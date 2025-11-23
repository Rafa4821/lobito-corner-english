/**
 * Storage Service
 * Servicios para gestionar archivos en Firebase Storage
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from '@/services/firebase';

/**
 * Subir grabación a Firebase Storage
 */
export const uploadRecording = (file, metadata, onProgress) => {
  return new Promise((resolve, reject) => {
    try {
      // Crear referencia con estructura: recordings/{studentId}/{timestamp}_{filename}
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `recordings/${metadata.studentId}/${fileName}`);

      // Crear tarea de subida
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          studentId: metadata.studentId,
          studentName: metadata.studentName,
          teacherId: metadata.teacherId,
          teacherName: metadata.teacherName,
          uploadedAt: new Date().toISOString(),
        },
      });

      // Monitorear progreso
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          // Subida completada, obtener URL
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url: downloadURL,
              path: uploadTask.snapshot.ref.fullPath,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Eliminar grabación de Firebase Storage
 */
export const deleteRecording = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    return { error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { error: error.message };
  }
};

/**
 * Obtener lista de archivos de un estudiante
 */
export const getStudentRecordings = async (studentId) => {
  try {
    const listRef = ref(storage, `recordings/${studentId}`);
    const result = await listAll(listRef);
    
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          path: itemRef.fullPath,
          url,
        };
      })
    );

    return { files, error: null };
  } catch (error) {
    console.error('Error getting student recordings:', error);
    return { files: [], error: error.message };
  }
};

/**
 * Validar archivo antes de subir
 */
export const validateRecordingFile = (file) => {
  const maxSize = 500 * 1024 * 1024; // 500 MB
  const allowedTypes = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
    'audio/mp3',
  ];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'El archivo es demasiado grande. Máximo 500 MB.',
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido. Solo video (MP4, WebM, MOV) o audio (MP3, WAV).',
    };
  }

  return { valid: true, error: null };
};

/**
 * Formatear tamaño de archivo
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
