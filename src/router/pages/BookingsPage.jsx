import React from 'react';
import { Card } from '@design';

const BookingsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reservas</h1>
      <Card variant="elevated" padding="lg">
        <p className="text-[var(--brand-muted)]">Feature de reservas - Próximamente</p>
      </Card>
    </div>
  );
};

export default BookingsPage;
