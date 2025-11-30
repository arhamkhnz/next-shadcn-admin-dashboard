/**
 * Applies theme mode and preset on the client before hydration.
 * This keeps RootLayout fully static and prevents extra RSC renders
 * that would happen if cookies were read on the server.
 *
 * Runs instantly in <head> so the correct theme loads with no flicker.
 */

export function ThemeBootScript() {
  const code = `
    (function () {
      try {
        var root = document.documentElement;

        function getCookie(name) {
          var match = document.cookie.split("; ").find(function(c) {
            return c.indexOf(name + "=") === 0;
          });
          return match ? match.split("=")[1] : null;
        }

        // read cookies safely
        var rawMode = getCookie("theme_mode");
        var rawPreset = getCookie("theme_preset");

        // sanitize mode
        var mode = (rawMode === "dark" || rawMode === "light") ? rawMode : "light";
        var preset = rawPreset || "default";

        // set html class & preset attribute before paint
        root.classList.remove("light", "dark");
        root.classList.add(mode);

        root.setAttribute("data-theme-preset", preset);

        // correct color-scheme for scrollbars/form-controls
        root.style.colorScheme = mode === "dark" ? "dark" : "light";
      } catch (e) {
        console.warn("ThemeBootScript error:", e);
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
