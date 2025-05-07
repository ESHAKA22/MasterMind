import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuestionsByUserId, getAnswersByUserId } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const questionsResponse = await getQuestionsByUserId(user.id);
        setQuestions(questionsResponse.data);
        const answersResponse = await getAnswersByUserId(user.id);
        setAnswers(answersResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-dark-green text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile - {user.username}</h1>
      <h2 className="text-xl font-bold mb-2">Your Questions</h2>
      <div className="space-y-4 mb-8">
        {questions.map((question) => (
          <div key={question.id} className="border p-4 rounded">
            <h3 className="text-lg font-bold">{question.title}</h3>
            <p className="text-gray-700">{question.content}</p>
            <Link to={`/questions/${question.id}`} className="text-primary-green hover:underline">
              View
            </Link>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-2">Your Answers</h2>
      <div className="space-y-4">
        {answers.map((answer) => (
          <div key={answer.id} className="border p-4 rounded">
            <p className="text-gray-700">{answer.content}</p>
            <Link to={`/questions/${answer.questionId}`} className="text-primary-green hover:underline">
              View Question
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;