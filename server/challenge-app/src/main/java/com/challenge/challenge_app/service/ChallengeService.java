package com.challenge.challenge_app.service;

import com.challenge.challenge_app.model.Challenge;
import com.challenge.challenge_app.repository.ChallengeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChallengeService {
    private final ChallengeRepository repository;

    public ChallengeService(ChallengeRepository repository) {
        this.repository = repository;
    }

    public Challenge addChallenge(Challenge challenge) {
        return repository.save(challenge);
    }

    public List<Challenge> getAllChallenges() {
        return repository.findAll();
    }

    public Optional<Challenge> getChallengeById(String id) {
        return repository.findById(id);
    }

    public Challenge updateChallenge(String id, Challenge updatedChallenge) {
        updatedChallenge.setId(id);
        return repository.save(updatedChallenge);
    }

    public void deleteChallenge(String id) {
        repository.deleteById(id);
    }

    public List<Challenge> filterByCategory(String category) {
        return repository.findByCategory(category);
    }

    public List<Challenge> filterByDifficulty(String difficulty) {
        return repository.findByDifficulty(difficulty);
    }

    public Challenge enrollUser(String challengeId, String userId) {
        Challenge challenge = repository.findById(challengeId).orElseThrow();
        if (!challenge.getEnrolledUsers().contains(userId)) {
            challenge.getEnrolledUsers().add(userId);
        }
        return repository.save(challenge);
    }
}