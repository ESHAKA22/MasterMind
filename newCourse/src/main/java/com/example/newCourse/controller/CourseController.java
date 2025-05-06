package com.example.newCourse.controller;

import com.example.newCourse.model.Course;
import com.example.newCourse.model.CourseContent;
import com.example.newCourse.repository.CourseRepository;
import com.example.newCourse.service.ContentGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*") 
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ContentGeneratorService contentGeneratorService;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    // Add this new endpoint to get a course by ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        Optional<Course> courseOptional = courseRepository.findById(id);
        if (courseOptional.isPresent()) {
            return ResponseEntity.ok(courseOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseRepository.save(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @RequestBody Course updatedCourse) {
        Optional<Course> courseOptional = courseRepository.findById(id);
        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();
            course.setTitle(updatedCourse.getTitle());
            course.setDescription(updatedCourse.getDescription());
            course.setProgressList(updatedCourse.getProgressList());
            return ResponseEntity.ok(courseRepository.save(course));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable String id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return ResponseEntity.ok("Course deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
        }
    }

    @GetMapping("/{courseId}/content")
    public ResponseEntity<List<CourseContent>> getCourseContent(@PathVariable String courseId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isPresent()) {
            return ResponseEntity.ok(courseOptional.get().getContentList());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/{courseId}/content")
    public ResponseEntity<CourseContent> addCourseContent(
            @PathVariable String courseId,
            @RequestBody CourseContent content) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();
            if (course.getContentList() == null) {
                course.setContentList(new ArrayList<>());
            }
            content.setId(UUID.randomUUID().toString());
            course.getContentList().add(content);
            courseRepository.save(course);
            return ResponseEntity.status(HttpStatus.CREATED).body(content);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{courseId}/content/{contentId}")
    public ResponseEntity<CourseContent> updateCourseContent(
            @PathVariable String courseId,
            @PathVariable String contentId,
            @RequestBody CourseContent updatedContent) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();
            if (course.getContentList() != null) {
                for (int i = 0; i < course.getContentList().size(); i++) {
                    if (course.getContentList().get(i).getId().equals(contentId)) {
                        updatedContent.setId(contentId);
                        course.getContentList().set(i, updatedContent);
                        courseRepository.save(course);
                        return ResponseEntity.ok(updatedContent);
                    }
                }
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{courseId}/content/{contentId}")
    public ResponseEntity<Void> deleteCourseContent(
            @PathVariable String courseId,
            @PathVariable String contentId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();
            if (course.getContentList() != null) {
                if (course.getContentList().removeIf(content -> content.getId().equals(contentId))) {
                    courseRepository.save(course);
                    return ResponseEntity.noContent().build();
                }
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/{courseId}/generate-content")
    public ResponseEntity<List<CourseContent>> generateCourseContent(@PathVariable String courseId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();
            
            // Generate content based on course details
            List<CourseContent> generatedContent = contentGeneratorService
                    .generateContentForCourse(course.getTitle(), course.getCategory(), course.getLevel());
            
            // Add the generated content to the course
            if (course.getContentList() == null) {
                course.setContentList(new ArrayList<>());
            }
            course.getContentList().addAll(generatedContent);
            courseRepository.save(course);
            
            return ResponseEntity.ok(generatedContent);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<Course> createCourseWithImage(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "duration", required = false) String duration,
            @RequestParam(value = "language", required = false) String language,
            @RequestParam(value = "level", required = false) String level,
            @RequestParam(value = "tags", required = false) String tagsJson) {
        
        try {
            Course course = new Course();
            course.setTitle(title);
            course.setDescription(description);
            course.setLevel(level);
            course.setDuration(duration);
            course.setLanguage(language);
            
            // Handle tags
            if (tagsJson != null && !tagsJson.isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                List<String> tags = objectMapper.readValue(tagsJson, List.class);
                course.setTags(tags);
            }
            
            // Handle image upload
            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());
                // Generate unique filename to prevent collisions
                String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
                
                // Save file to disk
                Path uploadDir = Paths.get("uploads");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }
                
                Path filePath = uploadDir.resolve(uniqueFileName);
                Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                // Store the path in the course entity
                course.setImagePath("/uploads/" + uniqueFileName);
            }
            
            // Initialize lists if needed
            if (course.getProgressList() == null) {
                course.setProgressList(new ArrayList<>());
            }
            
            if (course.getContentList() == null) {
                course.setContentList(new ArrayList<>());
            }
            
            Course savedCourse = courseRepository.save(course);
            return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{courseId}/content/{contentId}/video")
    public ResponseEntity<CourseContent> uploadLessonVideo(
            @PathVariable String courseId,
            @PathVariable String contentId,
            @RequestParam("video") MultipartFile videoFile) {
        
        try {
            // Find the course
            Optional<Course> courseOptional = courseRepository.findById(courseId);
            if (!courseOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            Course course = courseOptional.get();
            CourseContent targetContent = null;
            
            // Find the specific content
            for (CourseContent content : course.getContentList()) {
                if (content.getId().equals(contentId)) {
                    targetContent = content;
                    break;
                }
            }
            
            if (targetContent == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            // Save the video file
            String fileName = StringUtils.cleanPath(videoFile.getOriginalFilename());
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path uploadDir = Paths.get("uploads/videos");
            
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            Path filePath = uploadDir.resolve(uniqueFileName);
            Files.copy(videoFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Update content with video path
            targetContent.setVideoUrl("/uploads/videos/" + uniqueFileName);
            courseRepository.save(course);
            
            return ResponseEntity.ok(targetContent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{courseId}/content/{contentId}/resource")
    public ResponseEntity<CourseContent> uploadLessonResource(
            @PathVariable String courseId,
            @PathVariable String contentId,
            @RequestParam("resource") MultipartFile resourceFile) {
        
        try {
            // Find the course
            Optional<Course> courseOptional = courseRepository.findById(courseId);
            if (!courseOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            Course course = courseOptional.get();
            CourseContent targetContent = null;
            
            // Find the specific content
            for (CourseContent content : course.getContentList()) {
                if (content.getId().equals(contentId)) {
                    targetContent = content;
                    break;
                }
            }
            
            if (targetContent == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            // Save the resource file
            String fileName = StringUtils.cleanPath(resourceFile.getOriginalFilename());
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path uploadDir = Paths.get("uploads/resources");
            
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            Path filePath = uploadDir.resolve(uniqueFileName);
            Files.copy(resourceFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Update content with resource path
            targetContent.setResourceUrl("/uploads/resources/" + uniqueFileName);
            courseRepository.save(course);
            
            return ResponseEntity.ok(targetContent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}