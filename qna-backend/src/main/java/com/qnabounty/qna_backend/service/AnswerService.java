package com.qnabounty.qna_backend.service;

import com.qnabounty.qna_backend.dto.AnswerDTO;
import com.qnabounty.qna_backend.exception.ResourceNotFoundException;
import com.qnabounty.qna_backend.model.Answer;
import com.qnabounty.qna_backend.repository.AnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;

    public Answer createAnswer(AnswerDTO dto, String userId) {
        Answer answer = Answer.builder()
                .content(dto.getContent())
                .questionId(dto.getQuestionId())
                .userId(userId)
                .build();
        return answerRepository.save(answer);
    }

    public List<Answer> getAnswersByQuestionId(String questionId) {
        return answerRepository.findByQuestionId(questionId);
    }

    public Answer updateAnswer(String id, AnswerDTO dto, String userId) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found"));
        if (!answer.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this answer");
        }
        answer.setContent(dto.getContent());
        return answerRepository.save(answer);
    }

    public void deleteAnswer(String id, String userId) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found"));
        if (!answer.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this answer");
        }
        answerRepository.deleteById(id);
    }
}
