import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getQuestionById,
  deleteQuestion,
  updateQuestion
} from '../services/questionService';
import {
  getAnswersByQuestionId,
  createAnswer
} from '../services/answerService';
import AnswerCard from '../components/AnswerCard';

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '' });

  const load = async () => {
    const qRes = await getQuestionById(id);
    setQuestion(qRes.data);
    setEditData({ title: qRes.data.title, description: qRes.data.description });

    const aRes = await getAnswersByQuestionId(id);
    setAnswers(aRes.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleDelete = async () => {
    await deleteQuestion(id);
    navigate('/');
  };

  const handleUpdate = async () => {
    await updateQuestion(id, editData);
    setIsEditing(false);
    load();
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    await createAnswer({ content: newAnswer, questionId: id });
    setNewAnswer('');
    load();
  };

  if (!question) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {isEditing ? (
        <div className="mb-6">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            rows={4}
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded mr-2">Save</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      ) : (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold">{question.title}</h2>
          <p className="mt-2 text-gray-700">{question.description}</p>
          <div className="mt-4 space-x-2">
            <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
            <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
          </div>
        </div>
      )}

      <form onSubmit={handleAnswerSubmit} className="mb-4">
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Write your answer..."
          className="w-full p-2 border rounded"
          rows={3}
          required
        />
        <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Post Answer</button>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Answers</h3>
        {answers.map((ans) => (
          <AnswerCard key={ans.id} answer={ans} reload={load} />
        ))}
      </div>
    </div>
  );
}
