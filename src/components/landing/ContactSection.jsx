/**
 * Contact Section - Contáctanos
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input } from '@design';
// import anime from 'animejs';

const ContactSection = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: formRef.current,
              translateY: [50, 0],
              opacity: [0, 1],
              duration: 1000,
              easing: 'easeOutExpo',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    // Simular envío (aquí integrarías con tu backend o servicio de email)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSending(false);
    setSent(true);

    // Resetear formulario
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });

    // Resetear mensaje de éxito después de 5 segundos
    setTimeout(() => setSent(false), 5000);
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'hello@lobitocorner.com',
      link: 'mailto:hello@lobitocorner.com',
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      value: '+1 (555) 123-4567',
      link: 'https://wa.me/15551234567',
    },
    {
      icon: '🌐',
      title: 'Redes Sociales',
      value: '@lobitocorner',
      link: '#',
    },
  ];

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-4">
            ¿Listo para Empezar?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Contáctame y comencemos tu viaje hacia la fluidez en inglés
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulario */}
          <div ref={formRef} className="opacity-0">
            <Card variant="elevated" padding="lg" className="h-full">
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-6">
                Envíame un Mensaje
              </h3>

              {sent && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg text-green-800">
                  ✅ ¡Mensaje enviado! Te responderé pronto.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#F4B942] focus:outline-none transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#F4B942] focus:outline-none transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#F4B942] focus:outline-none transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#F4B942] focus:outline-none transition-colors resize-none"
                    placeholder="Cuéntame sobre tus objetivos y nivel actual de inglés..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={sending}
                  disabled={sending}
                  className="bg-[#F4B942] hover:bg-[#E5A832] text-[#2C3E50] font-bold"
                >
                  {sending ? 'Enviando...' : '📨 Enviar Mensaje'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Info de contacto */}
          <div className="space-y-6">
            <Card variant="elevated" padding="lg">
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-6">
                Información de Contacto
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="text-4xl">{info.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">{info.title}</div>
                      <div className="font-semibold text-[#2C3E50] group-hover:text-[#F4B942] transition-colors">
                        {info.value}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-[#F4B942] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </Card>

            {/* Horarios */}
            <Card variant="elevated" padding="lg" className="bg-gradient-to-br from-[#2C3E50] to-[#34495E] text-white">
              <h3 className="text-xl font-bold mb-4">⏰ Horarios de Atención</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lunes - Viernes:</span>
                  <span className="font-semibold text-[#F4B942]">9:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados:</span>
                  <span className="font-semibold text-[#F4B942]">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos:</span>
                  <span className="font-semibold text-gray-400">Cerrado</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 text-xs text-gray-300">
                * Horario EST (GMT-5). Clases disponibles en otros horarios bajo consulta.
              </div>
            </Card>

            {/* FAQ rápido */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4">❓ Preguntas Frecuentes</h3>
              <div className="space-y-3 text-sm">
                <details className="group">
                  <summary className="font-semibold cursor-pointer hover:text-[#F4B942] transition-colors">
                    ¿Ofrecen clase de prueba gratuita?
                  </summary>
                  <p className="mt-2 text-gray-600 pl-4">
                    Sí! La primera clase de 30 minutos es completamente gratis para conocernos.
                  </p>
                </details>
                <details className="group">
                  <summary className="font-semibold cursor-pointer hover:text-[#F4B942] transition-colors">
                    ¿Qué nivel de inglés necesito?
                  </summary>
                  <p className="mt-2 text-gray-600 pl-4">
                    Trabajo con todos los niveles, desde principiantes hasta avanzados.
                  </p>
                </details>
                <details className="group">
                  <summary className="font-semibold cursor-pointer hover:text-[#F4B942] transition-colors">
                    ¿Cómo son las clases?
                  </summary>
                  <p className="mt-2 text-gray-600 pl-4">
                    100% online por Zoom/Google Meet, con material interactivo y grabaciones.
                  </p>
                </details>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
