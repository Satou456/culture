package satou.community.config;

import cn.dev33.satoken.context.SaHolder;
import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.router.SaRouter;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 设置允许跨域的路径
        registry.addMapping("/**")
                // 设置允许跨域请求的域名
                .allowedOriginPatterns("*")
                // 是否允许cookie
                .allowCredentials(true)
                // 设置允许的请求方式
                .allowedMethods("GET", "POST", "DELETE", "PUT", "OPTIONS")
                // 设置允许的header属性
                .allowedHeaders("*")
                // 跨域允许时间
                .maxAge(3600);
    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 禁用默认 favicon 处理
        registry.setOrder(0);
    }
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册 Sa-Token 拦截器，校验规则为 StpUtil.checkLogin() 登录校验
        registry.addInterceptor(new SaInterceptor(handle -> {
            var request = SaHolder.getRequest();

            if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                return;
            }

            // 登录校验 -- 排除登录/注册接口
            SaRouter
                .match("/**")
                .notMatch(
                        "/user/login",
                        "/user/logout",
                        "/user/register",
                        "/doc.html",
                        "/v3/api-docs",
                        "/v3/api-docs/**",
                        "/swagger-resources",
                        "/swagger-resources/**",
                        "/swagger-ui/**",
                        "/webjars/**",
                        "/favicon.ico",
                        "/error"
                )// 排除认证相关接口
                .notMatch("/posts/recommend") // 可选：推荐接口允许未登录访问
                .check(r -> StpUtil.checkLogin());
        })).addPathPatterns("/**")
           .excludePathPatterns("/error");
    }
}