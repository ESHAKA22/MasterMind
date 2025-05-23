package com.example.tutorialapp.service;

import com.example.tutorialapp.model.Tutorial;
import com.example.tutorialapp.repository.TutorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TutorialService {

    @Autowired
    private TutorialRepository tutorialRepository;

    public Tutorial createTutorial(Tutorial tutorial) {
        return tutorialRepository.save(tutorial);
    }

    public List<Tutorial> getAllTutorials() {
        return tutorialRepository.findAll();
    }

    public List<Tutorial> searchTutorialsByTag(String tag) {
        return tutorialRepository.findByTagsContaining(tag);
    }

    public void deleteTutorial(String id) {
        tutorialRepository.deleteById(id);
    }

    public Tutorial updateTutorial(String id, Tutorial updatedTutorial) {
        updatedTutorial.setId(id); // Ensure the ID is set to the one from the URL
        return tutorialRepository.save(updatedTutorial);
    }

    public Tutorial getTutorialById(String id) {
        return tutorialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutorial not found with id: " + id));
    }
}