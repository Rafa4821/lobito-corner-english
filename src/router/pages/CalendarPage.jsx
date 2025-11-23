import React from 'react';
import { Card } from '@design';

const CalendarPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendario</h1>
      <Card variant="elevated" padding="lg">
        <p className="text-[var(--brand-muted)]">Feature de calendario - Próximamente</p>
      </Card>
    </div>
  );
};

export default CalendarPage;
