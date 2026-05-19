import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Navigation from './components/Navigation';
import Discover from './components/Discover.tsx';
import Bookshelf from './components/Bookshelf.tsx';
import BookDetail from './components/BookDetail.tsx';
import Reader from './components/Reader.tsx';
import './App.css';

function AppRoutes() {
  return (
    <>
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/bookshelf" element={<Bookshelf />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/read/:chapterId" element={<Reader />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
