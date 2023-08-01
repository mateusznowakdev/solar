export function renderDate(date) {
  if (isNaN(date)) return "";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}
