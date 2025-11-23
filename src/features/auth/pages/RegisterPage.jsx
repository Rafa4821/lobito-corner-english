/**
 * Register Page
 * Página de registro de usuarios
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Logo, Badge } from '@design';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { registerUser } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });

  // Prellenar datos si vienen del state
  useEffect(() => {
    if (location.state) {
      const { prefilledEmail, prefilledRole, prefilledName } = location.state;
      setFormData((prev) => ({
        ...prev,
        email: prefilledEmail || prev.email,
        role: prefilledRole || prev.role,
        name: prefilledName || prev.name,
      }));
    }
  }, [location.state]);
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

    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setLoading(true);

    const { user, error } = await registerUser({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role,
    });

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
    if (error.includes('email-already-in-use')) {
      return 'Este email ya está registrado';
    }
    if (error.includes('weak-password')) {
      return 'La contraseña es muy débil';
    }
    if (error.includes('invalid-email')) {
      return 'Email inválido';
    }
    return 'Error al crear la cuenta. Intenta nuevamente';
  };

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] flex items-center justify-center p-4">
      <Card variant="elevated" padding="xl" className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo variant="full" size="lg" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Crear Cuenta</h1>
          <p className="text-[var(--brand-muted)]">Regístrate para comenzar</p>
        </div>

        {generalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre completo"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            error={errors.name}
            fullWidth
            disabled={loading}
          />

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
            helperText="Mínimo 6 caracteres"
            fullWidth
            disabled={loading}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.confirmPassword}
            fullWidth
            disabled={loading}
          />

          {/* Selector de rol */}
          <div>
            <label className="block text-sm font-medium text-[var(--brand-text)] mb-2">
              Tipo de cuenta
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: 'student' }))}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.role === 'student'
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10'
                    : 'border-[var(--brand-border)] hover:border-[var(--brand-primary)]/50'
                }`}
                disabled={loading}
              >
                <div className="text-2xl mb-2">🎓</div>
                <div className="font-medium">Estudiante</div>
                {formData.role === 'student' && (
                  <Badge variant="primary" size="sm" className="mt-2">
                    Seleccionado
                  </Badge>
                )}
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: 'teacher' }))}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.role === 'teacher'
                    ? 'border-[var(--brand-secondary)] bg-[var(--brand-secondary)]/10'
                    : 'border-[var(--brand-border)] hover:border-[var(--brand-secondary)]/50'
                }`}
                disabled={loading}
              >
                <div className="text-2xl mb-2">👨‍🏫</div>
                <div className="font-medium">Profesor</div>
                {formData.role === 'teacher' && (
                  <Badge variant="secondary" size="sm" className="mt-2">
                    Seleccionado
                  </Badge>
                )}
              </button>
            </div>
          </div>

          <Button 
            variant="primary" 
            fullWidth 
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-[var(--brand-primary)] hover:underline"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
