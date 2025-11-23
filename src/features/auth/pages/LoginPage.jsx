/**
 * Login Page
 * Página de inicio de sesión
 */

import React, { useState } from 'react';
import { Card, Input, Button, Logo } from '@design';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setLoading(true);

    const { user, error } = await loginUser(formData);

    if (error) {
      setGeneralError(getErrorMessage(error));
      setLoading(false);
      return;
    }

    if (user) {
      navigate('/app');
    }

    setLoading(false);
  };

  const getErrorMessage = (error) => {
    if (error.includes('user-not-found')) {
      return 'Usuario no encontrado';
    }
    if (error.includes('wrong-password')) {
      return 'Contraseña incorrecta';
    }
    if (error.includes('invalid-credential')) {
      return 'Credenciales inválidas';
    }
    if (error.includes('too-many-requests')) {
      return 'Demasiados intentos. Intenta más tarde';
    }
    return 'Error al iniciar sesión. Intenta nuevamente';
  };

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] flex items-center justify-center p-4">
      <Card variant="elevated" padding="xl" className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo variant="full" size="lg" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Iniciar Sesión</h1>
          <p className="text-[var(--brand-muted)]">Ingresa a tu cuenta</p>
        </div>

        {generalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            error={errors.email}
            fullWidth
            disabled={loading}
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            fullWidth
            disabled={loading}
          />

          <Button 
            variant="primary" 
            fullWidth 
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>

          <div className="text-center space-y-2">
            <Link
              to="/register"
              className="block text-sm text-[var(--brand-primary)] hover:underline"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
            <button
              type="button"
              className="text-sm text-[var(--brand-muted)] hover:text-[var(--brand-text)]"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>

        {/* Demo Users Link */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🧪</span>
              <p className="text-sm font-medium text-yellow-800">Modo Desarrollo</p>
            </div>
            <Link
              to="/demo"
              className="text-sm text-yellow-700 hover:text-yellow-900 underline"
            >
              → Acceder con usuarios de prueba (Profesor/Estudiante)
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
