import i18n from "i18next";
import Backend from "i18next-fs-backend";
import de from "../de.json";
import en from "../en.json";

i18n.use(Backend).init({
  fallbackLng: "en",
  ns: "page",
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
