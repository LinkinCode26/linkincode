import { useLanguage } from "./hooks/useLanguage";
import LanguageDropdown from "./components/LanguageDropdown";
import ThemeToggle from "./components/ThemeToggle";
import TechStack from "./sections/TechStack";
import { Hero } from "./sections/Hero";
import Timeline from "./sections/Timeline";

function App() {
  return (
    <main className="relative min-h-screen bg-bg text-ink font-sans">
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <ThemeToggle />
        <LanguageDropdown />
      </div>

      <Hero />
      <TechStack />
      <Timeline />
    </main>
  );
}

export default App;