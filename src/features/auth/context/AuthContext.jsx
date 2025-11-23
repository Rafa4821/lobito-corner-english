/**
 * Auth Context
 * Contexto global de autenticación
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { getUserDocument } from '../services/userService';
import { initializeCurrentUser } from '@/utils/initializeUsers';
import PropTypes from 'prop-types';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Usuario autenticado - obtener datos de Firestore
          console.log('🔐 Usuario autenticado:', firebaseUser.email);
          let firestoreData = await getUserDocument(firebaseUser.uid);
          console.log('📄 Datos de Firestore:', firestoreData);
          
          // Si no existe el documento, crearlo automáticamente
          if (!firestoreData) {
            console.log('⚠️ Documento no existe, creando automáticamente...');
            firestoreData = await initializeCurrentUser(firebaseUser, 'student');
            console.log('✅ Documento creado:', firestoreData);
          }
          
          console.log('👤 Rol del usuario:', firestoreData?.role);
          
          setUser(firebaseUser);
          setUserData(firestoreData);
        } else {
          // Usuario no autenticado
          console.log('🚪 Usuario no autenticado');
          setUser(null);
          setUserData(null);
        }
      } catch (err) {
        console.error('❌ Error in auth state change:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Refrescar datos del usuario desde Firestore
   */
  const refreshUserData = async () => {
    if (user) {
      const firestoreData = await getUserDocument(user.uid);
      setUserData(firestoreData);
    }
  };

  /**
   * Verificar si el usuario tiene un rol específico
   */
  const hasRole = (role) => {
    return userData?.role === role;
  };

  /**
   * Verificar si el usuario es estudiante
   */
  const isStudent = () => hasRole('student');

  /**
   * Verificar si el usuario es profesor
   */
  const isTeacher = () => hasRole('teacher');

  const value = {
    user,
    userData,
    loading,
    error,
    isAuthenticated: !!user,
    refreshUserData,
    hasRole,
    isStudent,
    isTeacher,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
