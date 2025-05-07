import React, { useEffect, useState } from 'react';
import { getAllQuestions } from '../services/questionService';
import QuestionCard from '../components/QuestionCard';

export default function Home() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await getAllQuestions();
      setQuestions(res.data);
    };
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Questions</h2>
      {questions.map((q) => (
        <QuestionCard key={q.id} question={q} />
      ))}
    </div>
  );
}
