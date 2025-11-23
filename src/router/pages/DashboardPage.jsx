/**
 * Dashboard Page
 * Página principal del dashboard
 */

import React from 'react';
import { Section, Card, Badge } from '@design';

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-[var(--brand-muted)]">
          Vista general de tu cuenta y actividad
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[var(--brand-muted)]">Productos</span>
            <Badge variant="primary">24</Badge>
          </div>
          <p className="text-3xl font-bold">24</p>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[var(--brand-muted)]">Reservas</span>
            <Badge variant="secondary">12</Badge>
          </div>
          <p className="text-3xl font-bold">12</p>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[var(--brand-muted)]">Posts</span>
            <Badge variant="accent">8</Badge>
          </div>
          <p className="text-3xl font-bold">8</p>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[var(--brand-muted)]">Mensajes</span>
            <Badge variant="info">5</Badge>
          </div>
          <p className="text-3xl font-bold">5</p>
        </Card>
      </div>

      <Card variant="default" padding="lg">
        <h2 className="text-xl font-bold mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-[var(--brand-bg-alt)] rounded-lg">
            <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full"></div>
            <span>Nuevo producto agregado</span>
            <span className="ml-auto text-sm text-[var(--brand-muted)]">Hace 2 horas</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[var(--brand-bg-alt)] rounded-lg">
            <div className="w-2 h-2 bg-[var(--brand-secondary)] rounded-full"></div>
            <span>Reserva confirmada</span>
            <span className="ml-auto text-sm text-[var(--brand-muted)]">Hace 5 horas</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[var(--brand-bg-alt)] rounded-lg">
            <div className="w-2 h-2 bg-[var(--brand-accent)] rounded-full"></div>
            <span>Nuevo mensaje recibido</span>
            <span className="ml-auto text-sm text-[var(--brand-muted)]">Hace 1 día</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
