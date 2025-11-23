/**
 * About Section - Quiénes Somos
 */

import React, { useEffect, useRef } from 'react';
import { Card } from '@design';
import anime from 'animejs/lib/anime.es.js';

const AboutSection = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animar contenido
            anime({
              targets: contentRef.current,
              translateX: [-100, 0],
              opacity: [0, 1],
              duration: 1000,
              easing: 'easeOutExpo',
            });

            // Animar stats
            anime({
              targets: statsRef.current?.children,
              scale: [0, 1],
              opacity: [0, 1],
              duration: 600,
              delay: anime.stagger(150, { start: 500 }),
              easing: 'easeOutBack',
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

  const achievements = [
    { icon: '🎓', title: 'Certificado TEFL', description: 'Teaching English as a Foreign Language' },
    { icon: '🌍', title: 'Nativo', description: 'Inglés como lengua materna' },
    { icon: '📚', title: '5+ Años', description: 'Experiencia enseñando online' },
    { icon: '⭐', title: '4.9/5', description: 'Calificación promedio' },
  ];

  const methodology = [
    {
      icon: '🎯',
      title: 'Personalizado',
      description: 'Cada clase se adapta a tu nivel y objetivos específicos',
    },
    {
      icon: '💬',
      title: 'Conversacional',
      description: 'Enfoque en la práctica real del idioma desde el día 1',
    },
    {
      icon: '📱',
      title: 'Flexible',
      description: 'Clases online desde cualquier lugar, a tu ritmo',
    },
    {
      icon: '🎮',
      title: 'Interactivo',
      description: 'Uso de tecnología y recursos multimedia dinámicos',
    },
  ];

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-[#2C3E50] to-[#34495E] text-white"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Imagen/Ilustración */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
              {/* Placeholder para foto del profesor */}
              <div className="aspect-square bg-gradient-to-br from-[#F4B942] to-[#7FB069] rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-9xl mb-4">👨‍🏫</div>
                  <div className="text-2xl font-bold text-white">Tu Profesor</div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-[#F4B942] text-[#2C3E50] px-6 py-3 rounded-full font-bold shadow-xl">
                ⭐ 500+ Estudiantes
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#7FB069] text-white px-6 py-3 rounded-full font-bold shadow-xl">
                🏆 Certificado TEFL
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div ref={contentRef} className="opacity-0 space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Sobre <span className="text-[#F4B942]">Lobito Corner</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Hola! Soy un profesor de inglés nativo con más de 5 años de experiencia 
                ayudando a estudiantes de todo el mundo a alcanzar sus metas en el idioma.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Mi pasión es hacer que el aprendizaje del inglés sea <strong className="text-[#F4B942]">divertido, 
                efectivo y accesible</strong> para todos. Creo firmemente que la mejor manera de aprender 
                un idioma es a través de la práctica constante y la conversación real.
              </p>
              <p className="text-gray-300 leading-relaxed">
                En Lobito Corner, no solo aprenderás gramática y vocabulario, sino que también 
                ganarás la <strong className="text-[#7FB069]">confianza</strong> para comunicarte 
                en situaciones reales del día a día.
              </p>
            </div>

            {/* Achievements */}
            <div ref={statsRef} className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="opacity-0 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-colors"
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <div className="font-bold text-[#F4B942]">{achievement.title}</div>
                  <div className="text-sm text-gray-300">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metodología */}
        <div className="mt-20">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Mi <span className="text-[#F4B942]">Metodología</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodology.map((item, index) => (
              <Card
                key={index}
                variant="elevated"
                padding="lg"
                className="bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-[#F4B942] transition-all hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h4 className="text-xl font-bold mb-2 text-[#F4B942]">{item.title}</h4>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card variant="elevated" padding="lg" className="bg-white text-[#2C3E50]">
            <div className="flex items-start gap-4">
              <div className="text-6xl text-[#F4B942]">"</div>
              <div className="flex-1">
                <p className="text-lg italic mb-4">
                  Las clases con Lobito Corner transformaron completamente mi inglés. 
                  En solo 3 meses pasé de tener miedo a hablar a poder mantener conversaciones 
                  fluidas en mi trabajo. ¡100% recomendado!
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#7FB069] flex items-center justify-center text-white font-bold">
                    MC
                  </div>
                  <div>
                    <div className="font-bold">María Contreras</div>
                    <div className="text-sm text-gray-600">Estudiante desde 2023</div>
                  </div>
                  <div className="ml-auto text-[#F4B942]">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
