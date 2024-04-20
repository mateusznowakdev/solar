import { isSecureNetwork } from "./utils";

export const STORAGE_KEYS = {
  API_URL: "apiUrl",
  FILTERS: "filters",
  FULL_NAMES: "fullNames",
  INTERNAL_URL: "internalUrl",
  PINNED: "pinned",
  WEBSOCKET_URL: "websocketUrl",
};

export function getStorage(key) {
  const raw = localStorage.getItem(key);
  const parsed = JSON.parse(raw);

  if (parsed == null) {
    switch (key) {
      case STORAGE_KEYS.API_URL:
        return (
          window.location.protocol +
          "//" +
          window.location.hostname +
          ":8000/api"
        );
      case STORAGE_KEYS.FILTERS:
        return [];
      case STORAGE_KEYS.FULL_NAMES:
        return true;
      case STORAGE_KEYS.PINNED:
        return ["timestamp"];
      case STORAGE_KEYS.WEBSOCKET_URL:
        return (
          window.location.protocol +
          "//" +
          window.location.hostname +
          ":" +
          (isSecureNetwork() ? 443 : 80) +
          "/ws/"
        );
    }
  }

  return parsed;
}

export function setStorage(key, value) {
  const stringified = JSON.stringify(value);
  localStorage.setItem(key, stringified);
}
