package com.challenge.challenge_app.repository;

import com.challenge.challenge_app.model.Challenge;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChallengeRepository extends MongoRepository<Challenge, String> {
    List<Challenge> findByCategory(String category);
    List<Challenge> findByDifficulty(String difficulty);
}