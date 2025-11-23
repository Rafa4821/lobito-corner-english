/**
 * Teacher Recordings Page
 * Página para que los profesores suban y administren grabaciones
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Badge, Button } from '@design';
import { useAuth } from '@features/auth';
import { getUsersByRole } from '@features/auth';
import { getAllProducts } from '@features/products';
import { useTeacherRecordings } from '../hooks/useRecordings';
import { uploadRecording } from '../services/storageService';
import { createRecording, deleteRecording as deleteRecordingMetadata } from '../services/recordingService';
import { deleteRecording as deleteRecordingFile } from '../services/storageService';
import RecordingCard from '../components/RecordingCard';
import UploadForm from '../components/UploadForm';

const TeacherRecordingsPage = () => {
  const { user, userData } = useAuth();
  const { recordings, loading: loadingRecordings, error, refetch } = useTeacherRecordings(user?.uid);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [students, setStudents] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoadingData(true);
    
    // Cargar estudiantes
    const { users: studentsList } = await getUsersByRole('student');
    setStudents(studentsList || []);

    // Cargar productos
    const { products: productsList } = await getAllProducts();
    setProducts(productsList || []);

    setLoadingData(false);
  };

  const handleUpload = async (formData, setProgress) => {
    setUploading(true);

    try {
      const student = students.find(s => s.id === formData.studentId);
      const product = products.find(p => p.id === formData.productId);

      // Subir archivo a Storage
      const uploadResult = await uploadRecording(
        formData.file,
        {
          studentId: formData.studentId,
          studentName: student?.name || 'Desconocido',
          teacherId: user.uid,
          teacherName: userData?.name || user.displayName,
        },
        setProgress
      );

      // Crear metadata en Firestore
      await createRecording({
        title: formData.title || formData.file.name,
        description: formData.description,
        fileName: uploadResult.fileName,
        url: uploadResult.url,
        filePath: uploadResult.path,
        fileSize: uploadResult.fileSize,
        fileType: uploadResult.fileType,
        studentId: formData.studentId,
        studentName: student?.name || 'Desconocido',
        teacherId: user.uid,
        teacherName: userData?.name || user.displayName,
        productId: formData.productId || null,
        productTitle: product?.title || null,
      });

      alert('Grabación subida correctamente');
      setShowUploadForm(false);
      refetch();
    } catch (error) {
      console.error('Error uploading recording:', error);
      alert('Error al subir la grabación: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (recording) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta grabación?')) {
      return;
    }

    try {
      // Eliminar archivo de Storage
      await deleteRecordingFile(recording.filePath);

      // Eliminar metadata de Firestore
      await deleteRecordingMetadata(recording.id);

      alert('Grabación eliminada correctamente');
      refetch();
    } catch (error) {
      console.error('Error deleting recording:', error);
      alert('Error al eliminar la grabación');
    }
  };

  // Filtrar grabaciones
  const filteredRecordings = recordings.filter((recording) => {
    const searchString = `${recording.title || ''} ${recording.fileName} ${recording.description || ''} ${recording.studentName}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Grabaciones</h1>
          <p className="text-[var(--brand-muted)]">
            Sube y administra grabaciones de tus estudiantes
          </p>
        </div>
        <Button 
          variant="primary"
          onClick={() => setShowUploadForm(!showUploadForm)}
          disabled={loadingData}
        >
          {showUploadForm ? '❌ Cancelar' : '📤 Subir Grabación'}
        </Button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <Card variant="elevated" padding="xl">
          <h2 className="text-xl font-bold mb-4">Subir Nueva Grabación</h2>
          {loadingData ? (
            <p className="text-center text-[var(--brand-muted)]">Cargando datos...</p>
          ) : (
            <UploadForm
              onUpload={handleUpload}
              loading={uploading}
              students={students}
              products={products}
            />
          )}
        </Card>
      )}

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
      {loadingRecordings && (
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
      {!loadingRecordings && !error && filteredRecordings.length === 0 && (
        <Card variant="elevated" padding="xl" className="text-center">
          <div className="space-y-4">
            <div className="text-6xl">🎥</div>
            <h3 className="text-xl font-bold">
              {searchTerm 
                ? `No se encontraron grabaciones para "${searchTerm}"`
                : 'No has subido grabaciones aún'}
            </h3>
            <p className="text-[var(--brand-muted)]">
              {searchTerm
                ? 'Intenta con otro término de búsqueda'
                : 'Sube la primera grabación para tus estudiantes'}
            </p>
            {!searchTerm && (
              <Button 
                variant="primary"
                onClick={() => setShowUploadForm(true)}
              >
                📤 Subir Primera Grabación
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Recordings grid */}
      {!loadingRecordings && !error && filteredRecordings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.map((recording) => (
            <RecordingCard 
              key={recording.id} 
              recording={recording}
              onDelete={handleDelete}
              canDelete={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherRecordingsPage;
