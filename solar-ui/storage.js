export const STORAGE_KEYS = {
  FILTERS: "filters",
  FULL_NAMES: "fullNames",
  PINNED: "pinned",
};

export function getDefaultValue(key) {
  switch (key) {
    case STORAGE_KEYS.FILTERS:
      return [];
    case STORAGE_KEYS.FULL_NAMES:
      return true;
    case STORAGE_KEYS.PINNED:
      return ["timestamp"];
    default:
      return null;
  }
}

export function getStorage(key) {
  const raw = localStorage.getItem(key);
  const parsed = JSON.parse(raw);

  return parsed != null ? parsed : getDefaultValue(key);
}

export function setStorage(key, value) {
  const stringified = JSON.stringify(value);
  localStorage.setItem(key, stringified);
}
