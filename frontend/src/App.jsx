import React from 'react';
import { Route, Routes, Navigate } from 'react-router';

import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Homepage from './pages/Homepage.jsx';
import Notifications from './pages/Notifications.jsx';
import ChatPage from './pages/ChatPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import CallPage from './pages/CallPage.jsx';
import toast, { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import Layout from './components/Layout.jsx';

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <>
      <div data-theme="forest">
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <Homepage />
                </Layout>
              ) : (
                <Navigate to={isAuthenticated ? '/profile' : '/login'} />
              )
            }
          />

          {/* Signup */}
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <SignUpPage />
              ) : (
                <Navigate to={isOnboarded ? '/' : '/profile'} />
              )
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginPage />
              ) : (
                <Navigate to={isOnboarded ? '/' : '/profile'} />
              )
            }
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <Notifications />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? '/login' : '/profile'} />
              )
            }
          />

          {/* Call */}
          <Route
            path="/call/:id"
            element={
              isAuthenticated && isOnboarded ? (
                <CallPage />
              ) : (
                <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
              )
            }
          />

          {/* Chat */}
          <Route
            path="/chat/:id"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={false}>
                  <ChatPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? '/login' : '/profile'} />
              )
            }
          />

          {/* Profile / Onboarding */}
          <Route
            path="/profile"
            element={
              !isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Layout showSidebar={true}>
                  <OnboardingPage />
                </Layout>
              )
            }
          />
        </Routes>
        <Toaster />
      </div>
    </>
  );
};

export default App;
