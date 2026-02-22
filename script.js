/* ====================================================
   NEXORA — Landing Page Scripts
   ==================================================== */

// ── Nav scroll effect ─────────────────────────────
const nav = document.getElementById('nav');
const snapContainer = document.querySelector('.snap-container');

if (snapContainer) {
  snapContainer.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', snapContainer.scrollTop > 40);
  });
}

// ── Mobile menu ───────────────────────────────────
const mobileBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  const spans = mobileBtn.querySelectorAll('span');
  if (mobileMenu.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    const spans = mobileBtn.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ── Scroll reveal animation ──────────────────────
const observerOptions = {
  root: snapContainer,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1,
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger animation for sibling cards
      const parent = entry.target.parentElement;
      const siblings = Array.from(parent.children).filter(
        el => el.classList.contains('glass-card') || el.classList.contains('step-card') || el.classList.contains('section-header')
      );
      const idx = siblings.indexOf(entry.target);
      const delay = idx >= 0 ? idx * 80 : 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.glass-card, .step-card, .section-header').forEach(el => {
  // Don't animate hero elements
  if (el.closest('#hero')) {
    el.classList.add('visible');
    return;
  }
  revealObserver.observe(el);
});

// ── Waitlist form handler ────────────────────────
function handleWaitlist(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  const toast = document.getElementById('toast');

  if (input.value) {
    // Show toast
    toast.classList.add('show');
    input.value = '';

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
}

// ── Smooth anchor scrolling (snap-aware)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target && snapContainer) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Parallax on hero orbs ────────────────────────
let ticking = false;
if (snapContainer) {
  snapContainer.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = snapContainer.scrollTop;
        const orbs = document.querySelectorAll('.hero-bg .orb');
        orbs.forEach((orb, i) => {
          const speed = 0.15 + i * 0.05;
          orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ── Bar chart animation ──────────────────────────
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.bar');
      bars.forEach((bar, i) => {
        const height = bar.style.height;
        bar.style.height = '0%';
        setTimeout(() => {
          bar.style.transition = 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
          bar.style.height = height;
        }, i * 100);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { root: snapContainer, threshold: 0.3 });

document.querySelectorAll('.bar-chart').forEach(chart => {
  barObserver.observe(chart);
});
