import LanguageDropdown from "./components/LanguageDropdown";
import ThemeToggle from "./components/ThemeToggle";
import TechMarquee from "./components/TechMarquee";

function App() {
  const { t } = useLanguage();
import { Hero } from './sections/Hero'

function App() {
  return (
    <main className="relative min-h-screen bg-bg text-ink font-sans">
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <ThemeToggle />
        <LanguageDropdown />
      </div>
      <h1 className="font-display text-4xl font-bold animate-float">
        Linkincode
      </h1>
      <p className="text-mute max-w-md text-center">{t("hero.subtitle")}</p>
      <div className="w-full mt-12">
        <TechMarquee />
      </div>
      <Hero />
    </main>
  );
}

export default App;