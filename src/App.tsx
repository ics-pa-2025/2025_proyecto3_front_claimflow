import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ClaimsList } from './pages/claims/ClaimsList';
import { CreateClaim } from './pages/claims/CreateClaim';
import { UsersList } from './pages/users/UsersList';
import { ClientsList } from './pages/clients/ClientsList';
import { ProjectsList } from './pages/projects/ProjectsList';
import { ClaimDetail } from './pages/claims/ClaimDetail';
import { Settings } from './pages/Settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="claims" element={<ClaimsList />} />
            <Route path="claims/new" element={<CreateClaim />} />
            <Route path="claims/:id" element={<ClaimDetail />} />
            <Route path="users" element={<UsersList />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
