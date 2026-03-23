package satou.community.websocket;

import cn.dev33.satoken.stp.StpUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.websocket.*;
import jakarta.websocket.server.HandshakeRequest;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import jakarta.websocket.server.ServerEndpointConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import satou.community.domain.result.Result;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@ServerEndpoint(value = "/ws/{userId}", configurator = WebSocketServer.GetHttpSessionConfigurator.class)
public class WebSocketServer implements ApplicationContextAware {

    private static ApplicationContext applicationContext;

    private final ObjectMapper objectMapper;

    public WebSocketServer() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }


    /**
     * 连接建立成功调用
     * @param userId 路径参数中的用户 ID
     * @param session 会话对象
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("userId") String userId) {
        // 1. 从 UserProperties 中获取握手时验证过的 userId (防止伪造)
        String verifiedUserId = (String) session.getUserProperties().get("VERIFIED_USER_ID");

        if (verifiedUserId == null || !verifiedUserId.equals(userId)) {
            log.warn("非法连接尝试：userId={}, verified={}", userId, verifiedUserId);
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Auth Failed"));
            } catch (IOException e) {
                log.error("关闭非法 WebSocket 连接失败", e);
            }
            return;
        }

        // 2. 注册会话
        // 从 Spring 上下文获取 SessionManager
        WebSocketSessionManager sessionManager = getBean(WebSocketSessionManager.class);
        sessionManager.addSession(verifiedUserId, session);

        // 3. 发送欢迎消息
        sendMessage(session, Result.success("连接成功").getData());
    }

    /**
     * 收到客户端消息调用 (通常用于心跳检测)
     */
    @OnMessage
    public void onMessage(String message, Session session, @PathParam("userId") String userId) {
        log.debug("收到用户 [{}] 的心跳/消息：{}", userId, message);
        // 如果是心跳包，可以回复 pong
        if ("ping".equals(message)) {
            try {
                session.getBasicRemote().sendText("pong");
            } catch (IOException e) {
                log.error("回复心跳失败", e);
            }
        }
    }

    /**
     * 连接关闭调用
     */
    @OnClose
    public void onClose(Session session, @PathParam("userId") String userId) {
        String verifiedUserId = (String) session.getUserProperties().get("VERIFIED_USER_ID");
        if (verifiedUserId != null) {
            WebSocketSessionManager sessionManager = getBean(WebSocketSessionManager.class);
            sessionManager.removeSession(verifiedUserId);
        }
    }

    /**
     * 发生错误调用
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("WebSocket 错误", error);
        // 出错时尝试清理
        String verifiedUserId = (String) session.getUserProperties().get("VERIFIED_USER_ID");
        if (verifiedUserId != null) {
            WebSocketSessionManager sessionManager = getBean(WebSocketSessionManager.class);
            sessionManager.removeSession(verifiedUserId);
        }
    }

    /**
     * 封装发送消息方法
     */
    private void sendMessage(Session session, Object data) {
        if (session != null && session.isOpen()) {
            try {
                String json = objectMapper.writeValueAsString(data);
                session.getBasicRemote().sendText(json);
            } catch (IOException e) {
                log.error("发送消息失败", e);
            }
        }
    }

    /**
     * 【重要】供 Service 调用的静态/实例方法：向指定用户推送消息
     */
    public void sendToUser(String userId, Object data) {
        WebSocketSessionManager sessionManager = getBean(WebSocketSessionManager.class);
        Session session = sessionManager.getSession(userId);
        if (session != null && session.isOpen()) {
            sendMessage(session, data);
        } else {
            log.debug("用户 [{}] 不在线，消息未推送", userId);
        }
    }

    /**
     * 实现 ApplicationContextAware 接口，设置 Spring 上下文
     */
    @Override
    public void setApplicationContext(ApplicationContext context) throws BeansException {
        WebSocketServer.applicationContext = context;
    }

    /**
     * 从 Spring 上下文获取 Bean 的静态方法
     */
    public static <T> T getBean(Class<T> clazz) {
        if (applicationContext == null) {
            throw new IllegalStateException("ApplicationContext 未初始化");
        }
        return applicationContext.getBean(clazz);
    }

    /**
     * 内部类：用于在握手阶段拦截并验证 Token
     */
    public static class GetHttpSessionConfigurator extends ServerEndpointConfig.Configurator {
        @Override
        public void modifyHandshake(ServerEndpointConfig sec, HandshakeRequest request, HandshakeResponse response) {
            // 1. 获取 URL 参数 Map (注意：这里返回的是 Map<String, List<String>>)
            Map<String, List<String>> params = request.getParameterMap();

            // 2. 安全地提取 token 和 userId (取 List 的第一个值)
            String token = null;
            String userIdParam = null;

            if (params.containsKey("token")) {
                List<String> tokenList = params.get("token");
                if (tokenList != null && !tokenList.isEmpty()) {
                    token = tokenList.get(0);
                }
            }

            if (params.containsKey("userId")) {
                List<String> userIdList = params.get("userId");
                if (userIdList != null && !userIdList.isEmpty()) {
                    userIdParam = userIdList.get(0);
                }
            }

            // 如果参数缺失，标记验证失败
            if (token == null || token.isEmpty()) {
                log.warn("WebSocket 握手失败：缺少 Token 参数");
                sec.getUserProperties().put("VERIFIED_USER_ID", null);
                return;
            }

            try {
                // 3. 使用 Sa-Token 验证 Token 有效性并获取登录 ID
                Object loginIdObj = StpUtil.getLoginIdByToken(token);

                if (loginIdObj == null) {
                    throw new Exception("Token 无效或已过期");
                }

                String verifiedUserId = loginIdObj.toString();

                // 【可选】如果前端传的 userId 参数和 Token 解析出的不一致，也视为非法
                if (userIdParam != null && !userIdParam.equals(verifiedUserId)) {
                    log.warn("WebSocket 握手失败：URL 中的 userId({}) 与 Token 解析出的 userId({}) 一致", userIdParam, verifiedUserId);
                    sec.getUserProperties().put("VERIFIED_USER_ID", null);
                    return;
                }

                // 4. 将验证通过的 userId 存入 UserProperties，供 @OnOpen 使用
                sec.getUserProperties().put("VERIFIED_USER_ID", verifiedUserId);
                log.debug("WebSocket 握手成功：用户 [{}] 验证通过", verifiedUserId);

            } catch (Exception e) {
                log.error("Token 验证失败：{}", e.getMessage());
                // 标记验证失败，@OnOpen 中会检查到此值并关闭连接
                sec.getUserProperties().put("VERIFIED_USER_ID", null);
            }
        }
    }
}
