export function updateContentLayout(value: "centered" | "full-width") {
  const target = document.querySelector('[data-slot="sidebar-inset"]');
  if (target) {
    target.setAttribute("data-content-layout", value);
  }
}

export function updateNavbarStyle(value: "sticky" | "scroll") {
  const target = document.querySelector("header[data-navbar-style]");
  if (target) {
    target.setAttribute("data-navbar-style", value);
  }
}
