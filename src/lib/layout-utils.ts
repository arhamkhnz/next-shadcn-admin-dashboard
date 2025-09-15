export function updateContentLayout(value: "centered" | "full-width") {
  const target = document.querySelector('[data-slot="sidebar-inset"]');
  if (target) {
    target.setAttribute("data-content-layout", value);
  }
}

export function updateNavbarBehavior(value: "sticky" | "offcanvas") {
  const target = document.querySelector("header");
  if (target) {
    if (value === "sticky") {
      target.classList.add("sticky", "top-0", "z-50", "backdrop-blur-md", "bg-background/80", "border-b-border/50");
    } else {
      target.classList.remove("sticky", "top-0", "z-50", "backdrop-blur-md", "bg-background/80", "border-b-border/50");
    }
  }
}
