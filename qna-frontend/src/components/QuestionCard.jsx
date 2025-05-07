import React from 'react';
import { Link } from 'react-router-dom';

export default function QuestionCard({ question }) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-md transition mb-3 bg-white">
      <Link to={`/question/${question.id}`}>
        <h3 className="text-xl font-semibold text-blue-600">{question.title}</h3>
        <p className="text-gray-700 mt-1">{question.description}</p>
      </Link>
    </div>
  );
}
