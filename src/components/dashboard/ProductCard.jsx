/**
 * Product Card Component (for Student Dashboard)
 * Tarjeta de producto adquirido
 */

import React from 'react';
import { Card, Badge, Button } from '@design';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductCard = ({ product, showActions = true }) => {
  const navigate = useNavigate();

  return (
    <Card variant="elevated" padding="md" hover>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold line-clamp-1">{product.title}</h3>
            <p className="text-sm text-[var(--brand-muted)] line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>
          {product.category && (
            <Badge variant="primary" size="sm">
              {product.category}
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="flex items-center gap-4 text-xs text-[var(--brand-muted)]">
          {product.duration && (
            <span>⏱️ {product.duration} min</span>
          )}
          {product.level && (
            <span>📊 {product.level}</span>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => navigate(`/products/${product.id}`)}
            >
              Ver Detalles
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/calendar')}
            >
              📅
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    duration: PropTypes.number,
    level: PropTypes.string,
  }).isRequired,
  showActions: PropTypes.bool,
};

export default ProductCard;
