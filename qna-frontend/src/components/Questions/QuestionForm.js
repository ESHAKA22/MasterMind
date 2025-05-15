import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createQuestion, updateQuestion, getQuestionById } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import FooterCom from '../../components/FooterCom';

const QuestionForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchQuestion = async () => {
        try {
          const response = await getQuestionById(id);
          const question = response.data;
          if (question.userId !== user.id) {
            setError('You can only edit your own questions.');
            return;
          }
          setTitle(question.title);
          setContent(question.content);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch question');
        }
      };
      fetchQuestion();
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (id) {
        await updateQuestion(id, { title, content }, user.id);
      } else {
        await createQuestion({ title, content }, user.id);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto p-6 flex-grow">
        <div className="bg-white p-6 rounded-lg shadow-md border border-light-gray max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-dark-gray">{id ? 'Edit Question' : 'Ask a Question'}</h1>
          {error && <p className="text-dark-green mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-dark-gray mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-light-gray rounded-lg text-dark-gray focus:outline-none focus:ring-2 focus:ring-primary-green"
                required
              />
            </div>
            <div>
              <label className="block text-dark-gray mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border border-light-gray rounded-lg h-32 text-dark-gray focus:outline-none focus:ring-2 focus:ring-primary-green"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-primary-green text-white px-6 py-3 rounded-lg shadow-md hover:bg-dark-green hover:shadow-lg transition duration-300 w-full"
              disabled={loading}
            >
              {loading ? 'Saving...' : id ? 'Update Question' : 'Post Question'}
            </button>
          </form>
        </div>
      </div>
      <FooterCom />
    </div>
  );
};

export default QuestionForm;