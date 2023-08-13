export function getBackendURI() {
  return `${window.location.protocol}//${window.location.hostname}:8000`;
}

export function getVersion() {
  return import.meta.env.PACKAGE_VERSION;
}
