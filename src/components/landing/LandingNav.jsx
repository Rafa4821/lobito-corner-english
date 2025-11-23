/**
 * Landing Navigation
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@design';
import { useNavigate } from 'react-router-dom';

const LandingNav = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Quiénes Somos', href: '#nosotros' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const scrollToSection = (href) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? 'bg-white shadow-lg py-4' : 'bg-transparent py-6'}
      `}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('#')}
            className="flex items-center gap-2 group"
          >
            <div className="text-3xl">🦊</div>
            <div>
              <div
                className={`font-bold text-lg transition-colors ${
                  scrolled ? 'text-[#2C3E50]' : 'text-white'
                }`}
              >
                Lobito Corner
              </div>
              <div className="text-[#F4B942] text-xs font-semibold">ENGLISH</div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={`
                  font-medium transition-colors
                  ${
                    scrolled
                      ? 'text-gray-700 hover:text-[#F4B942]'
                      : 'text-white hover:text-[#F4B942]'
                  }
                `}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/app')}
              className={
                scrolled
                  ? 'border-2 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white'
                  : 'border-2 border-white text-white hover:bg-white hover:text-[#2C3E50]'
              }
            >
              🔐 Plataforma
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/register')}
              className="bg-[#F4B942] hover:bg-[#E5A832] text-[#2C3E50] font-bold"
            >
              Clase Gratis
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg
              className={`w-6 h-6 ${scrolled ? 'text-[#2C3E50]' : 'text-white'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-xl">
            <div className="flex flex-col space-y-4 px-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left font-medium text-gray-700 hover:text-[#F4B942] transition-colors py-2"
                >
                  {link.name}
                </button>
              ))}
              <div className="border-t pt-4 space-y-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    navigate('/app');
                    setMobileMenuOpen(false);
                  }}
                  className="border-2 border-[#2C3E50] text-[#2C3E50]"
                >
                  🔐 Plataforma
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="bg-[#F4B942] hover:bg-[#E5A832] text-[#2C3E50] font-bold"
                >
                  Clase Gratis
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNav;
