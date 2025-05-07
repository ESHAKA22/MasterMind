package com.example.tutorialapp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "tutorials")
@Data
public class Tutorial {
    @Id
    private String id;
    private String title;
    private String description;
    private String codeSnippet;
    private List<String> tags;
    private String creatorId; // New field to track post creator
}