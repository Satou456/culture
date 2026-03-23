package satou.community.websocket;

import jakarta.websocket.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class WebSocketSessionManager {

    // 存储在线用户：Key = userId, Value = Session
    private static final Map<String, Session> ONLINE_SESSIONS = new ConcurrentHashMap<>();

    public void addSession(String userId, Session session) {
        ONLINE_SESSIONS.put(userId, session);
        log.info("用户 [{}] 上线，当前在线人数: {}", userId, ONLINE_SESSIONS.size());
    }

    public void removeSession(String userId) {
        ONLINE_SESSIONS.remove(userId);
        log.info("用户 [{}] 下线，当前在线人数: {}", userId, ONLINE_SESSIONS.size());
    }

    public Session getSession(String userId) {
        return ONLINE_SESSIONS.get(userId);
    }

    public boolean isOnline(String userId) {
        return ONLINE_SESSIONS.containsKey(userId);
    }
}