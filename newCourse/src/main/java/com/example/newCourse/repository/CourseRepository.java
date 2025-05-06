package com.example.newCourse.repository;

import com.example.newCourse.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CourseRepository extends MongoRepository<Course, String> {}
