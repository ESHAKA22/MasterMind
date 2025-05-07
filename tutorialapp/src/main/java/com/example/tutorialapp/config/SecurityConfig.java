package com.example.tutorialapp.config;

import com.example.tutorialapp.service.JwtService;
import com.example.tutorialapp.service.UserService;
import com.example.tutorialapp.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/oauth2/**", "/login/**", "/api/auth/**", "/api/tutorials", "/api/tutorials/search").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .oidcUserService(oidcUserService())
                    .userService(oauth2UserService())
                )
                .successHandler((request, response, authentication) -> {
                    logger.info("OAuth2 success handler triggered");
                    Object principal = authentication.getPrincipal();
                    User user = null;
                    if (principal instanceof OidcUser) {
                        logger.info("Processing Google user: {}", ((OidcUser) principal).getEmail());
                        user = userService.processOAuth2User("google", ((OidcUser) principal).getAttributes());
                    } else if (principal instanceof OAuth2User) {
                        String login = ((OAuth2User) principal).getAttribute("login");
                        logger.info("Processing GitHub user: {}", login != null ? login : "unknown");
                        user = userService.processOAuth2User("github", ((OAuth2User) principal).getAttributes());
                    }
                    if (user != null) {
                        String token = jwtService.generateToken(user);
                        logger.info("Generated token: {}", token);
                        response.sendRedirect("http://localhost:5173/home?token=" + token);
                    } else {
                        logger.error("User processing failed");
                        response.sendError(401, "User processing failed");
                    }
                })
                .failureHandler((request, response, exception) -> {
                    logger.error("OAuth2 authentication failed: {}", exception.getMessage(), exception);
                    response.sendError(401, "OAuth2 authentication failed: " + exception.getMessage());
                })
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public OAuth2UserService<OidcUserRequest, OidcUser> oidcUserService() {
        final OidcUserService oidcUserService = new OidcUserService();
        return userRequest -> {
            OidcUser oidcUser = oidcUserService.loadUser(userRequest);
            userService.processOAuth2User("google", oidcUser.getAttributes());
            return oidcUser;
        };
    }

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
        final DefaultOAuth2UserService oauth2UserService = new DefaultOAuth2UserService();
        return userRequest -> {
            OAuth2User oauth2User = oauth2UserService.loadUser(userRequest);
            userService.processOAuth2User("github", oauth2User.getAttributes());
            return oauth2User;
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}