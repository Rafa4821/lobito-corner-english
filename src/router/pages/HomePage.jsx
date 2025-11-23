/**
 * Home Page - Landing Page
 * Página de inicio profesional para Lobito Corner English
 */

import React from 'react';
import {
  LandingNav,
  HeroSection,
  ServicesSection,
  AboutSection,
  ContactSection,
  LandingFooter,
} from '@/components/landing';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <LandingFooter />
    </div>
  );
};

export default HomePage;
