package com.example.tutorialapp.controller;

import com.example.tutorialapp.model.Tutorial;
import com.example.tutorialapp.service.TutorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutorials")
@CrossOrigin(origins = "*") // Allows requests from any origin (e.g., the frontend)
public class TutorialController {

    @Autowired
    private TutorialService tutorialService;

    @PostMapping
    public Tutorial createTutorial(@RequestBody Tutorial tutorial) {
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
}