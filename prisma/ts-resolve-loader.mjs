import { extname } from "node:path";

export async function resolve(specifier, context, defaultResolve) {
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && extname(specifier) === "") {
    try {
      return await defaultResolve(`${specifier}.ts`, context, defaultResolve);
    } catch {
      // Fall through to Node's default resolver for non-TS targets.
    }
  }

  return defaultResolve(specifier, context, defaultResolve);
}
