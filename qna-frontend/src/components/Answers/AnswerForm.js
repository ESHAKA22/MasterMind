import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createAnswer, updateAnswer, getAnswerById } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AnswerForm = () => {
  const { id, questionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [questionIdState, setQuestionIdState] = useState(questionId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchAnswer = async () => {
        try {
          const response = await getAnswerById(id);
          const answer = response.data;
          if (answer.userId !== user.id) {
            setError('You can only edit your own answers');
            return;
          }
          setContent(answer.content);
          setQuestionIdState(answer.questionId);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch answer');
        }
      };
      fetchAnswer();
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (id) {
        await updateAnswer(id, { content }, user.id);
        navigate(`/questions/${questionIdState}`);
      } else {
        await createAnswer({ content }, questionId, user.id);
        navigate(`/questions/${questionId}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Answer' : 'Add Answer'}</h1>
      {error && <p className="text-dark-green mb-4">{error}</p>}
      <div>
        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-32"
            required
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-primary-green text-white p-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Saving...' : id ? 'Update Answer' : 'Post Answer'}
        </button>
      </div>
    </div>
  );
};

export default AnswerForm;