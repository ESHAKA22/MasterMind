package com.example.qanda.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "questions")
public class Question {
    @Id
    private String id;

    private String title;

    private String content;

    private String userId;

    private String username; // Store username for quick display without joins

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Pre-save operations
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
    }
}
