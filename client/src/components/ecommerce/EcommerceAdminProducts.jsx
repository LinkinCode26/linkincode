import { useEffect, useRef, useState } from "react";
import { Minus, Package, Pencil, Plus, Trash2, X } from "lucide-react";
import useLanguage from "../../hooks/useLanguage";
import { products as mockProducts } from "../../data/mock/products";
import {
  badgeClasses,
  formatPrice,
  getDisplayName,
  getStockLevel,
  handleImageError,
  isValidImageUrl,
} from "../../utils/ecommerce";

const BASE = "solutions.simulator.ecommerce.admin.products";

// Galería: las fotos del catálogo inicial + dos más. No hay subida real de
// archivos: la foto se elige de acá o se pega una URL.
const IMAGE_PRESETS = [
  ...new Set([
    ...mockProducts.map((product) => product.image),
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
  ]),
];

const EMPTY_FORM = { name: "", price: "", stock: "", image: "", nameAtOpen: "" };

const INPUT_CLASSES =
  "w-full bg-bg border border-line-strong rounded-xl px-3.5 py-2 text-sm text-ink placeholder:text-mute/70 focus:outline-none focus:border-brand transition-colors";

const STOCK_TONE = { out: "red", low: "amber", ok: "emerald" };

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <span
      id={id}
      className="text-[11px] font-medium text-red-400 [[data-theme=light]_&]:text-red-700"
    >
      {message}
    </span>
  );
}

export function AdminProductsTab({
  products,
  onAdd,
  onUpdate,
  onAdjustStock,
  onDelete,
}) {
  const { t, lang } = useLanguage();
  const locale = lang === "en" ? "en-US" : "es-AR";
  const P = (key) => t(`${BASE}.${key}`);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [notice, setNotice] = useState("");
  const nameInputRef = useRef(null);

  // Al abrir el formulario el foco va al primer campo (también hace scroll
  // hasta él, útil en mobile cuando se edita un producto que está abajo).
  useEffect(() => {
    if (isFormOpen) nameInputRef.current?.focus();
  }, [isFormOpen, editingId]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setConfirmDeleteId(null);
    setNotice("");
    setIsFormOpen(true);
  };

  const openEdit = (product) => {
    const displayName = getDisplayName(t, product);
    setEditingId(product.id);
    setForm({
      name: displayName,
      nameAtOpen: displayName,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image.startsWith("data:") ? "" : product.image,
    });
    setErrors({});
    setConfirmDeleteId(null);
    setNotice("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleField = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    const name = form.name.trim();
    if (!name) next.name = P("errors.nameRequired");
    else if (name.length < 2) next.name = P("errors.nameMin");
    else if (name.length > 60) next.name = P("errors.nameMax");

    const price = Number(form.price);
    if (form.price.trim() === "") next.price = P("errors.priceRequired");
    else if (!Number.isFinite(price) || price <= 0 || price > 10_000_000)
      next.price = P("errors.priceRange");

    const stock = Number(form.stock);
    if (form.stock.trim() === "") next.stock = P("errors.stockRequired");
    else if (!Number.isInteger(stock) || stock < 0 || stock > 99_999)
      next.stock = P("errors.stockRange");

    const image = form.image.trim();
    if (image && !isValidImageUrl(image)) next.image = P("errors.imageInvalid");

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);
    const image = form.image.trim();

    if (editingId) {
      const current = products.find((p) => p.id === editingId);
      const changes = { price, stock };
      // Se conserva la foto actual si el campo quedó vacío.
      if (image) changes.image = image;
      // Si el nombre no se tocó, el producto sigue traduciéndose ES/EN; si se
      // cambió, pasa a ser un nombre propio.
      if (name !== form.nameAtOpen) {
        changes.name = name;
        changes.i18n = false;
      }
      if (current) onUpdate(editingId, changes);
      setNotice(P("notices.updated"));
    } else {
      onAdd({ name, price, stock, image });
      setNotice(P("notices.created"));
    }
    closeForm();
  };

  const handleConfirmDelete = (productId) => {
    onDelete(productId);
    setConfirmDeleteId(null);
    if (editingId === productId) closeForm();
    setNotice(P("notices.deleted"));
  };

  const stockLabel = (level) =>
    level === "out" ? P("soldOut") : level === "low" ? P("lowStock") : P("inStock");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-display text-base font-bold text-ink">
            {P("title")}
          </h4>
          <p className="text-xs text-mute">
            {products.length} {P("countWord")}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-text px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-brand-text/90 sm:w-auto"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {P("addButton")}
        </button>
      </div>

      <p role="status" className="min-h-0 text-xs font-semibold text-accent-text">
        {notice}
      </p>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 rounded-2xl border border-brand/40 bg-surface p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-display text-sm font-bold text-ink">
              {editingId ? P("formEditTitle") : P("formCreateTitle")}
            </h4>
            <button
              type="button"
              onClick={closeForm}
              aria-label={P("closeForm")}
              className="cursor-pointer p-1 text-mute transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="flex flex-col gap-1.5 sm:col-span-3">
              <label
                htmlFor="prod-form-name"
                className="text-xs font-semibold text-mute"
              >
                {P("nameLabel")}
              </label>
              <input
                ref={nameInputRef}
                id="prod-form-name"
                type="text"
                value={form.name}
                onChange={handleField("name")}
                placeholder={P("namePlaceholder")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "prod-form-name-error" : undefined}
                className={INPUT_CLASSES}
              />
              <FieldError id="prod-form-name-error" message={errors.name} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="prod-form-price"
                className="text-xs font-semibold text-mute"
              >
                {P("priceLabel")}
              </label>
              <input
                id="prod-form-price"
                type="number"
                inputMode="decimal"
                min="1"
                step="any"
                value={form.price}
                onChange={handleField("price")}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={errors.price ? "prod-form-price-error" : undefined}
                className={INPUT_CLASSES}
              />
              <FieldError id="prod-form-price-error" message={errors.price} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="prod-form-stock"
                className="text-xs font-semibold text-mute"
              >
                {P("stockLabel")}
              </label>
              <input
                id="prod-form-stock"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleField("stock")}
                aria-invalid={Boolean(errors.stock)}
                aria-describedby={errors.stock ? "prod-form-stock-error" : undefined}
                className={INPUT_CLASSES}
              />
              <FieldError id="prod-form-stock-error" message={errors.stock} />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-3">
              <label
                htmlFor="prod-form-image"
                className="text-xs font-semibold text-mute"
              >
                {P("imageLabel")}
              </label>
              <div className="flex items-center gap-3">
                <img
                  key={form.image}
                  src={form.image.trim() || undefined}
                  alt=""
                  onError={handleImageError}
                  className={`h-11 w-11 shrink-0 rounded-lg border border-line object-cover ${
                    form.image.trim() ? "" : "hidden"
                  }`}
                />
                <input
                  id="prod-form-image"
                  type="url"
                  inputMode="url"
                  value={form.image}
                  onChange={handleField("image")}
                  placeholder={P("imagePlaceholder")}
                  aria-invalid={Boolean(errors.image)}
                  aria-describedby={
                    errors.image ? "prod-form-image-error" : "prod-form-image-help"
                  }
                  className={INPUT_CLASSES}
                />
              </div>
              <FieldError id="prod-form-image-error" message={errors.image} />
              <span id="prod-form-image-help" className="text-[11px] text-mute">
                {P("imageHelp")}
              </span>
            </div>

            <div
              role="group"
              aria-label={P("imagePresetsLabel")}
              className="flex flex-col gap-2 sm:col-span-3"
            >
              <span className="text-xs font-semibold text-mute">
                {P("imagePresetsLabel")}
              </span>
              <div className="flex flex-wrap gap-2">
                {IMAGE_PRESETS.map((url, index) => {
                  const isSelected = form.image.trim() === url;
                  return (
                    <button
                      key={url}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, image: url }))
                      }
                      aria-pressed={isSelected}
                      aria-label={`${P("imagePresetAria")} ${index + 1}`}
                      className={`h-12 w-12 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                        isSelected
                          ? "scale-105 border-brand"
                          : "border-line-strong opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={url}
                        alt=""
                        loading="lazy"
                        onError={handleImageError}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeForm}
              className="w-full cursor-pointer rounded-xl border border-line-strong px-4 py-2 text-xs font-bold uppercase tracking-wider text-mute transition-colors hover:text-ink sm:w-auto"
            >
              {P("cancel")}
            </button>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-brand-text px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-text/90 sm:w-auto"
            >
              {editingId ? P("saveEdit") : P("saveCreate")}
            </button>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 text-brand">
            <Package className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="max-w-md space-y-1">
            <h4 className="font-display text-base font-bold text-ink">
              {P("empty.title")}
            </h4>
            <p className="text-xs text-mute sm:text-sm">
              {P("empty.description")}
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-text px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-text/90"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {P("empty.cta")}
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((product) => {
            const level = getStockLevel(product);
            const name = getDisplayName(t, product);
            const isConfirmingDelete = confirmDeleteId === product.id;

            return (
              <li
                key={product.id}
                className={`flex flex-col gap-3 rounded-2xl border bg-surface p-4 lg:flex-row lg:items-center lg:justify-between ${
                  level === "out"
                    ? "border-red-500/40"
                    : level === "low"
                      ? "border-amber-500/40"
                      : "border-line"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    key={product.image}
                    src={product.image}
                    alt={name}
                    loading="lazy"
                    onError={handleImageError}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{name}</p>
                    <p className="text-xs text-mute">
                      {formatPrice(product.price, locale)}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClasses(
                        STOCK_TONE[level],
                      )}`}
                    >
                      {stockLabel(level)}
                    </span>
                  </div>
                </div>

                {isConfirmingDelete ? (
                  <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line pt-3 lg:border-t-0 lg:pt-0">
                    <span className="mr-1 text-xs font-semibold text-ink">
                      {P("deleteConfirm.question")} <strong>{name}</strong>?
                    </span>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="cursor-pointer rounded-xl border border-line-strong px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-mute transition-colors hover:text-ink"
                    >
                      {P("deleteConfirm.cancel")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmDelete(product.id)}
                      className="cursor-pointer rounded-xl border border-red-500/30 bg-red-500/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-500/25 [[data-theme=light]_&]:text-red-700"
                    >
                      {P("deleteConfirm.confirm")}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3 border-t border-line pt-3 lg:justify-end lg:border-t-0 lg:pt-0">
                    <div
                      role="group"
                      aria-label={`${P("stockRowLabel")}: ${name}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-bg px-1.5 py-1"
                    >
                      <button
                        type="button"
                        onClick={() => onAdjustStock(product.id, -1)}
                        disabled={product.stock <= 0}
                        aria-label={`${P("decreaseStock")} ${name}`}
                        className="cursor-pointer p-1 text-mute transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <span className="min-w-[4.5rem] text-center text-xs font-bold text-ink">
                        {P("stockRowLabel")}: {product.stock}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAdjustStock(product.id, 1)}
                        aria-label={`${P("increaseStock")} ${name}`}
                        className="cursor-pointer p-1 text-mute transition-colors hover:text-ink"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        aria-label={`${P("edit")}: ${name}`}
                        title={P("edit")}
                        className="cursor-pointer rounded-xl border border-line-strong bg-bg p-2 text-mute transition-colors hover:border-brand/40 hover:text-ink"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(product.id)}
                        aria-label={`${P("delete")}: ${name}`}
                        title={P("delete")}
                        className="cursor-pointer rounded-xl border border-line-strong bg-bg p-2 text-mute transition-colors hover:border-red-400/40 hover:text-red-400 [[data-theme=light]_&]:hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AdminProductsTab;