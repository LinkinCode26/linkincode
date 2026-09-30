import { MessageSquare, PenTool, Laptop, GraduationCap } from "lucide-react";

export const COLOR_CLASSES = {
  brand: { dot: "bg-brand", iconBg: "bg-brand/15", iconText: "text-brand" },
  accent: { dot: "bg-accent", iconBg: "bg-accent/15", iconText: "text-accent" },
};

export const steps = [
  { number: 1, color: "brand", icon: MessageSquare },
  { number: 2, color: "accent", icon: PenTool },
  { number: 3, color: "brand", icon: Laptop },
  { number: 4, color: "accent", icon: GraduationCap },
];

export default steps;
