/**
 * Auth Feature
 * Exportación centralizada del feature de autenticación
 */

// Context & Hooks
export { AuthProvider, useAuth } from './context/AuthContext';

// Components
export { default as ProtectedRoute } from './components/ProtectedRoute';
export { default as PublicRoute } from './components/PublicRoute';

// Pages
export { default as LoginPage } from './pages/LoginPage';
export { default as RegisterPage } from './pages/RegisterPage';
export { default as ProfilePage } from './pages/ProfilePage';

// Services
export * from './services/authService';
export * from './services/userService';
