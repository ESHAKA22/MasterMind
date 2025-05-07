package com.example.newCourse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "lessons")
public class Lesson {
    @Id
    private String id;
    private String courseId;  // Reference to parent course
    private String title;
    private String contentType; // "video", "text", "quiz", "pdf"
    private String content; // Content or URL
    private int order; // Sequence in course
    private String lessonType; // "Video", "Quiz", "PDF"
    private String duration;
    private String videoUrl;
    private boolean previewEnabled;
    private String resourceUrl;
    private String quizLink;
    private boolean completed;
}