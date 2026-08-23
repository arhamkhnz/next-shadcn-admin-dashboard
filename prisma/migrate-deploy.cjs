const { spawn } = require("node:child_process");
const { setDefaultResultOrder } = require("node:dns");
const path = require("node:path");

// biome-ignore lint/correctness/noUndeclaredDependencies: dotenv is already available in the local runtime for env loading.
require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env"),
  quiet: true,
});

setDefaultResultOrder("ipv4first");

const runtimeUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

if (!runtimeUrl && !directUrl) {
  console.error("Prisma migrate deploy requires DATABASE_URL or DIRECT_URL to be set.");
  process.exit(1);
}

process.env.DATABASE_URL = directUrl || runtimeUrl;
process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, "--dns-result-order=ipv4first"].filter(Boolean).join(" ");

if (process.argv.includes("--check")) {
  console.log(
    JSON.stringify({
      hasDatabaseUrl: Boolean(runtimeUrl),
      hasDirectUrl: Boolean(directUrl),
      usingDirectUrlForMigration: Boolean(directUrl),
      hasEffectiveDatabaseUrl: Boolean(process.env.DATABASE_URL),
    }),
  );
  process.exit(0);
}

const prismaCliEntrypoint = require.resolve("prisma/build/index.js");
const child = spawn(process.execPath, [prismaCliEntrypoint, "migrate", "deploy"], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error("Failed to start Prisma migrate deploy.");
  console.error(error.message);
  process.exit(1);
});
