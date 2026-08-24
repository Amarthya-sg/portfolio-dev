// Instant Mobile Redirect to single-page scroll
(function() {
  const isMobile = window.innerWidth <= 900;
  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf('/') + 1);

  if (isMobile && pageName && pageName !== 'index.html' && pageName !== '') {
    let anchor = '';
    if (pageName === 'work.html') anchor = '#work';
    else if (pageName === 'about.html') anchor = '#about';
    else if (pageName === 'experience.html') anchor = '#experience';
    else if (pageName === 'contact.html') anchor = '#contact';

    if (anchor) {
      window.location.replace('index.html' + anchor);
    }
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.navlinks');
  const links = navLinks.querySelectorAll('a');

  function closeMenu() {
    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuBtn.innerHTML = '&#9776;';
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  // Handle mobile full-screen takeover menu toggling
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      menuBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
      menuBtn.setAttribute('aria-expanded', isOpen);
      
      // Prevent background scrolling when takeover menu is active
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Handle link clicks (scroll on mobile, standard nav on desktop)
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const isMobile = window.innerWidth <= 900;

        if (isMobile && href) {
          if (href === 'index.html') {
            e.preventDefault();
            closeMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }

          if (href.endsWith('.html')) {
            const sectionId = href.replace('.html', '');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
              e.preventDefault();
              closeMenu();
              targetSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
        } else {
          closeMenu();
        }
      });
    });
  }

  // Smooth scroll on direct mobile load with hash
  if (window.innerWidth <= 900 && window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // Helper to update active class on mobile menu links
  function updateActiveLinkOnMobile() {
    const isMobile = window.innerWidth <= 900;
    if (!isMobile) return;

    const sections = ['work', 'about', 'experience', 'contact'];
    let currentSection = 'index.html'; // Default to home

    const scrollPos = window.scrollY + window.innerHeight / 3;

    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);
      if (section && scrollPos >= section.offsetTop) {
        currentSection = sectionId + '.html';
      }
    }

    links.forEach(link => {
      if (link.getAttribute('href') === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Hook into scroll event
  window.addEventListener('scroll', updateActiveLinkOnMobile);
  if (menuBtn) {
    menuBtn.addEventListener('click', updateActiveLinkOnMobile);
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
