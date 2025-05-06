package com.example.newCourse.service;

import com.example.newCourse.model.CourseContent;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ContentGeneratorService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    /**
     * Generate course content based on a course title and description
     * This implementation creates text content that's similar to the course title
     */
    public List<CourseContent> generateContentForCourse(String title, String category, String level) {
        List<CourseContent> contentList = new ArrayList<>();
        
        // Create introduction content
        CourseContent intro = new CourseContent();
        intro.setId(UUID.randomUUID().toString());
        intro.setTitle("Introduction to " + title);
        intro.setContentType("text");
        intro.setContent("<h3>Welcome to " + title + "</h3><p>This course is designed for " 
                + level + " level students interested in " + category + ".</p>"
                + "<p>We'll cover the fundamentals and help you build strong skills in this area.</p>");
        intro.setOrder(1);
        contentList.add(intro);
        
        // Create course overview
        CourseContent overview = new CourseContent();
        overview.setId(UUID.randomUUID().toString());
        overview.setTitle("Course Overview");
        overview.setContentType("text");
        overview.setContent(generateOverviewContent(title, category, level));
        overview.setOrder(2);
        contentList.add(overview);
        
        // Create key concepts
        CourseContent keyConcepts = new CourseContent();
        keyConcepts.setId(UUID.randomUUID().toString());
        keyConcepts.setTitle("Key Concepts in " + title);
        keyConcepts.setContentType("text");
        keyConcepts.setContent(generateKeyConceptsContent(title, category));
        keyConcepts.setOrder(3);
        contentList.add(keyConcepts);
        
        // Create practice exercises
        CourseContent practice = new CourseContent();
        practice.setId(UUID.randomUUID().toString());
        practice.setTitle("Practice Exercises");
        practice.setContentType("text");
        practice.setContent(generatePracticeContent(title, level));
        practice.setOrder(4);
        contentList.add(practice);
        
        return contentList;
    }
    
    private String generateOverviewContent(String title, String category, String level) {
        StringBuilder content = new StringBuilder();
        content.append("<h3>What You'll Learn</h3>");
        content.append("<ul>");
        
        // Generate content based on category
        if (category != null) {
            if (category.toLowerCase().contains("java")) {
                content.append("<li>Java programming fundamentals and object-oriented design</li>");
                content.append("<li>Building robust applications with Java</li>");
                content.append("<li>Java libraries and frameworks</li>");
            } else if (category.toLowerCase().contains("python")) {
                content.append("<li>Python syntax and programming concepts</li>");
                content.append("<li>Data analysis and visualization with Python</li>");
                content.append("<li>Building applications with Python frameworks</li>");
            } else if (category.toLowerCase().contains("web") || category.toLowerCase().contains("javascript")) {
                content.append("<li>Frontend development principles</li>");
                content.append("<li>Interactive web applications with JavaScript</li>");
                content.append("<li>Modern web frameworks and libraries</li>");
            } else {
                content.append("<li>Core principles of " + title + "</li>");
                content.append("<li>Practical applications in real-world scenarios</li>");
                content.append("<li>Industry best practices</li>");
            }
        } else {
            content.append("<li>Core principles of " + title + "</li>");
            content.append("<li>Practical applications in real-world scenarios</li>");
            content.append("<li>Industry best practices</li>");
        }
        
        content.append("</ul>");
        content.append("<p>This " + level + " level course will take you through all the essential concepts needed to become proficient in " + title + ".</p>");
        
        return content.toString();
    }
    
    private String generateKeyConceptsContent(String title, String category) {
        StringBuilder content = new StringBuilder();
        content.append("<h3>Essential Concepts in " + title + "</h3>");
        content.append("<p>Understanding these core concepts will help you master " + title + ":</p>");
        content.append("<ol>");
        
        // Generate content based on category
        if (category != null) {
            if (category.toLowerCase().contains("java")) {
                content.append("<li><strong>Object-Oriented Programming</strong>: Understanding classes, objects, inheritance, and polymorphism</li>");
                content.append("<li><strong>Java Collections Framework</strong>: Working with Lists, Maps, Sets and their implementations</li>");
                content.append("<li><strong>Exception Handling</strong>: Managing errors effectively in Java applications</li>");
            } else if (category.toLowerCase().contains("python")) {
                content.append("<li><strong>Python Data Structures</strong>: Lists, dictionaries, sets, and tuples</li>");
                content.append("<li><strong>Functional Programming</strong>: Using map, filter, reduce, and list comprehensions</li>");
                content.append("<li><strong>Package Management</strong>: Working with pip and virtual environments</li>");
            } else if (category.toLowerCase().contains("web")) {
                content.append("<li><strong>HTML/CSS Fundamentals</strong>: Building the structure and style of web pages</li>");
                content.append("<li><strong>JavaScript Essentials</strong>: Making web pages interactive</li>");
                content.append("<li><strong>Responsive Design</strong>: Ensuring websites work on all devices</li>");
            } else {
                content.append("<li><strong>Fundamental Principles</strong>: Core concepts that drive " + title + "</li>");
                content.append("<li><strong>Practical Applications</strong>: Real-world examples and case studies</li>");
                content.append("<li><strong>Advanced Techniques</strong>: Taking your skills to the next level</li>");
            }
        } else {
            content.append("<li><strong>Fundamental Principles</strong>: Core concepts that drive " + title + "</li>");
            content.append("<li><strong>Practical Applications</strong>: Real-world examples and case studies</li>");
            content.append("<li><strong>Advanced Techniques</strong>: Taking your skills to the next level</li>");
        }
        
        content.append("</ol>");
        
        return content.toString();
    }
    
    private String generatePracticeContent(String title, String level) {
        StringBuilder content = new StringBuilder();
        content.append("<h3>Practice Exercises</h3>");
        content.append("<p>Apply your knowledge with these " + level.toLowerCase() + " level exercises:</p>");
        content.append("<ol>");
        content.append("<li>Create a simple project that demonstrates key concepts in " + title + "</li>");
        content.append("<li>Implement a solution to a common problem in the field</li>");
        content.append("<li>Build a portfolio piece that showcases your skills</li>");
        content.append("</ol>");
        content.append("<p>Complete these exercises to reinforce your learning.</p>");
        
        return content.toString();
    }
}