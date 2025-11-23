/**
 * Auth Service
 * Servicios de autenticación con Firebase
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '@/services/firebase';
import { createUserDocument, getUserDocument } from './userService';
import { sendWelcomeEmail } from '@features/notifications';

/**
 * Registrar nuevo usuario
 */
export const registerUser = async ({ email, password, name, role = 'student' }) => {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar perfil con nombre
    await updateProfile(user, { displayName: name });

    // Crear documento en Firestore
    await createUserDocument(user.uid, {
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    });

    // Enviar email de verificación
    await sendEmailVerification(user);

    // Enviar email de bienvenida (no bloqueante)
    sendWelcomeEmail({
      userName: name,
      userEmail: email,
    }).catch((error) => {
      console.warn('Error sending welcome email:', error);
    });

    return { user, error: null };
  } catch (error) {
    console.error('Error registering user:', error);
    return { user: null, error: error.message };
  }
};

/**
 * Iniciar sesión
 */
export const loginUser = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener datos adicionales de Firestore
    const userData = await getUserDocument(user.uid);

    return { user: { ...user, ...userData }, error: null };
  } catch (error) {
    console.error('Error logging in:', error);
    return { user: null, error: error.message };
  }
};

/**
 * Cerrar sesión
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Error logging out:', error);
    return { error: error.message };
  }
};

/**
 * Actualizar perfil de usuario
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const user = auth.currentUser;

    // Actualizar displayName en Auth si está presente
    if (updates.name && user) {
      await updateProfile(user, { displayName: updates.name });
    }

    // Actualizar email si está presente
    if (updates.email && user && updates.email !== user.email) {
      await updateEmail(user, updates.email);
    }

    return { error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error: error.message };
  }
};

/**
 * Cambiar contraseña
 */
export const changePassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    await updatePassword(user, newPassword);
    return { error: null };
  } catch (error) {
    console.error('Error changing password:', error);
    return { error: error.message };
  }
};

/**
 * Enviar email de recuperación de contraseña
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    console.error('Error sending password reset:', error);
    return { error: error.message };
  }
};

/**
 * Reenviar email de verificación
 */
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    await sendEmailVerification(user);
    return { error: null };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { error: error.message };
  }
};
