/**
 * Student Chat Page
 * Página de chat para estudiantes (chat único con su profesor)
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@design';
import { useAuth } from '@features/auth';
import { useGetOrCreateChat } from '../hooks/useChat';
import ChatWindow from '../components/ChatWindow';

const StudentChatPage = () => {
  const { user, userData } = useAuth();
  const { getChat, loading: loadingChat } = useGetOrCreateChat();
  const [chat, setChat] = useState(null);
  const [teacherName, setTeacherName] = useState('Profesor');

  useEffect(() => {
    initializeChat();
  }, [user, userData]);

  const initializeChat = async () => {
    if (!user || !userData) return;

    // Por ahora, usamos un teacherId fijo
    // En producción, esto vendría de la relación estudiante-profesor
    const teacherId = 'teacher_demo_id'; // Cambiar por el teacherId real
    const teacherNameValue = 'Profesor Demo'; // Cambiar por el nombre real

    const chatData = await getChat(
      user.uid,
      teacherId,
      userData.name || user.displayName,
      teacherNameValue
    );

    if (chatData) {
      setChat(chatData);
      setTeacherName(teacherNameValue);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Chat con tu Profesor</h1>
        <p className="text-[var(--brand-muted)]">
          Comunícate directamente con tu profesor
        </p>
      </div>

      {/* Chat Window */}
      <div className="h-[calc(100vh-250px)]">
        {loadingChat ? (
          <Card variant="outlined" padding="xl" className="h-full flex items-center justify-center">
            <p className="text-[var(--brand-muted)]">Cargando chat...</p>
          </Card>
        ) : (
          <ChatWindow
            chat={chat}
            currentUserId={user?.uid}
            otherUserName={teacherName}
          />
        )}
      </div>

      {/* Info */}
      <Card variant="outlined" padding="md">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Consejos para el chat</h3>
            <ul className="text-sm text-[var(--brand-muted)] space-y-1">
              <li>• Sé respetuoso y profesional en tus mensajes</li>
              <li>• Los mensajes se envían en tiempo real</li>
              <li>• Puedes ver cuando tu profesor ha leído tus mensajes (✓✓)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentChatPage;
