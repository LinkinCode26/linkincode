import useLanguage from "../../hooks/useLanguage";

export function FullScreenLoader() {
  const { t } = useLanguage();

  return (
    <div
      role="status"
      className="min-h-dvh flex items-center justify-center bg-bg text-brand"
    >
      <i className="fas fa-circle-notch fa-spin text-2xl" aria-hidden="true" />
      <span className="sr-only">{t("admin.loading")}</span>
    </div>
  );
}

export default FullScreenLoader;
