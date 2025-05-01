package com.example.fitnessserverapi.controller;

import com.example.fitnessserverapi.model.Post;
import com.example.fitnessserverapi.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173",methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = "*")
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostService postService;


    // Get all posts
    @GetMapping("/Get")
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{postUId}")
    public ResponseEntity<List<Post>> getPostsByPostUId(@PathVariable String postUId) {
        List<Post> posts = postService.getPostsByPostUId(postUId);
        if (!posts.isEmpty()) {
            return ResponseEntity.ok(posts);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    // Add new post
    @PostMapping("/create")
    public ResponseEntity<Post> addPost(@RequestBody Post post) {
        Post createdPost = postService.addPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    // Update post
    @PutMapping("/update/{postId}")
    public ResponseEntity<Post> updatePost(@PathVariable String postId, @RequestBody Post post) {
        Post updatedPost = postService.updatePost(postId, post);
        if (updatedPost != null) {
            return ResponseEntity.ok(updatedPost);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete post
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletepost(@PathVariable("id") String _id) {
        try {
            postService.deletepost(_id);
            return ResponseEntity.ok("Delete successful for ID: " + _id);  // Properly return a response indicating success without a body
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete post with ID: " + _id + " due to: " + e.getMessage());
        }
    }

    @PutMapping("/like/{postId}")
    public ResponseEntity<Post> likePost(@PathVariable String postId) {
        Post updatedPost = postService.likePost(postId);
        if (updatedPost != null) {
            return ResponseEntity.ok(updatedPost);
        } else {
            return ResponseEntity.notFound().build();
        }
    }




    // Delete all posts
    @DeleteMapping("/AllDelete")
    public ResponseEntity<Void> deleteAllPosts() {
        postService.deleteAllPosts();
        return ResponseEntity.noContent().build();
    }













}
