export function getBackendURI() {
  return `${window.location.protocol}//${window.location.hostname}:8000`;
}

export function getVersion() {
  return import.meta.env.PACKAGE_VERSION;
}

export function renderDateTime(date) {
  if (isNaN(date)) return "";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

export function renderNumber(number) {
  if (isNaN(number)) return "";

  return new Intl.NumberFormat(undefined).format(number);
}

export function renderTime(date) {
  if (isNaN(date)) return "";

  return new Intl.DateTimeFormat(undefined, {
    timeStyle: "medium",
  }).format(date);
}
