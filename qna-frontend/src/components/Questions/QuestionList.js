import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuestions } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import FooterCom from '../../components/FooterCom';

const QuestionList = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestions();
        setQuestions(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  if (loading) return <div className="text-center p-6 text-dark-gray">Loading...</div>;
  if (error) return <div className="text-dark-green text-center p-6">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-dark-gray">Questions</h1>
        {user && (
          <Link
            to="/questions/new"
            className="bg-primary-green text-white px-6 py-3 rounded-lg shadow-md hover:bg-dark-green hover:shadow-lg transition duration-300 mb-6 inline-block"
          >
            Ask a Question
          </Link>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <div key={question.id} className="bg-white p-4 rounded-lg shadow-md border border-light-gray">
              <h2 className="text-xl font-semibold text-dark-gray mb-2">{question.title}</h2>
              <p className="text-dark-gray mb-2 line-clamp-2">{question.content}</p>
              <p className="text-sm text-light-gray mb-2">
                Asked by {question.username} on {new Date(question.createdAt).toLocaleString()}
              </p>
              <Link
                to={`/questions/${question.id}`}
                className="text-primary-green hover:text-dark-green font-medium"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
      <FooterCom />
    </div>
  );
};

export default QuestionList;