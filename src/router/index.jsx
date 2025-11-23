/**
 * Router Configuration
 * Configuración de rutas de la aplicación
 */

import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import HomePage from '@/router/pages/HomePage';
import DashboardPage from '@/router/pages/DashboardPage';
import TeacherDashboardPage from '@/router/pages/TeacherDashboardPage';
import StudentDashboardPage from '@/router/pages/StudentDashboardPage';
// Products feature
import { ProductsListPage, ProductDetailPage } from '@features/products';
// Calendar & Bookings feature
import { 
  StudentBookingPage, 
  TeacherCalendarPage, 
  AvailabilityConfigPage 
} from '@features/calendar';
import CalendarPage from '@/router/pages/CalendarPage';
import BookingsPage from '@/router/pages/BookingsPage';
// Blog feature
import { BlogListPage, BlogPostPage, BlogEditorPage } from '@features/blog';
// Recordings feature
import { StudentRecordingsPage, TeacherRecordingsPage } from '@features/recordings';
// Chat feature
import { StudentChatPage, TeacherChatPage } from '@features/chat';
// Notifications feature
import { NotificationsPage } from '@features/notifications';
import NotFoundPage from '@/router/pages/NotFoundPage';
import DemoUsersPage from '@/router/pages/DemoUsersPage';

// Auth feature
import { 
  LoginPage, 
  RegisterPage, 
  ProfilePage,
  ProtectedRoute,
  PublicRoute 
} from '@features/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teacher/dashboard',
        element: (
          <ProtectedRoute requireRole="teacher">
            <TeacherDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'student/dashboard',
        element: (
          <ProtectedRoute requireRole="student">
            <StudentDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products',
        element: (
          <ProtectedRoute>
            <ProductsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <ProtectedRoute>
            <ProductDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'calendar',
        element: (
          <ProtectedRoute requireRole="student">
            <StudentBookingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teacher/calendar',
        element: (
          <ProtectedRoute requireRole="teacher">
            <TeacherCalendarPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teacher/availability',
        element: (
          <ProtectedRoute requireRole="teacher">
            <AvailabilityConfigPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'bookings',
        element: (
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'blog',
        element: (
          <ProtectedRoute>
            <BlogListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'blog/new',
        element: (
          <ProtectedRoute requireRole="teacher">
            <BlogEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'blog/edit/:id',
        element: (
          <ProtectedRoute requireRole="teacher">
            <BlogEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'blog/:id',
        element: (
          <ProtectedRoute>
            <BlogPostPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'recordings',
        element: (
          <ProtectedRoute requireRole="teacher">
            <TeacherRecordingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-classes/recordings',
        element: (
          <ProtectedRoute>
            <StudentRecordingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'chat',
        element: (
          <ProtectedRoute requireRole="teacher">
            <TeacherChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-chat',
        element: (
          <ProtectedRoute requireRole="student">
            <StudentChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/demo',
    element: <DemoUsersPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
