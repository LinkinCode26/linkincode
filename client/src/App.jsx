import LanguageDropdown from "./components/LanguageDropdown";
import ThemeToggle from "./components/ThemeToggle";
import { Hero } from './sections/Hero';
import  Navbar  from './components/Navbar';
import TechStack from "./sections/TechStack";
import { Solutions } from "./sections/Solutions";
import Timeline from "./sections/Timeline";
import Footer from "./sections/Footer";

function App() {
  return (
    <main className="relative min-h-screen bg-bg text-ink font-sans">
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <Navbar/>
        <ThemeToggle />
        <LanguageDropdown />
      </div>

      <Hero />
      <TechStack />
      <Solutions />
      <Timeline />
      <Footer />
    </main>
  );
}

export default App;
