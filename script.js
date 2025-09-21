
// intersection observer for reveal
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      obs.unobserve(e.target);
    }
  });
},{rootMargin:"-10% 0px -10% 0px", threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// sticky CTA after some scroll
const sticky = document.querySelector('.sticky-cta');
let shown = false;
window.addEventListener('scroll', ()=>{
  const scrolled = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if(!shown && scrolled > height * 0.6){
    sticky.style.display = 'inline-block';
    shown = true;
  }
});

// Mobile menu toggle (accessible)
const headerEl = document.querySelector('.wf-header');
const toggleBtn = document.querySelector('.menu-toggle');
const navEl = document.getElementById('site-nav');
if(toggleBtn && headerEl && navEl){
  toggleBtn.addEventListener('click', ()=>{
    const open = headerEl.classList.toggle('nav-open');
    toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if(open){
      const firstLink = navEl.querySelector('a');
      if(firstLink) firstLink.focus();
    }
  });
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && headerEl.classList.contains('nav-open')){
      headerEl.classList.remove('nav-open');
      toggleBtn.setAttribute('aria-expanded','false');
      toggleBtn.focus();
    }
  });
  navEl.addEventListener('click', (e)=>{
    if(e.target.closest('a')){
      headerEl.classList.remove('nav-open');
      toggleBtn.setAttribute('aria-expanded','false');
    }
  });
  document.addEventListener('click', (e)=>{
    if(headerEl.classList.contains('nav-open')){
      const inside = headerEl.contains(e.target);
      if(!inside){
        headerEl.classList.remove('nav-open');
        toggleBtn.setAttribute('aria-expanded','false');
      }
    }
  });
}
