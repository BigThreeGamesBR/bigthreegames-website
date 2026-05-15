const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('DOMContentLoaded', () => {
  setupNav();
  setupReveal();
  setupParallax();
  setupGallery();
  setupContactForm();
});

function setupNav() {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navList = document.querySelector('[data-nav-list]');

  if (!(navToggle instanceof HTMLButtonElement) || !(navList instanceof HTMLElement)) {
    return;
  }

  const closeMenu = () => {
    navList.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.contains('is-open');
    navList.classList.toggle('is-open', !isOpen);
    navToggle.setAttribute('aria-expanded', String(!isOpen));
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
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
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

function setupParallax() {
  // Disabled intentionally to avoid hero media drift between pages and devices.
  return;
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

function setupContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const endpoint = form.getAttribute('data-endpoint')?.trim() || '/api/contact';
  const statusElement = form.querySelector('[data-form-status]');
  const submitButton = form.querySelector('button[type="submit"]');

  const setStatus = (message, tone = '') => {
    if (!(statusElement instanceof HTMLElement)) {
      return;
    }

    statusElement.textContent = message;
    statusElement.classList.remove('is-success', 'is-error', 'is-warning');

    if (tone) {
      statusElement.classList.add(tone);
    }
  };

  const setError = (field, message) => {
    const errorElement = form.querySelector(`[data-error-for="${field}"]`);
    if (!(errorElement instanceof HTMLElement)) {
      return;
    }

    errorElement.textContent = message;
  };

  const clearErrors = () => {
    const errorElements = form.querySelectorAll('[data-error-for]');
    errorElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.textContent = '';
      }
    });
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(form);

    const payload = {
      name: normalizeSingleLine(formData.get('name'), 90),
      email: normalizeSingleLine(formData.get('email'), 130),
      company: normalizeSingleLine(formData.get('company'), 120),
      topic: normalizeSingleLine(formData.get('topic'), 40),
      message: normalizeMultiline(formData.get('message'), 3000),
      website: normalizeSingleLine(formData.get('website'), 200),
      turnstileToken: normalizeSingleLine(formData.get('cf-turnstile-response'), 2000)
    };

    let hasError = false;

    if (payload.name.length < 2) {
      setError('name', 'Enter your name so we can reply correctly.');
      hasError = true;
    }

    if (!isValidEmail(payload.email)) {
      setError('email', 'Enter a valid email address.');
      hasError = true;
    }

    if (!payload.topic) {
      setError('topic', 'Select a topic so we can route your message.');
      hasError = true;
    }

    if (payload.message.length < 20) {
      setError('message', 'Please add a bit more detail (at least 20 characters).');
      hasError = true;
    }

    if (!payload.turnstileToken) {
      setError('turnstile', 'Complete the verification before sending.');
      hasError = true;
    }

    if (hasError) {
      setStatus('Please fix the highlighted fields.', 'is-warning');
      return;
    }

    if (payload.website) {
      setStatus('Message sent. Thanks for reaching out.', 'is-success');
      form.reset();
      return;
    }

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    setStatus('Sending your message...');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || 'Unable to send message right now.');
      }

      setStatus('Message sent successfully. We will get back to you soon.', 'is-success');
      form.reset();

      if (window.turnstile && typeof window.turnstile.reset === 'function') {
        window.turnstile.reset();
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Could not send your message right now. Please try email instead.';
      setStatus(message, 'is-error');
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    }
  });
}

function normalizeSingleLine(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function normalizeMultiline(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\r/g, '').trim().slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
