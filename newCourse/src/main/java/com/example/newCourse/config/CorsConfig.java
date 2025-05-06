package com.example.newCourse.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000", "*") // Explicitly list common dev URLs
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") 
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(false); // Change to true if using credentials
    }

    // Add an additional CorsFilter bean for more robust CORS handling
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow all origins for development - restrict this in production
        config.addAllowedOrigin("*");
        config.addAllowedOriginPattern("*");
        
        // Allow common frontend URLs explicitly
        config.addAllowedOrigin("http://localhost:5173"); // Vite default port
        config.addAllowedOrigin("http://localhost:3000"); // React default port
        
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(false); // Set to true if using credentials
        
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}