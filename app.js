const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');menu.querySelector('.menu-label').textContent='Menu'}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.querySelector('.menu-label').textContent=open?'Close':'Menu'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus()}});
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let paused=preference.matches;
const running=new Map();
function finishCounter(el){el.textContent=Number(el.dataset.count).toFixed(Number(el.dataset.decimals||0));if(running.has(el))cancelAnimationFrame(running.get(el));running.delete(el)}
function setMotion(value){paused=value;document.documentElement.classList.toggle('motion-paused',value);if(value){running.forEach((_,el)=>finishCounter(el));document.querySelectorAll('.waiting').forEach(el=>el.classList.remove('waiting'))}}
setMotion(paused);
preference.addEventListener('change',e=>setMotion(e.matches));
function count(el){if(paused){finishCounter(el);return}const target=Number(el.dataset.count),decimals=Number(el.dataset.decimals||0),start=performance.now();el.textContent=(0).toFixed(decimals);function frame(now){if(paused){finishCounter(el);return}const t=Math.min(1,(now-start)/1800);el.textContent=(target*(1-Math.pow(1-t,3))).toFixed(decimals);if(t<1)running.set(el,requestAnimationFrame(frame));else finishCounter(el)}running.set(el,requestAnimationFrame(frame))}
if('IntersectionObserver' in window){
 const counts=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){count(e.target);counts.unobserve(e.target)}}),{threshold:0,rootMargin:'0px 0px -50px 0px'});
 document.querySelectorAll('[data-count]').forEach(el=>counts.observe(el));
 const reveals=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('waiting','pending');reveals.unobserve(e.target)}}),{threshold:0,rootMargin:'0px 0px -35px 0px'});
 document.querySelectorAll('.section-heading,.about-body,.training-grid article,.credentials,.project-card,.metric').forEach(el=>{el.classList.add('reveal');if(!paused){el.classList.add('waiting')}reveals.observe(el)});
}
const progress=document.querySelector('.scroll-progress');let scheduled=false;
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;scheduled=false}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress)}},{passive:true});addEventListener('resize',updateProgress);updateProgress();

const viewer=document.querySelector('#image-viewer'),viewerImage=viewer.querySelector('img'),viewerCaption=viewer.querySelector('.viewer-caption');let viewerReturn=null;
function closeViewer(){viewer.hidden=true;viewerImage.removeAttribute('src');document.body.style.overflow='';viewerReturn?.focus()}
document.querySelectorAll('.lightbox-link').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();viewerReturn=link;viewerImage.src=link.href;viewerImage.alt=link.querySelector('img')?.alt||link.dataset.caption||'Image preview';viewerCaption.textContent=link.dataset.caption||'';viewer.hidden=false;document.body.style.overflow='hidden';viewer.querySelector('.viewer-close').focus()}));
viewer.querySelector('.viewer-close').addEventListener('click',closeViewer);viewer.addEventListener('click',e=>{if(e.target===viewer)closeViewer()});document.addEventListener('keydown',e=>{if(viewer.hidden)return;if(e.key==='Escape')closeViewer();if(e.key==='Tab'){e.preventDefault();viewer.querySelector('.viewer-close').focus()}});
