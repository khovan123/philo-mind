import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import vi from "../locales/vi.json";

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

void i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  lng: "vi", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already safeguards from XSS
  },
});

export default i18n;
