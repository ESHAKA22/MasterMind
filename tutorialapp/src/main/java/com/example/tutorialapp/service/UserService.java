package com.example.tutorialapp.service;

import com.example.tutorialapp.model.User;
import com.example.tutorialapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    public User processOAuth2User(String provider, Map<String, Object> attributes) {
        String providerId;
        String email;
        String name;

        if ("google".equals(provider)) {
            providerId = attributes.get("sub").toString();
            email = attributes.get("email").toString();
            name = attributes.get("name").toString();
        } else if ("github".equals(provider)) {
            providerId = attributes.get("id").toString();
            email = attributes.get("email") != null ? attributes.get("email").toString() : attributes.get("login") + "@github.com";
            name = attributes.get("name") != null ? attributes.get("name").toString() : attributes.get("login").toString();
        } else {
            throw new IllegalArgumentException("Unsupported provider: " + provider);
        }

        Optional<User> existingUser = userRepository.findByProviderAndProviderId(provider, providerId);
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setEmail(email);
            user.setName(name);
        } else {
            user = new User();
            user.setProvider(provider);
            user.setProviderId(providerId);
            user.setEmail(email);
            user.setName(name);
        }
        return userRepository.save(user);
    }
}