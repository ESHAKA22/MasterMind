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
    // Check if updatedCourse is a FormData object
    if (updatedCourse instanceof FormData) {
      // For FormData, we need to use the appropriate content-type header
      const response = await axios.put(`${API_URL}/${id}`, updatedCourse, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // For JSON objects, use the existing approach
      const courseToUpdate = {
        title: updatedCourse.title || '',
        description: updatedCourse.description || '',
        duration: updatedCourse.duration || '',
        language: updatedCourse.language || '',
        level: updatedCourse.level || '',
        category: updatedCourse.category || '',
        tags: updatedCourse.tags || [],
        ...updatedCourse
      };
      
      const response = await axios.put(`${API_URL}/${id}`, courseToUpdate);
      return response.data;
    }
  } catch (error) {
    console.error('API Error:', error);
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
    // Set the courseId in the content
    const lessonWithCourseId = {
      ...content,
      courseId: courseId
    };
    
    const response = await axios.post(`${API_URL}/${courseId}/content`, lessonWithCourseId);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add course content');
  }
};

export const updateCourseContent = async (courseId, contentId, updatedContent) => {
  try {
    // Now using the lessons API directly
    const response = await axios.put(`http://localhost:9090/api/lessons/${contentId}`, updatedContent);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update course content');
  }
};

export const deleteCourseContent = async (courseId, contentId) => {
  try {
    // Now using the lessons API directly
    await axios.delete(`http://localhost:9090/api/lessons/${contentId}`);
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

// Update these functions to use the new API
export const getLessonById = async (lessonId) => {
  try {
    const response = await axios.get(`http://localhost:9090/api/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lesson data');
  }
};

export const updateLesson = async (lessonId, updatedLesson) => {
  try {
    const response = await axios.put(`http://localhost:9090/api/lessons/${lessonId}`, updatedLesson);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update lesson');
  }
};

export const markLessonComplete = async (lessonId) => {
  try {
    const response = await axios.post(`http://localhost:9090/api/lessons/${lessonId}/mark-complete`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to mark lesson as complete');
  }
};

export const markLessonIncomplete = async (lessonId) => {
  try {
    const response = await axios.post(`http://localhost:9090/api/lessons/${lessonId}/mark-incomplete`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to mark lesson as incomplete');
  }
};

export const uploadLessonVideo = async (lessonId, videoFile) => {
  try {
    const formData = new FormData();
    formData.append('video', videoFile);
    
    const response = await axios.post(`http://localhost:9090/api/lessons/${lessonId}/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to upload video');
  }
};

export const uploadLessonResource = async (lessonId, resourceFile) => {
  try {
    const formData = new FormData();
    formData.append('resource', resourceFile);
    
    const response = await axios.post(`http://localhost:9090/api/lessons/${lessonId}/resource`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to upload resource');
  }
};