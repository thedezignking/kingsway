// Kingsway — environment access with clear failures.
// The scaffold builds and renders without live keys; helpers throw only when a
// key is actually needed at runtime (PRD §7: no live keys required to scaffold).

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export function optionalEnv(name: string): string | undefined {
  return process.env[name] || undefined;
}

/** True when the given keys are all present — lets stubs render a "not configured" state. */
export function hasEnv(...names: string[]): boolean {
  return names.every((n) => Boolean(process.env[n]));
}
