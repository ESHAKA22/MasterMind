package com.example.fitnessserverapi.repository;

import com.example.fitnessserverapi.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepository extends MongoRepository<Comment, String> {
    Comment findByCommentId(String commentId);
}
