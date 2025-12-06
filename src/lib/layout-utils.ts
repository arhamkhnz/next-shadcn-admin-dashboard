export function applyContentLayout(value: "centered" | "full-width") {
  const root = document.documentElement;
  root.setAttribute("data-content-layout", value);
}

export function applyNavbarStyle(value: "sticky" | "scroll") {
  const root = document.documentElement;
  root.setAttribute("data-navbar-style", value);
}

export function applySidebarVariant(value: string) {
  const target = document.querySelector('[data-slot="sidebar"]');
  if (target) {
    target.setAttribute("data-variant", value);
  }
}

export function applySidebarCollapsible(value: string) {
  const target = document.querySelector('[data-slot="sidebar"]');
  if (target) {
    target.setAttribute("data-collapsible", value);
  }
}
