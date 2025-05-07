package com.example.tutorialapp.controller;

import com.example.tutorialapp.model.Tutorial;
import com.example.tutorialapp.service.TutorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutorials")
@CrossOrigin(origins = {"http://localhost:5173"})
public class TutorialController {

    @Autowired
    private TutorialService tutorialService;

    @PostMapping
    public Tutorial createTutorial(@RequestBody Tutorial tutorial, @AuthenticationPrincipal Object principal) {
        String userId = getUserId(principal);
        tutorial.setCreatorId(userId);
        return tutorialService.createTutorial(tutorial);
    }

    @GetMapping
    public List<Tutorial> getAllTutorials() {
        return tutorialService.getAllTutorials();
    }

    @GetMapping("/search")
    public List<Tutorial> searchTutorialsByTag(@RequestParam String tag) {
        return tutorialService.searchTutorialsByTag(tag);
    }

    @DeleteMapping("/{id}")
    public void deleteTutorial(@PathVariable String id, @AuthenticationPrincipal Object principal) {
        String userId = getUserId(principal);
        Tutorial tutorial = tutorialService.getTutorialById(id);
        if (!tutorial.getCreatorId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this tutorial");
        }
        tutorialService.deleteTutorial(id);
    }

    @PutMapping("/{id}")
    public Tutorial updateTutorial(@PathVariable String id, @RequestBody Tutorial tutorial, @AuthenticationPrincipal Object principal) {
        String userId = getUserId(principal);
        Tutorial existingTutorial = tutorialService.getTutorialById(id);
        if (!existingTutorial.getCreatorId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this tutorial");
        }
        return tutorialService.updateTutorial(id, tutorial);
    }

    @GetMapping("/{id}")
    public Tutorial getTutorialById(@PathVariable String id) {
        return tutorialService.getTutorialById(id);
    }

    private String getUserId(Object principal) {
        if (principal instanceof OidcUser) {
            return ((OidcUser) principal).getEmail();
        } else if (principal instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) principal;
            return oauth2User.getAttribute("email") != null ? oauth2User.getAttribute("email") : oauth2User.getAttribute("login") + "@github.com";
        }
        throw new RuntimeException("User not authenticated");
    }
}