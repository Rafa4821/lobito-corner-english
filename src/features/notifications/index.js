/**
 * Notifications Feature
 * Exportación centralizada del feature de notificaciones
 */

// Components
export { default as NotificationBell } from './components/NotificationBell';

// Pages
export { default as NotificationsPage } from './pages/NotificationsPage';

// Hooks
export * from './hooks/useNotifications';

// Services
export * from './services/emailService';
export * from './services/notificationService';
export * from './services/inAppNotificationService';

// Templates
export * from './templates/emailTemplates';
