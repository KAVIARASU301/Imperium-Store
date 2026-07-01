export function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

export function canUseDevelopmentFallbacks() {
  return !isProductionRuntime();
}
