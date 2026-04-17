/* ISH Akademie – Landingpage JS */

// Nav: scrolled class + mobile burger
const nav = document.getElementById('nav');
const burger = document.querySelector('.nav__burger');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burger?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

// Close mobile nav on link click
document.querySelectorAll('.nav__links a, .nav__cta').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
  });
});

// Smooth scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Form submission – Formspree AJAX
document.querySelector('.register__form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  btn.textContent = 'Wird gesendet …';
  btn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      btn.textContent = '✓ Wir melden uns in Kürze – danke für Ihr Interesse!';
      btn.style.background = '#00364a';
      form.reset();
      const labelEl = document.getElementById('buchung-selected-label') || document.getElementById('sv-buchung-label');
      if (labelEl) labelEl.textContent = '';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }, 7000);
    } else {
      throw new Error('Fehler beim Senden');
    }
  } catch {
    btn.textContent = 'Fehler – bitte erneut versuchen';
    btn.style.background = '#c0392b';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
    }, 4000);
  }
});

// Modul-Accordion (mod-accordion__trigger)
document.querySelectorAll('.mod-accordion__trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const panelId  = btn.getAttribute('aria-controls');
    const panel    = document.getElementById(panelId);

    // Collapse all in same list
    btn.closest('.modules__list, .aufbaukurs-section')
      ?.querySelectorAll('.mod-accordion__trigger').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const p = document.getElementById(b.getAttribute('aria-controls'));
        if (p) p.hidden = true;
      });

    // Toggle clicked
    if (!expanded && panel) {
      btn.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    }
  });
});

// Generic Accordion
document.querySelectorAll('.accordion-item__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    // Close all
    document.querySelectorAll('.accordion-item__btn').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling?.classList.remove('open');
    });
    // Toggle clicked
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling?.classList.add('open');
    }
  });
});

// Animate elements on scroll (Intersection Observer)
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.overview__card, .module-card, .trainer-card, .offer-item, .brand-card'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity .4s ease ${i * 0.07}s, transform .4s ease ${i * 0.07}s`;
  observer.observe(el);
});

document.addEventListener('animationend', () => {}, { once: true });

// Trigger visible class
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.visible, .overview__card.visible, .module-card.visible').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
});

// Add .visible via CSS transition when observed
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .overview__card.visible,
  .module-card.visible,
  .trainer-card.visible,
  .offer-item.visible,
  .brand-card.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(styleSheet);
