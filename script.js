const navbar = document.getElementById("navbar");
const hero = document.getElementById("hero");
const toTop = document.querySelector(".to-top");

if (navbar && hero && "IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(([entry]) => {
    navbar.classList.toggle("is-scrolled", !entry.isIntersecting);
    toTop?.classList.toggle("is-visible", !entry.isIntersecting);
  }, {
    rootMargin: "-48px 0px 0px 0px",
    threshold: 0
  });

  navObserver.observe(hero);
} else {
  toTop?.classList.add("is-visible");
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealEls = document.querySelectorAll("[data-reveal]");

if (!prefersReducedMotion.matches && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      el.style.transitionDelay = `${Number(el.dataset.revealDelay) || 0}ms`;
      el.classList.add("is-revealed");
      observer.unobserve(el);
    });
  }, {
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.12
  });

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-revealed"));
}
