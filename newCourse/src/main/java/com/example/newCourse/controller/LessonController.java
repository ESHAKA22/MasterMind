package com.example.newCourse.controller;

import com.example.newCourse.model.Lesson;
import com.example.newCourse.repository.LessonRepository;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    // Get all lessons
    @GetMapping
    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    // Get lesson by ID
    @GetMapping("/{id}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable String id) {
        Optional<Lesson> lesson = lessonRepository.findById(id);
        return lesson.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get lessons by course ID
    @GetMapping("/course/{courseId}")
    public List<Lesson> getLessonsByCourseId(@PathVariable String courseId) {
        return lessonRepository.findByCourseIdOrderByOrder(courseId);
    }

    // Create new lesson
    @PostMapping
    public ResponseEntity<Lesson> createLesson(@RequestBody Lesson lesson) {
        lesson.setId(UUID.randomUUID().toString());
        Lesson savedLesson = lessonRepository.save(lesson);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedLesson);
    }

    // Update lesson
    @PutMapping("/{id}")
    public ResponseEntity<Lesson> updateLesson(@PathVariable String id, @RequestBody Lesson lesson) {
        if (!lessonRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        lesson.setId(id); // Ensure the ID is set correctly
        return ResponseEntity.ok(lessonRepository.save(lesson));
    }

    // Delete lesson
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable String id) {
        if (!lessonRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        lessonRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Delete all lessons for a course
    @DeleteMapping("/course/{courseId}")
    public ResponseEntity<Void> deleteLessonsByCourse(@PathVariable String courseId) {
        lessonRepository.deleteByCourseId(courseId);
        return ResponseEntity.noContent().build();
    }

    // Mark lesson as complete
    @PostMapping("/{id}/mark-complete")
    public ResponseEntity<Lesson> markLessonAsComplete(@PathVariable String id) {
        Optional<Lesson> lessonOpt = lessonRepository.findById(id);
        if (!lessonOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Lesson lesson = lessonOpt.get();
        lesson.setCompleted(true);
        return ResponseEntity.ok(lessonRepository.save(lesson));
    }

    // Mark lesson as incomplete
    @PostMapping("/{id}/mark-incomplete")
    public ResponseEntity<Lesson> markLessonAsIncomplete(@PathVariable String id) {
        Optional<Lesson> lessonOpt = lessonRepository.findById(id);
        if (!lessonOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Lesson lesson = lessonOpt.get();
        lesson.setCompleted(false);
        return ResponseEntity.ok(lessonRepository.save(lesson));
    }

    // Upload lesson video
    @PostMapping("/{id}/video")
    public ResponseEntity<Lesson> uploadLessonVideo(
            @PathVariable String id,
            @RequestParam("video") MultipartFile videoFile) {
        
        try {
            Optional<Lesson> lessonOpt = lessonRepository.findById(id);
            if (!lessonOpt.isPresent()) {
                return ResponseEntity.notFound().build();
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
            return ResponseEntity.ok(lessonRepository.save(lesson));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Upload lesson resource
    @PostMapping("/{id}/resource")
    public ResponseEntity<Lesson> uploadLessonResource(
            @PathVariable String id,
            @RequestParam("resource") MultipartFile resourceFile) {
        
        try {
            Optional<Lesson> lessonOpt = lessonRepository.findById(id);
            if (!lessonOpt.isPresent()) {
                return ResponseEntity.notFound().build();
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