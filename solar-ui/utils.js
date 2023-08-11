export function getBackendURI() {
  return `${window.location.protocol}//${window.location.hostname}:8000`;
}

export function getBrokerURI() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.hostname}:8883`;
}
