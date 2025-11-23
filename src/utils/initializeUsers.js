/**
 * Script para inicializar usuarios en Firestore
 * Crea documentos de usuario para usuarios existentes en Auth
 */

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';

/**
 * Crear o actualizar documento de usuario en Firestore
 */
export const ensureUserDocument = async (userId, userData) => {
  try {
    console.log('🔧 Verificando documento para usuario:', userId);
    
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log('📝 Creando documento de usuario...');
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Documento creado exitosamente');
      return { created: true, error: null };
    } else {
      console.log('✅ Documento ya existe');
      return { created: false, error: null };
    }
  } catch (error) {
    console.error('❌ Error creando documento:', error);
    return { created: false, error: error.message };
  }
};

/**
 * Inicializar usuario actual
 * Llama a esta función después del login si el userData es null
 */
export const initializeCurrentUser = async (firebaseUser, defaultRole = 'student') => {
  if (!firebaseUser) {
    console.error('❌ No hay usuario autenticado');
    return null;
  }
  
  console.log('🚀 Inicializando usuario:', firebaseUser.email);
  
  const userData = {
    email: firebaseUser.email,
    name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
    role: defaultRole,
  };
  
  await ensureUserDocument(firebaseUser.uid, userData);
  
  // Obtener el documento recién creado
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { ...userSnap.data(), id: userSnap.id };
  }
  
  return null;
};
