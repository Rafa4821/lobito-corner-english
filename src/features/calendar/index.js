/**
 * Calendar Feature
 * Exportación centralizada del feature de calendario
 */

// Pages
export { default as StudentBookingPage } from './pages/StudentBookingPage';
export { default as TeacherCalendarPage } from './pages/TeacherCalendarPage';
export { default as AvailabilityConfigPage } from './pages/AvailabilityConfigPage';

// Components
export { default as Calendar } from './components/Calendar';
export { default as TimeSlotPicker } from './components/TimeSlotPicker';
export { default as AvailabilityConfig } from './components/AvailabilityConfig';
export { default as BookingModal } from './components/BookingModal';
export { default as GoogleCalendarSync } from './components/GoogleCalendarSync';
export { default as EventDetailsModal } from './components/EventDetailsModal';

// Services
export * from './services/googleCalendarService';
