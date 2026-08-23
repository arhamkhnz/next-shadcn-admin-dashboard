// biome-ignore lint/correctness/noUndeclaredDependencies: dotenv is already available in the local runtime for env loading.
import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
  migrations: {
    path: "prisma/migrations",
    seed: "node --experimental-strip-types --loader ./prisma/ts-resolve-loader.mjs prisma/seed.ts",
  },
});
