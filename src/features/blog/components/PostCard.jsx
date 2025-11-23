/**
 * Post Card Component
 * Tarjeta de post para listado del blog
 */

import React from 'react';
import { Card, Badge } from '@design';
import { useNavigate } from 'react-router-dom';
import { formatDate, truncateText } from '@/utils';
import PropTypes from 'prop-types';

const PostCard = ({ post }) => {
  const navigate = useNavigate();

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

  const handleClick = () => {
    navigate(`/blog/${post.id}`);
  };

  return (
    <Card 
      variant="elevated" 
      padding="none" 
      hover 
      className="overflow-hidden cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Imagen */}
      <div className="relative h-48 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center">
        {post.coverImage ? (
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl">📝</div>
        )}
        
        {post.featured && (
          <Badge 
            variant="warning" 
            className="absolute top-3 right-3"
          >
            ⭐ Destacado
          </Badge>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Categoría y fecha */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={getCategoryColor(post.category)} size="sm">
            {post.category}
          </Badge>
          <span className="text-xs text-[var(--brand-muted)]">
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold mb-2 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-[var(--brand-muted)] mb-4 line-clamp-3 flex-1">
          {post.excerpt || truncateText(post.content, 150)}
        </p>

        {/* Footer con autor y stats */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--brand-border)]">
          {/* Autor */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center text-white text-xs font-bold">
              {post.authorName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium">{post.authorName || 'Anónimo'}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-[var(--brand-muted)]">
            {post.views > 0 && (
              <span className="flex items-center gap-1">
                👁️ {post.views}
              </span>
            )}
            <span className="flex items-center gap-1">
              ⏱️ {post.readTime || '5'} min
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    content: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    coverImage: PropTypes.string,
    featured: PropTypes.bool,
    authorName: PropTypes.string,
    publishedAt: PropTypes.string,
    createdAt: PropTypes.string,
    views: PropTypes.number,
    readTime: PropTypes.number,
  }).isRequired,
};

export default PostCard;
