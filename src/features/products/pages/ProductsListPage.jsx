/**
 * Products List Page
 * Página de listado de productos
 */

import React, { useState } from 'react';
import { Input, Badge, Button } from '@design';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import EmptyProducts from '../components/EmptyProducts';

const ProductsListPage = () => {
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: '📚' },
    { id: 'Programación', name: 'Programación', icon: '💻' },
    { id: 'Diseño', name: 'Diseño', icon: '🎨' },
    { id: 'Marketing', name: 'Marketing', icon: '📈' },
    { id: 'Idiomas', name: 'Idiomas', icon: '🌍' },
    { id: 'Música', name: 'Música', icon: '🎵' },
    { id: 'Deportes', name: 'Deportes', icon: '⚽' },
  ];

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Productos y Clases</h1>
        <p className="text-[var(--brand-muted)]">
          Explora nuestra selección de cursos y clases particulares
        </p>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        {/* Búsqueda */}
        <Input
          type="text"
          placeholder="Buscar productos..."
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
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
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
          Error al cargar productos: {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredProducts.length === 0 && (
        <EmptyProducts 
          message={
            searchTerm 
              ? `No se encontraron productos para "${searchTerm}"`
              : 'No hay productos disponibles'
          }
        />
      )}

      {/* Products grid */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsListPage;
