/**
 * Teacher Dashboard Page
 * Panel principal del profesor con todas las secciones
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '@design';
import { useAuth } from '@features/auth';
import { useTeacherRecordings } from '@features/recordings';
import { useUserChats } from '@features/chat';
import { usePostsByAuthor } from '@features/blog';
import StatsCard from '@/components/dashboard/StatsCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { recordings, loading: loadingRecordings } = useTeacherRecordings(user?.uid);
  const { chats, loading: loadingChats } = useUserChats(user?.uid);
  const { posts, loading: loadingPosts } = usePostsByAuthor(user?.uid);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    generateRecentActivities();
  }, [recordings, chats, posts]);

  const generateRecentActivities = () => {
    const activities = [];

    // Grabaciones recientes
    recordings.slice(0, 2).forEach(rec => {
      activities.push({
        type: 'recording',
        title: 'Nueva grabación subida',
        description: `${rec.title || rec.fileName} para ${rec.studentName}`,
        timestamp: rec.createdAt,
      });
    });

    // Mensajes recientes
    chats.slice(0, 2).forEach(chat => {
      if (chat.lastMessage) {
        activities.push({
          type: 'message',
          title: 'Nuevo mensaje',
          description: chat.lastMessage,
          timestamp: chat.lastTimestamp?.toDate?.() || chat.lastTimestamp,
        });
      }
    });

    // Posts recientes
    posts.slice(0, 2).forEach(post => {
      activities.push({
        type: 'blog',
        title: 'Post publicado',
        description: post.title,
        timestamp: post.publishedAt || post.createdAt,
      });
    });

    // Ordenar por fecha
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setRecentActivities(activities.slice(0, 5));
  };

  const getTotalUnreadMessages = () => {
    return chats.reduce((total, chat) => {
      return total + (chat.unreadCount?.[user?.uid] || 0);
    }, 0);
  };

  const quickActions = [
    {
      icon: '📝',
      label: 'Nuevo Post',
      path: '/blog/new',
    },
    {
      icon: '📤',
      label: 'Subir Grabación',
      path: '/recordings',
    },
    {
      icon: '💬',
      label: 'Mensajes',
      path: '/chat',
    },
    {
      icon: '📅',
      label: 'Calendario',
      path: '/calendar',
    },
    {
      icon: '👥',
      label: 'Alumnos',
      onClick: () => {
        // Scroll to students section
        document.getElementById('students-section')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      icon: '📊',
      label: 'Reservas',
      path: '/bookings',
    },
    {
      icon: '👤',
      label: 'Mi Perfil',
      path: '/profile',
    },
    {
      icon: '⚙️',
      label: 'Configuración',
      path: '/profile',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido, {userData?.name || user?.displayName}! 👋
        </h1>
        <p className="text-[var(--brand-muted)]">
          Panel de control del profesor
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon="📝"
          title="Posts Publicados"
          value={posts.filter(p => p.published).length}
          subtitle={`${posts.filter(p => !p.published).length} borradores`}
          color="primary"
        />
        <StatsCard
          icon="🎥"
          title="Grabaciones"
          value={recordings.length}
          subtitle="Total subidas"
          color="secondary"
        />
        <StatsCard
          icon="💬"
          title="Conversaciones"
          value={chats.length}
          subtitle={`${getTotalUnreadMessages()} sin leer`}
          color="accent"
        />
        <StatsCard
          icon="👥"
          title="Estudiantes"
          value={chats.length}
          subtitle="Activos"
          color="success"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity 
            activities={recentActivities}
            loading={loadingRecordings || loadingChats || loadingPosts}
          />
        </div>

        {/* Upcoming Section */}
        <div className="space-y-6">
          {/* Unread Messages */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Mensajes</h3>
              {getTotalUnreadMessages() > 0 && (
                <Badge variant="error">{getTotalUnreadMessages()}</Badge>
              )}
            </div>
            {chats.length === 0 ? (
              <p className="text-center text-[var(--brand-muted)] py-4">
                No hay conversaciones
              </p>
            ) : (
              <div className="space-y-2">
                {chats.slice(0, 3).map((chat) => {
                  const otherUserId = chat.participants.find(id => id !== user?.uid);
                  const otherName = chat.participantNames?.[otherUserId] || 'Estudiante';
                  const unread = chat.unreadCount?.[user?.uid] || 0;

                  return (
                    <button
                      key={chat.id}
                      onClick={() => navigate('/chat')}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--brand-bg-alt)] transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center text-white font-bold">
                        {otherName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{otherName}</p>
                        <p className="text-sm text-[var(--brand-muted)] truncate">
                          {chat.lastMessage || 'Sin mensajes'}
                        </p>
                      </div>
                      {unread > 0 && (
                        <Badge variant="error" size="sm">{unread}</Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <Button 
              variant="outline" 
              fullWidth 
              className="mt-4"
              onClick={() => navigate('/chat')}
            >
              Ver Todos
            </Button>
          </Card>

          {/* Recent Posts */}
          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-bold mb-4">Mis Posts</h3>
            {posts.length === 0 ? (
              <p className="text-center text-[var(--brand-muted)] py-4">
                No has publicado posts
              </p>
            ) : (
              <div className="space-y-2">
                {posts.slice(0, 3).map((post) => (
                  <button
                    key={post.id}
                    onClick={() => navigate(`/blog/${post.id}`)}
                    className="w-full text-left p-3 rounded-lg hover:bg-[var(--brand-bg-alt)] transition-all"
                  >
                    <p className="font-medium truncate">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={post.published ? 'success' : 'default'} size="sm">
                        {post.published ? 'Publicado' : 'Borrador'}
                      </Badge>
                      <span className="text-xs text-[var(--brand-muted)]">
                        {post.views || 0} vistas
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <Button 
              variant="outline" 
              fullWidth 
              className="mt-4"
              onClick={() => navigate('/app/blog')}
            >
              Ver Todos
            </Button>
          </Card>
        </div>
      </div>

      {/* Students Section */}
      <div id="students-section">
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Mis Estudiantes</h3>
            <Badge variant="primary">{chats.length} activos</Badge>
          </div>
          {chats.length === 0 ? (
            <p className="text-center text-[var(--brand-muted)] py-8">
              Aún no tienes estudiantes
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chats.map((chat) => {
                const otherUserId = chat.participants.find(id => id !== user?.uid);
                const otherName = chat.participantNames?.[otherUserId] || 'Estudiante';

                return (
                  <Card key={chat.id} variant="outlined" padding="md" hover>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center text-white font-bold text-lg">
                        {otherName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{otherName}</p>
                        <p className="text-sm text-[var(--brand-muted)]">Estudiante</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        fullWidth
                        onClick={() => navigate('/chat')}
                      >
                        💬 Chat
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        fullWidth
                        onClick={() => navigate('/recordings')}
                      >
                        🎥 Grabaciones
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Tips */}
      <Card variant="outlined" padding="md">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Consejos para profesores</h3>
            <ul className="text-sm text-[var(--brand-muted)] space-y-1">
              <li>• Mantén tus grabaciones organizadas por estudiante</li>
              <li>• Responde los mensajes de tus estudiantes regularmente</li>
              <li>• Publica contenido en el blog para compartir conocimiento</li>
              <li>• Revisa tu calendario para estar al día con las clases</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeacherDashboardPage;
