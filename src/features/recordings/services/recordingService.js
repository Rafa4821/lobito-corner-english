/**
 * Recording Service
 * Servicios de gestión de metadata de grabaciones en Firestore
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

const RECORDINGS_COLLECTION = 'recordings';

/**
 * Crear metadata de grabación
 */
export const createRecording = async (recordingData) => {
  try {
    const recordingsRef = collection(db, RECORDINGS_COLLECTION);
    const docRef = await addDoc(recordingsRef, {
      ...recordingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
    });

    return { recordingId: docRef.id, error: null };
  } catch (error) {
    console.error('Error creating recording:', error);
    return { recordingId: null, error: error.message };
  }
};

/**
 * Obtener grabación por ID
 */
export const getRecordingById = async (recordingId) => {
  try {
    const recordingRef = doc(db, RECORDINGS_COLLECTION, recordingId);
    const recordingSnap = await getDoc(recordingRef);

    if (recordingSnap.exists()) {
      return { recording: { id: recordingSnap.id, ...recordingSnap.data() }, error: null };
    }

    return { recording: null, error: 'Grabación no encontrada' };
  } catch (error) {
    console.error('Error getting recording:', error);
    return { recording: null, error: error.message };
  }
};

/**
 * Obtener grabaciones de un estudiante
 */
export const getRecordingsByStudent = async (studentId) => {
  try {
    const recordingsRef = collection(db, RECORDINGS_COLLECTION);
    const q = query(
      recordingsRef,
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const recordings = [];
    querySnapshot.forEach((doc) => {
      recordings.push({ id: doc.id, ...doc.data() });
    });

    return { recordings, error: null };
  } catch (error) {
    console.error('Error getting student recordings:', error);
    return { recordings: [], error: error.message };
  }
};

/**
 * Obtener grabaciones subidas por un profesor
 */
export const getRecordingsByTeacher = async (teacherId) => {
  try {
    const recordingsRef = collection(db, RECORDINGS_COLLECTION);
    const q = query(
      recordingsRef,
      where('teacherId', '==', teacherId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const recordings = [];
    querySnapshot.forEach((doc) => {
      recordings.push({ id: doc.id, ...doc.data() });
    });

    return { recordings, error: null };
  } catch (error) {
    console.error('Error getting teacher recordings:', error);
    return { recordings: [], error: error.message };
  }
};

/**
 * Obtener todas las grabaciones (admin)
 */
export const getAllRecordings = async () => {
  try {
    const recordingsRef = collection(db, RECORDINGS_COLLECTION);
    const q = query(recordingsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const recordings = [];
    querySnapshot.forEach((doc) => {
      recordings.push({ id: doc.id, ...doc.data() });
    });

    return { recordings, error: null };
  } catch (error) {
    console.error('Error getting all recordings:', error);
    return { recordings: [], error: error.message };
  }
};

/**
 * Actualizar metadata de grabación
 */
export const updateRecording = async (recordingId, updates) => {
  try {
    const recordingRef = doc(db, RECORDINGS_COLLECTION, recordingId);
    await updateDoc(recordingRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return { error: null };
  } catch (error) {
    console.error('Error updating recording:', error);
    return { error: error.message };
  }
};

/**
 * Eliminar metadata de grabación
 */
export const deleteRecording = async (recordingId) => {
  try {
    const recordingRef = doc(db, RECORDINGS_COLLECTION, recordingId);
    await deleteDoc(recordingRef);

    return { error: null };
  } catch (error) {
    console.error('Error deleting recording:', error);
    return { error: error.message };
  }
};

/**
 * Incrementar vistas de una grabación
 */
export const incrementRecordingViews = async (recordingId) => {
  try {
    const recordingRef = doc(db, RECORDINGS_COLLECTION, recordingId);
    const recordingSnap = await getDoc(recordingRef);
    
    if (recordingSnap.exists()) {
      const currentViews = recordingSnap.data().views || 0;
      await updateDoc(recordingRef, {
        views: currentViews + 1,
      });
    }

    return { error: null };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { error: error.message };
  }
};

/**
 * Buscar grabaciones por estudiante y clase
 */
export const searchRecordings = async (filters) => {
  try {
    const recordingsRef = collection(db, RECORDINGS_COLLECTION);
    let q = query(recordingsRef, orderBy('createdAt', 'desc'));

    // Aplicar filtros
    if (filters.studentId) {
      q = query(q, where('studentId', '==', filters.studentId));
    }
    if (filters.teacherId) {
      q = query(q, where('teacherId', '==', filters.teacherId));
    }
    if (filters.productId) {
      q = query(q, where('productId', '==', filters.productId));
    }

    const querySnapshot = await getDocs(q);
    const recordings = [];
    
    querySnapshot.forEach((doc) => {
      recordings.push({ id: doc.id, ...doc.data() });
    });

    return { recordings, error: null };
  } catch (error) {
    console.error('Error searching recordings:', error);
    return { recordings: [], error: error.message };
  }
};
