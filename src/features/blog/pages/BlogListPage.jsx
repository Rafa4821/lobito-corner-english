/**
 * Blog List Page
 * Página de listado de posts del blog
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Badge, Button } from '@design';
import { useAuth } from '@features/auth';
import { usePosts } from '../hooks/useBlog';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';

const BlogListPage = () => {
  const navigate = useNavigate();
  const { isTeacher } = useAuth();
  const { posts, loading, error } = usePosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: '📚' },
    { id: 'Tecnología', name: 'Tecnología', icon: '💻' },
    { id: 'Educación', name: 'Educación', icon: '🎓' },
    { id: 'Programación', name: 'Programación', icon: '⚡' },
    { id: 'Diseño', name: 'Diseño', icon: '🎨' },
    { id: 'Marketing', name: 'Marketing', icon: '📈' },
    { id: 'Idiomas', name: 'Idiomas', icon: '🌍' },
  ];

  // Filtrar posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog</h1>
          <p className="text-[var(--brand-muted)]">
            Artículos, tutoriales y recursos educativos
          </p>
        </div>
        
        {isTeacher() && (
          <Button 
            variant="primary"
            onClick={() => navigate('/app/blog/new')}
          >
            ✍️ Nuevo Post
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        {/* Búsqueda */}
        <Input
          type="text"
          placeholder="Buscar posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />

        {/* Categorías */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-[var(--brand-primary)] text-white shadow-[var(--shadow-md)]'
                  : 'bg-[var(--brand-bg-alt)] text-[var(--brand-text)] hover:bg-[var(--brand-border)]'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-[var(--brand-muted)]">
          <span>
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          </span>
          {searchTerm && (
            <Badge variant="default" size="sm">
              Buscando: "{searchTerm}"
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="primary" size="sm">
              Categoría: {categories.find(c => c.id === selectedCategory)?.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          Error al cargar posts: {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold mb-2">
            {searchTerm 
              ? `No se encontraron posts para "${searchTerm}"`
              : 'No hay posts disponibles'}
          </h3>
          <p className="text-[var(--brand-muted)] mb-6">
            {isTeacher() 
              ? 'Sé el primero en escribir un post'
              : 'Vuelve más tarde para ver nuevo contenido'}
          </p>
          {isTeacher() && (
            <Button 
              variant="primary"
              onClick={() => navigate('/app/blog/new')}
            >
              ✍️ Crear Primer Post
            </Button>
          )}
        </div>
      )}

      {/* Posts grid */}
      {!loading && !error && filteredPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
