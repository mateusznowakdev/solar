import dayjs from "dayjs";

export function dateReviver(key, value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value))
    return new Date(value);

  return value;
}

export function getBackendResponse(path) {
  return fetch(getBackendURI() + path)
    .then(async (response) => {
      const status = response.status;
      const text = await response.text();

      if (response.ok) return text;
      else throw new Error(`(HTTP ${status}) ${text}`);
    })
    .then((text) => ({
      data: JSON.parse(text, dateReviver),
      error: null,
    }))
    .catch((error) => ({
      data: null,
      error: error.toString(),
    }));
}

export function getBackendURI() {
  return `${window.location.protocol}//${window.location.hostname}:8000`;
}

export function getDatesForOffset(value) {
  const stopDate = dayjs().second(0).millisecond(0).add(1, "minute");
  const startDate = stopDate.subtract(value, "seconds");

  return [startDate, stopDate];
}

export function getVersion() {
  return import.meta.env.PACKAGE_VERSION;
}

export function renderDate(date) {
  if (isNaN(date)) return "";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  }).format(date);
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
