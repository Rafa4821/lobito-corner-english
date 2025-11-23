/**
 * Product Skeleton Component
 * Loading skeleton para productos
 */

import React from 'react';
import { Card } from '@design';

const ProductSkeleton = () => {
  return (
    <Card variant="elevated" padding="none" className="overflow-hidden animate-pulse">
      {/* Imagen skeleton */}
      <div className="h-48 bg-[var(--brand-bg-alt)]" />

      {/* Contenido skeleton */}
      <div className="p-4 space-y-3">
        {/* Badges */}
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-[var(--brand-bg-alt)] rounded-full" />
          <div className="h-6 w-16 bg-[var(--brand-bg-alt)] rounded-full" />
        </div>

        {/* Título */}
        <div className="space-y-2">
          <div className="h-5 bg-[var(--brand-bg-alt)] rounded w-3/4" />
          <div className="h-5 bg-[var(--brand-bg-alt)] rounded w-1/2" />
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <div className="h-4 bg-[var(--brand-bg-alt)] rounded w-full" />
          <div className="h-4 bg-[var(--brand-bg-alt)] rounded w-5/6" />
        </div>

        {/* Profesor */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[var(--brand-bg-alt)] rounded-full" />
          <div className="h-4 bg-[var(--brand-bg-alt)] rounded w-24" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--brand-border)]">
          <div className="space-y-1">
            <div className="h-7 bg-[var(--brand-bg-alt)] rounded w-20" />
            <div className="h-3 bg-[var(--brand-bg-alt)] rounded w-16" />
          </div>
          <div className="h-9 w-20 bg-[var(--brand-bg-alt)] rounded-lg" />
        </div>
      </div>
    </Card>
  );
};

export default ProductSkeleton;
