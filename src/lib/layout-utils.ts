export function updateContentLayout(value: "centered" | "full-width") {
  const target = document.querySelector('[data-slot="sidebar-inset"]');
  if (target) {
    target.setAttribute("data-content-layout", value);
  }
}
