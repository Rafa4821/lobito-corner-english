/**
 * Resend Configuration
 * Configuración del servicio de email con Resend
 */

import { Resend } from 'resend';

// Inicializar Resend con API key
const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;

if (!resendApiKey || resendApiKey === 'demo_resend_key') {
  console.warn('⚠️ Resend API key not configured. Email notifications will not work.');
}

export const resend = new Resend(resendApiKey);

// Configuración de emails
export const EMAIL_CONFIG = {
  from: 'Lobito Corner <onboarding@resend.dev>', // Cambiar por tu dominio verificado
  replyTo: 'support@lobitoCorner.com',
};

// Verificar configuración
export const verifyResendConfig = () => {
  if (!resendApiKey || resendApiKey === 'demo_resend_key') {
    return {
      configured: false,
      message: 'Resend API key not configured',
    };
  }
  
  return {
    configured: true,
    message: 'Resend configured successfully',
  };
};
