import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuestionDetail from './pages/QuestionDetail';
import AskQuestion from './pages/AskQuestion';
import DiplomaList from './pages/DiplomaList';
import DiplomaDetail from './pages/DiplomaDetail';
import Verify from './pages/Verify';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/question/:id" element={<QuestionDetail />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/diplomas" element={<DiplomaList />} />
          <Route path="/diploma/:id" element={<DiplomaDetail />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/user/:id" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
