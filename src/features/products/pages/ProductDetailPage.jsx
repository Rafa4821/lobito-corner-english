/**
 * Product Detail Page
 * Página de detalle de producto
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from '@design';
import { useProduct } from '../hooks/useProducts';
import { formatPrice } from '@/utils';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);

  const getCategoryColor = (category) => {
    const colors = {
      'Programación': 'primary',
      'Diseño': 'secondary',
      'Marketing': 'accent',
      'Idiomas': 'info',
      'Música': 'warning',
      'Deportes': 'success',
    };
    return colors[category] || 'default';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[var(--brand-bg-alt)] rounded w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-[var(--brand-bg-alt)] rounded-lg" />
            <div className="h-64 bg-[var(--brand-bg-alt)] rounded-lg" />
          </div>
          <div className="h-96 bg-[var(--brand-bg-alt)] rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <Card variant="elevated" padding="xl" className="text-center">
        <div className="space-y-4">
          <div className="text-6xl">❌</div>
          <h2 className="text-2xl font-bold">Producto no encontrado</h2>
          <p className="text-[var(--brand-muted)]">
            {error || 'El producto que buscas no existe'}
          </p>
          <Button variant="primary" onClick={() => navigate('/products')}>
            Ver todos los productos
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
          onClick={() => navigate('/products')}
          className="hover:text-[var(--brand-primary)] transition-colors"
        >
          Productos
        </button>
        <span>/</span>
        <span className="text-[var(--brand-text)]">{product.title}</span>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Product info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <Card variant="elevated" padding="none" className="overflow-hidden">
            <div className="relative h-96 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-9xl">📚</div>
              )}
              
              {product.featured && (
                <Badge 
                  variant="warning" 
                  className="absolute top-4 right-4"
                >
                  ⭐ Destacado
                </Badge>
              )}
            </div>
          </Card>

          {/* Description */}
          <Card variant="elevated" padding="lg">
            <h2 className="text-2xl font-bold mb-4">Descripción</h2>
            <div className="prose max-w-none">
              <p className="text-[var(--brand-text)] leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">Lo que aprenderás</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[var(--brand-success)] mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {product.requirements && product.requirements.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">Requisitos</h3>
                <ul className="space-y-2">
                  {product.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[var(--brand-muted)] mt-1">•</span>
                      <span className="text-[var(--brand-muted)]">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Teacher info */}
          {product.teacherName && (
            <Card variant="elevated" padding="lg">
              <h2 className="text-2xl font-bold mb-4">Sobre el profesor</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center text-white text-2xl font-bold">
                  {product.teacherName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{product.teacherName}</h3>
                  <p className="text-sm text-[var(--brand-muted)]">
                    {product.teacherBio || 'Profesor experimentado'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right column - Purchase card */}
        <div className="lg:col-span-1">
          <Card variant="elevated" padding="lg" className="sticky top-24">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold mb-3">{product.title}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={getCategoryColor(product.category)}>
                    {product.category}
                  </Badge>
                  {product.level && (
                    <Badge variant="default">
                      {product.level}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="text-4xl font-bold text-[var(--brand-primary)] mb-1">
                  {formatPrice(product.price, 'USD')}
                </div>
                {product.duration && (
                  <p className="text-sm text-[var(--brand-muted)]">
                    {product.duration} minutos por clase
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-3 py-4 border-y border-[var(--brand-border)]">
                {product.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-muted)]">⏱️ Duración</span>
                    <span className="font-medium">{product.duration} min</span>
                  </div>
                )}
                {product.level && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-muted)]">📊 Nivel</span>
                    <span className="font-medium">{product.level}</span>
                  </div>
                )}
                {product.studentsCount && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-muted)]">👥 Estudiantes</span>
                    <span className="font-medium">{product.studentsCount}</span>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  fullWidth 
                  size="lg"
                  onClick={() => navigate('/calendar', { state: { productId: product.id } })}
                >
                  📅 Agendar Clase
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => navigate('/chat')}
                >
                  💬 Contactar Profesor
                </Button>
              </div>

              {/* Additional info */}
              <div className="text-xs text-[var(--brand-muted)] text-center pt-4 border-t border-[var(--brand-border)]">
                <p>✓ Satisfacción garantizada</p>
                <p>✓ Primera clase de prueba</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
