/**
 * Blog Post Page
 * Página de detalle de un post del blog
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from '@design';
import { useAuth } from '@features/auth';
import { usePost } from '../hooks/useBlog';
import { deletePost } from '../services/blogService';
import { formatDate } from '@/utils';

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isTeacher } = useAuth();
  const { post, loading, error } = usePost(id);

  const getCategoryColor = (category) => {
    const colors = {
      'Tecnología': 'primary',
      'Educación': 'secondary',
      'Programación': 'accent',
      'Diseño': 'info',
      'Marketing': 'warning',
      'Idiomas': 'success',
    };
    return colors[category] || 'default';
  };

  const handleEdit = () => {
    navigate(`/blog/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      return;
    }

    const { error } = await deletePost(id);
    
    if (error) {
      alert('Error al eliminar el post');
    } else {
      navigate('/app/blog');
    }
  };

  const canEdit = isTeacher() && user?.uid === post?.authorId;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[var(--brand-bg-alt)] rounded w-1/3" />
        <div className="h-96 bg-[var(--brand-bg-alt)] rounded-lg" />
        <div className="h-64 bg-[var(--brand-bg-alt)] rounded-lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <Card variant="elevated" padding="xl" className="text-center">
        <div className="space-y-4">
          <div className="text-6xl">❌</div>
          <h2 className="text-2xl font-bold">Post no encontrado</h2>
          <p className="text-[var(--brand-muted)]">
            {error || 'El post que buscas no existe'}
          </p>
          <Button variant="primary" onClick={() => navigate('/blog')}>
            Ver todos los posts
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--brand-muted)]">
        <button 
          onClick={() => navigate('/blog')}
          className="hover:text-[var(--brand-primary)] transition-colors"
        >
          Blog
        </button>
        <span>/</span>
        <span className="text-[var(--brand-text)]">{post.title}</span>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-96 rounded-lg overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main content */}
      <Card variant="elevated" padding="xl">
        {/* Header */}
        <div className="mb-6">
          {/* Categoría y badges */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
            {post.featured && (
              <Badge variant="warning">⭐ Destacado</Badge>
            )}
            {!post.published && (
              <Badge variant="default">📝 Borrador</Badge>
            )}
          </div>

          {/* Título */}
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          {/* Meta info */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-[var(--brand-border)]">
            {/* Autor y fecha */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center text-white text-lg font-bold">
                  {post.authorName?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="font-medium">{post.authorName || 'Anónimo'}</p>
                  <p className="text-sm text-[var(--brand-muted)]">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-[var(--brand-muted)]">
              <span className="flex items-center gap-1">
                👁️ {post.views || 0} vistas
              </span>
              <span className="flex items-center gap-1">
                ⏱️ {post.readTime || 5} min de lectura
              </span>
            </div>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="mb-6 p-4 bg-[var(--brand-bg-alt)] border-l-4 border-[var(--brand-primary)] rounded">
            <p className="text-lg italic text-[var(--brand-muted)]">
              {post.excerpt}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none">
          <div className="text-[var(--brand-text)] leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>

        {/* Actions (solo para el autor) */}
        {canEdit && (
          <div className="mt-8 pt-6 border-t border-[var(--brand-border)] flex gap-3">
            <Button variant="primary" onClick={handleEdit}>
              ✏️ Editar Post
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              🗑️ Eliminar Post
            </Button>
          </div>
        )}
      </Card>

      {/* Back button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => navigate('/blog')}>
          ← Volver al Blog
        </Button>
      </div>
    </div>
  );
};

export default BlogPostPage;
