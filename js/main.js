document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.navlinks');
  const links = navLinks ? navLinks.querySelectorAll('a') : [];

  function closeMenu() {
    if (navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  // Handle mobile full-screen takeover menu toggling
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', isOpen);
      
      // Prevent background scrolling when takeover menu is active
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when current page link is clicked
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const isMobile = window.innerWidth <= 900;

        if (isMobile && href) {
          const path = window.location.pathname;
          const pageName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
          if (href === pageName) {
            closeMenu();
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      });
    });
  }

  // Smooth custom mouse cursor follow effect (desktops only)
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let isHidden = true;

    // Track mouse coordinates
    document.addEventListener('mousemove', (e) => {
      if (isHidden) {
        cursor.style.opacity = '1';
        isHidden = false;
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Hide/show cursor when mouse leaves/enters viewport
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      isHidden = true;
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      isHidden = false;
    });

    // Interpolation loop
    function updateCursor() {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      // 0.12 scale factor for ultra-smooth easing
      cursorX += dx * 0.12;
      cursorY += dy * 0.12;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Event delegation for hover states
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .hero-name span, .contact-links a, .sec-title, .contact-title')) {
        cursor.classList.add('hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .hero-name span, .contact-links a, .sec-title, .contact-title')) {
        cursor.classList.remove('hover');
      }
    });
  }

  // Scroll reveal Intersection Observer
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }
});
