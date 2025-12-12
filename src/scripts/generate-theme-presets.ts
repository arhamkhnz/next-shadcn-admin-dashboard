/**
 * Script: generate-theme-presets.ts
 *
 * This script scans the /styles/presets directory for CSS files containing theme definitions.
 * It extracts `label:`, `value:`, and primary color definitions (`--primary`) for both light and dark modes.
 * These primary colors are used to visually represent each theme in the UI (e.g., colored dots or theme previews).
 * Default theme colors are fetched from /app/globals.css.
 * All extracted metadata is injected into a marked section of the /lib/preferences/theme.ts file.
 *
 * Usage:
 * - During local development, run manually after adding any new theme preset:
 *     npm run generate:presets
 * - Ensure that each new CSS preset includes `label:` and `value:` comments.
 * - This generation step is currently automated using a Husky pre-push hook.
 * - You may optionally integrate it directly into a build step if preferred.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const presetDir = path.resolve(__dirname, "../styles/presets");

if (!fs.existsSync(presetDir)) {
  console.error(`❌ Preset directory not found at: ${presetDir}`);
  process.exit(1);
}

const outputPath = path.resolve(__dirname, "../lib/preferences/theme.ts");

const files = fs.readdirSync(presetDir).filter((file) => file.endsWith(".css"));

if (files.length === 0) {
  console.warn("⚠️ No preset CSS files found. Only default preset will be included.");
}

const presets = files.map((file) => {
  const filePath = path.join(presetDir, file);
  const content = fs.readFileSync(filePath, "utf8");

  const labelMatch = content.match(/label:\s*(.+)/);
  const valueMatch = content.match(/value:\s*(.+)/);

  if (!labelMatch) {
    console.warn(`⚠️ No 'label:' found in ${file}, using filename as fallback.`);
  }
  if (!valueMatch) {
    console.warn(`⚠️ No 'value:' found in ${file}, using filename as fallback.`);
  }

  const label = labelMatch?.[1]?.trim() ?? file.replace(".css", "");
  const value = valueMatch?.[1]?.trim() ?? file.replace(".css", "");

  const lightPrimaryMatch = content.match(/:root\[data-theme-preset="[^"]*"\][\s\S]*?--primary:\s*([^;]+);/);
  const darkPrimaryMatch = content.match(/\.dark:root\[data-theme-preset="[^"]*"\][\s\S]*?--primary:\s*([^;]+);/);

  const primary = {
    light: lightPrimaryMatch?.[1]?.trim() ?? "",
    dark: darkPrimaryMatch?.[1]?.trim() ?? "",
  };

  if (!lightPrimaryMatch || !darkPrimaryMatch) {
    console.warn(`⚠️ Missing --primary for ${file} (light or dark). Check CSS syntax.`);
  }

  return { label, value, primary };
});

const globalStylesPath = path.resolve(__dirname, "../app/globals.css");

let globalContent = "";
try {
  globalContent = fs.readFileSync(globalStylesPath, "utf8");
} catch (err) {
  console.error(`❌ Could not read globals.css at ${globalStylesPath}`);
  console.error(err);
  process.exit(1);
}

const defaultLightPrimaryRegex = /:root\s*{[^}]*--primary:\s*([^;]+);/;
const defaultDarkPrimaryRegex = /\.dark\s*{[^}]*--primary:\s*([^;]+);/;

const defaultLightPrimaryMatch = defaultLightPrimaryRegex.exec(globalContent);
const defaultDarkPrimaryMatch = defaultDarkPrimaryRegex.exec(globalContent);

const defaultPrimary = {
  light: defaultLightPrimaryMatch?.[1]?.trim() ?? "",
  dark: defaultDarkPrimaryMatch?.[1]?.trim() ?? "",
};

presets.unshift({ label: "Default", value: "default", primary: defaultPrimary });

const generatedBlock = `// --- generated:themePresets:start ---

export const THEME_PRESET_OPTIONS = ${JSON.stringify(presets, null, 2)} as const;

export const THEME_PRESET_VALUES = THEME_PRESET_OPTIONS.map((p) => p.value);

export type ThemePreset = (typeof THEME_PRESET_OPTIONS)[number]["value"];

// --- generated:themePresets:end ---`;

const fileContent = fs.readFileSync(outputPath, "utf8");

const updated = fileContent.replace(
  /\/\/ --- generated:themePresets:start ---[\s\S]*?\/\/ --- generated:themePresets:end ---/,
  generatedBlock,
);

async function main() {
  const formatted = execFileSync("npx", ["@biomejs/biome", "format", "--stdin-file-path", outputPath], {
    input: updated,
    encoding: "utf8",
  });

  if (formatted === fileContent) {
    console.log("ℹ️  No changes in theme.ts");
    return;
  }

  fs.writeFileSync(outputPath, formatted);
  console.log("✅ theme.ts updated with new theme presets");
}

main().catch((err) => {
  console.error("❌ Unexpected error while generating theme presets:", err);
  process.exit(1);
});
