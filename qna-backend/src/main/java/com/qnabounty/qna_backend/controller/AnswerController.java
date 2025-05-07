package com.qnabounty.qna_backend.controller;

import com.qnabounty.qna_backend.dto.AnswerDTO;
import com.qnabounty.qna_backend.model.Answer;
import com.qnabounty.qna_backend.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    @PostMapping
    public ResponseEntity<?> createAnswer(@RequestBody AnswerDTO dto,
                                          @AuthenticationPrincipal User user) {
        Answer created = answerService.createAnswer(dto, user.getUsername());
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Answer posted successfully");
        response.put("data", created);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<?> getAnswers(@PathVariable String questionId) {
        List<Answer> answers = answerService.getAnswersByQuestionId(questionId);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Answers fetched successfully");
        response.put("data", answers);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnswer(@PathVariable String id,
                                          @RequestBody AnswerDTO dto,
                                          @AuthenticationPrincipal User user) {
        Answer updated = answerService.updateAnswer(id, dto, user.getUsername());
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Answer updated successfully");
        response.put("data", updated);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnswer(@PathVariable String id,
                                          @AuthenticationPrincipal User user) {
        answerService.deleteAnswer(id, user.getUsername());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Answer deleted successfully");
        return ResponseEntity.ok(response);
    }
}
