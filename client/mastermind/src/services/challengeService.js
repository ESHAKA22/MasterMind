import api from "./api";

// Base endpoint for challenges
const CHALLENGES_API = "/challenges";

// Get all challenges
export const getAllChallenges = async () => {
  const response = await api.get(CHALLENGES_API);
  return response.data;
};

// Get a specific challenge by ID
export const getChallengeById = async (id) => {
  const response = await api.get(`${CHALLENGES_API}/${id}`);
  return response.data;
};

// Create a new challenge
export const createChallenge = async (challengeData) => {
  const response = await api.post(CHALLENGES_API, challengeData);
  return response.data;
};

// Update an existing challenge
export const updateChallenge = async (id, challengeData) => {
  const response = await api.put(`${CHALLENGES_API}/${id}`, challengeData);
  return response.data;
};

// Delete a challenge
export const deleteChallenge = async (id) => {
  const response = await api.delete(`${CHALLENGES_API}/${id}`);
  return response.data;
};

// Filter challenges by category
export const filterChallengesByCategory = async (category) => {
  const response = await api.get(
    `${CHALLENGES_API}/filter/category?category=${encodeURIComponent(category)}`
  );
  return response.data;
};

// Filter challenges by difficulty
export const filterChallengesByDifficulty = async (difficulty) => {
  const response = await api.get(
    `${CHALLENGES_API}/filter/difficulty?difficulty=${encodeURIComponent(
      difficulty
    )}`
  );
  return response.data;
};

// Enroll user in a challenge
export const enrollUserInChallenge = async (challengeId, userId) => {
  const response = await api.post(
    `${CHALLENGES_API}/${challengeId}/enroll?userId=${encodeURIComponent(
      userId
    )}`
  );
  return response.data;
};

// Like a challenge
export const likeChallenge = async (challengeId, userId) => {
  const response = await api.post(
    `${CHALLENGES_API}/${challengeId}/like?userId=${encodeURIComponent(userId)}`
  );
  return response.data;
};

// Unlike a challenge
export const unlikeChallenge = async (challengeId, userId) => {
  const response = await api.delete(
    `${CHALLENGES_API}/${challengeId}/like?userId=${encodeURIComponent(userId)}`
  );
  return response.data;
};

// Get comments for a challenge
export const getComments = async (challengeId) => {
  const response = await api.get(`${CHALLENGES_API}/${challengeId}/comments`);
  return response.data;
};

// Add a comment to a challenge
export const addComment = async (challengeId, commentData) => {
  try {
    const response = await api.post(
      `${CHALLENGES_API}/${challengeId}/comments`,
      commentData
    );
    return response.data;
  } catch (error) {
    console.error("Error in addComment service function:", error);

    // For debugging: check what's happening with the request
    console.log("Attempted to add comment with data:", {
      challengeId,
      commentData,
    });

    // Re-throw the error to be handled by the component
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (challengeId, commentId) => {
  const response = await api.delete(
    `${CHALLENGES_API}/${challengeId}/comments/${commentId}`
  );
  return response.data;
};

// Like a comment
export const likeComment = async (challengeId, commentId, userId) => {
  const response = await api.post(
    `${CHALLENGES_API}/${challengeId}/comments/${commentId}/like?userId=${encodeURIComponent(
      userId
    )}`
  );
  return response.data;
};

// Unlike a comment
export const unlikeComment = async (challengeId, commentId, userId) => {
  const response = await api.delete(
    `${CHALLENGES_API}/${challengeId}/comments/${commentId}/like?userId=${encodeURIComponent(
      userId
    )}`
  );
  return response.data;
};

// Reply to a comment
export const replyToComment = async (challengeId, commentId, replyData) => {
  const response = await api.post(
    `${CHALLENGES_API}/${challengeId}/comments/${commentId}/replies`,
    replyData
  );
  return response.data;
};

// Get replies for a comment
export const getCommentReplies = async (challengeId, commentId) => {
  const response = await api.get(
    `${CHALLENGES_API}/${challengeId}/comments/${commentId}/replies`
  );
  return response.data;
};
