package com.example.fitnessserverapi.repository;

import com.example.fitnessserverapi.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends MongoRepository<Post, String> {


    List<Post> findAllByPostUId(String postUId);
}
