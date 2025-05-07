package com.qnabounty.qna_backend.service;

import com.qnabounty.qna_backend.dto.QuestionDTO;
import com.qnabounty.qna_backend.exception.ResourceNotFoundException;
import com.qnabounty.qna_backend.model.Question;
import com.qnabounty.qna_backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public Question createQuestion(QuestionDTO dto, String userId) {
        Question q = new Question();
        q.setTitle(dto.getTitle());
        q.setDescription(dto.getDescription());
        q.setUserId(userId);
        q.setCreatedAt(LocalDateTime.now()); // 👈 Ensure createdAt is set if not handled by annotation
        return questionRepository.save(q);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getById(String id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + id));
    }

    public Question updateQuestion(String id, QuestionDTO dto, String userId) {
        Question q = getById(id);
        if (!q.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this question.");
        }
        q.setTitle(dto.getTitle());
        q.setDescription(dto.getDescription());
        return questionRepository.save(q);
    }

    public void deleteQuestion(String id, String userId) {
        Question q = getById(id);
        if (!q.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this question.");
        }
        questionRepository.deleteById(id);
    }
}
