export const STORAGE_FILTERS = "filters";
export const STORAGE_FULL_NAMES = "fullNames";
export const STORAGE_INTERNAL_URL = "internalUrl";
export const STORAGE_PINNED = "pinned";

export function getStorage(key) {
  const raw = localStorage.getItem(key);
  const parsed = JSON.parse(raw);

  if (parsed == null) {
    switch (key) {
      case STORAGE_FILTERS:
        return [];
      case STORAGE_FULL_NAMES:
        return true;
      case STORAGE_PINNED:
        return ["timestamp"];
    }
  }

  return parsed;
}

export function setStorage(key, value) {
  const stringified = JSON.stringify(value);
  localStorage.setItem(key, stringified);
}
