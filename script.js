const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setupParallax() {
  const layers = [...document.querySelectorAll("[data-depth]")];
  if (prefersReducedMotion.matches || layers.length === 0) return;

  let pointerX = 0;
  let pointerY = 0;
  let ticking = false;

  function render() {
    for (const layer of layers) {
      const depth = Number(layer.dataset.depth || 0);
      const x = pointerX * depth;
      const y = pointerY * depth;
      layer.style.setProperty("--parallax-x", `${x}px`);
      layer.style.setProperty("--parallax-y", `${y}px`);
    }
    ticking = false;
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
      if (!ticking) {
        window.requestAnimationFrame(render);
        ticking = true;
      }
    },
    { passive: true },
  );
}

function setupScrollReveal() {
  const targets = [
    ...document.querySelectorAll(
      ".small-card, .pattern-card, .definition-card, .screen-card, .trust-card, .reveal-card",
    ),
  ];
  if (prefersReducedMotion.matches || targets.length === 0) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.14 },
  );

  targets.forEach((target) => observer.observe(target));
}

function setupAccessForm() {
  const form = document.querySelector(".access-form");
  const status = form?.querySelector(".form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "Not connected yet. Early access collection will be wired before launch.";
  });
}

setupParallax();
setupScrollReveal();
setupAccessForm();
