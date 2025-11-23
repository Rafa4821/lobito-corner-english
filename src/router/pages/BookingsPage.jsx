import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@features/auth';

const BookingsPage = () => {
  const navigate = useNavigate();
  const { isTeacher, isStudent, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Por ahora redirigir al calendario que tiene la funcionalidad de reservas
      if (isTeacher()) {
        navigate('/app/teacher/calendar', { replace: true });
      } else if (isStudent()) {
        navigate('/app/student/calendar', { replace: true });
      }
    }
  }, [loading, isTeacher, isStudent, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]"></div>
      </div>
    );
  }

  return null;
};

export default BookingsPage;
