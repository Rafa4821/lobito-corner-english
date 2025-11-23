/**
 * Hero Section - Landing Page
 * Sección principal con animaciones
 */

import React from 'react';
import { Button } from '@design';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#2C3E50]">
      {/* Patrón de fondo animado */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F4B942' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido */}
          <div className="text-white space-y-8">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Learn English
                <span className="block text-[#F4B942]">with Confidence</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <p className="text-xl md:text-2xl text-gray-300">
                Clases personalizadas de inglés con un profesor nativo. 
                Mejora tu fluidez, gramática y pronunciación desde casa.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
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
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-6 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
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
            </motion.div>
          </div>

          {/* Ilustración/Logo flotante */}
          <motion.div
            className="hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative">
              {/* Círculo de fondo */}
              <div className="absolute inset-0 bg-[#F4B942] rounded-full opacity-20 blur-3xl scale-150"></div>
              
              {/* Logo o ilustración */}
              <div className="relative bg-white rounded-3xl p-12 shadow-2xl">
                <div className="text-center space-y-4">
                  <div className="text-8xl">🦊</div>
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
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};

export default HeroSection;
