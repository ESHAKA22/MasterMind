package com.example.tutorialapp.controller;

import com.example.tutorialapp.model.Tutorial;
import com.example.tutorialapp.service.TutorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutorials")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:9090"}) // Updated for React app
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

    @DeleteMapping("/{id}")
    public void deleteTutorial(@PathVariable String id) {
        tutorialService.deleteTutorial(id);
    }

    @PutMapping("/{id}")
    public Tutorial updateTutorial(@PathVariable String id, @RequestBody Tutorial tutorial) {
        return tutorialService.updateTutorial(id, tutorial);
    }
     // GET mapping to retrieve a tutorial by ID
     @GetMapping("/{id}")
     public Tutorial getTutorialById(@PathVariable String id) {
         return tutorialService.getTutorialById(id);
     }
    
}