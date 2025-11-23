/**
 * Student Recordings Page
 * Página para que los estudiantes vean sus grabaciones
 */

import React, { useState } from 'react';
import { Card, Input, Badge } from '@design';
import { useAuth } from '@features/auth';
import { useStudentRecordings } from '../hooks/useRecordings';
import RecordingCard from '../components/RecordingCard';

const StudentRecordingsPage = () => {
  const { user } = useAuth();
  const { recordings, loading, error } = useStudentRecordings(user?.uid);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar grabaciones
  const filteredRecordings = recordings.filter((recording) => {
    const searchString = `${recording.title || ''} ${recording.fileName} ${recording.description || ''} ${recording.teacherName}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Mis Grabaciones</h1>
        <p className="text-[var(--brand-muted)]">
          Grabaciones de tus clases subidas por tus profesores
        </p>
      </div>

      {/* Search */}
      <Input
        type="text"
        placeholder="Buscar grabaciones..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-[var(--brand-muted)]">
        <span>
          {filteredRecordings.length} {filteredRecordings.length === 1 ? 'grabación' : 'grabaciones'}
        </span>
        {searchTerm && (
          <Badge variant="default" size="sm">
            Buscando: "{searchTerm}"
          </Badge>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          Error al cargar grabaciones: {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} variant="elevated" padding="lg" className="animate-pulse">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--brand-bg-alt)] rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-[var(--brand-bg-alt)] rounded w-3/4" />
                    <div className="h-4 bg-[var(--brand-bg-alt)] rounded w-1/2" />
                  </div>
                </div>
                <div className="h-16 bg-[var(--brand-bg-alt)] rounded" />
                <div className="h-10 bg-[var(--brand-bg-alt)] rounded" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredRecordings.length === 0 && (
        <Card variant="elevated" padding="xl" className="text-center">
          <div className="space-y-4">
            <div className="text-6xl">🎥</div>
            <h3 className="text-xl font-bold">
              {searchTerm 
                ? `No se encontraron grabaciones para "${searchTerm}"`
                : 'No tienes grabaciones aún'}
            </h3>
            <p className="text-[var(--brand-muted)]">
              {searchTerm
                ? 'Intenta con otro término de búsqueda'
                : 'Tus profesores subirán grabaciones de tus clases aquí'}
            </p>
          </div>
        </Card>
      )}

      {/* Recordings grid */}
      {!loading && !error && filteredRecordings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.map((recording) => (
            <RecordingCard 
              key={recording.id} 
              recording={recording}
              canDelete={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentRecordingsPage;
