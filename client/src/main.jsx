import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRoutes from "./AppRoutes.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";
import ContactProvider from "./context/ContactContext.jsx";
import AuthProvider from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ContactProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ContactProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
