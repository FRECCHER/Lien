const revealElements = document.querySelectorAll('.reveal');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const siteHeader = document.querySelector('.site-header');

const showElement = (element) => element.classList.add('is-visible');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        showElement(entry.target);
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach(showElement);
}

navToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    navToggle?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const updateHeader = () => {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 12);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
      openItem.classList.remove('is-open');
      openItem.querySelector('button').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});
