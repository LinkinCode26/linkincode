import { useLanguage } from "./hooks/useLanguage";
import LanguageDropdown from "./components/LanguageDropdown";
import ThemeToggle from "./components/ThemeToggle";
import TechMarquee from "./components/TechMarquee";
import { Hero } from "./sections/Hero";
import Timeline from "./sections/Timeline";

function App() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen bg-bg text-ink font-sans">
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <ThemeToggle />
        <LanguageDropdown />
      </div>

      <Hero />
      <div className="w-full my-10">
        <TechMarquee />
      </div>
      <Timeline />
    </main>
  );
}

export default App;