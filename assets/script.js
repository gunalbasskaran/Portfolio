/* =============================================================
   GUNAL BASSKARAN — Portfolio JavaScript
   Vanilla ES6+ — No frameworks, no libraries
   ============================================================= */

(function () {
  'use strict';

  /* -----------------------------------------------------------
     DOM REFERENCES
     ----------------------------------------------------------- */
  const loader      = document.getElementById('loader');
  const navbar      = document.getElementById('navbar');
  const navToggle   = document.getElementById('nav-toggle');
  const navMenu     = document.getElementById('nav-menu');
  const navLinks    = document.querySelectorAll('.navbar__link');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const typedText   = document.getElementById('typed-text');
  const sections    = document.querySelectorAll('section[id]');
  const fadeEls     = document.querySelectorAll('.fade-in');

  /* -----------------------------------------------------------
     0. FULLSCREEN LOADER — fade out after page load
     ----------------------------------------------------------- */
  function hideLoader() {
    if (loader) {
      loader.classList.add('hidden');
      // Remove from DOM after transition completes
      loader.addEventListener('transitionend', function () {
        loader.style.display = 'none';
      }, { once: true });
    }
  }

  // Hide loader once everything is loaded (or after 3s max)
  window.addEventListener('load', function () {
    setTimeout(hideLoader, 800);
  });
  // Safety fallback in case load event was missed
  setTimeout(hideLoader, 3500);

  /* -----------------------------------------------------------
     1. STICKY NAVBAR — add 'scrolled' class on scroll
     ----------------------------------------------------------- */
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  // Run once on load
  handleNavbarScroll();


  /* -----------------------------------------------------------
     2. MOBILE MENU TOGGLE
     ----------------------------------------------------------- */
  function toggleMobileMenu() {
    const isOpen = navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMobileMenu);

  // Close menu when a nav link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMobileMenu();
      navToggle.focus();
    }
  });


  /* -----------------------------------------------------------
     3. SMOOTH SCROLLING (enhanced)
     ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* -----------------------------------------------------------
     4. ACTIVE NAV LINK — highlight based on scroll position
     ----------------------------------------------------------- */
  function updateActiveNavLink() {
    var scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      var sectionTop    = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();


  /* -----------------------------------------------------------
     5. FADE-IN ON SCROLL — Intersection Observer
     ----------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* -----------------------------------------------------------
     6. TYPING ANIMATION
     ----------------------------------------------------------- */
  var typingStrings = [
    'Building Clean & Modern Websites',
    'Full Stack Developer',
    'AI / ML Enthusiast',
    'Open to Opportunities'
  ];
  var stringIndex  = 0;
  var charIndex    = 0;
  var isDeleting   = false;
  var typingSpeed  = 80;

  function typeWriter() {
    var current = typingStrings[stringIndex];

    if (isDeleting) {
      typedText.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typedText.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    // Finished typing the string
    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause before deleting
    }

    // Finished deleting
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % typingStrings.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(typeWriter, typingSpeed);
  }

  // Start typing when DOM is ready
  if (typedText) {
    setTimeout(typeWriter, 600);
  }


  /* -----------------------------------------------------------
     7. CONTACT FORM VALIDATION
     ----------------------------------------------------------- */
  /**
   * Validates a single form field and shows/clears error.
   * @param {HTMLElement} field - The input/textarea element.
   * @param {string} errorId - The ID of the error element.
   * @returns {boolean} Whether the field is valid.
   */
  function validateField(field, errorId) {
    var errorEl = document.getElementById(errorId);
    var value   = field.value.trim();
    var isValid = true;
    var message = '';

    if (!value) {
      isValid = false;
      message = capitalizeFirst(field.name) + ' is required.';
    } else if (field.type === 'email' && !isValidEmail(value)) {
      isValid = false;
      message = 'Please enter a valid email address.';
    }

    if (!isValid) {
      field.classList.add('error');
      errorEl.textContent = message;
    } else {
      field.classList.remove('error');
      errorEl.textContent = '';
    }

    return isValid;
  }

  /**
   * Simple email validation regex.
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Capitalize first letter.
   */
  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (contactForm) {
    // Real-time validation on blur
    var fields = [
      { el: document.getElementById('form-name'),    errorId: 'name-error' },
      { el: document.getElementById('form-email'),   errorId: 'email-error' },
      { el: document.getElementById('form-subject'), errorId: 'subject-error' },
      { el: document.getElementById('form-message'), errorId: 'message-error' }
    ];

    fields.forEach(function (f) {
      if (f.el) {
        f.el.addEventListener('blur', function () {
          validateField(f.el, f.errorId);
        });
        // Clear error on input
        f.el.addEventListener('input', function () {
          if (f.el.classList.contains('error')) {
            validateField(f.el, f.errorId);
          }
        });
      }
    });

    // Form submission
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var allValid = true;

      fields.forEach(function (f) {
        if (!validateField(f.el, f.errorId)) {
          allValid = false;
        }
      });

      if (!allValid) {
        // Focus the first invalid field
        var firstError = contactForm.querySelector('.form-input.error');
        if (firstError) firstError.focus();
        return;
      }

      // Simulate form submission success
      // In production, replace with actual API call (e.g., Formspree, EmailJS, or custom backend)
      formSuccess.hidden = false;
      contactForm.reset();

      // Remove success message after 5 seconds
      setTimeout(function () {
        formSuccess.hidden = true;
      }, 5000);
    });
  }


  /* -----------------------------------------------------------
     8. PERFORMANCE — Throttle scroll events
     ----------------------------------------------------------- */
  // Note: The scroll listeners above use `passive: true` for performance.
  // The IntersectionObserver handles fade-in without adding scroll listeners.


  /* -----------------------------------------------------------
     9. BACK TO TOP — smooth scroll when clicking footer logo
     ----------------------------------------------------------- */
  var footerLogo = document.querySelector('.footer__logo');
  if (footerLogo) {
    footerLogo.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
