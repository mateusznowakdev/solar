import dayjs from "dayjs";

export function dateReviver(key, value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value))
    return new Date(value);

  return value;
}

export function getBackendResponse(path, options) {
  return fetch(getBackendURI() + path, options)
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

export function renderBoolean(value) {
  return value ? "Tak" : "Nie";
}

export function renderChoice(choices, value) {
  return choices[value] || value;
}

export function renderDate(date, options) {
  if (isNaN(date)) return "";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(options || {}),
  }).format(date);
}

export function renderDateTime(date, options) {
  if (isNaN(date)) return "";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "medium",
    ...(options || {}),
  }).format(date);
}

export function renderMonth(date, options) {
  if (isNaN(date)) return "";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    year: "numeric",
    ...(options || {}),
  }).format(date);
}

export function renderMultipleChoices(choices, values) {
  if (!values || values.length === 0) return "---";

  return values.map((value) => renderChoice(choices, value)).join(", ");
}

export function renderNumber(number, options) {
  if (isNaN(number)) return "";

  return new Intl.NumberFormat(undefined, {
    ...(options || {}),
  }).format(number);
}

export function renderTime(date, options) {
  if (isNaN(date)) return "";

  return new Intl.DateTimeFormat(undefined, {
    timeStyle: "medium",
    ...(options || {}),
  }).format(date);
}

export function toggleItem(list, item) {
  const idx = list.indexOf(item);
  idx === -1 ? list.push(item) : list.splice(idx, 1);
}
