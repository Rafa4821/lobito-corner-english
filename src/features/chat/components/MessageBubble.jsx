/**
 * Message Bubble Component
 * Burbuja de mensaje individual
 */

import React from 'react';
import { formatDate } from '@/utils';
import PropTypes from 'prop-types';

const MessageBubble = ({ message, isOwn }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-[var(--brand-primary)] text-white rounded-br-sm'
              : 'bg-[var(--brand-bg-alt)] text-[var(--brand-text)] rounded-bl-sm'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        <div className={`flex items-center gap-2 mt-1 px-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-[var(--brand-muted)]">
            {formatTime(message.timestamp)}
          </span>
          {isOwn && message.read && (
            <span className="text-xs text-[var(--brand-primary)]">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    senderId: PropTypes.string.isRequired,
    timestamp: PropTypes.any,
    read: PropTypes.bool,
  }).isRequired,
  isOwn: PropTypes.bool.isRequired,
};

export default MessageBubble;
