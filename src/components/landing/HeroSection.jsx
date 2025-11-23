/**
 * Hero Section - Landing Page
 * Sección principal con animaciones
 */

import React, { useEffect, useRef } from 'react';
import { Button } from '@design';
import { useNavigate } from 'react-router-dom';
// import anime from 'animejs';

const HeroSection = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const floatingRef = useRef(null);

  useEffect(() => {
    // Animaciones temporalmente deshabilitadas para deploy
    // TODO: Reemplazar con CSS animations o librería compatible
    
    // // Animación del título
    // anime({
    //   targets: titleRef.current,
    //   translateY: [-50, 0],
    //   opacity: [0, 1],
    //   duration: 1200,
    //   easing: 'easeOutExpo',
    // });

    // // Animación del subtítulo
    // anime({
    //   targets: subtitleRef.current,
    //   translateY: [30, 0],
    //   opacity: [0, 1],
    //   duration: 1200,
    //   delay: 300,
    //   easing: 'easeOutExpo',
    // });

    // // Animación de los botones
    // anime({
    //   targets: ctaRef.current?.children,
    //   translateY: [30, 0],
    //   opacity: [0, 1],
    //   duration: 800,
    //   delay: anime.stagger(150, { start: 600 }),
    //   easing: 'easeOutExpo',
    // });

    // // Animación flotante continua
    // anime({
    //   targets: floatingRef.current,
    //   translateY: [-20, 20],
    //   duration: 3000,
    //   direction: 'alternate',
    //   loop: true,
    //   easing: 'easeInOutSine',
    // });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#2C3E50]">
      {/* Patrón de fondo animado */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F4B942' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div ref={heroRef} className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido */}
          <div className="text-white space-y-8">
            <div ref={titleRef} className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Learn English
                <span className="block text-[#F4B942]">with Confidence</span>
              </h1>
            </div>

            <div ref={subtitleRef} className="animate-fade-in animation-delay-300">
              <p className="text-xl md:text-2xl text-gray-300">
                Clases personalizadas de inglés con un profesor nativo. 
                Mejora tu fluidez, gramática y pronunciación desde casa.
              </p>
            </div>

            <div ref={ctaRef} className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-[#F4B942] hover:bg-[#E5A832] text-[#2C3E50] font-bold shadow-xl"
              >
                📚 Reserva tu Clase Gratis
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-white text-white hover:bg-white hover:text-[#2C3E50]"
              >
                Ver Paquetes
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#F4B942]">500+</div>
                <div className="text-sm text-gray-300">Estudiantes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#7FB069]">98%</div>
                <div className="text-sm text-gray-300">Satisfacción</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#F4B942]">5+</div>
                <div className="text-sm text-gray-300">Años Exp.</div>
              </div>
            </div>
          </div>

          {/* Ilustración/Logo flotante */}
          <div ref={floatingRef} className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Círculo de fondo */}
              <div className="absolute inset-0 bg-[#F4B942] rounded-full opacity-20 blur-3xl scale-150"></div>
              
              {/* Logo o ilustración */}
              <div className="relative bg-white rounded-3xl p-12 shadow-2xl">
                <div className="text-center space-y-4">
                  <img 
                    src="https://firebasestorage.googleapis.com/v0/b/lc-english-e52c2.firebasestorage.app/o/WhatsApp_Image_2025-11-22_at_10.39.37_PM-removebg-preview.png?alt=media&token=68a2d6c0-8aaf-4510-a84c-8614786dfee7"
                    alt="Lobito Corner Logo"
                    className="w-48 h-48 mx-auto object-contain"
                  />
                  <div className="text-2xl font-bold text-[#2C3E50]">Lobito Corner</div>
                  <div className="text-lg text-[#7FB069] font-semibold">ENGLISH</div>
                  <div className="flex items-center justify-center gap-2 text-[#F4B942]">
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
