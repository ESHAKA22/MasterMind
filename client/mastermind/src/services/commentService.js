import axios from "axios";

const API_URL = "/api/comments";

// Get all comments for a specific challenge
export const getCommentsByChallengeId = async (challengeId) => {
  try {
    const response = await axios.get(`${API_URL}/${challengeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Add a new comment
export const addComment = async (commentData) => {
  try {
    const response = await axios.post(API_URL, commentData);
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Update an existing comment
export const updateComment = async (commentId, content) => {
  try {
    const response = await axios.put(`${API_URL}/${commentId}`, { content });
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    await axios.delete(`${API_URL}/${commentId}`);
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export default {
  getCommentsByChallengeId,
  addComment,
  updateComment,
  deleteComment,
};
