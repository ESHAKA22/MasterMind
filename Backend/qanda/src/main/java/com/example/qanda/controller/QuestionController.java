package com.example.qanda.controller;

import com.example.qanda.model.Question;
import com.example.qanda.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable String id) {
        try {
            Question question = questionService.getQuestionById(id);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Question>> getQuestionsByUserId(@PathVariable String userId) {
        List<Question> questions = questionService.getQuestionsByUserId(userId);
        return ResponseEntity.ok(questions);
    }

    @PostMapping
    public ResponseEntity<?> createQuestion(
            @RequestBody Question question,
            @RequestHeader("userId") String userId) {
        try {
            Question createdQuestion = questionService.createQuestion(question, userId);
            return new ResponseEntity<>(createdQuestion, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(
            @PathVariable String id,
            @RequestBody Question question,
            @RequestHeader("userId") String userId) {
        try {
            Question updatedQuestion = questionService.updateQuestion(id, question, userId);
            return ResponseEntity.ok(updatedQuestion);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());

            if (e.getMessage().contains("You can only update your own")) {
                return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
            } else {
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(
            @PathVariable String id,
            @RequestHeader("userId") String userId) {
        try {
            questionService.deleteQuestion(id, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Question deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());

            if (e.getMessage().contains("You can only delete your own")) {
                return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
            } else {
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
        }
    }
}