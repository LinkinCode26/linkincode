import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";
import ContactProvider from "./context/ContactContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <ContactProvider>
          <App />
        </ContactProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);