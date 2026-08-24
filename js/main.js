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

  // Custom Cursor Implementation (Skipped entirely if user prefers reduced motion)
  if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
