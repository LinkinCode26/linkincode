import {
  Globe,
  Store,
  Code,
  PieChart,
  Boxes,
  UserCog,
  Receipt,
} from "lucide-react";

export const SERVICES = [
  {
    id: "landing",
    icon: Globe,
    accent: "brand",
    tech: ["Next.js", "Tailwind CSS", "SEO"],
  },
  {
    id: "ecommerce",
    icon: Store,
    accent: "accent",
    tech: ["React", "Stripe", "MercadoPago"],
  },
  {
    id: "api",
    icon: Code,
    accent: "brand",
    tech: ["Node.js", "Express.js", "JWT"],
  },
  {
    id: "dashboard",
    icon: PieChart,
    accent: "accent",
    tech: ["React", "Recharts", "PostgreSQL"],
  },
  {
    id: "stock",
    icon: Boxes,
    accent: "brand",
    tech: ["Node.js", "PostgreSQL", "React"],
  },
  {
    id: "staff",
    icon: UserCog,
    accent: "accent",
    tech: ["JWT", "Firebase Auth", "Express.js"],
  },
  {
    id: "billing",
    icon: Receipt,
    accent: "brand",
    tech: ["Node.js", "Zod", "Prisma ORM"],
  },
];

export default SERVICES;
