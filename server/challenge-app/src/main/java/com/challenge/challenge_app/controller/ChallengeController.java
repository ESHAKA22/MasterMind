package com.challenge.challenge_app.controller;

import com.challenge.challenge_app.model.Challenge;
import com.challenge.challenge_app.service.ChallengeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {
    private final ChallengeService service;

    public ChallengeController(ChallengeService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Challenge> addChallenge(@RequestBody Challenge challenge) {
        return ResponseEntity.ok(service.addChallenge(challenge));
    }

    @GetMapping
    public ResponseEntity<List<Challenge>> getAllChallenges() {
        return ResponseEntity.ok(service.getAllChallenges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Challenge> getChallenge(@PathVariable String id) {
        return service.getChallengeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Challenge> updateChallenge(@PathVariable String id, @RequestBody Challenge challenge) {
        return ResponseEntity.ok(service.updateChallenge(id, challenge));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChallenge(@PathVariable String id) {
        service.deleteChallenge(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter/category")
    public ResponseEntity<List<Challenge>> filterByCategory(@RequestParam String category) {
        return ResponseEntity.ok(service.filterByCategory(category));
    }

    @GetMapping("/filter/difficulty")
    public ResponseEntity<List<Challenge>> filterByDifficulty(@RequestParam String difficulty) {
        return ResponseEntity.ok(service.filterByDifficulty(difficulty));
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<Challenge> enroll(@PathVariable String id, @RequestParam String userId) {
        return ResponseEntity.ok(service.enrollUser(id, userId));
    }
}