import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/authStore';

import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import MobileNav from './components/Layout/MobileNav';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import CalendarPage from './pages/CalendarPage';
import WishlistPage from './pages/WishlistPage';
import InspirationPage from './pages/InspirationPage';
import CommunityPage from './pages/CommunityPage';
import BlogPage from './pages/BlogPage';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (token) {
    return <Navigate to="/feed" replace />;
  }
  return children;
};

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-4rem)] pb-20 lg:pb-0">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/feed" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <FeedPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/:username" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreatePostPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/post/:id" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PostDetailPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CalendarPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <WishlistPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inspiration" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <InspirationPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/community" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CommunityPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blog" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <BlogPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
