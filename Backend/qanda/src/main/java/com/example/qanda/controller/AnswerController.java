package com.example.qanda.controller;

import com.example.qanda.model.Answer;
import com.example.qanda.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {

    @Autowired
    private AnswerService answerService;

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<Answer>> getAnswersByQuestionId(@PathVariable String questionId) {
        List<Answer> answers = answerService.getAnswersByQuestionId(questionId);
        return ResponseEntity.ok(answers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAnswerById(@PathVariable String id) {
        try {
            Answer answer = answerService.getAnswerById(id);
            return ResponseEntity.ok(answer);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/question/{questionId}")
    public ResponseEntity<?> createAnswer(
            @PathVariable String questionId,
            @RequestBody Answer answer,
            @RequestHeader("userId") String userId) {
        try {
            Answer createdAnswer = answerService.createAnswer(answer, questionId, userId);
            return new ResponseEntity<>(createdAnswer, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnswer(
            @PathVariable String id,
            @RequestBody Answer answer,
            @RequestHeader("userId") String userId) {
        try {
            Answer updatedAnswer = answerService.updateAnswer(id, answer, userId);
            return ResponseEntity.ok(updatedAnswer);
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
    public ResponseEntity<?> deleteAnswer(
            @PathVariable String id,
            @RequestHeader("userId") String userId) {
        try {
            answerService.deleteAnswer(id, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Answer deleted successfully");
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
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Answer>> getAnswersByUserId(@PathVariable String userId) {
        List<Answer> answers = answerService.getAnswersByUserId(userId);
        return ResponseEntity.ok(answers);
    }
}