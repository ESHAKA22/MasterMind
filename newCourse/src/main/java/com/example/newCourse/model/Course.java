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
    private String category;
    private String level;
    private String imagePath;
    private String duration;
    private String language;
    private List<String> tags = new ArrayList<>();
    private List<StudentProgress> progressList;
    // Add the actual field instead of just methods
    private List<CourseContent> contentList = new ArrayList<>();
}
