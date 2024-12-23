import * as fs from "fs";
import * as path from "path";

import fg from "fast-glob";

const appPath = path.join(__dirname, "../app");
const outputPath = path.join(__dirname, "../utils/routes.ts");

async function listRoutes(basePath: string): Promise<string[]> {
  try {
    const files = await fg("**/*.tsx", { cwd: basePath });
    return files
      .map((file) => {
        const route = `/${file.replace(/\/index\.tsx$/, "").replace(/\.tsx$/, "")}`;
        return route === "/page" ? "/" : route.replace(/\/page$/, "");
      })
      .filter(
        (route) =>
          !route.includes("_app") &&
          !route.includes("_document") &&
          !route.includes("layout") &&
          !route.includes("components"),
      );
  } catch (error) {
    console.error("Error listing routes with fast-glob:", error);
    throw error;
  }
}

async function updateRouteList() {
  try {
    const routes = await listRoutes(appPath);
    const exportContent = `export const routes: string[] = ${JSON.stringify(routes, null, 2)};\n`;
    fs.writeFileSync(outputPath, exportContent);
    console.log(`Routes have been written to ${outputPath}`);
  } catch (error) {
    console.error("Failed to update route list:", error);
  }
}

updateRouteList();
