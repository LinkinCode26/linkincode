import useLanguage from "../../hooks/useLanguage";
import { LoaderCircle } from "lucide-react";

export function FullScreenLoader() {
  const { t } = useLanguage();

  return (
    <div
      role="status"
      className="min-h-dvh flex items-center justify-center bg-bg text-brand"
    >
      <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" />
      <span className="sr-only">{t("admin.loading")}</span>
    </div>
  );
}

export default FullScreenLoader;
