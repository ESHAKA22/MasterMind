package com.challenge.challenge_app.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "challenges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Challenge {
    @Id
    private String id;
    private String title;
    private String description;
    private String imageUrl;
    private String category;
    private String difficulty;
    private int repeatCount;
    private List<String> enrolledUsers;
}