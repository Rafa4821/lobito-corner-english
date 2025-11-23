/**
 * Teacher Chat Page
 * Página de chat para profesores (lista de chats con todos sus estudiantes)
 */

import React, { useState } from 'react';
import { Card } from '@design';
import { useAuth } from '@features/auth';
import { useUserChats } from '../hooks/useChat';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';

const TeacherChatPage = () => {
  const { user } = useAuth();
  const { chats, loading } = useUserChats(user?.uid);
  const [selectedChat, setSelectedChat] = useState(null);

  const getOtherParticipantName = (chat) => {
    if (!chat) return '';
    const otherUserId = chat.participants.find(id => id !== user?.uid);
    return chat.participantNames?.[otherUserId] || 'Estudiante';
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Mensajes</h1>
        <p className="text-[var(--brand-muted)]">
          Chats con tus estudiantes
        </p>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 250px)' }}>
        {/* Chat List */}
        <div className="lg:col-span-1 overflow-y-auto">
          <ChatList
            chats={chats}
            currentUserId={user?.uid}
            selectedChatId={selectedChat?.id}
            onSelectChat={handleSelectChat}
            loading={loading}
          />
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          <ChatWindow
            chat={selectedChat}
            currentUserId={user?.uid}
            otherUserName={getOtherParticipantName(selectedChat)}
          />
        </div>
      </div>

      {/* Info */}
      <Card variant="outlined" padding="md">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Gestión de chats</h3>
            <ul className="text-sm text-[var(--brand-muted)] space-y-1">
              <li>• Los chats se crean automáticamente cuando un estudiante te escribe</li>
              <li>• Los mensajes no leídos se marcan con un contador rojo</li>
              <li>• Los mensajes se sincronizan en tiempo real</li>
              <li>• Puedes ver cuando un estudiante ha leído tus mensajes (✓✓)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeacherChatPage;
