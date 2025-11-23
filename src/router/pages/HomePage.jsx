/**
 * Home Page
 * Página de inicio
 */

import React from 'react';
import { Section, Card, Button } from '@design';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Section spacing="xl" centered>
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] bg-clip-text text-transparent">
            Bienvenido a Lobito Corner
          </h1>
          <p className="text-xl text-[var(--brand-muted)] max-w-2xl mx-auto">
            Plataforma modular construida con React, Firebase y arquitectura por features
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/dashboard')}
          >
            Ir al Dashboard
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
          <Card variant="elevated" padding="lg" hover>
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Modular</h3>
            <p className="text-[var(--brand-muted)]">
              Arquitectura por features, escalable y mantenible
            </p>
          </Card>

          <Card variant="elevated" padding="lg" hover>
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Rápido</h3>
            <p className="text-[var(--brand-muted)]">
              Vite + React para desarrollo ultrarrápido
            </p>
          </Card>

          <Card variant="elevated" padding="lg" hover>
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Personalizable</h3>
            <p className="text-[var(--brand-muted)]">
              Sistema de diseño flexible y fácil de modificar
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
};

export default HomePage;
