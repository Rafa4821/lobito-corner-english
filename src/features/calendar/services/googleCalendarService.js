/**
 * Google Calendar Service
 * Integración con Google Calendar API
 */

// Configuración de Google Calendar API
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Inicializar Google API
 */
export const initGoogleCalendar = () => {
  return new Promise((resolve, reject) => {
    // Cargar Google API script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client', async () => {
        try {
          await window.gapi.client.init({
            apiKey: GOOGLE_API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
          });
          gapiInited = true;
          maybeEnableButtons(resolve);
        } catch (error) {
          reject(error);
        }
      });
    };
    document.body.appendChild(script);

    // Cargar Google Identity Services
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = () => {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: '', // Se define en cada llamada
      });
      gisInited = true;
      maybeEnableButtons(resolve);
    };
    document.body.appendChild(gisScript);
  });
};

const maybeEnableButtons = (resolve) => {
  if (gapiInited && gisInited) {
    resolve();
  }
};

/**
 * Autenticar con Google
 */
export const authenticateGoogle = () => {
  return new Promise((resolve, reject) => {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        reject(resp);
      } else {
        resolve(resp);
      }
    };

    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  });
};

/**
 * Desconectar de Google
 */
export const disconnectGoogle = () => {
  const token = window.gapi.client.getToken();
  if (token !== null) {
    window.google.accounts.oauth2.revoke(token.access_token);
    window.gapi.client.setToken('');
  }
};

/**
 * Verificar si está autenticado
 */
export const isAuthenticated = () => {
  return window.gapi?.client?.getToken() !== null;
};

/**
 * Crear evento en Google Calendar
 */
export const createGoogleEvent = async (eventData) => {
  try {
    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      start: {
        dateTime: eventData.startDateTime,
        timeZone: eventData.timeZone || 'America/Argentina/Buenos_Aires',
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: eventData.timeZone || 'America/Argentina/Buenos_Aires',
      },
      attendees: eventData.attendees || [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 día antes
          { method: 'popup', minutes: 60 }, // 1 hora antes
        ],
      },
    };

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all',
    });

    return { event: response.result, error: null };
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return { event: null, error: error.message };
  }
};

/**
 * Actualizar evento en Google Calendar
 */
export const updateGoogleEvent = async (eventId, eventData) => {
  try {
    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      start: {
        dateTime: eventData.startDateTime,
        timeZone: eventData.timeZone || 'America/Argentina/Buenos_Aires',
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: eventData.timeZone || 'America/Argentina/Buenos_Aires',
      },
    };

    const response = await window.gapi.client.calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: event,
      sendUpdates: 'all',
    });

    return { event: response.result, error: null };
  } catch (error) {
    console.error('Error updating Google Calendar event:', error);
    return { event: null, error: error.message };
  }
};

/**
 * Eliminar evento de Google Calendar
 */
export const deleteGoogleEvent = async (eventId) => {
  try {
    await window.gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'all',
    });

    return { error: null };
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    return { error: error.message };
  }
};

/**
 * Obtener eventos de Google Calendar
 */
export const getGoogleEvents = async (timeMin, timeMax) => {
  try {
    const response = await window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin,
      timeMax: timeMax,
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return { events: response.result.items, error: null };
  } catch (error) {
    console.error('Error getting Google Calendar events:', error);
    return { events: [], error: error.message };
  }
};

/**
 * Sincronizar reserva con Google Calendar
 */
export const syncBookingToGoogle = async (booking) => {
  try {
    const startDateTime = new Date(`${booking.date}T${booking.time}`);
    const endDateTime = new Date(startDateTime.getTime() + booking.duration * 60000);

    const eventData = {
      title: `${booking.productTitle || 'Clase'} - ${booking.studentName}`,
      description: `Clase con ${booking.teacherName}\n${booking.notes || ''}`,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      attendees: [
        { email: booking.studentEmail },
        { email: booking.teacherEmail },
      ],
    };

    const { event, error } = await createGoogleEvent(eventData);

    if (error) {
      return { googleEventId: null, error };
    }

    return { googleEventId: event.id, error: null };
  } catch (error) {
    console.error('Error syncing booking to Google:', error);
    return { googleEventId: null, error: error.message };
  }
};

/**
 * Actualizar evento de Google cuando se reprograma
 */
export const updateGoogleEventFromBooking = async (googleEventId, booking) => {
  try {
    const startDateTime = new Date(`${booking.date}T${booking.time}`);
    const endDateTime = new Date(startDateTime.getTime() + booking.duration * 60000);

    const eventData = {
      title: `${booking.productTitle || 'Clase'} - ${booking.studentName}`,
      description: `Clase con ${booking.teacherName}\n${booking.notes || ''}`,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    };

    return await updateGoogleEvent(googleEventId, eventData);
  } catch (error) {
    console.error('Error updating Google event:', error);
    return { event: null, error: error.message };
  }
};

/**
 * Eliminar evento de Google cuando se cancela
 */
export const deleteGoogleEventFromBooking = async (googleEventId) => {
  return await deleteGoogleEvent(googleEventId);
};
