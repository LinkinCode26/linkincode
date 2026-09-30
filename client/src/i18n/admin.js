// Textos del área de admin (login y panel). Se mezclan en translations.js
// bajo la clave `admin`, así que se usan como t('admin.login.title').

export const adminEs = {
  loading: "Cargando…",
  login: {
    title: "Iniciar sesión",
    subtitle: "Ingresá con tu cuenta de administrador.",
    emailLabel: "Email",
    emailPlaceholder: "admin@linkincode.dev",
    passwordLabel: "Contraseña",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    submit: "Ingresar",
    submitting: "Ingresando…",
    backToSite: "Volver al sitio",
    restricted: "Acceso solo para el equipo de Linkincode.",
    sessionExpired: "Tu sesión expiró. Ingresá de nuevo para continuar.",
    showcase: {
      title: "Seguí cada consulta desde que llega hasta que se cierra.",
      text: "Los pedidos del formulario de contacto quedan registrados con su estado: nuevo, contactado, ganado o perdido.",
    },
    validation: {
      emailRequired: "Ingresá tu email.",
      emailInvalid: "Ingresá un email válido, por ejemplo nombre@empresa.com.",
      passwordRequired: "Ingresá tu contraseña.",
    },
    errors: {
      invalid:
        "El email o la contraseña no coinciden. Revisá los datos e intentá de nuevo.",
      tooMany:
        "Hiciste demasiados intentos. Esperá 15 minutos antes de volver a probar.",
      network:
        "No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo.",
      generic: "No pudimos iniciar sesión. Intentá de nuevo en unos minutos.",
    },
  },
  dashboard: {
    title: "Panel de administración",
    signedInAs: "Sesión iniciada como",
    logout: "Cerrar sesión",
    leadsTitle: "Consultas recibidas",
    leads: {
      all: "Todos",
      servicesLabel: "Filtrar por servicio",
      statusLabel: "Estado",
      statusAll: "Todos los estados",
      status: {
        nuevo: "Nuevo",
        contactado: "Contactado",
        ganado: "Ganado",
        perdido: "Perdido",
      },
      empty: "No hay consultas que coincidan con estos filtros.",
      loadError: "No pudimos cargar las consultas.",
      retry: "Reintentar",
      updateError:
        "No pudimos actualizar el estado. Se restauró el valor anterior.",
      prev: "Anterior",
      next: "Siguiente",
      page: "Página",
      of: "de",
    },
  },
};

export const adminEn = {
  loading: "Loading…",
  login: {
    title: "Sign in",
    subtitle: "Use your administrator account to continue.",
    emailLabel: "Email",
    emailPlaceholder: "admin@linkincode.dev",
    passwordLabel: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submit: "Sign in",
    submitting: "Signing in…",
    backToSite: "Back to site",
    restricted: "Access restricted to the Linkincode team.",
    sessionExpired: "Your session expired. Sign in again to continue.",
    showcase: {
      title: "Follow every inquiry from the moment it arrives until it closes.",
      text: "Contact form requests are saved with a status: new, contacted, won or lost.",
    },
    validation: {
      emailRequired: "Enter your email.",
      emailInvalid: "Enter a valid email, for example name@company.com.",
      passwordRequired: "Enter your password.",
    },
    errors: {
      invalid:
        "The email and password don't match. Check your details and try again.",
      tooMany: "Too many attempts. Wait 15 minutes before trying again.",
      network:
        "We couldn't reach the server. Check your connection and try again.",
      generic: "We couldn't sign you in. Try again in a few minutes.",
    },
  },
  dashboard: {
    title: "Admin panel",
    signedInAs: "Signed in as",
    logout: "Sign out",
    leadsTitle: "Received inquiries",
    leads: {
      all: "All",
      servicesLabel: "Filter by service",
      statusLabel: "Status",
      statusAll: "All statuses",
      status: {
        nuevo: "New",
        contactado: "Contacted",
        ganado: "Won",
        perdido: "Lost",
      },
      empty: "No inquiries match these filters.",
      loadError: "We couldn't load the inquiries.",
      retry: "Try again",
      updateError: "We couldn't update the status. The previous value was restored.",
      prev: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
    },
  },
};
