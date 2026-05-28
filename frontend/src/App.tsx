import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Navigation from './components/Navigation';
import Discover from './components/Discover.tsx';
import Bookshelf from './components/Bookshelf.tsx';
import BookDetail from './components/BookDetail.tsx';
import Reader from './components/Reader.tsx';
import ProfilePage from './components/ProfilePage.tsx';
import CreateBook from './components/CreateBook.tsx';
import AuthCallback from './components/AuthCallback';
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
          {/* Callback dari social login (Google/Facebook) */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/create-novel" element={
            <ProtectedRoute><CreateBook /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
