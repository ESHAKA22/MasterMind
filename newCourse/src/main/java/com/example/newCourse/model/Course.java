package com.example.newCourse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.util.List;
import java.util.ArrayList;

@Data
@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    private String title;
    private String description;
    private String category; // This could be repurposed or used alongside tags
    private String level;
    private String imagePath; // Store the path to the uploaded image
    private String duration;  // New field for course duration
    private String language;  // New field for course language
    private List<String> tags = new ArrayList<>(); // New field for course tags
    private List<StudentProgress> progressList;
    private List<CourseContent> contentList = new ArrayList<>();
}
