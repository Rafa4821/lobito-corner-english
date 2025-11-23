/**
 * Demo Users Page
 * Página para acceso rápido con usuarios de prueba
 */

import React, { useState } from 'react';
import { Card, Button, Badge } from '@design';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@features/auth';

const DemoUsersPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const demoUsers = [
    {
      id: 'teacher',
      name: 'Profesor Demo',
      email: 'profesor@demo.com',
      password: 'demo123',
      role: 'teacher',
      icon: '👨‍🏫',
      color: 'secondary',
      description: 'Acceso completo al panel de profesor',
      features: [
        'Subir grabaciones',
        'Gestionar blog',
        'Ver todos los chats',
        'Panel de estadísticas',
      ],
    },
    {
      id: 'student',
      name: 'Estudiante Demo',
      email: 'estudiante@demo.com',
      password: 'demo123',
      role: 'student',
      icon: '🎓',
      color: 'primary',
      description: 'Vista de estudiante',
      features: [
        'Ver mis grabaciones',
        'Chat con profesor',
        'Ver productos',
        'Reservar clases',
      ],
    },
  ];

  const handleLogin = async (user) => {
    setLoading(user.id);

    const { user: loggedUser, error } = await loginUser(user.email, user.password);

    if (error) {
      alert(`Error: ${error}\n\nEste usuario aún no existe. Por favor créalo primero desde el registro.`);
      setLoading(null);
      return;
    }

    if (loggedUser) {
      // Redirigir según el rol
      if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/dashboard');
      }
    }

    setLoading(null);
  };

  const handleCreateAccount = (user) => {
    navigate('/register', { 
      state: { 
        prefilledEmail: user.email,
        prefilledRole: user.role,
        prefilledName: user.name,
      } 
    });
  };

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🧪 Usuarios de Prueba</h1>
          <p className="text-[var(--brand-muted)] mb-4">
            Accede rápidamente con usuarios de demostración
          </p>
          <Badge variant="warning" size="lg">
            ⚠️ Solo para desarrollo
          </Badge>
        </div>

        {/* Demo Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {demoUsers.map((user) => (
            <Card key={user.id} variant="elevated" padding="xl">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{user.icon}</div>
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <Badge variant={user.color} size="lg">
                  {user.role === 'teacher' ? 'Profesor' : 'Estudiante'}
                </Badge>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-[var(--brand-bg-alt)] rounded-lg">
                  <p className="text-sm text-[var(--brand-muted)] mb-2">Credenciales:</p>
                  <div className="space-y-1">
                    <p className="font-mono text-sm">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="font-mono text-sm">
                      <strong>Password:</strong> {user.password}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">{user.description}</p>
                  <ul className="space-y-1">
                    {user.features.map((feature, index) => (
                      <li key={index} className="text-sm text-[var(--brand-muted)]">
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant={user.color}
                  fullWidth
                  onClick={() => handleLogin(user)}
                  loading={loading === user.id}
                  disabled={loading !== null}
                >
                  {loading === user.id ? 'Iniciando sesión...' : '🚀 Acceder'}
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => handleCreateAccount(user)}
                  disabled={loading !== null}
                >
                  📝 Crear esta cuenta
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card variant="outlined" padding="lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <h3 className="font-bold mb-2">Instrucciones</h3>
              <ol className="text-sm text-[var(--brand-muted)] space-y-2 list-decimal list-inside">
                <li>
                  <strong>Primera vez:</strong> Click en "Crear esta cuenta" para registrar el usuario de prueba
                </li>
                <li>
                  <strong>Siguientes veces:</strong> Click en "Acceder" para iniciar sesión directamente
                </li>
                <li>
                  <strong>Profesor:</strong> Tendrás acceso al panel de administración completo
                </li>
                <li>
                  <strong>Estudiante:</strong> Verás la vista de estudiante con funciones limitadas
                </li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
            >
              ← Login Normal
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/register')}
            >
              Registro Normal →
            </Button>
          </div>
          <p className="text-xs text-[var(--brand-muted)]">
            Esta página solo debe usarse en desarrollo. Elimínala en producción.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoUsersPage;
