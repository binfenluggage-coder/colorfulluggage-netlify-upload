
const siteRoot = new URL('.', document.currentScript.src);
const rootPages = ['', 'index.html', 'products/', 'products/index.html', 'factory/', 'factory/index.html', 'custom/', 'custom/index.html', 'contact/', 'contact/index.html'];
const isRootPage = rootPages.some((path) => new URL(path, siteRoot).pathname === location.pathname);
const rootNav = document.querySelector('body > .nav');
if (isRootPage && rootNav) {
  document.body.classList.add('root-scroll-nav');
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('root-nav.css', siteRoot).href;
  document.head.appendChild(stylesheet);
  const inFlow = !['absolute', 'fixed'].includes(getComputedStyle(rootNav).position);
  const spacer = document.createElement('div');
  spacer.hidden = true;
  spacer.setAttribute('aria-hidden', 'true');
  rootNav.after(spacer);
  const updateNav = () => {
    const scrolled = window.scrollY > 32;
    if (inFlow) {
      spacer.style.height = `${rootNav.getBoundingClientRect().height}px`;
      spacer.hidden = !scrolled;
    }
    rootNav.classList.toggle('is-scrolled', scrolled);
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);
  window.addEventListener('pageshow', updateNav);
  updateNav();
}

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

const navProducts = document.querySelectorAll('.nav-product');
navProducts.forEach((productNav) => {
  const trigger = productNav.querySelector('.nav-product-arrow');
  const menuLinks = productNav.querySelectorAll('.nav-product-menu a');
  if (!trigger) return;
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    const willOpen = !productNav.classList.contains('is-open');
    navProducts.forEach((item) => {
      item.classList.remove('is-open');
      const itemTrigger = item.querySelector('.nav-product-arrow');
      if (itemTrigger) itemTrigger.setAttribute('aria-expanded', 'false');
    });
    productNav.classList.toggle('is-open', willOpen);
    trigger.setAttribute('aria-expanded', String(willOpen));
  });
  menuLinks.forEach((link) => link.addEventListener('click', () => {
    productNav.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (navLinks) navLinks.classList.remove('open');
  }));
});
document.addEventListener('click', (event) => {
  if (event.target.closest('.nav-product')) return;
  navProducts.forEach((item) => {
    item.classList.remove('is-open');
    const trigger = item.querySelector('.nav-product-arrow');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
});
