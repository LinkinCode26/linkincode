import useLanguage from "./hooks/useLanguage";
import LanguageDropdown from "./components/LanguageDropdown";
import ThemeToggle from "./components/ThemeToggle";
function App() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen bg-bg text-ink font-sans flex flex-col items-center justify-center gap-6 px-6">
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <ThemeToggle />
        <LanguageDropdown />
      </div>
      <h1 className="font-display text-4xl font-bold animate-float">
        Linkincode
      </h1>
      <p className="text-mute max-w-md text-center">{t("hero.subtitle")}</p>
    </main>
  );
}

export default App;
