import { useMemo, useState } from "react";
import useLanguage from "../hooks/useLanguage";
import { employees as initialEmployees } from "../data/mock/employees";
import {
  Check,
  X,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Users,
} from "lucide-react";

const DAY_COUNT = 7;
const ROLE_IDS = ["ventas", "deposito", "atencion", "administracion"];

const EMPTY_FORM = {
  name: "",
  roleId: "ventas",
  shiftHours: "8",
};

// Todos presentes por defecto en cada día — el usuario marca ausencias.
function buildInitialAttendance(list) {
  const initial = {};
  for (let day = 0; day < DAY_COUNT; day++) {
    list.forEach((emp) => {
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

  const [staffList, setStaffList] = useState(() =>
    initialEmployees.map((emp) => ({ ...emp })),
  );
  const [activeDay, setActiveDay] = useState(0);
  const [attendance, setAttendance] = useState(() =>
    buildInitialAttendance(initialEmployees),
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Estado del formulario de Alta / Edición (LC-006)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Estado de Baja con confirmación y Vista de Detalle (LC-007)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const dayLabels = t("solutions.simulator.dashboard.periods.weekdays");
  const hoursShort = t("solutions.simulator.staff.hoursShort");

  const toggleAttendance = (employeeId, dayIndex = activeDay) => {
    const key = `${dayIndex}-${employeeId}`;
    setAttendance((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Resumen diario recalculado dinámicamente (incluye estado vacío con 0 empleados)
  const summary = useMemo(() => {
    let scheduledHours = 0;
    let workedHours = 0;
    let presentCount = 0;

    staffList.forEach((emp) => {
      scheduledHours += emp.shiftHours;
      if (attendance[`${activeDay}-${emp.id}`]) {
        workedHours += emp.shiftHours;
        presentCount += 1;
      }
    });

    const attendanceRate = staffList.length
      ? Math.round((presentCount / staffList.length) * 100)
      : 0;

    return { scheduledHours, workedHours, presentCount, attendanceRate };
  }, [staffList, attendance, activeDay]);

  // Filtro por nombre o rol traducido (LC-007)
  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return staffList;

    return staffList.filter((emp) => {
      const roleLabel = String(
        t(`solutions.simulator.staff.roles.${emp.roleId}`),
      ).toLowerCase();
      return (
        emp.name.toLowerCase().includes(query) || roleLabel.includes(query)
      );
    });
  }, [staffList, searchQuery, t]);

  const selectedEmployee = useMemo(
    () => staffList.find((emp) => emp.id === selectedEmployeeId) || null,
    [staffList, selectedEmployeeId],
  );

  // Handlers de formulario (Alta y Edición)
  const openCreateForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setConfirmDeleteId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (emp) => {
    setEditingId(emp.id);
    setFormData({
      name: emp.name,
      roleId: emp.roleId,
      shiftHours: String(emp.shiftHours),
    });
    setFormErrors({});
    setConfirmDeleteId(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      errors.name = t("solutions.simulator.staff.form.errors.nameRequired");
    } else if (trimmedName.length < 2) {
      errors.name = t("solutions.simulator.staff.form.errors.nameMin");
    }

    if (!ROLE_IDS.includes(formData.roleId)) {
      errors.roleId = t("solutions.simulator.staff.form.errors.roleRequired");
    }

    if (formData.shiftHours === "" || formData.shiftHours === null) {
      errors.shiftHours = t(
        "solutions.simulator.staff.form.errors.hoursRequired",
      );
    } else {
      const parsedHours = Number(formData.shiftHours);
      if (
        !Number.isFinite(parsedHours) ||
        parsedHours < 1 ||
        parsedHours > 24
      ) {
        errors.shiftHours = t(
          "solutions.simulator.staff.form.errors.hoursRange",
        );
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const cleanName = formData.name.trim();
    const cleanHours = Math.round(Number(formData.shiftHours) * 10) / 10;

    if (editingId) {
      setStaffList((prev) =>
        prev.map((emp) =>
          emp.id === editingId
            ? {
                ...emp,
                name: cleanName,
                roleId: formData.roleId,
                shiftHours: cleanHours,
              }
            : emp,
        ),
      );
    } else {
      const newId = `emp-${Date.now()}`;
      const newEmployee = {
        id: newId,
        name: cleanName,
        roleId: formData.roleId,
        shiftHours: cleanHours,
      };

      setStaffList((prev) => [newEmployee, ...prev]);
      setAttendance((prev) => {
        const next = { ...prev };
        for (let day = 0; day < DAY_COUNT; day++) {
          next[`${day}-${newId}`] = true;
        }
        return next;
      });
    }

    closeForm();
  };

  // Handler de baja confirmada (LC-007)
  const handleConfirmDelete = (employeeId) => {
    setStaffList((prev) => prev.filter((emp) => emp.id !== employeeId));
    setConfirmDeleteId(null);
    if (selectedEmployeeId === employeeId) {
      setSelectedEmployeeId(null);
    }
    if (editingId === employeeId) {
      closeForm();
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Barra superior: Buscador + Botón Alta de empleado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-0">
          <Search
            className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("solutions.simulator.staff.searchPlaceholder")}
            aria-label={t("solutions.simulator.staff.searchPlaceholder")}
            className="w-full bg-surface border border-line-strong rounded-xl pl-10 pr-9 py-2.5 text-sm text-ink placeholder:text-mute/70 focus:outline-none focus:border-brand transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label={t("solutions.simulator.staff.clearSearch")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-mute hover:text-ink transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer shadow-sm"
        >
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          {t("solutions.simulator.staff.addEmployee")}
        </button>
      </div>

      {/* Formulario de Alta / Edición de empleado (LC-006) */}
      {isFormOpen && (
        <form
          onSubmit={handleFormSubmit}
          noValidate
          className="bg-surface border border-brand/40 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-display text-sm font-bold text-ink">
              {editingId
                ? t("solutions.simulator.staff.form.editTitle")
                : t("solutions.simulator.staff.form.createTitle")}
            </h4>
            <button
              type="button"
              onClick={closeForm}
              aria-label={t("solutions.simulator.staff.form.cancel")}
              className="p-1 text-mute hover:text-ink transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Nombre */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="staff-form-name"
                className="text-xs font-semibold text-mute"
              >
                {t("solutions.simulator.staff.form.nameLabel")}
              </label>
              <input
                id="staff-form-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder={t(
                  "solutions.simulator.staff.form.namePlaceholder",
                )}
                aria-invalid={Boolean(formErrors.name)}
                className="w-full bg-bg border border-line-strong rounded-xl px-3.5 py-2 text-sm text-ink placeholder:text-mute/70 focus:outline-none focus:border-brand transition-colors"
              />
              {formErrors.name && (
                <span className="text-[11px] font-medium text-red-400 [[data-theme=light]_&]:text-red-700">
                  {formErrors.name}
                </span>
              )}
            </div>

            {/* Rol */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="staff-form-role"
                className="text-xs font-semibold text-mute"
              >
                {t("solutions.simulator.staff.form.roleLabel")}
              </label>
              <select
                id="staff-form-role"
                value={formData.roleId}
                onChange={(e) => handleFieldChange("roleId", e.target.value)}
                aria-invalid={Boolean(formErrors.roleId)}
                className="w-full bg-bg border border-line-strong rounded-xl px-3.5 py-2 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
              >
                {ROLE_IDS.map((roleId) => (
                  <option key={roleId} value={roleId}>
                    {t(`solutions.simulator.staff.roles.${roleId}`)}
                  </option>
                ))}
              </select>
              {formErrors.roleId && (
                <span className="text-[11px] font-medium text-red-400 [[data-theme=light]_&]:text-red-700">
                  {formErrors.roleId}
                </span>
              )}
            </div>

            {/* Horas por turno */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="staff-form-hours"
                className="text-xs font-semibold text-mute"
              >
                {t("solutions.simulator.staff.form.hoursLabel")}
              </label>
              <input
                id="staff-form-hours"
                type="number"
                min="1"
                max="24"
                step="1"
                value={formData.shiftHours}
                onChange={(e) =>
                  handleFieldChange("shiftHours", e.target.value)
                }
                placeholder={t(
                  "solutions.simulator.staff.form.hoursPlaceholder",
                )}
                aria-invalid={Boolean(formErrors.shiftHours)}
                className="w-full bg-bg border border-line-strong rounded-xl px-3.5 py-2 text-sm text-ink placeholder:text-mute/70 focus:outline-none focus:border-brand transition-colors"
              />
              {formErrors.shiftHours && (
                <span className="text-[11px] font-medium text-red-400 [[data-theme=light]_&]:text-red-700">
                  {formErrors.shiftHours}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={closeForm}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-line-strong text-xs font-bold uppercase tracking-wider text-mute hover:text-ink transition-colors cursor-pointer"
            >
              {t("solutions.simulator.staff.form.cancel")}
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
            >
              {editingId
                ? t("solutions.simulator.staff.form.saveEdit")
                : t("solutions.simulator.staff.form.saveCreate")}
            </button>
          </div>
        </form>
      )}

      {/* Selector de día — mini calendario semanal */}
      <div className="flex flex-wrap gap-2">
        {dayLabels.map((label, index) => {
          const isActive = index === activeDay;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveDay(index)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                isActive
                  ? "bg-brand/15 border-brand text-brand"
                  : "bg-surface border-line-strong text-mute hover:text-ink hover:border-brand/40"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Resumen — se recalcula en cada toggle, alta, edición o baja */}
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
          value={`${summary.presentCount}/${staffList.length}`}
        />
        <SummaryCard
          label={t("solutions.simulator.staff.summary.attendance")}
          value={`${summary.attendanceRate}%`}
        />
      </div>

      {/* Vista de detalle por empleado (LC-007) */}
      {selectedEmployee && (
        <div className="bg-surface border border-brand/40 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-brand/15 flex items-center justify-center text-brand font-bold text-sm shrink-0">
                {getInitials(selectedEmployee.name)}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                  {t("solutions.simulator.staff.detail.title")}
                </span>
                <h4 className="font-display text-base font-bold text-ink truncate">
                  {selectedEmployee.name}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedEmployeeId(null)}
              aria-label={t("solutions.simulator.staff.detail.close")}
              className="p-1.5 rounded-lg text-mute hover:text-ink hover:bg-bg transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {(() => {
            let presentDays = 0;
            for (let d = 0; d < DAY_COUNT; d++) {
              if (attendance[`${d}-${selectedEmployee.id}`]) {
                presentDays += 1;
              }
            }
            const weeklyScheduled = selectedEmployee.shiftHours * DAY_COUNT;
            const weeklyWorked = selectedEmployee.shiftHours * presentDays;
            const weeklyRate = Math.round((presentDays / DAY_COUNT) * 100);

            return (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-bg border border-line rounded-xl p-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-mute">
                      {t("solutions.simulator.staff.detail.role")}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-ink">
                      {t(
                        `solutions.simulator.staff.roles.${selectedEmployee.roleId}`,
                      )}
                    </span>
                  </div>
                  <div className="bg-bg border border-line rounded-xl p-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-mute">
                      {t("solutions.simulator.staff.detail.dailyShift")}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-ink">
                      {selectedEmployee.shiftHours} {hoursShort}
                    </span>
                  </div>
                  <div className="bg-bg border border-line rounded-xl p-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-mute">
                      {t("solutions.simulator.staff.detail.weeklyWorked")}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-accent">
                      {weeklyWorked}/{weeklyScheduled} {hoursShort}
                    </span>
                  </div>
                  <div className="bg-bg border border-line rounded-xl p-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-mute">
                      {t("solutions.simulator.staff.detail.weeklyAttendance")}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-ink">
                      {weeklyRate}% ({presentDays}/{DAY_COUNT})
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-mute">
                    {t("solutions.simulator.staff.detail.dailyStatus")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {dayLabels.map((label, dayIdx) => {
                      const isDayPresent =
                        attendance[`${dayIdx}-${selectedEmployee.id}`];
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() =>
                            toggleAttendance(selectedEmployee.id, dayIdx)
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                            isDayPresent
                              ? "bg-accent/15 border-accent/30 text-accent"
                              : "bg-red-400/10 border-red-400/30 text-red-400 [[data-theme=light]_&]:text-red-700"
                          }`}
                        >
                          {isDayPresent ? (
                            <Check className="w-3 h-3" aria-hidden="true" />
                          ) : (
                            <X className="w-3 h-3" aria-hidden="true" />
                          )}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Lista de empleados o Estados Vacíos (LC-007) */}
      {staffList.length === 0 ? (
        <div className="bg-surface border border-dashed border-line-strong rounded-2xl p-8 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand/15 text-brand flex items-center justify-center">
            <Users className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="max-w-md space-y-1">
            <h4 className="font-display text-base font-bold text-ink">
              {t("solutions.simulator.staff.empty.title")}
            </h4>
            <p className="text-xs sm:text-sm text-mute">
              {t("solutions.simulator.staff.empty.description")}
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="mt-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            {t("solutions.simulator.staff.empty.cta")}
          </button>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-surface border border-dashed border-line-strong rounded-2xl p-8 text-center flex flex-col items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand/15 text-brand flex items-center justify-center">
            <Search className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="max-w-md space-y-1">
            <h4 className="font-display text-base font-bold text-ink">
              {t("solutions.simulator.staff.empty.noResultsTitle")}
            </h4>
            <p className="text-xs sm:text-sm text-mute">
              {t("solutions.simulator.staff.empty.noResultsDescription")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-1 px-4 py-2 rounded-xl border border-line-strong text-xs font-bold uppercase tracking-wider text-ink hover:border-brand transition-colors cursor-pointer"
          >
            {t("solutions.simulator.staff.clearSearch")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredEmployees.map((emp) => {
            const isPresent = attendance[`${activeDay}-${emp.id}`];
            const isConfirmingDelete = confirmDeleteId === emp.id;
            const isSelected = selectedEmployeeId === emp.id;

            return (
              <div
                key={emp.id}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface border rounded-2xl p-4 transition-colors ${
                  isSelected ? "border-brand" : "border-line"
                }`}
              >
                {/* Datos del empleado — clic abre/cierra vista de detalle */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedEmployeeId((prev) =>
                      prev === emp.id ? null : emp.id,
                    )
                  }
                  className="flex items-center gap-3 min-w-0 text-left cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center text-brand font-bold text-sm shrink-0">
                    {getInitials(emp.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink truncate group-hover:text-brand transition-colors">
                      {emp.name}
                    </p>
                    <p className="text-xs text-mute truncate">
                      {t(`solutions.simulator.staff.roles.${emp.roleId}`)} ·{" "}
                      {emp.shiftHours} {hoursShort}
                    </p>
                  </div>
                </button>

                {/* Acciones: Confirmación de baja O botones normales */}
                {isConfirmingDelete ? (
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-line">
                    <span className="text-xs font-semibold text-ink mr-1">
                      {t("solutions.simulator.staff.deleteConfirm.question")}{" "}
                      <strong>{emp.name}</strong>?
                    </span>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1.5 rounded-xl border border-line-strong text-xs font-bold uppercase tracking-wider text-mute hover:text-ink transition-colors cursor-pointer"
                    >
                      {t("solutions.simulator.staff.deleteConfirm.cancel")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmDelete(emp.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 [[data-theme=light]_&]:text-red-700 text-xs font-bold uppercase tracking-wider hover:bg-red-500/25 transition-colors cursor-pointer"
                    >
                      {t("solutions.simulator.staff.deleteConfirm.confirm")}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-line shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleAttendance(emp.id)}
                      className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isPresent
                          ? "bg-accent/15 text-accent"
                          : "bg-red-400/10 text-red-400 [[data-theme=light]_&]:text-red-700"
                      }`}
                    >
                      {isPresent ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {isPresent
                        ? t("solutions.simulator.staff.present")
                        : t("solutions.simulator.staff.absent")}
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedEmployeeId((prev) =>
                            prev === emp.id ? null : emp.id,
                          )
                        }
                        aria-label={t(
                          "solutions.simulator.staff.actions.viewDetail",
                        )}
                        title={t(
                          "solutions.simulator.staff.actions.viewDetail",
                        )}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-brand/15 border-brand text-brand"
                            : "bg-bg border-line-strong text-mute hover:text-ink hover:border-brand/40"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditForm(emp)}
                        aria-label={t("solutions.simulator.staff.actions.edit")}
                        title={t("solutions.simulator.staff.actions.edit")}
                        className="p-2 rounded-xl bg-bg border border-line-strong text-mute hover:text-ink hover:border-brand/40 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(emp.id)}
                        aria-label={t(
                          "solutions.simulator.staff.actions.delete",
                        )}
                        title={t("solutions.simulator.staff.actions.delete")}
                        className="p-2 rounded-xl bg-bg border border-line-strong text-mute hover:text-red-400 [[data-theme=light]_&]:hover:text-red-700 hover:border-red-400/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[11px] text-mute/70 text-center">
        {t("solutions.simulator.staff.disclaimer")}
      </p>
    </div>
  );
}

export default StaffSimulatorContent;
