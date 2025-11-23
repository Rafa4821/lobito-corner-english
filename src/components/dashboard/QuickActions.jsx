/**
 * Quick Actions Component
 * Acciones rápidas para dashboard
 */

import React from 'react';
import { Card, Button } from '@design';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const QuickActions = ({ actions }) => {
  const navigate = useNavigate();

  return (
    <Card variant="elevated" padding="lg">
      <h3 className="text-lg font-bold mb-4">Acciones Rápidas</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => action.onClick ? action.onClick() : navigate(action.path)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[var(--brand-bg-alt)] hover:bg-[var(--brand-border)] transition-all hover:shadow-md"
          >
            <div className="text-3xl">{action.icon}</div>
            <span className="text-sm font-medium text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};

QuickActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    path: PropTypes.string,
    onClick: PropTypes.func,
  })).isRequired,
};

export default QuickActions;
