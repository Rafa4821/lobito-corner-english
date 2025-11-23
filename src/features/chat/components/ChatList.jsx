/**
 * Chat List Component
 * Lista de conversaciones
 */

import React from 'react';
import { Card, Badge } from '@design';
import { formatDate } from '@/utils';
import PropTypes from 'prop-types';

const ChatList = ({ chats, currentUserId, selectedChatId, onSelectChat, loading }) => {
  const getOtherParticipantName = (chat) => {
    const otherUserId = chat.participants.find(id => id !== currentUserId);
    return chat.participantNames?.[otherUserId] || 'Usuario';
  };

  const getUnreadCount = (chat) => {
    return chat.unreadCount?.[currentUserId] || 0;
  };

  const isLastMessageFromMe = (chat) => {
    return chat.lastMessageSenderId === currentUserId;
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Card key={i} variant="outlined" padding="md" className="animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--brand-bg-alt)] rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[var(--brand-bg-alt)] rounded w-3/4" />
                <div className="h-3 bg-[var(--brand-bg-alt)] rounded w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <Card variant="outlined" padding="xl" className="text-center">
        <div className="text-4xl mb-2">💬</div>
        <p className="text-[var(--brand-muted)]">No hay conversaciones aún</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {chats.map((chat) => {
        const unreadCount = getUnreadCount(chat);
        const isSelected = chat.id === selectedChatId;
        const otherName = getOtherParticipantName(chat);

        return (
          <Card
            key={chat.id}
            variant={isSelected ? 'elevated' : 'outlined'}
            padding="md"
            hover
            className={`cursor-pointer transition-all ${
              isSelected ? 'border-2 border-[var(--brand-primary)]' : ''
            }`}
            onClick={() => onSelectChat(chat)}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center text-white font-bold text-lg">
                  {otherName.charAt(0).toUpperCase()}
                </div>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold truncate">{otherName}</h3>
                  {chat.lastTimestamp && (
                    <span className="text-xs text-[var(--brand-muted)] ml-2">
                      {formatDate(chat.lastTimestamp.toDate?.() || chat.lastTimestamp)}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className={`text-sm truncate ${
                    unreadCount > 0 ? 'font-semibold text-[var(--brand-text)]' : 'text-[var(--brand-muted)]'
                  }`}>
                    {isLastMessageFromMe(chat) && 'Tú: '}
                    {chat.lastMessage}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

ChatList.propTypes = {
  chats: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    participants: PropTypes.arrayOf(PropTypes.string).isRequired,
    participantNames: PropTypes.object,
    lastMessage: PropTypes.string,
    lastMessageSenderId: PropTypes.string,
    lastTimestamp: PropTypes.any,
    unreadCount: PropTypes.object,
  })).isRequired,
  currentUserId: PropTypes.string.isRequired,
  selectedChatId: PropTypes.string,
  onSelectChat: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ChatList;
