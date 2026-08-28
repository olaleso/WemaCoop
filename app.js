const projects = [
  {
    title: 'Purple Villa — Alakuko',
    kicker: 'Completed Project',
    description: "A completed residential property milestone delivered through the cooperative's member property acquisition initiative.",
    location: 'Alakuko, Lagos',
    image: 'assets/purple-villa-real.webp',
    primary: 'View Project',
    secondary: 'Explore Property Schemes'
  },
  {
    title: 'Somolu Serviced Flats',
    kicker: 'Property Project',
    description: "Modern serviced apartments representing the cooperative's property investment and home-ownership opportunities for members.",
    location: 'Somolu, Lagos',
    image: 'assets/somolu-serviced-flats.webp',
    primary: 'View Project',
    secondary: 'Explore Investments'
  },
  {
    title: 'Oko-Omi Land Acquisition',
    kicker: 'Land Scheme',
    description: 'A serviced land acquisition initiative designed to broaden long-term property ownership opportunities for cooperative members.',
    location: 'Oko-Omi, Lagos',
    image: 'assets/oko-omi-land.webp',
    primary: 'View Project',
    secondary: 'Contact Cooperative'
  }
];

const opportunities = [
  { icon:'badge-dollar-sign', tone:'purple', title:'Qwik Loans', text:'Short-term member financing for urgent needs.' },
  { icon:'chart-no-axes-combined', tone:'teal', title:'Investment Hub', text:'Member opportunities designed for long-term growth.' },
  { icon:'building-2', tone:'gold', title:'Property Projects', text:'Explore cooperative property acquisition initiatives.' },
  { icon:'piggy-bank', tone:'green', title:'Savings Plans', text:'Build financial discipline through regular savings.' }
];

const newsItems = [
  { tag:'Property Milestone', title:'Purple Villa — Alakuko', date:'Completed project', image:'assets/purple-villa-real.webp' },
  { tag:'Property', title:'Somolu serviced flats expand member property opportunities', date:'Featured project', image:'assets/somolu-serviced-flats.webp' },
  { tag:'Land Scheme', title:'Oko-Omi acquisition supports long-term land ownership', date:'Featured project', image:'assets/oko-omi-land.webp' },
  { tag:'Member Services', title:'Explore cooperative savings, loans and investment options', date:'Member opportunities', image:'assets/purple-villa-real.webp' }
];

const slidesEl = document.getElementById('heroSlides');
const dotsEl = document.getElementById('heroDots');
let currentProject = 0;
let heroTimer;

function buildHero(){
  slidesEl.innerHTML = projects.map((p,i)=>`
    <article class="hero-slide ${i===0?'active':''}">
      <img src="${p.image}" alt="${p.title}">
      <div class="hero-content">
        <span class="hero-kicker">${p.kicker}</span>
        <h1>${p.title}</h1>
        <p>${p.description}</p>
        <div class="hero-location"><i data-lucide="map-pin"></i><span>${p.location}</span></div>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#contact">${p.primary} <span>→</span></a>
          <a class="btn btn-gold" href="#opportunities">${p.secondary}</a>
        </div>
      </div>
    </article>`).join('');
  dotsEl.innerHTML = projects.map((_,i)=>`<button type="button" class="${i===0?'active':''}" aria-label="Show project ${i+1}" data-index="${i}"></button>`).join('');
  refreshIcons();
}

function showProject(index){
  currentProject = (index + projects.length) % projects.length;
  document.querySelectorAll('.hero-slide').forEach((el,i)=>el.classList.toggle('active',i===currentProject));
  dotsEl.querySelectorAll('button').forEach((el,i)=>el.classList.toggle('active',i===currentProject));
}
function resetHeroTimer(){ clearInterval(heroTimer); heroTimer=setInterval(()=>showProject(currentProject+1),5500); }

buildHero();
document.getElementById('heroPrev').addEventListener('click',()=>{showProject(currentProject-1);resetHeroTimer()});
document.getElementById('heroNext').addEventListener('click',()=>{showProject(currentProject+1);resetHeroTimer()});
dotsEl.addEventListener('click',e=>{if(e.target.matches('button')){showProject(Number(e.target.dataset.index));resetHeroTimer()}});
resetHeroTimer();

let touchStartX=0;
const hero=document.querySelector('.project-hero');
hero.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX},{passive:true});
hero.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchStartX;if(Math.abs(dx)>45){showProject(currentProject+(dx<0?1:-1));resetHeroTimer()}},{passive:true});

const opportunityList=document.getElementById('opportunityList');
opportunityList.innerHTML=opportunities.map(o=>`
  <div class="opportunity-item">
    <span class="opp-icon ${o.tone}"><i data-lucide="${o.icon}"></i></span>
    <div><h3>${o.title}</h3><p>${o.text}</p></div>
    <a href="#contact" aria-label="View ${o.title}"><i data-lucide="chevron-right"></i></a>
  </div>`).join('');

const newsStrip=document.getElementById('newsStrip');
newsStrip.innerHTML=newsItems.map(n=>`
  <article class="news-card">
    <div class="news-thumb"><img src="${n.image}" alt=""></div>
    <div><p class="news-tag">${n.tag}</p><h3>${n.title}</h3><p class="news-date">${n.date}</p></div>
  </article>`).join('');

function refreshIcons(){ if(window.lucide) window.lucide.createIcons(); }
window.addEventListener('load', refreshIcons);
setTimeout(refreshIcons, 300);

const amountInput=document.getElementById('loanAmount');
const rangeInput=document.getElementById('loanRange');
const termInput=document.getElementById('loanTerm');
const rateInput=document.getElementById('loanRate');
const monthlyEl=document.getElementById('monthlyPayment');

function formatNaira(n){return new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(n).replace('NGN','₦').replace(/\s/g,'');}
function calculateLoan(){
  const P=Math.max(0,Number(amountInput.value)||0);
  const months=Number(termInput.value)||12;
  const annual=Number(rateInput.value)||0;
  const r=annual/100/12;
  const payment=r===0?P/months:(P*r*Math.pow(1+r,months))/(Math.pow(1+r,months)-1);
  monthlyEl.textContent=formatNaira(Math.round(payment));
  if(Number(rangeInput.value)!==P && P>=Number(rangeInput.min) && P<=Number(rangeInput.max)) rangeInput.value=P;
}
rangeInput.addEventListener('input',()=>{amountInput.value=rangeInput.value;calculateLoan()});
amountInput.addEventListener('input',calculateLoan);
termInput.addEventListener('change',calculateLoan);
rateInput.addEventListener('change',calculateLoan);
calculateLoan();

const panelToggle=document.querySelector('.panel-toggle');
panelToggle.addEventListener('click',()=>{
  document.querySelector('.calculator-body').classList.toggle('collapsed');
  panelToggle.classList.toggle('collapsed');
});

const menuToggle=document.querySelector('.menu-toggle');
const drawer=document.querySelector('.mobile-drawer');
const overlay=document.querySelector('.drawer-overlay');
const closeBtn=document.querySelector('.drawer-close');
function openDrawer(){drawer.classList.add('open');overlay.classList.add('show');document.body.classList.add('no-scroll');drawer.setAttribute('aria-hidden','false');menuToggle.setAttribute('aria-expanded','true')}
function closeDrawer(){drawer.classList.remove('open');overlay.classList.remove('show');document.body.classList.remove('no-scroll');drawer.setAttribute('aria-hidden','true');menuToggle.setAttribute('aria-expanded','false')}
menuToggle.addEventListener('click',()=>drawer.classList.contains('open')?closeDrawer():openDrawer());
closeBtn.addEventListener('click',closeDrawer);overlay.addEventListener('click',closeDrawer);document.querySelectorAll('.drawer-nav a,.drawer-actions a').forEach(a=>a.addEventListener('click',closeDrawer));

document.getElementById('year').textContent=new Date().getFullYear();
