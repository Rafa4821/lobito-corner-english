/**
 * Chat Window Component
 * Ventana de chat con mensajes y input
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from '@design';
import { useChatMessages } from '../hooks/useChat';
import { sendMessage, markMessagesAsRead } from '../services/chatService';
import MessageBubble from './MessageBubble';
import PropTypes from 'prop-types';

const ChatWindow = ({ chat, currentUserId, otherUserName }) => {
  const { messages, loading } = useChatMessages(chat?.id);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Marcar mensajes como leídos cuando se abre el chat
  useEffect(() => {
    if (chat?.id && currentUserId) {
      markMessagesAsRead(chat.id, currentUserId);
    }
  }, [chat?.id, currentUserId]);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chat?.id) return;

    setSending(true);

    try {
      await sendMessage(chat.id, currentUserId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!chat) {
    return (
      <Card variant="outlined" padding="xl" className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold mb-2">Selecciona una conversación</h3>
          <p className="text-[var(--brand-muted)]">
            Elige un chat de la lista para comenzar a conversar
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="outlined" padding="none" className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--brand-border)] bg-[var(--brand-bg-alt)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center text-white font-bold">
            {otherUserName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold">{otherUserName}</h3>
            <p className="text-xs text-[var(--brand-muted)]">
              {messages.length > 0 ? 'Activo' : 'Sin mensajes'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[var(--brand-muted)]">Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">👋</div>
              <p className="text-[var(--brand-muted)]">
                No hay mensajes aún. ¡Envía el primero!
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-[var(--brand-border)] bg-[var(--brand-bg-alt)]">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            rows={1}
            disabled={sending}
            className="flex-1 px-4 py-2 border rounded-lg bg-[var(--brand-bg)] text-[var(--brand-text)] placeholder:text-[var(--brand-muted)] transition-all duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed border-[var(--brand-border)] resize-none"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <Button
            variant="primary"
            type="submit"
            disabled={!newMessage.trim() || sending}
            loading={sending}
          >
            {sending ? '...' : '📤'}
          </Button>
        </div>
        <p className="text-xs text-[var(--brand-muted)] mt-1">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </p>
      </form>
    </Card>
  );
};

ChatWindow.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    participants: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  currentUserId: PropTypes.string.isRequired,
  otherUserName: PropTypes.string.isRequired,
};

export default ChatWindow;
