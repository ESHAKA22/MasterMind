package com.qnabounty.qna_backend.controller;

import com.qnabounty.qna_backend.dto.QuestionDTO;
import com.qnabounty.qna_backend.model.Question;
import com.qnabounty.qna_backend.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<?> createQuestion(@RequestBody QuestionDTO dto,
                                            @AuthenticationPrincipal User user) {
        Question created = questionService.createQuestion(dto, user.getUsername());
        return buildResponse("Question created successfully", created);
    }

    @GetMapping
    public ResponseEntity<?> getAllQuestions() {
        return buildResponse("Questions fetched successfully", questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable String id) {
        Question question = questionService.getById(id);
        return buildResponse("Question fetched successfully", question);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable String id,
                                            @RequestBody QuestionDTO dto,
                                            @AuthenticationPrincipal User user) {
        Question updated = questionService.updateQuestion(id, dto, user.getUsername());
        return buildResponse("Question updated successfully", updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable String id,
                                            @AuthenticationPrincipal User user) {
        questionService.deleteQuestion(id, user.getUsername());
        Map<String, String> res = new HashMap<>();
        res.put("message", "Question deleted successfully");
        return ResponseEntity.ok(res);
    }

    // Utility method
    private ResponseEntity<?> buildResponse(String message, Object data) {
        Map<String, Object> res = new HashMap<>();
        res.put("message", message);
        res.put("data", data);
        return ResponseEntity.ok(res);
    }
}
