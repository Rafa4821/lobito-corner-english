/**
 * Chat Service
 * Servicios de gestión de chats y mensajes en Firestore
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

const CHATS_COLLECTION = 'chats';
const MESSAGES_SUBCOLLECTION = 'messages';

/**
 * Generar ID único de chat basado en studentId y teacherId
 */
export const generateChatId = (studentId, teacherId) => {
  // Ordenar IDs alfabéticamente para consistencia
  const ids = [studentId, teacherId].sort();
  return `${ids[0]}_${ids[1]}`;
};

/**
 * Crear o obtener chat entre estudiante y profesor
 */
export const getOrCreateChat = async (studentId, teacherId, studentName, teacherName) => {
  try {
    const chatId = generateChatId(studentId, teacherId);
    const chatRef = doc(db, CHATS_COLLECTION, chatId);
    const chatSnap = await getDoc(chatRef);

    if (chatSnap.exists()) {
      return { chat: { id: chatSnap.id, ...chatSnap.data() }, error: null };
    }

    // Crear nuevo chat
    await setDoc(chatRef, {
      participants: [studentId, teacherId],
      participantNames: {
        [studentId]: studentName,
        [teacherId]: teacherName,
      },
      lastMessage: '',
      lastMessageSenderId: null,
      lastTimestamp: serverTimestamp(),
      unreadCount: {
        [studentId]: 0,
        [teacherId]: 0,
      },
      createdAt: serverTimestamp(),
    });

    const newChatSnap = await getDoc(chatRef);
    return { chat: { id: newChatSnap.id, ...newChatSnap.data() }, error: null };
  } catch (error) {
    console.error('Error getting or creating chat:', error);
    return { chat: null, error: error.message };
  }
};

/**
 * Obtener chats de un usuario (estudiante o profesor)
 */
export const getUserChats = async (userId) => {
  try {
    const chatsRef = collection(db, CHATS_COLLECTION);
    const q = query(
      chatsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastTimestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const chats = [];
    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });

    return { chats, error: null };
  } catch (error) {
    console.error('Error getting user chats:', error);
    return { chats: [], error: error.message };
  }
};

/**
 * Suscribirse a chats de un usuario en tiempo real
 */
export const subscribeToUserChats = (userId, callback) => {
  const chatsRef = collection(db, CHATS_COLLECTION);
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastTimestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = [];
    snapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });
    callback(chats);
  }, (error) => {
    console.error('Error in chats subscription:', error);
    callback([]);
  });
};

/**
 * Enviar mensaje
 */
export const sendMessage = async (chatId, senderId, text) => {
  try {
    const messagesRef = collection(db, CHATS_COLLECTION, chatId, MESSAGES_SUBCOLLECTION);
    
    // Agregar mensaje
    await addDoc(messagesRef, {
      senderId,
      text,
      timestamp: serverTimestamp(),
      read: false,
    });

    // Actualizar último mensaje del chat
    const chatRef = doc(db, CHATS_COLLECTION, chatId);
    const chatSnap = await getDoc(chatRef);
    
    if (chatSnap.exists()) {
      const chatData = chatSnap.data();
      const otherUserId = chatData.participants.find(id => id !== senderId);
      
      await updateDoc(chatRef, {
        lastMessage: text,
        lastMessageSenderId: senderId,
        lastTimestamp: serverTimestamp(),
        [`unreadCount.${otherUserId}`]: (chatData.unreadCount?.[otherUserId] || 0) + 1,
      });
    }

    return { error: null };
  } catch (error) {
    console.error('Error sending message:', error);
    return { error: error.message };
  }
};

/**
 * Suscribirse a mensajes de un chat en tiempo real
 */
export const subscribeToMessages = (chatId, callback) => {
  const messagesRef = collection(db, CHATS_COLLECTION, chatId, MESSAGES_SUBCOLLECTION);
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  }, (error) => {
    console.error('Error in messages subscription:', error);
    callback([]);
  });
};

/**
 * Marcar mensajes como leídos
 */
export const markMessagesAsRead = async (chatId, userId) => {
  try {
    const messagesRef = collection(db, CHATS_COLLECTION, chatId, MESSAGES_SUBCOLLECTION);
    const q = query(
      messagesRef,
      where('senderId', '!=', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    
    const updatePromises = [];
    querySnapshot.forEach((docSnapshot) => {
      const messageRef = doc(db, CHATS_COLLECTION, chatId, MESSAGES_SUBCOLLECTION, docSnapshot.id);
      updatePromises.push(updateDoc(messageRef, { read: true }));
    });

    await Promise.all(updatePromises);

    // Resetear contador de no leídos
    const chatRef = doc(db, CHATS_COLLECTION, chatId);
    await updateDoc(chatRef, {
      [`unreadCount.${userId}`]: 0,
    });

    return { error: null };
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return { error: error.message };
  }
};

/**
 * Obtener contador de mensajes no leídos total
 */
export const getTotalUnreadCount = async (userId) => {
  try {
    const { chats } = await getUserChats(userId);
    
    let totalUnread = 0;
    chats.forEach(chat => {
      totalUnread += chat.unreadCount?.[userId] || 0;
    });

    return { count: totalUnread, error: null };
  } catch (error) {
    console.error('Error getting total unread count:', error);
    return { count: 0, error: error.message };
  }
};

/**
 * Eliminar chat (solo para testing/admin)
 */
export const deleteChat = async (chatId) => {
  try {
    // Eliminar todos los mensajes
    const messagesRef = collection(db, CHATS_COLLECTION, chatId, MESSAGES_SUBCOLLECTION);
    const messagesSnapshot = await getDocs(messagesRef);
    
    const deletePromises = [];
    messagesSnapshot.forEach((docSnapshot) => {
      deletePromises.push(deleteDoc(docSnapshot.ref));
    });
    
    await Promise.all(deletePromises);

    // Eliminar chat
    const chatRef = doc(db, CHATS_COLLECTION, chatId);
    await deleteDoc(chatRef);

    return { error: null };
  } catch (error) {
    console.error('Error deleting chat:', error);
    return { error: error.message };
  }
};
