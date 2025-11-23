/**
 * Recording Card Component
 * Tarjeta de grabación para listado
 */

import React from 'react';
import { Card, Badge, Button } from '@design';
import { formatDate } from '@/utils';
import { formatFileSize } from '../services/storageService';
import PropTypes from 'prop-types';

const RecordingCard = ({ recording, onDelete, canDelete = false }) => {
  const getFileTypeIcon = (fileType) => {
    if (fileType?.startsWith('video/')) return '🎥';
    if (fileType?.startsWith('audio/')) return '🎵';
    return '📁';
  };

  const handleDownload = () => {
    window.open(recording.url, '_blank');
  };

  return (
    <Card variant="elevated" padding="lg" hover>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">
              {getFileTypeIcon(recording.fileType)}
            </div>
            <div>
              <h3 className="font-bold text-lg line-clamp-1">
                {recording.title || recording.fileName}
              </h3>
              <p className="text-sm text-[var(--brand-muted)]">
                {formatDate(recording.createdAt)}
              </p>
            </div>
          </div>
          
          {recording.fileType?.startsWith('video/') && (
            <Badge variant="primary" size="sm">Video</Badge>
          )}
          {recording.fileType?.startsWith('audio/') && (
            <Badge variant="secondary" size="sm">Audio</Badge>
          )}
        </div>

        {/* Description */}
        {recording.description && (
          <p className="text-sm text-[var(--brand-muted)] line-clamp-2">
            {recording.description}
          </p>
        )}

        {/* Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[var(--brand-muted)]">Estudiante:</span>
            <p className="font-medium">{recording.studentName}</p>
          </div>
          <div>
            <span className="text-[var(--brand-muted)]">Profesor:</span>
            <p className="font-medium">{recording.teacherName}</p>
          </div>
          {recording.productTitle && (
            <div className="col-span-2">
              <span className="text-[var(--brand-muted)]">Clase:</span>
              <p className="font-medium">{recording.productTitle}</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-[var(--brand-muted)] pt-3 border-t border-[var(--brand-border)]">
          <span>📦 {formatFileSize(recording.fileSize)}</span>
          {recording.views > 0 && (
            <span>👁️ {recording.views} vistas</span>
          )}
          {recording.duration && (
            <span>⏱️ {recording.duration}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            size="sm"
            fullWidth
            onClick={handleDownload}
          >
            ▶️ Ver/Descargar
          </Button>
          {canDelete && onDelete && (
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => onDelete(recording)}
            >
              🗑️
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

RecordingCard.propTypes = {
  recording: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    fileName: PropTypes.string.isRequired,
    description: PropTypes.string,
    url: PropTypes.string.isRequired,
    fileType: PropTypes.string.isRequired,
    fileSize: PropTypes.number.isRequired,
    studentName: PropTypes.string.isRequired,
    teacherName: PropTypes.string.isRequired,
    productTitle: PropTypes.string,
    views: PropTypes.number,
    duration: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
  canDelete: PropTypes.bool,
};

export default RecordingCard;
