import { DateTime } from "luxon";

import { STRINGS } from "./locale";
import { STORAGE_KEYS, getStorage } from "./storage";

export function dateReviver(key, value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value))
    return DateTime.fromISO(value);

  return value;
}

export function getBackendResponse(path, options) {
  const backendURI = getStorage(STORAGE_KEYS.API_URL);

  return fetch(backendURI + path, options)
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

export function getDatesForOffset(value) {
  const stopDate = DateTime.now()
    .set({ second: 0, millisecond: 0 })
    .plus({ minutes: 1 });
  const startDate = stopDate.minus({ seconds: value });

  return [startDate, stopDate];
}

export function getVersion() {
  return import.meta.env.PACKAGE_VERSION;
}

export function isSecureNetwork() {
  return window.location.protocol === "https:";
}

export function renderBoolean(value) {
  return value ? STRINGS.YES : STRINGS.NO;
}

export function renderChoice(value, choices, choicesShort = null) {
  if (choicesShort && !getStorage(STORAGE_KEYS.FULL_NAMES)) {
    return choicesShort[value] || value;
  } else {
    return choices[value] || value;
  }
}

export function renderDate(date, options) {
  if (!date) return date;

  return date.toLocaleString({
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(options || {}),
  });
}

export function renderDateTime(date, options) {
  if (!date) return date;

  return date.toLocaleString({
    dateStyle: "short",
    timeStyle: "medium",
    ...(options || {}),
  });
}

export function renderMonth(date, options) {
  if (!date) return date;

  return date.toLocaleString({
    month: "short",
    year: "numeric",
    ...(options || {}),
  });
}

export function renderMultipleChoices(values, choices) {
  if (!values || values.length === 0) return "---";

  return values.map((value) => renderChoice(value, choices)).join(", ");
}

export function renderNumber(number, options) {
  if (isNaN(number)) return "";

  return new Intl.NumberFormat(undefined, {
    ...(options || {}),
  }).format(number);
}

export function renderTime(date, options) {
  if (!date) return date;

  return date.toLocaleString({
    timeStyle: "medium",
    ...(options || {}),
  });
}

export function toggleItem(list, item) {
  const idx = list.indexOf(item);
  idx === -1 ? list.push(item) : list.splice(idx, 1);
}
