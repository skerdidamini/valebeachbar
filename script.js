document.addEventListener('DOMContentLoaded', () => {
  const revealTargets = document.querySelectorAll('.reveal');

  if (!revealTargets.length) return;

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px',
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealTargets.forEach((target) => {
    revealObserver.observe(target);
  });
});
