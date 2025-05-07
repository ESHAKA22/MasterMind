package com.qnabounty.qna_backend.repository;

import com.qnabounty.qna_backend.model.Answer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AnswerRepository extends MongoRepository<Answer, String> {
    List<Answer> findByQuestionId(String questionId);
}
