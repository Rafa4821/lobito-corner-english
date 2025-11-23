/**
 * useChat Hooks
 * Hooks personalizados para gestionar chat en tiempo real
 */

import { useState, useEffect } from 'react';
import {
  subscribeToUserChats,
  subscribeToMessages,
  getOrCreateChat,
} from '../services/chatService';

/**
 * Hook para obtener chats de un usuario en tiempo real
 */
export const useUserChats = (userId) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToUserChats(userId, (updatedChats) => {
      setChats(updatedChats);
      setLoading(false);
      setError(null);
    });

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]);

  return { chats, loading, error };
};

/**
 * Hook para obtener mensajes de un chat en tiempo real
 */
export const useChatMessages = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToMessages(chatId, (updatedMessages) => {
      setMessages(updatedMessages);
      setLoading(false);
      setError(null);
    });

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [chatId]);

  return { messages, loading, error };
};

/**
 * Hook para obtener o crear chat
 */
export const useGetOrCreateChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getChat = async (studentId, teacherId, studentName, teacherName) => {
    setLoading(true);
    setError(null);

    const { chat, error: err } = await getOrCreateChat(
      studentId,
      teacherId,
      studentName,
      teacherName
    );

    if (err) {
      setError(err);
      setLoading(false);
      return null;
    }

    setLoading(false);
    return chat;
  };

  return { getChat, loading, error };
};
