package com.example.newCourse.model;

import lombok.Data;

@Data
public class StudentProgress {
    private String studentName;
    private String status; // e.g., "Completed", "In Progress"
}
