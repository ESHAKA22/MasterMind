import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Header from './components/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import QuestionList from './components/Questions/QuestionList';
import QuestionDetail from './components/Questions/QuestionDetail';
import QuestionForm from './components/Questions/QuestionForm';
import AnswerForm from './components/Answers/AnswerForm';
import UserProfile from './components/Profile/UserProfile';
import PrivateRoute from './components/Shared/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<QuestionList />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        <Route element={<PrivateRoute />}>
          <Route path="/questions/new" element={<QuestionForm />} />
          <Route path="/questions/edit/:id" element={<QuestionForm />} />
          <Route path="/answers/new/:questionId" element={<AnswerForm />} />
          <Route path="/answers/edit/:id" element={<AnswerForm />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;