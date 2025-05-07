package com.example.qanda.repository;

import com.example.qanda.model.Answer;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AnswerRepository extends MongoRepository<Answer, String> {
    List<Answer> findByQuestionId(String questionId);
    List<Answer> findByUserId(String userId);
}