package com.example.tutorialapp.controller;

import com.example.tutorialapp.model.User;
import com.example.tutorialapp.service.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    private com.example.tutorialapp.service.UserService userService;

    @GetMapping("/success")
    public void authSuccess(@AuthenticationPrincipal Object principal, HttpServletResponse response) throws IOException {
        logger.info("Processing OAuth2 success callback");
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
            logger.info("Generated JWT token: {}", token);
            // Redirect to frontend home page
            response.sendRedirect("http://localhost:5173/home?token=" + token);
        } else {
            logger.error("User processing failed");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
        }
    }

    @GetMapping("/failure")
    public void authFailure(HttpServletResponse response) throws IOException {
        logger.error("Authentication failed");
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed. Please try again.");
    }

    @GetMapping("/user")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal Object principal) {
        Map<String, Object> userInfo = new HashMap<>();
        if (principal instanceof OidcUser) {
            OidcUser oidcUser = (OidcUser) principal;
            userInfo.put("email", oidcUser.getEmail());
            userInfo.put("name", oidcUser.getFullName());
            userInfo.put("provider", "google");
        } else if (principal instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) principal;
            userInfo.put("email", oauth2User.getAttribute("email") != null ? oauth2User.getAttribute("email") : oauth2User.getAttribute("login") + "@github.com");
            userInfo.put("name", oauth2User.getAttribute("name") != null ? oauth2User.getAttribute("name") : oauth2User.getAttribute("login"));
            userInfo.put("provider", "github");
        }
        return userInfo;
    }
}