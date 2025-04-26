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
}