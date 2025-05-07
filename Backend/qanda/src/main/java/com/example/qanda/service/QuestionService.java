package com.example.qanda.service;

import com.example.qanda.model.Question;
import com.example.qanda.model.User;
import com.example.qanda.repository.QuestionRepository;
import com.example.qanda.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAllByOrderByCreatedAtDesc();
    }

    public Question getQuestionById(String id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public List<Question> getQuestionsByUserId(String userId) {
        return questionRepository.findByUserId(userId);
    }

    public Question createQuestion(Question question, String userId) {
        // Find the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Set user details
        question.setUserId(userId);
        question.setUsername(user.getUsername());

        // Set created/updated timestamps
        question.prePersist();

        // Save and return
        return questionRepository.save(question);
    }

    public Question updateQuestion(String id, Question questionDetails, String userId) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Check if the user owns this question
        if (!question.getUserId().equals(userId)) {
            throw new RuntimeException("You can only update your own questions");
        }

        // Update fields
        question.setTitle(questionDetails.getTitle());
        question.setContent(questionDetails.getContent());
        question.prePersist(); // Update timestamp

        // Save and return
        return questionRepository.save(question);
    }

    public void deleteQuestion(String id, String userId) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Check if the user owns this question
        if (!question.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own questions");
        }

        questionRepository.delete(question);
    }
}