// Diccionario de textos estáticos del sitio, en español e inglés.
import { adminEs, adminEn } from "./admin.js";

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
    badge: "Estudio de Software - Argentina",
    titlePart1: "Software de",
    titleHighlight: "alto impacto",
    titlePart2: "para escalar tu negocio",
    subtitle:
      "Transformamos tus ideas en plataformas a medida, e-commerce y sistemas de gestión. Código robusto y diseño enfocado en multiplicar tus ventas y automatizar procesos.",
    ctaPrimary: "Ver soluciones",
    ctaSecondary: "Código revisado y probado",
    teamCaptionLead: "Un equipo, un objetivo:",
    teamCaptionPre: "tu",
    teamCaptionWords: ["sistema", "e-commerce", "software", "sitio web"],
    teamCaptionPost: "bien hecho.",
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
          "Tu tienda abierta 24/7. Gestioná productos, cobros y envíos desde un solo lugar para vender sin límites.",
        bullets: [
          "Carrito y checkout optimizado",
          "Integración con MercadoPago, Stripe, PayPal",
          "Gestión de inventario y pedidos",
        ],
        cta: "Solicitar presupuesto",
      },
      api: {
        badge: "Servicio 03",
        heading: "APIs REST & Integraciones",
        description:
          "¿Ya tenés tu sitio web o sistemas y necesitás conectar plataformas o integrar Mercado Pago? Desarrollamos backends robustos y automatizamos el intercambio de datos entre tus herramientas.",
        bullets: [
          "Integración de Mercado Pago en sitios web y tiendas online",
          "Conexión con sistemas de gestión o bases de datos externas",
          "Integración de APIs de terceros y servicios externos",
          "Automatización del intercambio de información entre plataformas",
        ],
        cta: "Solicitar presupuesto",
      },
      dashboard: {
        badge: "Servicio 04",
        heading: "Dashboards & Paneles Admin",
        description:
          "Paneles de control personalizados para visualizar métricas, KPIs y datos de negocio en real time.",
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
          "Controlá tu inventario en tiempo real, anticipá la demanda y olvidate de los quiebres de stock.",
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
          "Automatizá tu facturación y reducí el tiempo administrativo a la mitad con nuestro sistema de gestión.",
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
      names: {
        landing: "Simulador de Landing Pages",
        ecommerce: "Simulador de E-commerce",
        api: "Simulador de APIs & Backends",
        dashboard: "Simulador de Dashboards",
        stock: "Simulador de Control de Stock",
        staff: "Simulador de Gestión de Personal",
        billing: "Simulador de Facturación Digital",
      },
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
      api: {
        chooseEndpoint: "Elegí un endpoint",
        send: "Enviar solicitud",
        sending: "Enviando...",
        waiting: "Esperando respuesta del servidor...",
        placeholder:
          'Elegí un endpoint y tocá "Enviar solicitud" para ver la respuesta simulada.',
        headers: "Headers",
        body: "Body",
        disclaimer:
          "Simulación de respuestas — no se conecta a ningún backend real.",
      },
      stock: {
        units: "u.",
        products: {
          "prod-1": "Auriculares Inalámbricos",
          "prod-2": "Mochila Urbana",
          "prod-3": "Botella Térmica 1L",
          "prod-4": "Teclado Mecánico",
        },
      },
      disclaimer:
        "Funcionalidades con fines demostrativos — se adaptan y personalizan según las necesidades de cada cliente.",
      ecommerce: {
        clientName: "Nombre del cliente",
        placeholder: "Ej: Juan Pérez...",
        defaultStore: "Mi Tienda",
        add: "Agregar",
        cartSummary: "Resumen del carrito",
        emptyCart: "Agregá productos al carrito para simular una compra.",
        stockAvailable: "disponibles",
        outOfStock: "Sin stock",
        maxStockReached: "Stock máximo en carrito",
        nav: {
          ariaLabel: "Cambiar vista del simulador E-commerce",
          store: "Tienda Online",
          admin: "Panel Admin",
          ordersCounter: "Pedidos",
          cartCounter: "Carrito",
        },
        checkout: {
          payButton: "Pagar",
          readyHint:
            "Completá el pago simulado para generar el pedido en el Admin.",
          stepTitle: "Checkout simulado",
          backToCart: "Volver al carrito",
          buyerName: "Nombre del comprador",
          buyerNamePlaceholder: "Ej: Camila Rodríguez",
          buyerEmail: "Email de contacto",
          buyerEmailPlaceholder: "camila@ejemplo.com",
          guestCustomer: "Cliente Web",
          paymentMethodLabel: "Medio de pago",
          methods: {
            mercadopago: "Mercado Pago",
            card: "Tarjeta de crédito",
            transfer: "Transferencia",
          },
          totalLabel: "Total a pagar",
          cancel: "Cancelar",
          confirmButton: "Confirmar pago",
          confirmedTitle: "¡Compra confirmada!",
          confirmedSubtitle:
            "El pedido ya se registró en el Panel Admin y se descontó el stock.",
          orderLabel: "Pedido",
          buyerLabel: "Cliente",
          totalPaid: "Total abonado",
          continueShopping: "Seguir comprando",
          viewInAdmin: "Ver pedido en Admin",
        },
        admin: {
          navAriaLabel: "Secciones del panel de administración",
          tabs: {
            dashboard: "Dashboard",
            orders: "Pedidos",
            products: "Productos",
            customers: "Clientes",
            reports: "Informes",
          },
          newOrderBanner: "Nuevo pedido recibido desde la tienda online",
          viewOrdersCta: "Ver pedidos",
          recentOrdersTitle: "Pedidos sincronizados con la tienda",
          ordersWord: "pedidos",
          kpis: {
            revenue: "Facturación",
            orders: "Pedidos",
            customers: "Clientes",
            lowStock: "Stock bajo",
          },
          paymentStatuses: {
            paid: "Pagado",
            pending: "Pendiente",
          },
          dashboard: {
            sales: "Ventas de hoy",
            thisMonth: "Este mes",
            ordersReceived: "Pedidos recibidos",
            pendingPayments: "Pagos pendientes",
            toPrepare: "Por preparar",
            lowStock: "Stock bajo",
            chartTitle: "Evolución de ventas, últimos 7 días",
            salesSeries: "Ventas",
          },
        },
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
        errorMissingItems:
          "Revisá que todos los ítems tengan descripción y precio.",
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
        addEmployee: "Agregar empleado",
        searchPlaceholder: "Buscar por nombre o rol...",
        clearSearch: "Limpiar búsqueda",
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
        actions: {
          viewDetail: "Ver detalle",
          edit: "Editar",
          delete: "Dar de baja",
        },
        form: {
          createTitle: "Nuevo empleado",
          editTitle: "Editar empleado",
          nameLabel: "Nombre completo",
          namePlaceholder: "Ej: Valentina Gómez",
          roleLabel: "Rol / Área",
          hoursLabel: "Horas por turno",
          hoursPlaceholder: "Ej: 8",
          cancel: "Cancelar",
          saveCreate: "Guardar empleado",
          saveEdit: "Guardar cambios",
          errors: {
            nameRequired: "Ingresá el nombre del empleado.",
            nameMin: "El nombre debe tener al menos 2 caracteres.",
            roleRequired: "Seleccioná un rol válido.",
            hoursRequired: "Ingresá las horas del turno.",
            hoursRange: "Las horas deben estar entre 1 y 24.",
          },
        },
        deleteConfirm: {
          question: "¿Dar de baja a",
          cancel: "Cancelar",
          confirm: "Confirmar baja",
        },
        detail: {
          title: "Ficha del empleado",
          role: "Rol",
          dailyShift: "Jornada diaria",
          weeklyWorked: "Horas semanales trabajadas",
          weeklyAttendance: "Asistencia semanal",
          dailyStatus: "Asistencia por día (clic para alternar)",
          close: "Cerrar ficha",
        },
        empty: {
          title: "No hay empleados en la nómina",
          description:
            "Agregá un nuevo empleado para gestionar turnos y asistencias, o usá Reiniciar arriba para restaurar la lista inicial.",
          cta: "Agregar primer empleado",
          noResultsTitle: "Sin coincidencias",
          noResultsDescription:
            "No encontramos empleados que coincidan con tu búsqueda.",
        },
        disclaimer:
          "Datos de personal simulados con fines demostrativos — no representan empleados reales ni se envían a ningún servidor.",
      },
    },
  },

  process: {
    eyebrow: "Cómo trabajamos",
    title: "De tu idea al lanzamiento en 4 pasos",
    steps: [
      {
        title: "Reunión de diagnóstico",
        description:
          "Escuchamos tu idea, entendemos tu negocio y definimos qué problema hay que resolver.",
      },
      {
        title: "Propuesta y diseño",
        description:
          "Definimos alcance, tiempos y presupuesto, y diseñamos la solución antes de escribir código.",
      },
      {
        title: "Desarrollo e implementación",
        description:
          "Construimos por etapas y te mostramos avances. Todo se revisa y se prueba antes de lanzar.",
      },
      {
        title: "Lanzamiento y soporte",
        description:
          "Ponemos todo en línea, te enseñamos a usarlo y seguimos disponibles para dudas y ajustes.",
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

  testimonials: {
    eyebrow: "Testimonios",
    title: "Lo que dicen de",
    highlight: "nosotros",
    subtitle:
      "Empresas y emprendedores que confiaron en nuestro código y metodología.",
    items: [
      {
        name: "Ariadna Rivarola",
        role: "Fundadora de Margarita By Ari",
        content:
          "El equipo entendió a la perfección lo que necesitaba para mi marca. Ahora tengo una plataforma súper rápida y el diseño es exactamente lo que buscaba. ¡Súper recomendados!",
        image: "", // Agustín aqui pone la foto ej: "/images/ariadna.jpg"
      },
      {
        name: "Daniela Salvatierra",
        role: "Directora en EMUNA",
        content:
          "Trabajar con LinkinCode fue un alivio. Automatizaron nuestros procesos y la comunicación fue excelente en cada etapa del desarrollo. Son profesionales de primer nivel.",
        image: "",
      },
      {
        name: "Nicolas Cantone",
        role: "Creador de Chizato Zone",
        content:
          "Necesitaba un sistema robusto y escalable, y superaron mis expectativas. El código es impecable y el soporte post-lanzamiento me dio muchísima tranquilidad.",
        image: "",
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
      phoneCodeLabel: "Cód.",
      phoneLabel: "WhatsApp / Teléfono",
      phonePlaceholder: "Ej. 11 1234 5678",
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
    copyright: "Todos los derechos reservados.",
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
    badge: "Software Studio - Argentina",
    titlePart1: "High-impact",
    titleHighlight: "software",
    titlePart2: "to scale your business",
    subtitle:
      "We transform your ideas into custom platforms, e-commerce, and management systems. Robust code and design focused on multiplying your sales and automating your processes.",
    ctaPrimary: "See solutions",
    ctaSecondary: "Reviewed and tested code",
    teamCaptionLead: "One team, one goal:",
    teamCaptionPre: "your",
    teamCaptionWords: ["system", "e-commerce", "software", "website"],
    teamCaptionPost: "done right.",
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
          "Your store open 24/7. Manage products, payments, and shipping from a single place to sell without limits.",
        bullets: [
          "Optimized cart and checkout",
          "MercadoPago, Stripe, PayPal integration",
          "Inventory and order management",
        ],
        cta: "Request a quote",
      },
      api: {
        badge: "Service 03",
        heading: "REST APIs & Integrations",
        description:
          "Already have a website or systems and need to connect platforms or integrate Mercado Pago? We build robust backends and automate data exchange across your workflows.",
        bullets: [
          "Mercado Pago integration for websites and online stores",
          "Connection with management systems or external databases",
          "Third-party API and external service integration",
          "Automated cross-platform data exchange",
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
          "Control your inventory in real-time, anticipate demand, and forget about stockouts.",
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
          "Automate your invoicing and cut administrative time in half with our management system.",
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
      names: {
        landing: "Landing Pages Simulator",
        ecommerce: "E-commerce Simulator",
        api: "APIs & Backends Simulator",
        dashboard: "Dashboards Simulator",
        stock: "Stock Control Simulator",
        staff: "Staff Management Simulator",
        billing: "Digital Billing Simulator",
      },
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
      api: {
        chooseEndpoint: "Choose an endpoint",
        send: "Send request",
        sending: "Sending...",
        waiting: "Waiting for server response...",
        placeholder:
          'Pick an endpoint and tap "Send request" to see the simulated response.',
        headers: "Headers",
        body: "Body",
        disclaimer: "Simulated responses — not connected to any real backend.",
      },
      stock: {
        units: "units",
        products: {
          "prod-1": "Wireless Headphones",
          "prod-2": "Urban Backpack",
          "prod-3": "Thermal Bottle 1L",
          "prod-4": "Mechanical Keyboard",
        },
      },
      disclaimer:
        "Demonstration features — fully adaptable and customizable to each client's needs.",
      ecommerce: {
        clientName: "Client name",
        placeholder: "E.g. John Doe...",
        defaultStore: "My Store",
        add: "Add to cart",
        cartSummary: "Cart summary",
        emptyCart: "Add products to the cart to simulate a purchase.",
        stockAvailable: "available",
        outOfStock: "Out of stock",
        maxStockReached: "Max stock in cart",
        nav: {
          ariaLabel: "Switch E-commerce simulator view",
          store: "Online Store",
          admin: "Admin Panel",
          ordersCounter: "Orders",
          cartCounter: "Cart",
        },
        checkout: {
          payButton: "Checkout",
          readyHint: "Complete simulated payment to create the order in Admin.",
          stepTitle: "Simulated checkout",
          backToCart: "Back to cart",
          buyerName: "Buyer name",
          buyerNamePlaceholder: "E.g. Sarah Connor",
          buyerEmail: "Contact email",
          buyerEmailPlaceholder: "sarah@example.com",
          guestCustomer: "Web Customer",
          paymentMethodLabel: "Payment method",
          methods: {
            mercadopago: "Mercado Pago",
            card: "Credit card",
            transfer: "Bank transfer",
          },
          totalLabel: "Total to pay",
          cancel: "Cancel",
          confirmButton: "Confirm payment",
          confirmedTitle: "Purchase confirmed!",
          confirmedSubtitle:
            "The order was recorded in the Admin Panel and stock was updated.",
          orderLabel: "Order",
          buyerLabel: "Customer",
          totalPaid: "Total paid",
          continueShopping: "Continue shopping",
          viewInAdmin: "View order in Admin",
        },
        admin: {
          navAriaLabel: "Admin panel sections",
          tabs: {
            dashboard: "Dashboard",
            orders: "Orders",
            products: "Products",
            customers: "Customers",
            reports: "Reports",
          },
          newOrderBanner: "New order received from the online store",
          viewOrdersCta: "View orders",
          recentOrdersTitle: "Orders synced with the storefront",
          ordersWord: "orders",
          kpis: {
            revenue: "Revenue",
            orders: "Orders",
            customers: "Customers",
            lowStock: "Low stock",
          },
          paymentStatuses: {
            paid: "Paid",
            pending: "Pending",
          },
          dashboard: {
            sales: "Sales today",
            thisMonth: "This month",
            ordersReceived: "Orders received",
            pendingPayments: "Pending payments",
            toPrepare: "To prepare",
            lowStock: "Low stock",
            chartTitle: "Sales trend, last 7 days",
            salesSeries: "Sales",
          },
        },
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
        errorMissingItems:
          "Make sure every item has a description and a price.",
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
        addEmployee: "Add employee",
        searchPlaceholder: "Search by name or role...",
        clearSearch: "Clear search",
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
        actions: {
          viewDetail: "View details",
          edit: "Edit",
          delete: "Remove",
        },
        form: {
          createTitle: "New employee",
          editTitle: "Edit employee",
          nameLabel: "Full name",
          namePlaceholder: "E.g. Sarah Connor",
          roleLabel: "Role / Department",
          hoursLabel: "Shift hours",
          hoursPlaceholder: "E.g. 8",
          cancel: "Cancel",
          saveCreate: "Save employee",
          saveEdit: "Save changes",
          errors: {
            nameRequired: "Please enter the employee's name.",
            nameMin: "Name must be at least 2 characters long.",
            roleRequired: "Please select a valid role.",
            hoursRequired: "Please enter the shift hours.",
            hoursRange: "Hours must be between 1 and 24.",
          },
        },
        deleteConfirm: {
          question: "Remove",
          cancel: "Cancel",
          confirm: "Confirm removal",
        },
        detail: {
          title: "Employee details",
          role: "Role",
          dailyShift: "Daily shift",
          weeklyWorked: "Weekly worked hours",
          weeklyAttendance: "Weekly attendance",
          dailyStatus: "Daily attendance (click to toggle)",
          close: "Close details",
        },
        empty: {
          title: "No employees in the roster",
          description:
            "Add a new employee to manage shifts and attendance, or click Reset above to restore the initial list.",
          cta: "Add first employee",
          noResultsTitle: "No matching employees",
          noResultsDescription:
            "We couldn't find any employees matching your search.",
        },
        disclaimer:
          "Simulated staff data for demonstration purposes only — it does not represent real employees and is not sent to any server.",
      },
    },
  },

  process: {
    eyebrow: "How we work",
    title: "From idea to launch in 4 steps",
    steps: [
      {
        title: "Discovery call",
        description:
          "We listen to your idea, understand your business and define the problem to solve.",
      },
      {
        title: "Proposal & design",
        description:
          "We define scope, timeline and budget, and design the solution before writing code.",
      },
      {
        title: "Development & implementation",
        description:
          "We build in stages and show you progress along the way. Everything is reviewed and tested before launch.",
      },
      {
        title: "Launch & support",
        description:
          "We put everything online, show you how to use it and stay available for questions and adjustments.",
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

  testimonials: {
    eyebrow: "Testimonials",
    title: "What they say about",
    highlight: "us",
    subtitle:
      "Companies and entrepreneurs who trusted our code and methodology.",
    items: [
      {
        name: "Ariadna Rivarola",
        role: "Founder at Margarita By Ari",
        content:
          "The team perfectly understood what my brand needed. Now I have a super fast platform and the design is exactly what I was looking for. Highly recommended!",
        image: "",
      },
      {
        name: "Daniela Salvatierra",
        role: "Director at EMUNA",
        content:
          "Working with LinkinCode was a relief. They automated our processes and communication was excellent at every stage of development. Top-tier professionals.",
        image: "",
      },
      {
        name: "Nicolas Cantone",
        role: "Creator of Chizato Zone",
        content:
          "I needed a robust and scalable system, and they exceeded my expectations. The code is flawless and the post-launch support gave me great peace of mind.",
        image: "",
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
      phoneCodeLabel: "Code",
      phoneLabel: "WhatsApp / Phone",
      phonePlaceholder: "E.g. 11 1234 5678",
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
    copyright: "All rights reserved.",
    legalLinks: ["Privacy", "Terms", "Cookies"],
  },

  common: {
    openMenu: "Open menu",
    changeTheme: "Switch theme",
    contactWhatsapp: "Contact via WhatsApp",
    backToTop: "Back to top",
  },
};

export const translations = {
  es: { ...es, admin: adminEs },
  en: { ...en, admin: adminEn },
};

export default translations;
