// src/AppRoutes.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminRoute, StudentRoute, PublicRoute, LoadingScreen } from './pages/utils/ProtectedRoute';
import { Layout } from './components/Layout';

// Lazy load components
const Login = lazy(() => import('./pages/auth/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

// Route configurations
const routes = {
  public: [
    { path: "/login", element: Login },
    { path: "/unauthorized", element: Unauthorized }
  ],
  admin: [
    { path: "/admin/dashboard", element: AdminDashboard },
    // Add more admin routes here
  ],
  student: [
    { path: "/student/dashboard", element: StudentDashboard },
    // Add more student routes here
  ],
  shared: [
    { path: "*", element: NotFound }
  ]
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        {routes.public.map(({ path, element: Element }) => (
          <Route
            key={path}
            path={path}
            element={
              path === '/login' ? (
                <PublicRoute>
                  <Element />
                </PublicRoute>
              ) : (
                <Element />
              )
            }
          />
        ))}

        {/* Protected Routes */}
        <Route element={<Layout />}>
          {/* Admin Routes */}
          {routes.admin.map(({ path, element: Element }) => (
            <Route
              key={path}
              path={path}
              element={
                <AdminRoute>
                  <Suspense fallback={<LoadingScreen />}>
                    <Element />
                  </Suspense>
                </AdminRoute>
              }
            />
          ))}

          {/* Student Routes */}
          {routes.student.map(({ path, element: Element }) => (
            <Route
              key={path}
              path={path}
              element={
                <StudentRoute>
                  <Suspense fallback={<LoadingScreen />}>
                    <Element />
                  </Suspense>
                </StudentRoute>
              }
            />
          ))}
        </Route>

        {/* Shared Routes */}
        {routes.shared.map(({ path, element: Element }) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<LoadingScreen />}>
                <Element />
              </Suspense>
            }
          />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;