/**
 * Profile Page
 * Página de perfil con edición de datos
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Badge } from '@design';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/authService';
import { updateUserDocument } from '../services/userService';

const ProfilePage = () => {
  const { user, userData, refreshUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user && userData) {
      setFormData({
        name: user.displayName || '',
        email: user.email || '',
        bio: userData.bio || '',
        phone: userData.phone || '',
      });
    }
  }, [user, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) return;

    setLoading(true);

    try {
      // Actualizar Auth (nombre y email)
      await updateUserProfile(user.uid, {
        name: formData.name,
        email: formData.email,
      });

      // Actualizar Firestore (bio, phone, etc)
      await updateUserDocument(user.uid, {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        phone: formData.phone,
      });

      await refreshUserData();
      setSuccessMessage('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      setErrors({ general: 'Error al actualizar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.displayName || '',
      email: user.email || '',
      bio: userData?.bio || '',
      phone: userData?.phone || '',
    });
    setErrors({});
  };

  const getRoleBadge = () => {
    if (userData?.role === 'teacher') {
      return <Badge variant="secondary">👨‍🏫 Profesor</Badge>;
    }
    return <Badge variant="primary">🎓 Estudiante</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-[var(--brand-muted)]">
            Gestiona tu información personal
          </p>
        </div>
        {getRoleBadge()}
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar con avatar */}
        <Card variant="elevated" padding="lg" className="lg:col-span-1">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center text-white text-4xl font-bold">
              {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold">{user?.displayName || 'Usuario'}</h3>
              <p className="text-sm text-[var(--brand-muted)]">{user?.email}</p>
            </div>
            <div className="pt-4 border-t border-[var(--brand-border)] space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--brand-muted)]">Miembro desde</span>
                <span className="font-medium">
                  {userData?.createdAt 
                    ? new Date(userData.createdAt).toLocaleDateString('es-ES', { 
                        month: 'short', 
                        year: 'numeric' 
                      })
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--brand-muted)]">Email verificado</span>
                <span className="font-medium">
                  {user?.emailVerified ? '✅' : '❌'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Formulario de edición */}
        <Card variant="elevated" padding="lg" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Información Personal</h2>
            {!isEditing && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            )}
          </div>

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
              disabled={!isEditing || loading}
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
              disabled={!isEditing || loading}
              helperText="Cambiar el email requerirá verificación"
            />

            <Input
              label="Teléfono"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
              error={errors.phone}
              fullWidth
              disabled={!isEditing || loading}
            />

            <div>
              <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">
                Biografía
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Cuéntanos sobre ti..."
                rows={4}
                disabled={!isEditing || loading}
                className="w-full px-4 py-2 border rounded-[var(--radius-md)] bg-[var(--brand-bg)] text-[var(--brand-text)] placeholder:text-[var(--brand-muted)] transition-all duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed border-[var(--brand-border)]"
              />
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="primary" 
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button 
                  variant="ghost" 
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>

      {/* Sección de seguridad */}
      <Card variant="elevated" padding="lg">
        <h2 className="text-xl font-bold mb-4">Seguridad</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--brand-bg-alt)] rounded-lg">
            <div>
              <h3 className="font-medium">Cambiar contraseña</h3>
              <p className="text-sm text-[var(--brand-muted)]">
                Actualiza tu contraseña regularmente
              </p>
            </div>
            <Button variant="outline" size="sm">
              Cambiar
            </Button>
          </div>

          {!user?.emailVerified && (
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div>
                <h3 className="font-medium text-yellow-800">Verificar email</h3>
                <p className="text-sm text-yellow-600">
                  Tu email no está verificado
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enviar verificación
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
