/**
 * User Service
 * Servicios de gestión de usuarios en Firestore
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

const USERS_COLLECTION = 'users';

/**
 * Crear documento de usuario en Firestore
 */
export const createUserDocument = async (userId, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error) {
    console.error('Error creating user document:', error);
    return { error: error.message };
  }
};

/**
 * Obtener documento de usuario
 */
export const getUserDocument = async (userId) => {
  try {
    console.log('🔍 Buscando usuario con UID:', userId);
    console.log('📁 Colección:', USERS_COLLECTION);
    
    const userRef = doc(db, USERS_COLLECTION, userId);
    console.log('📄 Referencia del documento:', userRef.path);
    
    const userSnap = await getDoc(userRef);
    console.log('📦 Documento existe:', userSnap.exists());

    if (userSnap.exists()) {
      const data = { ...userSnap.data(), id: userSnap.id };
      console.log('✅ Datos encontrados:', data);
      return data;
    }
    
    console.log('❌ Documento no encontrado en Firestore');
    return null;
  } catch (error) {
    console.error('❌ Error getting user document:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return null;
  }
};

/**
 * Actualizar documento de usuario
 */
export const updateUserDocument = async (userId, updates) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error) {
    console.error('Error updating user document:', error);
    return { error: error.message };
  }
};

/**
 * Obtener usuarios por rol
 */
export const getUsersByRole = async (role) => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('role', '==', role));
    const querySnapshot = await getDocs(q);

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return users;
  } catch (error) {
    console.error('Error getting users by role:', error);
    return [];
  }
};

/**
 * Verificar si el usuario tiene un rol específico
 */
export const hasRole = async (userId, role) => {
  try {
    const userData = await getUserDocument(userId);
    return userData?.role === role;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

/**
 * Cambiar rol de usuario (solo admin)
 */
export const changeUserRole = async (userId, newRole) => {
  try {
    const validRoles = ['student', 'teacher'];
    if (!validRoles.includes(newRole)) {
      throw new Error('Invalid role');
    }

    await updateUserDocument(userId, { role: newRole });
    return { error: null };
  } catch (error) {
    console.error('Error changing user role:', error);
    return { error: error.message };
  }
};
