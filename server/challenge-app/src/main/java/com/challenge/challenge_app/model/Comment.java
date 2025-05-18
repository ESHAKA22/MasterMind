package com.challenge.challenge_app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;
    private String challengeId;
    private String userId;
    private String content;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Comment() {}

    public Comment(String challengeId, String userId, String content) {
        this.challengeId = challengeId;
        this.userId = userId;
        this.content = content;
    }

    // Getters and Setters
    public String getId() { return id; }
    public String getChallengeId() { return challengeId; }
    public void setChallengeId(String challengeId) { this.challengeId = challengeId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
