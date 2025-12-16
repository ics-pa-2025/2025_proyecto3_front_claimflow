import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ClaimsList } from './pages/claims/ClaimsList';
import { CreateClaim } from './pages/claims/CreateClaim';
import { UsersList } from './pages/users/UsersList';
import { CreateUser } from './pages/users/CreateUser';
import { ClientsList } from './pages/clients/ClientsList';
import { EditClient } from './pages/clients/EditClient';
import { ProjectsList } from './pages/projects/ProjectsList';
import { CreateProject } from './pages/projects/CreateProject';
import { EditProject } from './pages/projects/EditProject';
import { ClaimDetail } from './pages/claims/ClaimDetail';
import { SolicitudReclamoList } from './pages/solicitud-reclamo/SolicitudReclamoList';
import { CreateSolicitudReclamo } from './pages/solicitud-reclamo/CreateSolicitudReclamo';
import { Settings } from './pages/Settings';
import { EstadoReclamoList } from './pages/claim-statuses/EstadoReclamoList';
import { CreateEditEstadoReclamo } from './pages/claim-statuses/CreateEditEstadoReclamo';
import { AreasList } from './pages/areas/AreasList';
import { CreateEditArea } from './pages/areas/CreateEditArea';
import { ChatList } from './pages/chat/ChatList';
import { ChatWindow } from './pages/chat/ChatWindow';
import { TipoReclamoList } from './pages/tipo-reclamo/TipoReclamoList';
import { CreateEditTipoReclamo } from './pages/tipo-reclamo/CreateEditTipoReclamo';


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

const RoleProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || (user.role && !allowedRoles.includes(user.role.name))) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
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
              {/* Solicitud Reclamo */}
              <Route path="solicitud-reclamo" element={<SolicitudReclamoList />} />
              <Route path="solicitud-reclamo/new" element={<CreateSolicitudReclamo />} />
              <Route path="users" element={<UsersList />} />
              <Route path="users/new" element={<CreateUser />} />
              <Route path="clients" element={<ClientsList />} />
              <Route path="clients/edit/:id" element={<EditClient />} />
              <Route path="projects" element={<ProjectsList />} />
              <Route path="projects/new" element={<CreateProject />} />
              <Route path="projects/edit/:id" element={<EditProject />} />
              <Route path="settings" element={<Settings />} />
              <Route path="areas" element={<AreasList />} />
              <Route path="areas/new" element={<CreateEditArea />} />
              <Route path="areas/:id/edit" element={<CreateEditArea />} />

              {/* Chat Routes - Restricted to non-clients */}
              <Route path="chat" element={
                <RoleProtectedRoute allowedRoles={['admin', 'user', 'superadmin']}>
                  <ChatList />
                </RoleProtectedRoute>
              } />
              <Route path="chat/:reclamoId" element={
                <RoleProtectedRoute allowedRoles={['admin', 'user', 'superadmin']}>
                  <ChatWindow />
                </RoleProtectedRoute>
              } />

              <Route path="claim-statuses" element={<EstadoReclamoList />} />
              <Route path="claim-statuses/new" element={<CreateEditEstadoReclamo />} />
              <Route path="claim-statuses/:id/edit" element={<CreateEditEstadoReclamo />} />

              <Route path="claim-types" element={<TipoReclamoList />} />
              <Route path="claim-types/new" element={<CreateEditTipoReclamo />} />
              <Route path="claim-types/:id/edit" element={<CreateEditTipoReclamo />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
