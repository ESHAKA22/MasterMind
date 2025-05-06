package com.example.newCourse.model;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class CourseContent {
    @Id
    private String id;
    private String title;
    private String contentType; // "video", "text", "quiz", "pdf"
    private String content; // URL for videos, text content, etc.
    private int order; // To maintain the sequence of content
    
    // New fields for enhanced lesson features
    private String lessonType; // "Video", "Quiz", "PDF"
    private String duration; // e.g., "15 minutes", "1 hour"
    private String videoUrl; // YouTube link or uploaded video path
    private boolean previewEnabled; // Allow preview without enrollment
    private String resourceUrl; // URL for downloadable resources
    private String quizLink; // Link to quiz or embedded quiz content
    private boolean completed; // Track completion status
}