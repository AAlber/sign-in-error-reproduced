import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "../de.json";
import en from "../en.json";

i18n.use(initReactI18next).init({
  // Set the default language
  fallbackLng: "en",
  ns: ["page"], // Add your namespace here
  defaultNS: "page", // Set the default namespace
  resources: {
    en: {
      page: en,
    },
    de: {
      page: de,
    },
  },
});

export default i18n;
