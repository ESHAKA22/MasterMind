package com.example.newCourse.repository;

import com.example.newCourse.model.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LessonRepository extends MongoRepository<Lesson, String> {
    List<Lesson> findByCourseId(String courseId);
    List<Lesson> findByCourseIdOrderByOrder(String courseId);
    void deleteByCourseId(String courseId);
}