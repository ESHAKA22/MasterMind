package com.example.fitnessserverapi.controller;

import com.example.fitnessserverapi.model.Comment;
import com.example.fitnessserverapi.model.Post;
import com.example.fitnessserverapi.repository.CommentRepository;
import com.example.fitnessserverapi.repository.PostRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173",methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = "*")
@RequestMapping("/api")
public class CommentController {

    @Autowired
    PostRepository postRepository;
    @Autowired
    private CommentRepository commentRepository;

    @PostMapping("/comment/{postId}")
    public ResponseEntity<Post> addComment(@PathVariable String postId, @RequestBody Comment comment) {
        Optional<Post> post = postRepository.findById(postId);

        if (post.isPresent()) {
            Post _post = post.get();

            ObjectId objectId = new ObjectId();
            String objectIdString = objectId.toHexString();

            comment.setCommentId(objectIdString);
            comment.setCreatedAt(LocalDateTime.now());
            comment.setModifiedAt(LocalDateTime.now());
            _post.getComments().add(comment);
            Post updatedPost = postRepository.save(_post);

            return ResponseEntity.ok(updatedPost);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{postId}/{commentId}/comments")
    public ResponseEntity<Post> updateComment(@PathVariable String postId,
                                                 @PathVariable String commentId,
                                              @RequestBody Comment comment) {

        Optional<Post> postData = postRepository.findById(postId);

        if (postData.isPresent()) {
            Post _post = postData.get();
            List<Comment> _comment = _post.getComments();
            _comment.forEach(val -> {
                if (commentId.equals(val.getCommentId())) {
                    val.setComment(comment.getComment());
                }
            });
            System.out.println(_post.getComments());

            Post updatedPost = postRepository.save(_post);
            return ResponseEntity.ok(updatedPost);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<Comment>> getCommentsByPost(@PathVariable String postId) {
        Optional<Post> post = postRepository.findById(postId);

        if (post.isPresent()) {
            Post _post = post.get();
            return ResponseEntity.ok(_post.getComments());
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Post> deleteComment(@PathVariable String postId, @PathVariable String commentId) {
        Optional<Post> post = postRepository.findById(postId);

        if (post.isPresent()) {
            Post _post = post.get();
            List<Comment> updatedComments = _post.getComments().stream()
                    .filter(c -> !c.getCommentId().equals(commentId))
                    .toList();
            _post.setComments(updatedComments);
            Post updatedPost = postRepository.save(_post);
            return ResponseEntity.ok(updatedPost);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
