import React from 'react';
import { Button, Section } from '@design';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Section spacing="xl" centered>
      <div className="text-center space-y-6">
        <div className="text-9xl">404</div>
        <h1 className="text-4xl font-bold">Página no encontrada</h1>
        <p className="text-xl text-[var(--brand-muted)]">
          La página que buscas no existe
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </div>
    </Section>
  );
};

export default NotFoundPage;
