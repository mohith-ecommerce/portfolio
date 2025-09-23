// Mobile nav toggle
const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('primary-nav');
if(toggle && nav){
    toggle.addEventListener('click', ()=>{
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
}

// Modals
const $q = (s)=>document.querySelector(s);
const cal=$q('#modal-cal'), form=$q('#modal-form');
const openDlg = (d)=>{ if(d && d.showModal){ d.showModal(); document.documentElement.style.overflow='hidden'; } };
const closeDlg = (d)=>{ if(d && d.close){ d.close(); document.documentElement.style.overflow='auto'; } };
document.getElementById('btn-book')?.addEventListener('click',()=>openDlg(cal));
document.getElementById('btn-book-2')?.addEventListener('click',()=>openDlg(cal));
document.getElementById('btn-brief')?.addEventListener('click',()=>openDlg(form));
document.getElementById('btn-brief-2')?.addEventListener('click',()=>openDlg(form));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',e=>closeDlg(e.target.closest('dialog'))));
;[cal,form].forEach(d=>d?.addEventListener('click',e=>{ if(e.target===d) closeDlg(d)}));

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
    entries.forEach((e)=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target);} });
},{threshold: .12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Year
const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

// Vanilla infinite carousel for Projects (no jQuery, no Owl)
(function(){
    const car = document.getElementById('brandsCarousel');
    if(!car) return;
    const viewport = car.querySelector('.viewport');
    const track = car.querySelector('.track');
    const originals = Array.from(track.children);
    if(!originals.length) return;

    // Clone set to both ends
    const fragStart = document.createDocumentFragment();
    const fragEnd = document.createDocumentFragment();
    originals.forEach(el=>fragStart.appendChild(el.cloneNode(true)));
    originals.forEach(el=>fragEnd.appendChild(el.cloneNode(true)));
    track.insertBefore(fragStart, track.firstChild);
    track.appendChild(fragEnd);

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    function totalWidth(list){ return list.reduce((s,el,i)=> s + el.getBoundingClientRect().width + (i?gap:0), 0); }
    let originalWidth = totalWidth(originals);

    // Start in the middle (original set)
    viewport.scrollLeft = originalWidth;

    function visibleCount(){
        const w = originals[0].getBoundingClientRect().width + gap;
        return Math.max(1, Math.round((viewport.clientWidth + gap)/w));
    }
    function step(dir=1){
        const w = originals[0].getBoundingClientRect().width + gap;
        const stepPx = visibleCount()*w;
        viewport.scrollTo({left: viewport.scrollLeft + dir*stepPx, behavior:'smooth'});
    }

    function onScroll(){
        const left = viewport.scrollLeft;
        if (left < gap) {
            viewport.scrollLeft = left + originalWidth;
        } else if (left >= originalWidth*2) {
            viewport.scrollLeft = left - originalWidth;
        }
    }
    viewport.addEventListener('scroll', onScroll, {passive:true});

    car.querySelector('.prev')?.addEventListener('click', ()=>step(-1));
    car.querySelector('.next')?.addEventListener('click', ()=>step(1));

    // Autoplay (respect reduced motion)
    const preferReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer; function start(){ if(preferReduce) return; stop(); timer = setInterval(()=>step(1), 2400);} function stop(){ if(timer) clearInterval(timer); }
    car.addEventListener('mouseenter', stop); car.addEventListener('mouseleave', start); start();

    window.addEventListener('resize', ()=>{ originalWidth = totalWidth(originals); viewport.scrollLeft = originalWidth; });
})();
