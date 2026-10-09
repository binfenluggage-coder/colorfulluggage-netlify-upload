
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.textContent = navLinks.classList.contains('open') ? 'x' : 'Menu';
  });
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => navLinks.classList.remove('open')));
}
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

const factoryIntroModal = document.querySelector('#factory-intro-modal');
if (factoryIntroModal) {
  let factoryIntroTimer;
  const closeFactoryIntro = () => {
    window.clearTimeout(factoryIntroTimer);
    if (factoryIntroModal.classList.contains('is-fading')) return;
    factoryIntroModal.classList.add('is-fading');
    window.setTimeout(() => {
      factoryIntroModal.classList.remove('is-open', 'is-fading');
    }, 1550);
  };
  factoryIntroModal.classList.remove('is-fading');
  factoryIntroModal.classList.add('is-open');
  factoryIntroTimer = window.setTimeout(closeFactoryIntro, 4500);
  factoryIntroModal.addEventListener('click', (event) => {
    if (event.target === factoryIntroModal) closeFactoryIntro();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeFactoryIntro();
  });
}
