/**
 * Blog Editor Page
 * Página para crear y editar posts (solo profesores)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@design';
import { useAuth } from '@features/auth';
import PostEditor from '../components/PostEditor';
import { createPost, updatePost, getPostById } from '../services/blogService';

const BlogEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userData, isTeacher } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);

  const isEditMode = Boolean(id);

  useEffect(() => {
    // Verificar que sea profesor
    if (!isTeacher()) {
      navigate('/blog');
      return;
    }

    // Si es modo edición, cargar el post
    if (isEditMode) {
      loadPost();
    }
  }, [id, isTeacher]);

  const loadPost = async () => {
    setLoadingPost(true);
    const { post, error } = await getPostById(id);
    
    if (error || !post) {
      alert('Error al cargar el post');
      navigate('/blog');
      return;
    }

    // Verificar que sea el autor
    if (post.authorId !== user.uid) {
      alert('No tienes permiso para editar este post');
      navigate('/blog');
      return;
    }

    setInitialData(post);
    setLoadingPost(false);
  };

  const handleSave = async (postData) => {
    setLoading(true);

    try {
      if (isEditMode) {
        // Actualizar post existente
        const { error } = await updatePost(id, postData);
        
        if (error) {
          throw new Error(error);
        }

        alert('Post actualizado correctamente');
        navigate(`/blog/${id}`);
      } else {
        // Crear nuevo post
        const { postId, error } = await createPost({
          ...postData,
          authorId: user.uid,
          authorName: userData.name || user.displayName,
        });
        
        if (error) {
          throw new Error(error);
        }

        alert('Post creado correctamente');
        navigate(`/blog/${postId}`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error al guardar el post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro? Los cambios no guardados se perderán.')) {
      navigate(isEditMode ? `/blog/${id}` : '/blog');
    }
  };

  if (!isTeacher()) {
    return null;
  }

  if (loadingPost) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[var(--brand-bg-alt)] rounded w-1/3" />
        <div className="h-96 bg-[var(--brand-bg-alt)] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {isEditMode ? 'Editar Post' : 'Nuevo Post'}
        </h1>
        <p className="text-[var(--brand-muted)]">
          {isEditMode 
            ? 'Actualiza el contenido de tu post'
            : 'Comparte tus conocimientos con la comunidad'}
        </p>
      </div>

      {/* Editor */}
      <Card variant="elevated" padding="xl">
        <PostEditor
          initialData={initialData}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default BlogEditorPage;
