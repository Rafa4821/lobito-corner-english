/**
 * Empty Products Component
 * Mensaje cuando no hay productos
 */

import React from 'react';
import { Card, Button } from '@design';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const EmptyProducts = ({ message = 'No hay productos disponibles' }) => {
  const navigate = useNavigate();

  return (
    <Card variant="elevated" padding="xl" className="text-center">
      <div className="space-y-4">
        <div className="text-6xl">📦</div>
        <h3 className="text-xl font-bold">{message}</h3>
        <p className="text-[var(--brand-muted)]">
          Vuelve más tarde o explora otras categorías
        </p>
        <Button 
          variant="outline"
          onClick={() => navigate('/app')}
        >
          Volver al Dashboard
        </Button>
      </div>
    </Card>
  );
};

EmptyProducts.propTypes = {
  message: PropTypes.string,
};

export default EmptyProducts;
