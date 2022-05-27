import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import tranEn from "./files/en.json";
import tranKo from "./files/ko.json";

const resources = {
  en: { translation: tranEn },
  ko: { translation: tranKo },
};

const userLanguage = window.navigator.language; // 현재 설정 언어

i18n.use(initReactI18next).init({
  resources,
  lng: userLanguage || "ko",
  fallbackLng: "ko",
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
