/**
 * Test de conexión a Firestore
 * Ejecuta este archivo para verificar que Firestore funciona
 */

import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';

export const testFirestoreConnection = async () => {
  console.log('🧪 Iniciando test de Firestore...');
  
  try {
    // Test 1: Verificar que db existe
    console.log('Test 1: Verificar DB');
    console.log('DB existe:', !!db);
    console.log('DB type:', db?.type);
    
    // Test 2: Intentar leer la colección users
    console.log('\nTest 2: Leer colección users');
    const usersRef = collection(db, 'users');
    console.log('Referencia creada:', usersRef.path);
    
    // Test 3: Obtener todos los documentos
    console.log('\nTest 3: Obtener documentos');
    const snapshot = await getDocs(usersRef);
    console.log('Documentos encontrados:', snapshot.size);
    
    snapshot.forEach((doc) => {
      console.log('📄 Documento ID:', doc.id);
      console.log('📄 Datos:', doc.data());
    });
    
    // Test 4: Intentar leer un documento específico
    console.log('\nTest 4: Leer documento específico');
    const userId = 'RJS5oFSYMeZO0bcX3JGpgu'; // Reemplaza con tu UID
    const userRef = doc(db, 'users', userId);
    console.log('Referencia:', userRef.path);
    
    const userSnap = await getDoc(userRef);
    console.log('Documento existe:', userSnap.exists());
    if (userSnap.exists()) {
      console.log('Datos:', userSnap.data());
    }
    
    console.log('\n✅ Test completado');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error en test:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return { success: false, error };
  }
};

// Ejecutar test automáticamente si se importa
if (import.meta.env.DEV) {
  console.log('🔧 Modo desarrollo detectado');
}
