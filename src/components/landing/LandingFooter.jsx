/**
 * Landing Footer
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#2C3E50] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/lc-english-e52c2.firebasestorage.app/o/WhatsApp_Image_2025-11-22_at_10.39.37_PM-removebg-preview.png?alt=media&token=68a2d6c0-8aaf-4510-a84c-8614786dfee7"
                alt="Lobito Corner Logo"
                className="h-12 w-auto object-contain"
              />
              <div>
                <div className="font-bold text-xl">Lobito Corner</div>
                <div className="text-[#F4B942] text-sm">ENGLISH</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Aprende inglés con confianza. Clases personalizadas con un profesor nativo.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F4B942] transition-colors"
              >
                📘
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F4B942] transition-colors"
              >
                📸
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F4B942] transition-colors"
              >
                🐦
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F4B942] transition-colors"
              >
                💼
              </a>
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#F4B942] transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#servicios"
                  className="text-gray-400 hover:text-[#F4B942] transition-colors"
                >
                  Servicios
                </a>
              </li>
              <li>
                <a
                  href="#nosotros"
                  className="text-gray-400 hover:text-[#F4B942] transition-colors"
                >
                  Quiénes Somos
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  className="text-gray-400 hover:text-[#F4B942] transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="font-bold text-lg mb-4">Servicios</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#F4B942] transition-colors">
                  Clases Individuales
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#F4B942] transition-colors">
                  Clases Grupales
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#F4B942] transition-colors">
                  Preparación Exámenes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#F4B942] transition-colors">
                  Inglés de Negocios
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span>📧</span>
                <a
                  href="mailto:hello@lobitocorner.com"
                  className="text-gray-400 hover:text-[#F4B942] transition-colors"
                >
                  hello@lobitocorner.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>📱</span>
                <a
                  href="https://wa.me/15551234567"
                  className="text-gray-400 hover:text-[#F4B942] transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>🌐</span>
                <span className="text-gray-400">Online Worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            © 2024 Lobito Corner English. Todos los derechos reservados.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-[#F4B942] transition-colors">
              Términos y Condiciones
            </a>
            <a href="#" className="text-gray-400 hover:text-[#F4B942] transition-colors">
              Política de Privacidad
            </a>
            <button
              onClick={() => navigate('/app')}
              className="text-[#F4B942] hover:text-[#E5A832] font-semibold transition-colors"
            >
              🔐 Acceso Plataforma
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
