/**
 * Chat Feature
 * Exportación centralizada del feature de chat
 */

// Pages
export { default as StudentChatPage } from './pages/StudentChatPage';
export { default as TeacherChatPage } from './pages/TeacherChatPage';

// Components
export { default as ChatList } from './components/ChatList';
export { default as ChatWindow } from './components/ChatWindow';
export { default as MessageBubble } from './components/MessageBubble';

// Hooks
export * from './hooks/useChat';

// Services
export * from './services/chatService';
