// device redirection layout check (runs immediately on script execution to prevent visual flashing)
(function checkDeviceLayout() {
  const isMobile = window.innerWidth < 900;
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const hash = window.location.hash;

  if (isMobile) {
    // Redirect mobile users to homepage hash if visiting separate pages
    if (page !== 'index.html' && page.endsWith('.html')) {
      const topic = page.replace('.html', '');
      window.location.replace(`index.html#${topic}`);
    }
  } else {
    // Redirect desktop users to separate pages if visiting homepage hashes
    if (page === 'index.html' && hash) {
      const topic = hash.replace('#', '');
      const validTopics = ['about', 'work', 'experience', 'contact'];
      if (validTopics.includes(topic)) {
        window.location.replace(`${topic}.html`);
      }
    }
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.navlinks');
  const links = navLinks.querySelectorAll('a');

  // Handle menu button toggling
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      menuBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          menuBtn.innerHTML = '&#9776;';
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Dynamic link rewriting based on viewport size
  const rewriteLinksForDevice = () => {
    const isMobile = window.innerWidth < 900;
    const allLinks = document.querySelectorAll('.navlinks a, .nav-cta, .nav-cta-mobile, .logo');

    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      if (isMobile) {
        // Desktop subpages (.html) -> Mobile hashes (index.html#hash)
        if (href.endsWith('.html') && href !== 'index.html' && !href.startsWith('index.html')) {
          const topic = href.replace('.html', '');
          link.setAttribute('href', `index.html#${topic}`);
        }
      } else {
        // Mobile hashes (index.html#hash) -> Desktop subpages (.html)
        if (href.includes('index.html#')) {
          const topic = href.split('#')[1];
          if (['about', 'work', 'experience', 'contact'].includes(topic)) {
            link.setAttribute('href', `${topic}.html`);
          }
        }
      }
    });
  };

  // Run rewrite links on load and resize
  rewriteLinksForDevice();
  window.addEventListener('resize', rewriteLinksForDevice);



  // Custom Cursor Implementation
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursorDot = document.createElement('div');
    const cursorRing = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let hasMoved = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasMoved) {
        cursorDot.style.opacity = 1;
        cursorRing.style.opacity = 1;
        hasMoved = true;
      }

      // Dot moves instantly
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    function animateCursor() {
      // Lerp for lagging outline follow effect
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Trigger cursor hovers on interactive targets
    const attachHovers = () => {
      const interactives = document.querySelectorAll('a, button, .agent-node');
      interactives.forEach(el => {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = 'true';

        el.addEventListener('mouseenter', () => {
          cursorRing.classList.add('hovered');
          cursorDot.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
          cursorRing.classList.remove('hovered');
          cursorDot.classList.remove('hovered');
        });
      });
    };

    attachHovers();

    // Re-attach hovers on document changes (e.g. view transitions)
    window.addEventListener('pagereveal', () => {
      setTimeout(attachHovers, 50);
    });
  }

  // Mobile pipeline node pulse sequencer
  const flowNodes = document.querySelectorAll('.flow-node');
  if (flowNodes.length > 0) {
    let activeIndex = 0;
    setInterval(() => {
      const currentPip = flowNodes[activeIndex].querySelector('.pip');
      if (currentPip) currentPip.classList.remove('pulse');
      
      activeIndex = (activeIndex + 1) % flowNodes.length;
      
      const nextPip = flowNodes[activeIndex].querySelector('.pip');
      if (nextPip) nextPip.classList.add('pulse');
    }, 2500);
  }
});
