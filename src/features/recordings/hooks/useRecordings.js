/**
 * useRecordings Hooks
 * Hooks personalizados para gestionar grabaciones
 */

import { useState, useEffect } from 'react';
import {
  getRecordingsByStudent,
  getRecordingsByTeacher,
  getRecordingById,
} from '../services/recordingService';

/**
 * Hook para obtener grabaciones de un estudiante
 */
export const useStudentRecordings = (studentId) => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const fetchRecordings = async () => {
      setLoading(true);
      const { recordings: data, error: err } = await getRecordingsByStudent(studentId);
      
      if (err) {
        setError(err);
      } else {
        setRecordings(data);
      }
      
      setLoading(false);
    };

    fetchRecordings();
  }, [studentId]);

  const refetch = async () => {
    if (!studentId) return;
    
    setLoading(true);
    const { recordings: data, error: err } = await getRecordingsByStudent(studentId);
    
    if (err) {
      setError(err);
    } else {
      setRecordings(data);
    }
    
    setLoading(false);
  };

  return { recordings, loading, error, refetch };
};

/**
 * Hook para obtener grabaciones subidas por un profesor
 */
export const useTeacherRecordings = (teacherId) => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teacherId) {
      setLoading(false);
      return;
    }

    const fetchRecordings = async () => {
      setLoading(true);
      const { recordings: data, error: err } = await getRecordingsByTeacher(teacherId);
      
      if (err) {
        setError(err);
      } else {
        setRecordings(data);
      }
      
      setLoading(false);
    };

    fetchRecordings();
  }, [teacherId]);

  const refetch = async () => {
    if (!teacherId) return;
    
    setLoading(true);
    const { recordings: data, error: err } = await getRecordingsByTeacher(teacherId);
    
    if (err) {
      setError(err);
    } else {
      setRecordings(data);
    }
    
    setLoading(false);
  };

  return { recordings, loading, error, refetch };
};

/**
 * Hook para obtener una grabación específica
 */
export const useRecording = (recordingId) => {
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recordingId) {
      setLoading(false);
      return;
    }

    const fetchRecording = async () => {
      setLoading(true);
      const { recording: data, error: err } = await getRecordingById(recordingId);
      
      if (err) {
        setError(err);
      } else {
        setRecording(data);
      }
      
      setLoading(false);
    };

    fetchRecording();
  }, [recordingId]);

  return { recording, loading, error };
};
