/**
 * Product Card Component
 * Tarjeta de producto para listado
 */

import React from 'react';
import { Card, Badge, Button } from '@design';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/utils';
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

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

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card 
      variant="elevated" 
      padding="none" 
      hover 
      className="overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* Imagen */}
      <div className="relative h-48 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl">📚</div>
        )}
        
        {product.featured && (
          <Badge 
            variant="warning" 
            className="absolute top-3 right-3"
          >
            ⭐ Destacado
          </Badge>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Categoría y nivel */}
        <div className="flex items-center gap-2">
          <Badge variant={getCategoryColor(product.category)} size="sm">
            {product.category}
          </Badge>
          {product.level && (
            <Badge variant="default" size="sm">
              {product.level}
            </Badge>
          )}
        </div>

        {/* Título */}
        <h3 className="text-lg font-bold line-clamp-2">
          {product.title}
        </h3>

        {/* Descripción */}
        <p className="text-sm text-[var(--brand-muted)] line-clamp-2">
          {product.description}
        </p>

        {/* Profesor */}
        {product.teacherName && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-6 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white text-xs font-bold">
              {product.teacherName.charAt(0).toUpperCase()}
            </div>
            <span className="text-[var(--brand-muted)]">{product.teacherName}</span>
          </div>
        )}

        {/* Footer con precio y duración */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--brand-border)]">
          <div>
            <div className="text-2xl font-bold text-[var(--brand-primary)]">
              {formatPrice(product.price, 'USD')}
            </div>
            {product.duration && (
              <div className="text-xs text-[var(--brand-muted)]">
                {product.duration} min por clase
              </div>
            )}
          </div>
          
          <Button 
            variant="primary" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
          >
            Ver más
          </Button>
        </div>
      </div>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
    featured: PropTypes.bool,
    level: PropTypes.string,
    teacherName: PropTypes.string,
    duration: PropTypes.number,
  }).isRequired,
};

export default ProductCard;
