// Shared marker for scaffolded-but-unbuilt service functions.
// Keeps signatures/types real so call sites compile, while making the gap explicit.
export function notImplemented(what: string): never {
  throw new Error(`Not implemented yet: ${what}`);
}
