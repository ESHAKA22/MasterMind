package com.challenge.challenge_app.repository;

import com.challenge.challenge_app.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByChallengeId(String challengeId);
}
