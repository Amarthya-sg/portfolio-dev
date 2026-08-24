document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.navlinks');
  const links = navLinks.querySelectorAll('a');

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

    // Close menu when a link is clicked
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          menuBtn.innerHTML = '&#9776;';
          menuBtn.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
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
