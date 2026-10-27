import { Hero } from "./sections/Hero";
import Navbar from "./components/Navbar";
import TechStack from "./sections/TechStack";
import { Solutions } from "./sections/Solutions";
import Timeline from "./sections/Timeline";
import { Contact } from "./sections/Contact";
import { CtaPrefooter } from "./sections/CtaPrefooter";
import Footer from "./sections/Footer";
import AboutUs from "./sections/AboutUs";
import Testimonials from "./sections/Testimonials";

function App() {
  return (
    <main className="relative min-h-screen bg-bg text-ink font-sans">
      <Navbar />

      <Hero />
      <TechStack />
      <Solutions />
      <Timeline />
      <AboutUs />
      <Testimonials />
      <Contact />
      <CtaPrefooter />
      <Footer />
    </main>
  );
}

export default App;
