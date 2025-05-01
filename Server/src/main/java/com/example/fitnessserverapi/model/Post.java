package com.example.fitnessserverapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.*;

// Annotations
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
//@Configuration
//@EnableMongoAuditing

public class Post {

    @Id
    private String id;

    private String postUId;

    private String ylink;
    private String glink;

    private String title;
    private String content;
    private List<String> image;
    private List<Comment> comments = new ArrayList<>();
    private boolean published;
    private int likes;

    @CreatedDate
    private LocalDateTime created;

    @LastModifiedDate
    private LocalDateTime modified;

    public Post( String title, String content, boolean published) {

        this.title = title;
        this.content = content;
        this.published = published;
    }

    public Post( String title, String content, List<String> image, boolean published) {

        this.title = title;
        this.content = content;
        this.image = image;
        this.published = published;
    }

}
