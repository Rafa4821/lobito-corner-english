import React from 'react';
import { Card } from '@design';

const NotificationsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notificaciones</h1>
      <Card variant="elevated" padding="lg">
        <p className="text-[var(--brand-muted)]">Feature de notificaciones - Próximamente</p>
      </Card>
    </div>
  );
};

export default NotificationsPage;
