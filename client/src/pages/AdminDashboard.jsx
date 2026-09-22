import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";
import { Button } from "../components/Button";
import { GlassCard } from "../components/GlassCard";
import ThemeToggle from "../components/ThemeToggle";
import logoImg from "../assets/logo.png";

// Placeholder de /admin: confirma que la ruta protegida funciona. Al
// cerrar sesión, ProtectedRoute redirige solo a /admin/login.
export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-dvh bg-bg text-ink font-sans">
      <header className="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <img src={logoImg} alt="Linkincode" className="h-12 w-auto" />

          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <span className="hidden min-w-0 truncate text-sm text-mute sm:block">
              {user?.email}
            </span>
            <ThemeToggle />
            <Button
              variant="outline"
              size="small"
              onClick={() => logout()}
              aria-label={t("admin.dashboard.logout")}
            >
              <i className="fas fa-right-from-bracket" aria-hidden="true" />
              <span className="hidden sm:inline">
                {t("admin.dashboard.logout")}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {t("admin.dashboard.title")}
        </h1>
        <p className="mt-2 text-mute">
          {t("admin.dashboard.signedInAs")}{" "}
          <span className="font-medium text-ink">{user?.email}</span>
        </p>

        <GlassCard className="mt-10 p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold">
            {t("admin.dashboard.leadsTitle")}
          </h2>
          <p className="mt-2 text-mute">{t("admin.dashboard.leadsPlaceholder")}</p>
        </GlassCard>
      </main>
    </div>
  );
}
