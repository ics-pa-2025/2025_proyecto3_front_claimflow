import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ClaimsList } from './pages/claims/ClaimsList';
import { CreateClaim } from './pages/claims/CreateClaim';
import { UsersList } from './pages/users/UsersList';
import { CreateUser } from './pages/users/CreateUser';
import { ClientsList } from './pages/clients/ClientsList';
import { CreateClient } from './pages/clients/CreateClient';
import { EditClient } from './pages/clients/EditClient';
import { ProjectsList } from './pages/projects/ProjectsList';
import { CreateProject } from './pages/projects/CreateProject';
import { EditProject } from './pages/projects/EditProject';
import { ClaimDetail } from './pages/claims/ClaimDetail';
import { Settings } from './pages/Settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

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
            <Route path="claims/:id/edit" element={<CreateClaim />} />
            <Route path="claims/:id" element={<ClaimDetail />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/new" element={<CreateUser />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="clients/new" element={<CreateClient />} />
            <Route path="clients/edit/:id" element={<EditClient />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<CreateProject />} />
            <Route path="projects/edit/:id" element={<EditProject />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
