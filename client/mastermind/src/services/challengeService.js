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
