import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuestionById, getAnswersByQuestionId, deleteQuestion } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import FooterCom from '../../components/FooterCom';

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Fixed syntax here

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionResponse = await getQuestionById(id);
        setQuestion(questionResponse.data);
        const answersResponse = await getAnswersByQuestionId(id);
        setAnswers(answersResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(id, user.id);
        window.location.href = '/';
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete question');
      }
    }
  };

  if (loading) return <div className="text-center p-6 text-dark-gray">Loading...</div>;
  if (error) return <div className="text-dark-green text-center p-6">{error}</div>;
  if (!question) return <div className="text-center p-6 text-dark-gray">Question not found</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto p-6 flex-grow">
        <div className="bg-white p-6 rounded-lg shadow-md border border-light-gray mb-6">
          <h1 className="text-2xl font-bold mb-4 text-dark-gray">{question.title}</h1>
          <p className="text-dark-gray mb-4">{question.content}</p>
          <p className="text-sm text-light-gray mb-4">
            Asked by {question.username} on {new Date(question.createdAt).toLocaleString()}
          </p>
          {user && user.id === question.userId && (
            <div className="space-x-4 mb-4">
              <Link
                to={`/questions/edit/${id}`}
                className="text-primary-green hover:text-dark-green font-medium"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="text-dark-green hover:text-primary-green font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold mb-4 text-dark-gray">Answers</h2>
        <div className="space-y-4">
          {answers.map((answer) => (
            <div key={answer.id} className="bg-white p-4 rounded-lg shadow-md border border-light-gray">
              <p className="text-dark-gray mb-2">{answer.content}</p>
              <p className="text-sm text-light-gray mb-2">
                Answered by {answer.username} on {new Date(answer.createdAt).toLocaleString()}
              </p>
              {user && user.id === answer.userId && (
                <Link
                  to={`/answers/edit/${answer.id}`}
                  className="text-primary-green hover:text-dark-green font-medium"
                >
                  Edit
                </Link>
              )}
            </div>
          ))}
        </div>
        {user && (
          <Link
            to={`/answers/new/${id}`}
            className="bg-primary-green text-white px-6 py-3 rounded-lg shadow-md hover:bg-dark-green hover:shadow-lg transition duration-300 mt-6 inline-block"
          >
            Add Answer
          </Link>
        )}
      </div>
      <FooterCom />
    </div>
  );
};

export default QuestionDetail;