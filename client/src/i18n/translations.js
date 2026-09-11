// Diccionario de textos estáticos del sitio, en español e inglés.
// Estructura en namespaces por sección para que coincida 1:1 con las
// secciones del boceto (nav, hero, tech, solutions, process, about,
// team, contact, ctaPrefooter, footer, common).
//
// Uso: const { t } = useLanguage(); t('hero.subtitle')

const es = {
  nav: {
    inicio: "Inicio",
    soluciones: "Soluciones",
    proceso: "Proceso",
    nosotros: "Nosotros",
    tecnologias: "Tecnologías",
    contacto: "Contacto",
    idioma: "Idioma",
  },

  hero: {
    badge: "4 developers · 1 misión",
    titlePart1: "Confianza,",
    titleHighlight: "profesionalismo",
    titlePart2: "y tecnología sin límites",
    subtitle:
      "Somos un equipo de 4 desarrolladores full stack. Construimos software de calidad internacional a precios competitivos, con la experiencia real de haber creado una plataforma editorial en producción.",
    ctaPrimary: "Ver soluciones",
    ctaSecondary: "Código revisado y probado",
    teamCaption: "4 amigos, un mismo objetivo: tu proyecto bien hecho.",
    browserUrl: "app.linkincode.dev/dashboard",
    deliveryTitle: "Entregas ágiles",
    deliverySubtitle: "Comunicación directa 24/7",
  },

  tech: {
    eyebrow: "Stack tecnológico",
    title: "Nuestras herramientas de mayor impacto",
    subtitle:
      "El core tecnológico con el que construimos productos reales y escalables.",
  },

  solutions: {
    eyebrow: "Servicios & Soluciones",
    title: "Todo lo que necesitás para crecer",
    subtitle:
      "Desde tu presencia online hasta sistemas de gestión a medida, con tecnología moderna y mantenible.",
    tabs: {
      landing: "Landing Pages",
      ecommerce: "E-commerce",
      api: "APIs & Backends",
      dashboard: "Dashboards",
      stock: "Control de Stock",
      staff: "Gestión de Personal",
      billing: "Facturación Digital",
    },
    moreCta: {
      text: "¿No encontraste lo que buscás? También hacemos desarrollo a medida.",
      button: "Contanos tu idea",
    },
    services: {
      landing: {
        badge: "Servicio 01",
        heading: "Landing Pages & Sitios Corporativos",
        description:
          "Diseñamos y desarrollamos sitios web profesionales que convierten visitantes en clientes. Optimizados para SEO, velocidad y dispositivos móviles.",
        bullets: [
          "Diseño responsive y moderno",
          "Optimización SEO y rendimiento",
          "Formularios de contacto y captación",
        ],
        cta: "Solicitar presupuesto",
      },
      ecommerce: {
        badge: "Servicio 02",
        heading: "E-commerce",
        description:
          "Tiendas online completas con carrito de compras, pasarelas de pago integradas y panel de administración de productos.",
        bullets: [
          "Carrito y checkout optimizado",
          "Integración con MercadoPago, Stripe, PayPal",
          "Gestión de inventario y pedidos",
        ],
        cta: "Solicitar presupuesto",
      },
      api: {
        badge: "Servicio 03",
        heading: "APIs REST & Backends",
        description:
          "Desarrollamos backends robustos y escalables para empresas que ya tienen su frontend o necesitan una API para sus aplicaciones.",
        bullets: [
          "Arquitectura RESTful documentada",
          "Autenticación JWT / OAuth",
          "Testing automatizado y CI/CD",
        ],
        cta: "Solicitar presupuesto",
      },
      dashboard: {
        badge: "Servicio 04",
        heading: "Dashboards & Paneles Admin",
        description:
          "Paneles de control personalizados para visualizar métricas, KPIs y datos de negocio en tiempo real.",
        bullets: [
          "Gráficos interactivos y reportes",
          "Roles de usuario y permisos",
          "Exportación de datos (PDF, Excel, CSV)",
        ],
        cta: "Solicitar presupuesto",
      },
      stock: {
        badge: "Módulo 01",
        heading: "Inventario en Tiempo Real",
        description:
          "Visualización completa de existencias, movimientos y alertas de reabastecimiento automáticas.",
        bullets: [
          "Alertas de stock mínimo automáticas",
          "Códigos de barra / QR",
          "Reportes exportables (PDF / Excel)",
        ],
        cta: "Quiero una demo de este módulo",
      },
      staff: {
        badge: "Módulo 02",
        heading: "Sistemas de Gestión Interna",
        description:
          "Administración jerárquica de usuarios con niveles de acceso granulares y logs de actividad.",
        bullets: [
          "Roles y permisos personalizados",
          "Autenticación con JWT / Firebase Auth",
          "Auditoría y control de asistencia",
        ],
        cta: "Quiero una demo de este módulo",
      },
      billing: {
        badge: "Módulo 03",
        heading: "Facturación y Finanzas",
        description:
          "Módulos de facturación con generación automática de comprobantes y reportes de ingresos.",
        bullets: [
          "Emisión automática de comprobantes",
          "Historial y búsqueda avanzada",
          "Exportación contable",
        ],
        cta: "Quiero una demo de este módulo",
      },
    },
    comingSoon: {
      title: "Simulador interactivo en camino",
      description:
        "Vas a poder previsualizar este servicio en vivo muy pronto.",
      badge: "Próximamente",
    },
    simulatorReady: {
      title: "Simulador interactivo disponible",
      description:
        "Probá este panel con datos de ejemplo, sin conexión a datos reales.",
      badge: "Demo disponible",
    },
    simulator: {
      previewLabel: "Vista previa",
      simulateBadge: "Tu marca aquí",
      simulateHeadlineDefault: "Impulsá tu negocio online",
      simulateDescription:
        "Landing page rápida, moderna y lista para convertir visitantes en clientes.",
      simulateButton: "Empezar ahora",
      simulateTrigger: "Simulá tu servicio",
      liveEditing: "Editando en vivo",
      fullscreenTitle: "Simulando en pantalla completa",
      resetLabel: "Reiniciar",
      exitLabel: "Salir del simulador",
      fullscreenLabel: "Pantalla completa",
      exitFullscreenLabel: "Salir de pantalla completa",
      inputLabel: "Título principal",
      inputPlaceholder: "Escribí tu propio título...",
      colorLabel: "Color de marca",
      bgColorLabel: "Color de fondo",
      subtitleLabel: "Subtítulo",
      subtitlePlaceholder: "Escribí una breve descripción...",
      ctaLabel: "Texto del botón",
      ctaPlaceholder: "Ej: Empezar ahora",
      disclaimer:
        "Simulación visual — no se envía ni almacena en nuestros servidores.",
      ecommerce: {
        clientName: "Nombre del cliente",
        placeholder: "Ej: Juan Pérez...",
        defaultStore: "Mi Tienda",
        add: "Agregar",
        cartSummary: "Resumen del carrito",
        products: {
          "prod-1": "Auriculares Inalámbricos",
          "prod-2": "Mochila Urbana",
          "prod-3": "Botella Térmica 1L",
          "prod-4": "Teclado Mecánico",
        },
      },
      dashboard: {
        rangeLabel: "Rango de fechas",
        updating: "Actualizando…",
        ranges: {
          "7d": "7 días",
          "30d": "30 días",
          "90d": "90 días",
          "12m": "12 meses",
        },
        kpis: {
          ventas: "Ventas",
          pedidos: "Pedidos",
          conversion: "Tasa de conversión",
          visitas: "Visitas",
        },
        categories: {
          electronica: "Electrónica",
          ropa: "Ropa",
          hogar: "Hogar",
          otros: "Otros",
        },
        charts: {
          salesVisits: "Ventas & Visitas",
          salesLegend: "Ventas ($)",
          visitsLegend: "Visitas",
          ordersByPeriod: "Pedidos por período",
          ordersLegend: "Pedidos",
          byCategory: "Ventas por categoría",
        },
        periods: {
          weekdays: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
          weeks: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
          quarterMonths: ["Mes 1", "Mes 2", "Mes 3"],
          monthsShort: [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic",
          ],
        },
        disclaimer:
          "Datos simulados con fines demostrativos — no representan información real ni se envían a ningún servidor.",
      },
      billing: {
        clientSection: "Cliente",
        clientNamePlaceholder: "Nombre o razón social",
        taxIdPlaceholder: "CUIT / DNI",
        taxConditions: {
          finalConsumer: "Consumidor final",
          registered: "Responsable inscripto",
          monotax: "Monotributista",
        },
        voucherSection: "Tipo de comprobante",
        invoiceLabel: "Factura",
        itemsSection: "Ítems",
        addItem: "+ agregar ítem",
        descriptionPlaceholder: "Descripción",
        pricePlaceholder: "Precio",
        removeItem: "Quitar ítem",
        subtotal: "Subtotal",
        vat: "IVA (21%)",
        total: "Total",
        errorMissingClient: "Falta el nombre o razón social del cliente.",
        errorMissingItems: "Revisá que todos los ítems tengan descripción y precio.",
        emitButton: "Emitir factura",
        authorizedBadge: "autorizada",
        caeLabel: "CAE",
        dueLabel: "Vence",
        newInvoice: "← nueva factura",
      },
      staff: {
        present: "Presente",
        absent: "Ausente",
        hoursShort: "hs",
        summary: {
          scheduledHours: "Horas programadas",
          workedHours: "Horas trabajadas",
          presentCount: "Presentes",
          attendance: "Asistencia",
        },
        roles: {
          ventas: "Ventas",
          deposito: "Depósito",
          atencion: "Atención al cliente",
          administracion: "Administración",
        },
        disclaimer:
          "Datos de personal simulados con fines demostrativos — no representan empleados reales ni se envían a ningún servidor.",
      },      
    },
  },

  process: {
    eyebrow: "Cómo trabajamos",
    title: "Un proceso simple y transparente",
    steps: [
      { title: "Reunión Diagnóstico", description: "Entendemos tu necesidad." },
      {
        title: "Propuesta y Diseño",
        description: "Definimos alcance, tiempos y presupuesto.",
      },
      {
        title: "Desarrollo e Implementación",
        description: "Creamos y lanzamos la solución.",
      },
      {
        title: "Capacitación y Soporte",
        description: "Te acompañamos en el uso.",
      },
    ],
  },

  about: {
    eyebrow: "Sobre nosotros",
    titlePart1: "Somos 4 amigos con un",
    titleHighlight: "mismo estándar",
    paragraph1:
      "Linkincode nació de la amistad y la pasión por construir software bien hecho. Nos diferenciamos por la comunicación directa y resultados tangibles desde el primer día.",
    paragraph2:
      "Nuestra experiencia real desarrollando infraestructura para una plataforma editorial nos permite afrontar cualquier desafío de escalabilidad con total seguridad.",
    stats: [
      { value: "4", label: "Devs Full Stack" },
      { value: "100%", label: "Código propio" },
      { value: "1", label: "Plataforma real en producción" },
    ],
    successCase: {
      badge: "Caso de éxito",
      text: "Desarrollamos y mantenemos una plataforma editorial real, gestionando miles de contenidos.",
    },
  },

  team: {
    eyebrow: "El equipo",
    title: "Las caras detrás del código",
    subtitle:
      "Cuatro perfiles, un mismo compromiso: entregar software confiable.",
    members: [
      {
        name: "Santiago Molina",
        role: "Backend & Arquitectura",
        bio: "APIs robustas y lógica de negocio a prueba de escalabilidad.",
      },
      {
        name: "Thomas Bretschneider",
        role: "Frontend & UI/UX",
        bio: "Interfaces claras y pensadas para una gran experiencia de usuario.",
      },
      {
        name: "Agustín Aparicio",
        role: "Full Stack & DevOps",
        bio: "Despliegues, integraciones y buenas prácticas de principio a fin.",
      },
      {
        name: "Ángel Berretta",
        role: "Full Stack & QA",
        bio: "Testing, calidad de código y experiencia de producto de punta a punta.",
      },
    ],
  },

  contact: {
    eyebrow: "Contacto",
    titlePart1: "Construyamos algo",
    titleHighlight: "extraordinario",
    subtitle:
      "Contanos sobre tu proyecto. Te respondemos en menos de 24 horas con una propuesta clara.",
    emailLabel: "Escríbenos",
    whatsappLabel: "WhatsApp",
    scopeLabel: "Alcance",
    scopeValue: "PyMEs y proyectos internacionales",
    form: {
      nameLabel: "Nombre completo",
      namePlaceholder: "Ej. Carlos Ruiz",
      emailLabel: "Email",
      emailPlaceholder: "carlos@empresa.com",
      projectTypeLabel: "Tipo de proyecto",
      projectTypePlaceholder: "Seleccioná una opción",
      projectTypeOptions: [
        "Landing Pages",
        "E-commerce",
        "APIs REST y Backends",
        "Dashboards y Paneles Admin",
        "Control de Stock",
        "Gestión de Personal",
        "Facturación Digital",
        "Proyecto a medida",
      ],
      messageLabel: "Mensaje",
      messagePlaceholder: "Contanos un poco sobre tu idea...",
      submit: "Enviar solicitud",
    },
    success: {
      title: "¡Mensaje enviado!",
      text: "Te vamos a responder a la brevedad. Gracias por confiar en Linkincode.",
    },
  },

  ctaPrefooter: {
    title: "¿Tenés una idea? Hagámosla realidad",
    subtitle:
      "Agenda una llamada gratuita de 20 minutos con nuestro equipo, sin compromiso.",
    button: "Agendar llamada",
  },

  footer: {
    description:
      "Estudio de 4 desarrolladores Full Stack. Construimos software confiable, escalable y con estándares internacionales.",
    availability: "Disponibles para nuevos proyectos",
    columns: {
      site: {
        title: "Sitio",
        links: ["Inicio", "Soluciones", "Proceso", "Nosotros", "Tecnologías"],
      },
      services: {
        title: "Servicios",
        links: [
          "Landing Pages",
          "E-commerce",
          "APIs REST",
          "Dashboards",
          "Proyecto a medida",
        ],
      },
      contact: {
        title: "Contacto",
        location: "Argentina · Trabajo 100% remoto",
      },
    },
    copyright: "Hecho con ♥ por 4 amigos developers.",
    legalLinks: ["Privacidad", "Términos", "Cookies"],
  },

  common: {
    openMenu: "Abrir menú",
    changeTheme: "Cambiar tema",
    contactWhatsapp: "Contactar por WhatsApp",
    backToTop: "Volver arriba",
  },
};

const en = {
  nav: {
    inicio: "Home",
    soluciones: "Solutions",
    proceso: "Process",
    nosotros: "About Us",
    tecnologias: "Technologies",
    contacto: "Contact",
    idioma: "Language",
  },

  hero: {
    badge: "4 developers · 1 mission",
    titlePart1: "Trust,",
    titleHighlight: "professionalism",
    titlePart2: "and technology without limits",
    subtitle:
      "We're a team of 4 full stack developers. We build internationally-grade software at competitive prices, backed by real experience building a publishing platform in production.",
    ctaPrimary: "See solutions",
    ctaSecondary: "Reviewed and tested code",
    teamCaption: "4 friends, one goal: your project done right.",
    browserUrl: "app.linkincode.dev/dashboard",
    deliveryTitle: "Agile delivery",
    deliverySubtitle: "Direct communication 24/7",
  },

  tech: {
    eyebrow: "Tech stack",
    title: "The tools that make the biggest impact",
    subtitle: "The technological core we use to build real, scalable products.",
  },

  solutions: {
    eyebrow: "Services & Solutions",
    title: "Everything you need to grow",
    subtitle:
      "From your online presence to custom management systems, built with modern, maintainable technology.",
    tabs: {
      landing: "Landing Pages",
      ecommerce: "E-commerce",
      api: "APIs & Backends",
      dashboard: "Dashboards",
      stock: "Stock Control",
      staff: "Staff Management",
      billing: "Digital Billing",
    },
    moreCta: {
      text: "Didn't find what you were looking for? We also build custom solutions.",
      button: "Tell us your idea",
    },
    services: {
      landing: {
        badge: "Service 01",
        heading: "Landing Pages & Corporate Sites",
        description:
          "We design and build professional websites that turn visitors into customers. Optimized for SEO, speed and mobile devices.",
        bullets: [
          "Modern, responsive design",
          "SEO and performance optimization",
          "Contact and lead-capture forms",
        ],
        cta: "Request a quote",
      },
      ecommerce: {
        badge: "Service 02",
        heading: "E-commerce",
        description:
          "Full online stores with a shopping cart, integrated payment gateways, and a product admin panel.",
        bullets: [
          "Optimized cart and checkout",
          "MercadoPago, Stripe, PayPal integration",
          "Inventory and order management",
        ],
        cta: "Request a quote",
      },
      api: {
        badge: "Service 03",
        heading: "REST APIs & Backends",
        description:
          "We build robust, scalable backends for companies that already have a frontend or need an API for their applications.",
        bullets: [
          "Documented RESTful architecture",
          "JWT / OAuth authentication",
          "Automated testing and CI/CD",
        ],
        cta: "Request a quote",
      },
      dashboard: {
        badge: "Service 04",
        heading: "Dashboards & Admin Panels",
        description:
          "Custom control panels to visualize metrics, KPIs and business data in real time.",
        bullets: [
          "Interactive charts and reports",
          "User roles and permissions",
          "Data export (PDF, Excel, CSV)",
        ],
        cta: "Request a quote",
      },
      stock: {
        badge: "Module 01",
        heading: "Real-Time Inventory",
        description:
          "Full visibility into stock levels, movements, and automatic restocking alerts.",
        bullets: [
          "Automatic low-stock alerts",
          "Barcode / QR codes",
          "Exportable reports (PDF / Excel)",
        ],
        cta: "Get a demo of this module",
      },
      staff: {
        badge: "Module 02",
        heading: "Internal Management Systems",
        description:
          "Hierarchical user administration with granular access levels and activity logs.",
        bullets: [
          "Custom roles and permissions",
          "JWT / Firebase Auth authentication",
          "Audit trail and attendance control",
        ],
        cta: "Get a demo of this module",
      },
      billing: {
        badge: "Module 03",
        heading: "Billing & Finance",
        description:
          "Billing modules with automatic invoice generation and revenue reports.",
        bullets: [
          "Automatic invoice issuance",
          "History and advanced search",
          "Accounting export",
        ],
        cta: "Get a demo of this module",
      },
    },
    comingSoon: {
      title: "Interactive simulator on its way",
      description: "You'll be able to preview this service live very soon.",
      badge: "Coming soon",
    },
    simulatorReady: {
      title: "Interactive simulator available",
      description: "Try this panel with sample data, no real data involved.",
      badge: "Demo available",
    },
    simulator: {
      previewLabel: "Preview",
      simulateBadge: "Your brand here",
      simulateHeadlineDefault: "Grow your business online",
      simulateDescription:
        "A fast, modern landing page ready to turn visitors into customers.",
      simulateButton: "Get started",
      simulateTrigger: "Simulate your service",
      liveEditing: "Editing live",
      fullscreenTitle: "Fullscreen simulation",
      resetLabel: "Reset",
      exitLabel: "Exit simulator",
      fullscreenLabel: "Fullscreen",
      exitFullscreenLabel: "Exit fullscreen",
      inputLabel: "Main headline",
      inputPlaceholder: "Write your own headline...",
      colorLabel: "Brand color",
      bgColorLabel: "Background color",
      subtitleLabel: "Subtitle",
      subtitlePlaceholder: "Write a short description...",
      ctaLabel: "Button text",
      ctaPlaceholder: "E.g: Get started",
      disclaimer:
        "Visual simulation — nothing is sent or stored on our servers.",
      ecommerce: {
        clientName: "Client name",
        placeholder: "E.g. John Doe...",
        defaultStore: "My Store",
        add: "Add to cart",
        cartSummary: "Cart summary",
        products: {
          "prod-1": "Wireless Headphones",
          "prod-2": "Urban Backpack",
          "prod-3": "Thermal Bottle 1L",
          "prod-4": "Mechanical Keyboard",
        },
      },
      dashboard: {
        rangeLabel: "Date range",
        updating: "Updating…",
        ranges: {
          "7d": "7 days",
          "30d": "30 days",
          "90d": "90 days",
          "12m": "12 months",
        },
        kpis: {
          ventas: "Sales",
          pedidos: "Orders",
          conversion: "Conversion rate",
          visitas: "Visits",
        },
        categories: {
          electronica: "Electronics",
          ropa: "Clothing",
          hogar: "Home",
          otros: "Other",
        },
        charts: {
          salesVisits: "Sales & Visits",
          salesLegend: "Sales ($)",
          visitsLegend: "Visits",
          ordersByPeriod: "Orders by period",
          ordersLegend: "Orders",
          byCategory: "Sales by category",
        },
        periods: {
          weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          weeks: ["Week 1", "Week 2", "Week 3", "Week 4"],
          quarterMonths: ["Month 1", "Month 2", "Month 3"],
          monthsShort: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
        disclaimer:
          "Simulated data for demonstration purposes only — it does not represent real information and is not sent to any server.",
      },
      billing: {
        clientSection: "Client",
        clientNamePlaceholder: "Full name or business name",
        taxIdPlaceholder: "Tax ID / CUIT",
        taxConditions: {
          finalConsumer: "Final consumer",
          registered: "Registered taxpayer",
          monotax: "Small taxpayer (Monotributo)",
        },
        voucherSection: "Voucher type",
        invoiceLabel: "Invoice",
        itemsSection: "Items",
        addItem: "+ add item",
        descriptionPlaceholder: "Description",
        pricePlaceholder: "Price",
        removeItem: "Remove item",
        subtotal: "Subtotal",
        vat: "VAT (21%)",
        total: "Total",
        errorMissingClient: "The client's name or business name is missing.",
        errorMissingItems: "Make sure every item has a description and a price.",
        emitButton: "Issue invoice",
        authorizedBadge: "authorized",
        caeLabel: "CAE",
        dueLabel: "Due date",
        newInvoice: "← new invoice",
      },
      staff: {
        present: "Present",
        absent: "Absent",
        hoursShort: "hrs",
        summary: {
          scheduledHours: "Scheduled hours",
          workedHours: "Worked hours",
          presentCount: "Present",
          attendance: "Attendance",
        },
        roles: {
          ventas: "Sales",
          deposito: "Warehouse",
          atencion: "Customer service",
          administracion: "Administration",
        },
        disclaimer:
          "Simulated staff data for demonstration purposes only — it does not represent real employees and is not sent to any server.",
      },      
    },
  },

  process: {
    eyebrow: "How we work",
    title: "A simple, transparent process",
    steps: [
      { title: "Discovery Call", description: "We understand what you need." },
      {
        title: "Proposal & Design",
        description: "We define scope, timeline and budget.",
      },
      {
        title: "Development & Implementation",
        description: "We build and launch the solution.",
      },
      {
        title: "Training & Support",
        description: "We support you along the way.",
      },
    ],
  },

  about: {
    eyebrow: "About us",
    titlePart1: "We're 4 friends with the",
    titleHighlight: "same standard",
    paragraph1:
      "Linkincode was born from friendship and a passion for building software the right way. We stand out through direct communication and tangible results from day one.",
    paragraph2:
      "Our real-world experience building infrastructure for a publishing platform lets us take on any scalability challenge with total confidence.",
    stats: [
      { value: "4", label: "Full Stack Devs" },
      { value: "100%", label: "Original code" },
      { value: "1", label: "Real platform in production" },
    ],
    successCase: {
      badge: "Success story",
      text: "We built and maintain a real publishing platform, managing thousands of pieces of content.",
    },
  },

  team: {
    eyebrow: "The team",
    title: "The faces behind the code",
    subtitle:
      "Four profiles, one shared commitment: delivering reliable software.",
    members: [
      {
        name: "Santiago Molina",
        role: "Backend & Architecture",
        bio: "Robust APIs and business logic built to scale.",
      },
      {
        name: "Thomas Bretschneider",
        role: "Frontend & UI/UX",
        bio: "Clear interfaces designed for a great user experience.",
      },
      {
        name: "Agustín Aparicio",
        role: "Full Stack & DevOps",
        bio: "Deployments, integrations, and best practices from start to finish.",
      },
      {
        name: "Ángel Berretta",
        role: "Full Stack & QA",
        bio: "Testing, code quality and end-to-end product experience.",
      },
    ],
  },

  contact: {
    eyebrow: "Contact",
    titlePart1: "Let's build something",
    titleHighlight: "extraordinary",
    subtitle:
      "Tell us about your project. We'll get back to you in under 24 hours with a clear proposal.",
    emailLabel: "Email us",
    whatsappLabel: "WhatsApp",
    scopeLabel: "Reach",
    scopeValue: "SMBs and international projects",
    form: {
      nameLabel: "Full name",
      namePlaceholder: "E.g. Carlos Ruiz",
      emailLabel: "Email",
      emailPlaceholder: "carlos@company.com",
      projectTypeLabel: "Project type",
      projectTypePlaceholder: "Select an option",
      projectTypeOptions: [
        "Landing Pages",
        "E-commerce",
        "REST APIs & Backends",
        "Dashboards & Admin Panels",
        "Stock Control",
        "Staff Management",
        "Digital Billing",
        "Custom project",
      ],
      messageLabel: "Message",
      messagePlaceholder: "Tell us a bit about your idea...",
      submit: "Send request",
    },
    success: {
      title: "Message sent!",
      text: "We'll get back to you shortly. Thanks for trusting Linkincode.",
    },
  },

  ctaPrefooter: {
    title: "Have an idea? Let's make it real",
    subtitle: "Book a free 20-minute call with our team, no strings attached.",
    button: "Book a call",
  },

  footer: {
    description:
      "A studio of 4 full stack developers. We build reliable, scalable software to international standards.",
    availability: "Available for new projects",
    columns: {
      site: {
        title: "Site",
        links: ["Home", "Solutions", "Process", "About Us", "Technologies"],
      },
      services: {
        title: "Services",
        links: [
          "Landing Pages",
          "E-commerce",
          "REST APIs",
          "Dashboards",
          "Custom project",
        ],
      },
      contact: {
        title: "Contact",
        location: "Argentina · 100% remote work",
      },
    },
    copyright: "Made with ♥ by 4 friends who happen to be developers.",
    legalLinks: ["Privacy", "Terms", "Cookies"],
  },

  common: {
    openMenu: "Open menu",
    changeTheme: "Switch theme",
    contactWhatsapp: "Contact via WhatsApp",
    backToTop: "Back to top",
  },
};

export const translations = { es, en };

export default translations;