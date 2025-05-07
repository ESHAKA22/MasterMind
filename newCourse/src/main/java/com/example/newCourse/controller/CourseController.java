package com.example.newCourse.controller;

import com.example.newCourse.model.Course;
import com.example.newCourse.model.CourseContent;
import com.example.newCourse.model.Lesson;
import com.example.newCourse.repository.CourseRepository;
import com.example.newCourse.repository.LessonRepository;
import com.example.newCourse.service.ContentGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    private LessonRepository lessonRepository;

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
            
            // Update all fields sent from the frontend
            if (updatedCourse.getTitle() != null) {
                course.setTitle(updatedCourse.getTitle());
            }
            if (updatedCourse.getDescription() != null) {
                course.setDescription(updatedCourse.getDescription());
            }
            if (updatedCourse.getDuration() != null) {
                course.setDuration(updatedCourse.getDuration());
            }
            if (updatedCourse.getLanguage() != null) {
                course.setLanguage(updatedCourse.getLanguage());
            }
            if (updatedCourse.getLevel() != null) {
                course.setLevel(updatedCourse.getLevel());
            }
            if (updatedCourse.getCategory() != null) {
                course.setCategory(updatedCourse.getCategory());
            }
            if (updatedCourse.getTags() != null) {
                course.setTags(updatedCourse.getTags());
            }
            
            return ResponseEntity.ok(courseRepository.save(course));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Add a multipart form handling endpoint
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Course> updateCourseWithImage(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "duration", required = false) String duration,
            @RequestParam(value = "language", required = false) String language,
            @RequestParam(value = "level", required = false) String level,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "tags", required = false) String tagsJson,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        try {
            Optional<Course> courseOptional = courseRepository.findById(id);
            if (!courseOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            Course course = courseOptional.get();
            course.setTitle(title);
            course.setDescription(description);
            if (duration != null) course.setDuration(duration);
            if (language != null) course.setLanguage(language);
            if (level != null) course.setLevel(level);
            if (category != null) course.setCategory(category);
            
            // Parse tags from JSON
            if (tagsJson != null && !tagsJson.isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                List<String> tags = objectMapper.readValue(tagsJson, List.class);
                course.setTags(tags);
            }
            
            // Handle image upload if provided
            if (image != null && !image.isEmpty()) {
                String fileName = StringUtils.cleanPath(image.getOriginalFilename());
                String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
                
                Path uploadDir = Paths.get("uploads");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }
                
                Path filePath = uploadDir.resolve(uniqueFileName);
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                course.setImagePath("/uploads/" + uniqueFileName);
            }
            
            Course savedCourse = courseRepository.save(course);
            return ResponseEntity.ok(savedCourse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable String id) {
        if (courseRepository.existsById(id)) {
            // Delete associated lessons first
            lessonRepository.deleteByCourseId(id);
            
            // Then delete the course
            courseRepository.deleteById(id);
            return ResponseEntity.ok("Course and its lessons deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
        }
    }
    
    @GetMapping("/{courseId}/content")
    public ResponseEntity<List<Lesson>> getCourseContent(@PathVariable String courseId) {
        if (!courseRepository.existsById(courseId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrder(courseId);
        return ResponseEntity.ok(lessons);
    }

    @PostMapping("/{courseId}/content")
    public ResponseEntity<Lesson> addCourseContent(
            @PathVariable String courseId,
            @RequestBody Lesson content) {
        
        if (!courseRepository.existsById(courseId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        content.setCourseId(courseId);
        content.setId(UUID.randomUUID().toString());
        Lesson savedLesson = lessonRepository.save(content);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedLesson);
    }

    @PostMapping("/{courseId}/generate-content")
    public ResponseEntity<List<CourseContent>> generateCourseContent(@PathVariable String courseId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();
            
            // Generate content based on course details
            List<CourseContent> generatedContent = contentGeneratorService
                    .generateContentForCourse(course.getTitle(), course.getCategory(), course.getLevel());
            
            // Create lessons from the generated content
            List<Lesson> lessons = new ArrayList<>();
            for (CourseContent content : generatedContent) {
                Lesson lesson = new Lesson();
                lesson.setId(UUID.randomUUID().toString());
                lesson.setCourseId(courseId);
                lesson.setTitle(content.getTitle());
                lesson.setContent(content.getContent());
                lesson.setContentType(content.getContentType());
                lesson.setOrder(content.getOrder());
                lesson.setLessonType("Reading"); // Default type
                
                lessons.add(lessonRepository.save(lesson));
            }
            
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
    public ResponseEntity<Lesson> uploadLessonVideo(
            @PathVariable String courseId,
            @PathVariable String contentId,
            @RequestParam("video") MultipartFile videoFile) {
        
        try {
            // Find the lesson directly
            Optional<Lesson> lessonOpt = lessonRepository.findById(contentId);
            if (!lessonOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            Lesson lesson = lessonOpt.get();
            
            // Save the video file
            String fileName = StringUtils.cleanPath(videoFile.getOriginalFilename());
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path uploadDir = Paths.get("uploads/videos");
            
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            Path filePath = uploadDir.resolve(uniqueFileName);
            Files.copy(videoFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Update lesson with video path
            lesson.setVideoUrl("/uploads/videos/" + uniqueFileName);
            lesson.setLessonType("Video");
            
            return ResponseEntity.ok(lessonRepository.save(lesson));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{courseId}/content/{contentId}/resource")
    public ResponseEntity<Lesson> uploadLessonResource(
            @PathVariable String courseId,
            @PathVariable String contentId,
            @RequestParam("resource") MultipartFile resourceFile) {
    
        try {
            // Find the lesson directly
            Optional<Lesson> lessonOpt = lessonRepository.findById(contentId);
            if (!lessonOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            Lesson lesson = lessonOpt.get();
            
            // Save the resource file
            String fileName = StringUtils.cleanPath(resourceFile.getOriginalFilename());
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path uploadDir = Paths.get("uploads/resources");
            
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            Path filePath = uploadDir.resolve(uniqueFileName);
            Files.copy(resourceFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Update lesson with resource path
            lesson.setResourceUrl("/uploads/resources/" + uniqueFileName);
            
            return ResponseEntity.ok(lessonRepository.save(lesson));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}