/**
 * Services Section - Paquetes de Clases
 */

import React, { useEffect, useRef } from 'react';
import { Card, Button } from '@design';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';

const ServicesSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animar cards cuando entran en viewport
            anime({
              targets: cardsRef.current?.children,
              translateY: [50, 0],
              opacity: [0, 1],
              duration: 800,
              delay: anime.stagger(200),
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

  const packages = [
    {
      name: 'Starter',
      icon: '🌱',
      price: '$49',
      period: '/mes',
      description: 'Perfecto para comenzar tu viaje en el inglés',
      features: [
        '4 clases de 60 minutos',
        'Material didáctico incluido',
        'Acceso a grabaciones',
        'Chat con el profesor',
        'Certificado de participación',
      ],
      popular: false,
      color: '#7FB069',
    },
    {
      name: 'Professional',
      icon: '🚀',
      price: '$89',
      period: '/mes',
      description: 'El más elegido por estudiantes serios',
      features: [
        '8 clases de 60 minutos',
        'Material didáctico premium',
        'Acceso ilimitado a grabaciones',
        'Chat prioritario 24/7',
        'Ejercicios personalizados',
        'Certificado oficial',
        'Sesiones de conversación grupales',
      ],
      popular: true,
      color: '#F4B942',
    },
    {
      name: 'Intensive',
      icon: '⚡',
      price: '$149',
      period: '/mes',
      description: 'Máximo progreso en el menor tiempo',
      features: [
        '12 clases de 60 minutos',
        'Material exclusivo avanzado',
        'Acceso de por vida a grabaciones',
        'Soporte 24/7 prioritario',
        'Plan de estudio personalizado',
        'Certificado internacional',
        'Sesiones grupales ilimitadas',
        'Preparación para exámenes',
      ],
      popular: false,
      color: '#2C3E50',
    },
  ];

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-4">
            Nuestros Paquetes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus objetivos y ritmo de aprendizaje
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`opacity-0 ${pkg.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              <Card
                variant="elevated"
                padding="none"
                className={`
                  relative overflow-hidden h-full
                  ${pkg.popular ? 'border-4 border-[#F4B942] shadow-2xl' : 'border border-gray-200'}
                  hover:scale-105 transition-transform duration-300
                `}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-[#F4B942] text-[#2C3E50] px-4 py-1 text-sm font-bold rounded-bl-lg">
                    ⭐ MÁS POPULAR
                  </div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <div className="text-6xl mb-4">{pkg.icon}</div>

                  {/* Name */}
                  <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">
                    {pkg.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">{pkg.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-5xl font-bold" style={{ color: pkg.color }}>
                      {pkg.price}
                    </span>
                    <span className="text-gray-500 text-lg">{pkg.period}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#7FB069] mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    variant={pkg.popular ? 'primary' : 'outline'}
                    fullWidth
                    size="lg"
                    onClick={() => navigate('/register')}
                    className={
                      pkg.popular
                        ? 'bg-[#F4B942] hover:bg-[#E5A832] text-[#2C3E50] font-bold'
                        : 'border-2 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white'
                    }
                  >
                    {pkg.popular ? '🎯 Elegir Plan' : 'Seleccionar'}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Extra info */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ✨ Todos los planes incluyen garantía de satisfacción de 7 días
          </p>
          <Button
            variant="outline"
            onClick={() => {
              document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            ¿Necesitas un plan personalizado? Contáctanos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
