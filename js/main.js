document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.navlinks');
  const links = navLinks.querySelectorAll('a');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      
      // Toggle button text between hamburger and cross
      menuBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;'; // &#10005; is ✕, &#9776; is ☰
      
      // Accessibility states
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a navigation link is clicked (jump link behavior)
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

  // Dynamic Orbit Core Text on Agent Node Hover
  const coreLabel = document.querySelector('.core-label');
  const agentNodes = document.querySelectorAll('.agent-node');

  if (coreLabel && agentNodes.length > 0) {
    const defaultText = coreLabel.innerHTML;
    const agentData = {
      'validator': '<b>Validator</b>Checks GDP docs<br>for compliance',
      'retriever': '<b>Retriever</b>RAG pipelines &<br>knowledge routing',
      'router': '<b>Router</b>Topic-based<br>dialog handoffs',
      'diff engine': '<b>Diff Engine</b>Semantic PDF<br>revision compare',
      'chat orchestrator': '<b>Orchestrator</b>Coordinating<br>multi-agent flows'
    };

    agentNodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        const key = node.textContent.trim().toLowerCase();
        if (agentData[key]) {
          coreLabel.style.opacity = 0;
          setTimeout(() => {
            coreLabel.innerHTML = agentData[key];
            coreLabel.style.opacity = 1;
          }, 150);
        }
      });

      node.addEventListener('mouseleave', () => {
        coreLabel.style.opacity = 0;
        setTimeout(() => {
          coreLabel.innerHTML = defaultText;
          coreLabel.style.opacity = 1;
        }, 150);
      });
    });
  }

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
});
