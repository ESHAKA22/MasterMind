package com.qnabounty.qna_backend.repository;

import com.qnabounty.qna_backend.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByUserId(String userId);
}
