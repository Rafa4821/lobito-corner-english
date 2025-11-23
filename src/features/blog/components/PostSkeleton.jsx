/**
 * Post Skeleton Component
 * Loading skeleton para posts
 */

import React from 'react';
import { Card } from '@design';

const PostSkeleton = () => {
  return (
    <Card variant="elevated" padding="none" className="overflow-hidden animate-pulse h-full flex flex-col">
      {/* Imagen skeleton */}
      <div className="h-48 bg-[var(--brand-bg-alt)]" />

      {/* Contenido skeleton */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Categoría y fecha */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-6 w-24 bg-[var(--brand-bg-alt)] rounded-full" />
          <div className="h-4 w-20 bg-[var(--brand-bg-alt)] rounded" />
        </div>

        {/* Título */}
        <div className="space-y-2 mb-4">
          <div className="h-6 bg-[var(--brand-bg-alt)] rounded w-full" />
          <div className="h-6 bg-[var(--brand-bg-alt)] rounded w-3/4" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="h-4 bg-[var(--brand-bg-alt)] rounded w-full" />
          <div className="h-4 bg-[var(--brand-bg-alt)] rounded w-full" />
          <div className="h-4 bg-[var(--brand-bg-alt)] rounded w-2/3" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--brand-border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--brand-bg-alt)] rounded-full" />
            <div className="h-4 bg-[var(--brand-bg-alt)] rounded w-24" />
          </div>
          <div className="flex gap-3">
            <div className="h-4 bg-[var(--brand-bg-alt)] rounded w-12" />
            <div className="h-4 bg-[var(--brand-bg-alt)] rounded w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostSkeleton;
