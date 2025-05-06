// src/api.js
import axios from 'axios';

// Define the base URL for your backend API
const API_URL = 'http://localhost:9090/api/courses';

// Function to get the details of a course by its ID
export const getCourseById = async (id) => {
  try {
    // Send GET request to fetch course details by ID
    const response = await axios.get(`${API_URL}/${id}`);
    
    // Return the course data from the response
    return response.data;
  } catch (error) {
    // If an error occurs, throw a new error with a message
    throw new Error('Failed to fetch course data');
  }
};

// Function to update a course with new data
export const updateCourse = async (id, updatedCourse) => {
  try {
    // Send PUT request to update the course with new data
    const response = await axios.put(`${API_URL}/${id}`, updatedCourse);
    
    // Return the updated course data from the response
    return response.data;
  } catch (error) {
    // If an error occurs, throw a new error with a message
    throw new Error('Failed to update course');
  }
};

export const uploadLessonVideo = async (courseId, lessonId, videoFile) => {
  try {
    const formData = new FormData();
    formData.append('video', videoFile);
    
    const response = await axios.post(`${API_URL}/${courseId}/content/${lessonId}/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to upload video');
  }
};

export const uploadLessonResource = async (courseId, lessonId, resourceFile) => {
  try {
    const formData = new FormData();
    formData.append('resource', resourceFile);
    
    const response = await axios.post(`${API_URL}/${courseId}/content/${lessonId}/resource`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to upload resource');
  }
};
