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

// One control for the snowfall, garland, and 3D toys, including WebGL fallback.
const holidayHero = document.getElementById('hero');
const holidayToggle = document.querySelector('.motion-toggle');
const holidayConnection = navigator.connection;
let holidayPaused = false;
let holidayVisible = true;

if (holidayHero && holidayToggle) {
  const updateHolidayMotion = () => {
    const available = !prefersReducedMotion.matches && !holidayConnection?.saveData;
    const active = available && !holidayPaused && holidayVisible && !document.hidden;
    holidayHero.dataset.holidayPaused = String(holidayPaused);
    holidayHero.classList.toggle('holiday-running', active);
    holidayToggle.hidden = !available;
    holidayToggle.setAttribute('aria-pressed', String(holidayPaused));
    holidayToggle.innerHTML = holidayPaused
      ? '<span aria-hidden="true">▶</span> 動かす'
      : '<span aria-hidden="true">Ⅱ</span> 雪・動きを止める';
    window.dispatchEvent(new Event('holiday-motion-change'));
  };
  holidayToggle.addEventListener('click', () => {
    holidayPaused = !holidayPaused;
    updateHolidayMotion();
  });
  prefersReducedMotion.addEventListener('change', updateHolidayMotion);
  holidayConnection?.addEventListener('change', updateHolidayMotion);
  document.addEventListener('visibilitychange', updateHolidayMotion);
  if ('IntersectionObserver' in window) {
    const holidayObserver = new IntersectionObserver(([entry]) => {
      holidayVisible = entry.isIntersecting;
      updateHolidayMotion();
    });
    holidayObserver.observe(holidayHero);
  }
  updateHolidayMotion();
}
