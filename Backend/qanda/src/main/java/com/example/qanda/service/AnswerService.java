package com.example.qanda.service;

import com.example.qanda.model.Answer;
import com.example.qanda.model.User;
import com.example.qanda.repository.AnswerRepository;
import com.example.qanda.repository.QuestionRepository;
import com.example.qanda.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Answer> getAnswersByQuestionId(String questionId) {
        return answerRepository.findByQuestionId(questionId);
    }

    public Answer getAnswerById(String id) {
        return answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
    }

    public Answer createAnswer(Answer answer, String questionId, String userId) {
        // Verify question exists
        if (!questionRepository.existsById(questionId)) {
            throw new RuntimeException("Question not found");
        }

        // Find the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Set user and question details
        answer.setQuestionId(questionId);
        answer.setUserId(userId);
        answer.setUsername(user.getUsername());

        // Set created/updated timestamps
        answer.prePersist();

        // Save and return
        return answerRepository.save(answer);
    }

    public Answer updateAnswer(String id, Answer answerDetails, String userId) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        // Check if the user owns this answer
        if (!answer.getUserId().equals(userId)) {
            throw new RuntimeException("You can only update your own answers");
        }

        // Update content
        answer.setContent(answerDetails.getContent());
        answer.prePersist(); // Update timestamp

        // Save and return
        return answerRepository.save(answer);
    }

    public void deleteAnswer(String id, String userId) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        // Check if the user owns this answer
        if (!answer.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own answers");
        }

        answerRepository.delete(answer);
    }
    public List<Answer> getAnswersByUserId(String userId) {
        return answerRepository.findByUserId(userId);
    }
}