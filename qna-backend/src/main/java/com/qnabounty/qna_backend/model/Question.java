package com.qnabounty.qna_backend.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    private String id;

    private String title;

    private String description;

    private String userId; // This can be email or user._id, based on your Auth logic

    @CreatedDate
    private LocalDateTime createdAt;
}
