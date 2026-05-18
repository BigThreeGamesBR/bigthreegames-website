const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('DOMContentLoaded', () => {
  setupNav();
  setupReveal();
  setupGallery();
});

function setupNav() {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navList = document.querySelector('[data-nav-list]');

  if (!(navToggle instanceof HTMLButtonElement) || !(navList instanceof HTMLElement)) {
    return;
  }

  const navLinks = Array.from(navList.querySelectorAll('a[href]')).filter(
    (link) => link instanceof HTMLAnchorElement
  );

  const closeMenu = ({ returnFocus = false } = {}) => {
    navList.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');

    if (returnFocus) {
      navToggle.focus();
    }
  };

  const openMenu = () => {
    navList.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');

    const firstLink = navLinks[0];
    if (firstLink instanceof HTMLAnchorElement) {
      firstLink.focus();
    }
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.contains('is-open');

    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  navList.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.closest('a[href]')) {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (!navList.classList.contains('is-open')) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!navList.contains(target) && target !== navToggle) {
      closeMenu({ returnFocus: false });
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu({ returnFocus: true });
    }
  });
}

function setupReveal() {
  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  if (revealItems.length === 0) {
    return;
  }

  if (prefersReducedMotion.matches) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -6% 0px'
    }
  );

  revealItems.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index * 45, 360)}ms`);
    observer.observe(item);
  });
}

function setupGallery() {
  const galleries = Array.from(document.querySelectorAll('[data-gallery]'));
  if (galleries.length === 0) {
    return;
  }

  galleries.forEach((gallery) => {
    const slides = Array.from(gallery.querySelectorAll('.gallery__slide'));
    if (slides.length === 0) {
      return;
    }

    let currentIndex = slides.findIndex((slide) => !slide.hasAttribute('hidden'));
    if (currentIndex === -1) {
      currentIndex = 0;
    }

    const status = gallery.querySelector('[data-gallery-status]');
    const prevButton = gallery.querySelector('[data-gallery-prev]');
    const nextButton = gallery.querySelector('[data-gallery-next]');
    const thumbButtons = Array.from(gallery.querySelectorAll('[data-gallery-thumb]'));

    const render = () => {
      slides.forEach((slide, index) => {
        slide.hidden = index !== currentIndex;

        const video = slide.querySelector('video');
        if (video instanceof HTMLVideoElement && index !== currentIndex) {
          video.pause();
        }

        const embedFrame = slide.querySelector('iframe[data-gallery-embed]');
        if (embedFrame instanceof HTMLIFrameElement && index !== currentIndex) {
          const src = embedFrame.getAttribute('src');
          if (src) {
            embedFrame.setAttribute('src', src);
          }
        }
      });

      thumbButtons.forEach((thumb, index) => {
        if (!(thumb instanceof HTMLButtonElement)) {
          return;
        }

        const isActive = index === currentIndex;
        thumb.classList.toggle('is-active', isActive);
        thumb.setAttribute('aria-pressed', String(isActive));
      });

      if (status) {
        status.textContent = `${currentIndex + 1} / ${slides.length}`;
      }
    };

    if (prevButton instanceof HTMLButtonElement) {
      prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        render();
      });
    }

    if (nextButton instanceof HTMLButtonElement) {
      nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        render();
      });
    }

    thumbButtons.forEach((thumb, index) => {
      if (!(thumb instanceof HTMLButtonElement)) {
        return;
      }

      thumb.addEventListener('click', () => {
        currentIndex = index;
        render();
      });
    });

    render();
  });
}
