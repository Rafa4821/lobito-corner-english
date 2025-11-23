/**
 * Student Dashboard Page
 * Panel principal del estudiante con todas las secciones
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '@design';
import { useAuth } from '@features/auth';
import { useStudentRecordings } from '@features/recordings';
import { useGetOrCreateChat } from '@features/chat';
import { getAllProducts } from '@features/products';
import StatsCard from '@/components/dashboard/StatsCard';
import QuickActions from '@/components/dashboard/QuickActions';
import UpcomingClassCard from '@/components/dashboard/UpcomingClassCard';
import ProductCard from '@/components/dashboard/ProductCard';

const StudentDashboardPage = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { recordings, loading: loadingRecordings } = useStudentRecordings(user?.uid);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [upcomingClasses, setUpcomingClasses] = useState([]);

  useEffect(() => {
    loadProducts();
    loadUpcomingClasses();
  }, []);

  const loadProducts = async () => {
    setLoadingProducts(true);
    const { products: data } = await getAllProducts();
    // En producción, filtrar solo productos adquiridos por el estudiante
    setProducts(data?.slice(0, 3) || []);
    setLoadingProducts(false);
  };

  const loadUpcomingClasses = async () => {
    // Simulación - En producción usar useUpcomingBookings
    setUpcomingClasses([
      {
        id: '1',
        productTitle: 'Clase de Inglés',
        teacherName: 'Profesor Demo',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:00',
        duration: 60,
        status: 'confirmed',
        notes: 'Traer material de estudio',
      },
    ]);
  };

  const handleReschedule = (booking) => {
    // Validar si puede reprogramar (24h antes)
    const now = new Date();
    const classDate = new Date(`${booking.date} ${booking.time}`);
    const hoursDiff = (classDate - now) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      alert('No puedes reprogramar con menos de 24 horas de anticipación');
      return;
    }

    navigate('/calendar', { state: { rescheduleBooking: booking } });
  };

  const handleCancel = (booking) => {
    // Validar si puede cancelar (24h antes)
    const now = new Date();
    const classDate = new Date(`${booking.date} ${booking.time}`);
    const hoursDiff = (classDate - now) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      alert('No puedes cancelar con menos de 24 horas de anticipación');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres cancelar esta clase?')) {
      // Aquí iría la lógica de cancelación
      alert('Clase cancelada correctamente');
      loadUpcomingClasses();
    }
  };

  const canModifyBooking = (booking) => {
    const now = new Date();
    const classDate = new Date(`${booking.date} ${booking.time}`);
    const hoursDiff = (classDate - now) / (1000 * 60 * 60);
    return hoursDiff >= 24;
  };

  const quickActions = [
    {
      icon: '📅',
      label: 'Reservar Clase',
      path: '/calendar',
    },
    {
      icon: '🎥',
      label: 'Mis Grabaciones',
      path: '/my-classes/recordings',
    },
    {
      icon: '💬',
      label: 'Chat con Profesor',
      path: '/my-chat',
    },
    {
      icon: '📚',
      label: 'Ver Productos',
      path: '/products',
    },
    {
      icon: '📝',
      label: 'Blog',
      path: '/blog',
    },
    {
      icon: '👤',
      label: 'Mi Perfil',
      path: '/profile',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          ¡Hola, {userData?.name || user?.displayName}! 👋
        </h1>
        <p className="text-[var(--brand-muted)]">
          Bienvenido a tu panel de estudiante
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon="📅"
          title="Próximas Clases"
          value={upcomingClasses.length}
          subtitle="Esta semana"
          color="primary"
        />
        <StatsCard
          icon="🎥"
          title="Grabaciones"
          value={recordings.length}
          subtitle="Disponibles"
          color="secondary"
        />
        <StatsCard
          icon="📚"
          title="Productos"
          value={products.length}
          subtitle="Adquiridos"
          color="accent"
        />
        <StatsCard
          icon="✅"
          title="Clases Completadas"
          value={0}
          subtitle="Este mes"
          color="success"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Classes */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Próximas Clases</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/calendar')}
              >
                Ver Calendario
              </Button>
            </div>

            {upcomingClasses.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-bold mb-2">No tienes clases programadas</h3>
                <p className="text-[var(--brand-muted)] mb-4">
                  Reserva tu primera clase con el profesor
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/calendar')}
                >
                  Reservar Clase
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingClasses.map((booking) => (
                  <UpcomingClassCard
                    key={booking.id}
                    booking={booking}
                    onReschedule={handleReschedule}
                    onCancel={handleCancel}
                    canReschedule={canModifyBooking(booking)}
                    canCancel={canModifyBooking(booking)}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Recent Recordings */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Grabaciones Recientes</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/my-classes/recordings')}
              >
                Ver Todas
              </Button>
            </div>

            {loadingRecordings ? (
              <p className="text-center text-[var(--brand-muted)] py-4">
                Cargando grabaciones...
              </p>
            ) : recordings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎥</div>
                <p className="text-[var(--brand-muted)]">
                  Aún no tienes grabaciones
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recordings.slice(0, 3).map((recording) => (
                  <div
                    key={recording.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--brand-bg-alt)] transition-all cursor-pointer"
                    onClick={() => window.open(recording.url, '_blank')}
                  >
                    <div className="text-2xl">🎥</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {recording.title || recording.fileName}
                      </p>
                      <p className="text-sm text-[var(--brand-muted)]">
                        {recording.teacherName}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      ▶️
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Chat Quick Access */}
          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-bold mb-4">Chat con Profesor</h3>
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center text-white text-2xl">
                👨‍🏫
              </div>
              <p className="font-medium mb-1">Profesor Demo</p>
              <p className="text-sm text-[var(--brand-muted)] mb-4">
                Disponible para ayudarte
              </p>
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/my-chat')}
              >
                💬 Abrir Chat
              </Button>
            </div>
          </Card>

          {/* My Products */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Mis Productos</h3>
              <Badge variant="primary">{products.length}</Badge>
            </div>

            {loadingProducts ? (
              <p className="text-center text-[var(--brand-muted)] py-4">
                Cargando...
              </p>
            ) : products.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-[var(--brand-muted)] mb-3">
                  No tienes productos aún
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/app/products')}
                >
                  Ver Productos
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showActions={false}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/app/products')}
                >
                  Ver Todos
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Tips */}
      <Card variant="outlined" padding="md">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Consejos para estudiantes</h3>
            <ul className="text-sm text-[var(--brand-muted)] space-y-1">
              <li>• Revisa tus grabaciones regularmente para repasar</li>
              <li>• Mantén contacto con tu profesor a través del chat</li>
              <li>• Recuerda que puedes cancelar o reprogramar con 24h de anticipación</li>
              <li>• Explora el blog para contenido adicional</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboardPage;
