package com.qnabounty.qna_backend.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Answer {
    @Id
    private String id;
    private String content;
    private String questionId;
    private String userId;

    @CreatedDate
    private Date createdAt;
}
