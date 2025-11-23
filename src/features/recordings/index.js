/**
 * Recordings Feature
 * Exportación centralizada del feature de grabaciones
 */

// Pages
export { default as StudentRecordingsPage } from './pages/StudentRecordingsPage';
export { default as TeacherRecordingsPage } from './pages/TeacherRecordingsPage';

// Components
export { default as RecordingCard } from './components/RecordingCard';
export { default as UploadForm } from './components/UploadForm';

// Hooks
export * from './hooks/useRecordings';

// Services
export * from './services/recordingService';
export * from './services/storageService';
