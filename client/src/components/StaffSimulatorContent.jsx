import { useMemo, useState } from "react";
import useLanguage from "../hooks/useLanguage";
import { employees } from "../data/mock/employees";

const DAY_COUNT = 7;

// Todos presentes por defecto en cada día — el usuario marca ausencias.
function buildInitialAttendance() {
  const initial = {};
  for (let day = 0; day < DAY_COUNT; day++) {
    employees.forEach((emp) => {
      initial[`${day}-${emp.id}`] = true;
    });
  }
  return initial;
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function SummaryCard({ label, value, accent = false }) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-4 sm:p-5 flex flex-col gap-2 min-w-0">
      <span className="text-[11px] font-bold uppercase tracking-wider text-mute truncate">
        {label}
      </span>
      <span
        className={`font-display text-lg sm:text-2xl font-bold truncate ${
          accent ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function StaffSimulatorContent() {
  const { t } = useLanguage();
  const [activeDay, setActiveDay] = useState(0);
  const [attendance, setAttendance] = useState(buildInitialAttendance);

  // Reutilizamos los labels de días de semana del simulador de Dashboard
  // para no duplicar la misma lista en dos lugares del diccionario.
  const dayLabels = t("solutions.simulator.dashboard.periods.weekdays");
  const hoursShort = t("solutions.simulator.staff.hoursShort");

  const toggleAttendance = (employeeId) => {
    const key = `${activeDay}-${employeeId}`;
    setAttendance((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const summary = useMemo(() => {
    let scheduledHours = 0;
    let workedHours = 0;
    let presentCount = 0;

    employees.forEach((emp) => {
      scheduledHours += emp.shiftHours;
      if (attendance[`${activeDay}-${emp.id}`]) {
        workedHours += emp.shiftHours;
        presentCount += 1;
      }
    });

    const attendanceRate = employees.length
      ? Math.round((presentCount / employees.length) * 100)
      : 0;

    return { scheduledHours, workedHours, presentCount, attendanceRate };
  }, [attendance, activeDay]);

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Selector de día — mini calendario semanal */}
      <div className="flex flex-wrap gap-2">
        {dayLabels.map((label, index) => {
          const isActive = index === activeDay;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveDay(index)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                isActive
                  ? "bg-brand/15 border-brand text-brand"
                  : "bg-surface border-line text-mute hover:text-ink hover:border-brand/40"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Resumen — se recalcula en cada toggle */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard
          label={t("solutions.simulator.staff.summary.scheduledHours")}
          value={`${summary.scheduledHours} ${hoursShort}`}
        />
        <SummaryCard
          label={t("solutions.simulator.staff.summary.workedHours")}
          value={`${summary.workedHours} ${hoursShort}`}
          accent
        />
        <SummaryCard
          label={t("solutions.simulator.staff.summary.presentCount")}
          value={`${summary.presentCount}/${employees.length}`}
        />
        <SummaryCard
          label={t("solutions.simulator.staff.summary.attendance")}
          value={`${summary.attendanceRate}%`}
        />
      </div>

      {/* Lista de empleados — a propósito NO es una tabla, para que se lea
          bien en mobile (cada fila es una card apilable). */}
      <div className="flex flex-col gap-3">
        {employees.map((emp) => {
          const isPresent = attendance[`${activeDay}-${emp.id}`];
          return (
            <div
              key={emp.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface border border-line rounded-2xl p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center text-brand font-bold text-sm shrink-0">
                  {getInitials(emp.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {emp.name}
                  </p>
                  <p className="text-xs text-mute truncate">
                    {t(`solutions.simulator.staff.roles.${emp.roleId}`)} ·{" "}
                    {emp.shiftHours} {hoursShort}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleAttendance(emp.id)}
                className={`w-full sm:w-auto shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isPresent
                    ? "bg-accent/15 text-accent"
                    : "bg-red-400/10 text-red-400"
                }`}
              >
                <i
                  className={`fas ${isPresent ? "fa-check" : "fa-xmark"} mr-1.5`}
                  aria-hidden="true"
                />
                {isPresent
                  ? t("solutions.simulator.staff.present")
                  : t("solutions.simulator.staff.absent")}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-mute/70 text-center">
        {t("solutions.simulator.staff.disclaimer")}
      </p>
    </div>
  );
}

export default StaffSimulatorContent;