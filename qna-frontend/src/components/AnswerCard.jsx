import React, { useState } from 'react';
import { updateAnswer, deleteAnswer } from '../services/answerService';

export default function AnswerCard({ answer, reload }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(answer.content);

  const handleUpdate = async () => {
    await updateAnswer(answer.id, { content: editedContent });
    setIsEditing(false);
    reload();
  };

  const handleDelete = async () => {
    await deleteAnswer(answer.id);
    reload();
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-3">
      {isEditing ? (
        <>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            rows={2}
          />
          <button onClick={handleUpdate} className="bg-green-600 text-white px-3 py-1 rounded mr-2">Save</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
        </>
      ) : (
        <>
          <p className="text-gray-800">{answer.content}</p>
          <div className="mt-2 space-x-2">
            <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
            <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
