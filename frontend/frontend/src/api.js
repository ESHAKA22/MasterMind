import axios from 'axios';

const API_URL = 'http://localhost:9090/api/courses';

export const getCourses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch courses');
  }
};

export const getCourseById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch course data');
  }
};

export const createCourse = async (courseData) => {
  try {
    // Check if courseData is FormData (with file) or a regular object
    let response;
    
    if (courseData instanceof FormData) {
      response = await axios.post(API_URL, courseData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await axios.post(API_URL, courseData);
    }
    
    return response.data;
  } catch (error) {
    throw new Error('Failed to create course');
  }
};

export const updateCourse = async (id, updatedCourse) => {
  try {
    // Make sure we're sending the required fields with fallbacks
    const courseToUpdate = {
      title: updatedCourse.title || '',
      description: updatedCourse.description || '',
      ...updatedCourse
    };
    
    const response = await axios.put(`${API_URL}/${id}`, courseToUpdate);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update course');
  }
};

export const deleteCourse = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Failed to delete course');
  }
};

// New API functions for course content
export const getCourseContent = async (courseId) => {
  try {
    const response = await axios.get(`${API_URL}/${courseId}/content`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch course content');
  }
};

export const addContentToCourse = async (courseId, content) => {
  try {
    const response = await axios.post(`${API_URL}/${courseId}/content`, content);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add course content');
  }
};

export const updateCourseContent = async (courseId, contentId, updatedContent) => {
  try {
    const response = await axios.put(`${API_URL}/${courseId}/content/${contentId}`, updatedContent);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update course content');
  }
};

export const deleteCourseContent = async (courseId, contentId) => {
  try {
    await axios.delete(`${API_URL}/${courseId}/content/${contentId}`);
  } catch (error) {
    throw new Error('Failed to delete course content');
  }
};

// Add this function to your existing api.js file

export const generateCourseContent = async (courseId) => {
  try {
    const response = await axios.post(`${API_URL}/${courseId}/generate-content`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to generate course content');
  }
};