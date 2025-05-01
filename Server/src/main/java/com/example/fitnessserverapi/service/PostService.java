package com.example.fitnessserverapi.service;

import com.example.fitnessserverapi.model.Post;
import com.example.fitnessserverapi.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;


    public List<Post> getAllPosts() {
        return postRepository.findAll();

    }

    public Post getPostById(String postUId) {
        Optional<Post> optionalPost = postRepository.findById(postUId);
        return optionalPost.orElse(null);
    }

    public Post addPost(Post post) {
        return postRepository.save(post);
    }


    public Post updatePost(String postId, Post post) {
        post.setId(postId);
        return postRepository.save(post);
    }




    public void deleteAllPosts() {
        postRepository.deleteAll();
    }



    public List<Post> getPostsByPostUId(String postUId) {
        return postRepository.findAllByPostUId(postUId);
    }

    public void deletepost(String id) {
        postRepository.deleteById(id);
    }

    public Post likePost(String postId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            int likes = post.getLikes();
            post.setLikes(likes + 1); // Increment likes count by one
            return postRepository.save(post);
        }
        return null;
    }

}
