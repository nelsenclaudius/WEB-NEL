// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Detail & Jobdesc toggles (per experience/organization entry)
document.querySelectorAll('.detail-btn, .jobdesc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = document.getElementById(btn.dataset.target);
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }
    btn.classList.toggle('active', isHidden);
  });
});

// Simple auto-swipe carousel for elements with `data-carousel`
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const items = Array.from(carousel.querySelectorAll('.carousel-item'));
  if (!track || items.length <= 1) return;

  let index = 0;
  const count = items.length;
  const intervalMs = 3000;
  let paused = false;

  function goTo(i){
    index = (i + count) % count;
    track.style.transform = `translateX(${ -index * 100 }%)`;
  }

  let timer = setInterval(() => { if(!paused) goTo(index + 1); }, intervalMs);

  carousel.addEventListener('mouseenter', () => { paused = true; });
  carousel.addEventListener('mouseleave', () => { paused = false; });

  // make images keyboard accessible (left/right to navigate)
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === 'ArrowLeft') goTo(index - 1);
  });
});

// Lightbox/modal for project thumbnails
const imgModal = document.getElementById('imgModal');
const imgModalImg = document.getElementById('imgModalImg');
const imgModalCaption = document.getElementById('imgModalCaption');
const imgModalClose = document.getElementById('imgModalClose');
const imgModalOverlay = document.getElementById('imgModalOverlay');

function openImageModal(src, alt){
  if(!imgModal) return;
  imgModalImg.src = src;
  imgModalImg.alt = alt || '';
  imgModalCaption.textContent = alt || '';
  imgModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeImageModal(){
  if(!imgModal) return;
  imgModal.setAttribute('aria-hidden', 'true');
  imgModalImg.src = '';
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.project-img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const full = img.dataset.full || img.src;
    openImageModal(full, img.alt || '');
  });
});

// Disable image drag and right-click/save behaviors
const protectedImages = document.querySelectorAll('img');
protectedImages.forEach(img => {
  img.setAttribute('draggable', 'false');
  img.addEventListener('dragstart', event => event.preventDefault());
  img.addEventListener('contextmenu', event => event.preventDefault());
});

if (imgModalClose) imgModalClose.addEventListener('click', closeImageModal);
if (imgModalOverlay) imgModalOverlay.addEventListener('click', closeImageModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeImageModal();
});