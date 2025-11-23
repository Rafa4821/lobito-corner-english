/**
 * App Component
 * Componente raíz con React Router y Auth Provider
 */

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@features/auth';
import router from './router';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
