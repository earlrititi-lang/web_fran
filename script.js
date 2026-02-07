const revealNodes = document.querySelectorAll('.reveal');
const nav = document.querySelector('.nav');
const backgroundImage = document.querySelector('.background-image');

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const delay = Number(entry.target.dataset.delay || 0);
      entry.target.style.transitionDelay = `${delay}ms`;
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  },
  {
    threshold: 0.3,
    root: null
  }
);

for (const node of revealNodes) {
  revealObserver.observe(node);
}

const initMagneticButtons = () => {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const magneticButtons = document.querySelectorAll('[data-magnetic]');

  for (const button of magneticButtons) {
    let rafId = 0;
    const position = { x: 0, y: 0 };

    const render = () => {
      button.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      rafId = 0;
    };

    const onPointerMove = (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      position.x = x * 0.24;
      position.y = y * 0.24;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(render);
    };

    const onPointerLeave = () => {
      position.x = 0;
      position.y = 0;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(render);
    };

    button.addEventListener('pointermove', onPointerMove);
    button.addEventListener('pointerleave', onPointerLeave);
  }
};

const updateScrollEffects = () => {
  const y = window.scrollY || 0;

  if (nav) {
    nav.classList.toggle('nav-scrolled', y > 36);
  }

  if (backgroundImage) {
    const scrollableHeight = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    const progress = Math.min(y / scrollableHeight, 1);
    const parallax = progress * 320;
    backgroundImage.style.transform = `translateY(${parallax - 120}px)`;
  }
};

window.addEventListener('scroll', updateScrollEffects, { passive: true });
initMagneticButtons();
updateScrollEffects();
