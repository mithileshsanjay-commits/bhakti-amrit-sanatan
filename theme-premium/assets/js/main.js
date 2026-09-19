/* ======================================================
   BHAKTI AMRIT SANATAN — JavaScript Core
   Animations, Interactions, Panchang, Particles
   ====================================================== */

'use strict';

// ── NAMESPACE ──────────────────────────────────────────
if (typeof window !== 'undefined') {
  window.BAS = window.BAS || {};
} else if (typeof globalThis !== 'undefined') {
  globalThis.BAS = globalThis.BAS || {};
}
var BAS = (typeof window !== 'undefined' ? window.BAS : (typeof globalThis !== 'undefined' ? globalThis.BAS : {}));

// ── PANCHANG DATA ──────────────────────────────────────
BAS.panchangData = (function () {
  const today = new Date();
  const day   = today.getDay();
  const days  = ['रविवार','सोमवार','मंगलवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'];
  const months = ['चैत्र','वैशाख','ज्येष्ठ','आषाढ़','श्रावण','भाद्रपद','आश्विन','कार्तिक','मार्गशीर्ष','पौष','माघ','फाल्गुन'];
  const tithis = ['प्रतिपदा','द्वितीया','तृतीया','चतुर्थी','पंचमी','षष्ठी','सप्तमी','अष्टमी','नवमी','दशमी','एकादशी','द्वादशी','त्रयोदशी','चतुर्दशी','पूर्णिमा/अमावस्या'];

  const lunarDay   = Math.floor((today.getDate() % 30) * (15/30));
  const lunarMonth = Math.floor((today.getMonth() + 9) % 12);

  return {
    varara: days[day],
    tithi:  tithis[lunarDay],
    masa:   months[lunarMonth],
  };
})();

// ── TICKER BAR ─────────────────────────────────────────
BAS.initTicker = function () {
  const panchangEl = document.getElementById('bas-panchang-text');
  if (!panchangEl) return;

  try {
    if (BAS.Astro && typeof BAS.Astro.calculatePanchang === 'function') {
      const now = BAS.Astro.getNow ? BAS.Astro.getNow() : new Date();
      const p = BAS.Astro.calculatePanchang(now, 'Asia/Kolkata');
      const text = `${p.dayOfWeek.hi} · तिथि: ${p.tithi.hi} (${p.tithi.pakshaHi}) · सूर्योदय: ${p.solar.sunrise} · ॐ नमः शिवाय · जय श्री राम · हरे कृष्ण · ॐ गं गणपतये नमः · ${p.dayOfWeek.hi} · तिथि: ${p.tithi.hi} (${p.tithi.pakshaHi})`;
      panchangEl.textContent = text;
      return;
    }
  } catch (e) {}

  const { varara, tithi, masa } = BAS.panchangData;
  const text = `${varara} · तिथि: ${tithi} · मास: ${masa} · ॐ नमः शिवाय · जय श्री राम · हरे कृष्ण · ॐ गं गणपतये नमः · ${varara} · तिथि: ${tithi} · मास: ${masa}`;
  panchangEl.textContent = text;
};

// ── STICKY NAV ─────────────────────────────────────────
BAS.initNav = function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const handler = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handler, { passive: true });

  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav__menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      const open = menu.classList.contains('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.querySelectorAll('span').forEach((s, i) => {
        if (open) {
          if (i === 0) s.style.transform = 'rotate(45deg) translate(5px, 5px)';
          if (i === 1) s.style.opacity = '0';
          if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          s.style.transform = '';
          s.style.opacity = '';
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        menu.classList.remove('open');
        toggle.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      }
    });
  }

  // Active link highlight
  const links = nav.querySelectorAll('.nav__link');
  const path  = location.pathname;
  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href && path.includes(href.replace('.html', '')) && href !== 'index.html') {
      link.classList.add('active');
    }
    if ((path === '/' || path.endsWith('index.html')) && href === 'index.html') {
      link.classList.add('active');
    }
  });
};

// ── BACK TO TOP ────────────────────────────────────────
BAS.initBackToTop = function () {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

// ── SCROLL REVEAL ──────────────────────────────────────
BAS.initScrollReveal = function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => io.observe(el));
};

// ── PARTICLES ──────────────────────────────────────────
BAS.initParticles = function () {
  const container = document.querySelector('.particles');
  if (!container) return;

  const count = window.innerWidth < 700 ? 12 : 24;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${6 + Math.random() * 8}s;
      --delay: ${Math.random() * 8}s;
      --op: ${0.3 + Math.random() * 0.5};
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
    `;
    container.appendChild(p);
  }
};

// ── FILTER BUTTONS ─────────────────────────────────────
BAS.initFilters = function () {
  const btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      if (filterValue === 'shlokas') {
        const feat = document.getElementById('featured-shloka');
        if (feat) {
          feat.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const items = document.querySelectorAll('[data-category]');
      if (!items.length) return;

      items.forEach(item => {
        const cats = (item.getAttribute('data-category') || '').trim().split(/\s+/);
        if (filterValue === 'all' || cats.includes(filterValue)) {
          item.style.display = '';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            if (item.style.opacity === '0') {
              item.style.display = 'none';
            }
          }, 250);
        }
      });
    });
  });
};

// ── WHATSAPP SHARE ─────────────────────────────────────
BAS.initWhatsAppShare = function () {
  const shareBtns = document.querySelectorAll('.whatsapp-share-btn');
  if (!shareBtns.length) return;

  shareBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get dynamic content to share or fallback to page URL
      const shareTitle = btn.getAttribute('data-share-title') || document.title;
      let shareUrl = btn.getAttribute('data-share-url') || window.location.href;
      
      // Check if there is specific quote text (e.g. for Geeta shlokas)
      const shareText = btn.getAttribute('data-share-text');
      
      let message = `${shareTitle}\n\n`;
      if (shareText) {
        message += `"${shareText}"\n\n`;
      }
      message += `Read more on Bhakti Amrit Sanatan: ${shareUrl}`;
      
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  });
};

// ── DONATE AMOUNT BUTTONS ──────────────────────────────
BAS.initDonateAmounts = function () {
  const btns = document.querySelectorAll('.donate-amount-btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      // Sync to custom input
      const customInput = document.querySelector('#donate-custom');
      if (customInput && btn.dataset.amount) {
        customInput.value = btn.dataset.amount;
      }
    });
  });
};

// ── AUTOMATIC ARTICLE & MANTRA COUNTERS ────────────────
BAS.updateDynamicCounters = function () {
  const data = window.ARTICLES_DATA || window.SANATAN_ARTICLES;
  if (!data || !Array.isArray(data) || !data.length) return;

  const totalArticles = data.length;
  const totalMantras = data.filter(function (item) {
    const cat = (item.category || item.c || '').toLowerCase();
    return cat === 'mantras' || cat === 'mantra';
  }).length || 38;

  // Update Articles Published counters
  document.querySelectorAll('[data-stat="articles"]').forEach(function (el) {
    el.dataset.count = totalArticles;
    el.textContent = totalArticles.toLocaleString();
  });

  // Update Mantras & Stotras counters (actual numbers, no fake/plus)
  document.querySelectorAll('[data-stat="mantras"]').forEach(function (el) {
    el.dataset.count = totalMantras;
    el.removeAttribute('data-suffix');
    el.textContent = totalMantras.toLocaleString();
  });
};

// ── COUNTER ANIMATION ──────────────────────────────────
BAS.animateCounters = function () {
  if (typeof BAS.updateDynamicCounters === 'function') {
    BAS.updateDynamicCounters();
  }
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1500;
      const start  = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / dur, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
};

// ── NEWSLETTER FORM ────────────────────────────────────
BAS.initNewsletterForm = function () {
  const forms = document.querySelectorAll('[data-newsletter-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button[type="submit"]');
      if (!input || !input.value) return;

      const original = btn.textContent;
      btn.textContent = '✓ Subscribed!';
      btn.disabled = true;
      btn.style.background = 'rgba(34,197,94,0.2)';
      btn.style.borderColor = '#22c55e';
      btn.style.color = '#22c55e';

      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.cssText = '';
        input.value = '';
      }, 3000);
    });
  });
};

// ── LAZY LOAD IMAGES ───────────────────────────────────
BAS.initLazyImages = function () {
  if (!('IntersectionObserver' in window)) return;

  const imgs = document.querySelectorAll('img[data-src]');
  if (!imgs.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.style.opacity = '0';
      img.onload = () => {
        img.style.transition = 'opacity 0.5s ease';
        img.style.opacity = '1';
      };
      io.unobserve(img);
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => io.observe(img));
};

// ── SMOOTH PAGE VISIBILITY & BFCACHE RESTORE ───────────
BAS.initPageTransitions = function () {
  // Always guarantee page is visible immediately
  document.body.style.opacity = '1';

  // Handle browser Back/Forward navigation from bfcache
  window.addEventListener('pageshow', function () {
    document.body.style.opacity = '1';
  });

  // Support local file:/// execution
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href^="/"]').forEach(a => {
      const h = a.getAttribute('href');
      if (h && !h.startsWith('//') && !h.includes('.html')) {
        const hashIdx = h.indexOf('#');
        const pathPart = hashIdx !== -1 ? h.substring(0, hashIdx) : h;
        const hashPart = hashIdx !== -1 ? h.substring(hashIdx) : '';
        const cleanPath = pathPart.replace(/^\//, '');
        if (cleanPath) {
          a.setAttribute('href', cleanPath + '.html' + hashPart);
        } else {
          a.setAttribute('href', 'index.html' + hashPart);
        }
      }
    });
  }
};

// ── DIYA GLOW CURSOR (desktop) ─────────────────────────
BAS.initCursorGlow = function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; z-index: 9999; pointer-events: none;
    width: 24px; height: 24px; border-radius: 50%;
    background: radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 70%);
    transform: translate(-50%,-50%);
    transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease;
  `;
  document.body.appendChild(glow);

  let x = 0, y = 0;
  document.addEventListener('mousemove', (e) => {
    x = e.clientX; y = e.clientY;
    glow.style.left = x + 'px';
    glow.style.top  = y + 'px';
  });

  // Expand on interactive elements
  document.querySelectorAll('a, button, .cat-card, .post-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      glow.style.width  = '60px';
      glow.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
      glow.style.width  = '24px';
      glow.style.height = '24px';
    });
  });
};

// ── READING PROGRESS BAR ───────────────────────────────
BAS.initReadingProgress = function () {
  const bar = document.querySelector('.reading-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total   = document.body.scrollHeight - window.innerHeight;
    const percent = (window.scrollY / total) * 100;
    bar.style.width = Math.min(percent, 100) + '%';
  }, { passive: true });
};

// ── CURRENT DATE DISPLAY ───────────────────────────────
BAS.updateDates = function () {
  const dateEls = document.querySelectorAll('[data-today]');
  const today   = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  dateEls.forEach(el => {
    el.textContent = today.toLocaleDateString('hi-IN', options);
  });
};

// ── AUTHORITATIVE FESTIVAL DATABASE & COUNTDOWN ENGINE ──────────────
BAS.festivalDatabase = [
  { id: 'ganesh-chaturthi-2026', name: 'Ganesh Chaturthi 2026', name_hi: 'श्री गणेश चतुर्थी 2026', date: '2026-09-14', deva: 'भाद्रपद शुक्ल चतुर्थी · 14 September, 2026', icon: '🐘' },
  { id: 'anant-chaturdashi-2026', name: 'Anant Chaturdashi 2026', name_hi: 'अनंत चतुर्दशी (गणेश विसर्जन) 2026', date: '2026-09-25', deva: 'भाद्रपद शुक्ल चतुर्दशी · 25 September, 2026', icon: '🕉️' },
  { id: 'sharad-navratri-2026', name: 'Sharad Navratri 2026', name_hi: 'शारदीय नवरात्रि (घटस्थापना) 2026', date: '2026-10-11', deva: 'आश्विन शुक्ल प्रतिपदा · 11 October, 2026', icon: '🌺' },
  { id: 'dussehra-2026', name: 'Dussehra / Vijayadashami 2026', name_hi: 'दशहरा (विजयादशमी) 2026', date: '2026-10-20', deva: 'आश्विन शुक्ल दशमी · 20 October, 2026', icon: '🏹' },
  { id: 'karwa-chauth-2026', name: 'Karwa Chauth 2026', name_hi: 'करवा चौथ व्रत 2026', date: '2026-10-29', deva: 'कार्तिक कृष्ण चतुर्थी · 29 October, 2026', icon: '🌕' },
  { id: 'dhanteras-2026', name: 'Dhanteras 2026', name_hi: 'धनतेरस (धनत्रयोदशी) 2026', date: '2026-11-06', deva: 'कार्तिक कृष्ण त्रयोदशी · 6 November, 2026', icon: '🪙' },
  { id: 'diwali-2026', name: 'Diwali 2026', name_hi: 'दीपावली (महालक्ष्मी पूजन) 2026', date: '2026-11-08', deva: 'कार्तिक अमावस्या · 8 November, 2026', icon: '🪔' },
  { id: 'govardhan-puja-2026', name: 'Govardhan Puja 2026', name_hi: 'गोवर्धन पूजा (अन्नकूट) 2026', date: '2026-11-09', deva: 'कार्तिक शुक्ल प्रतिपदा · 9 November, 2026', icon: '🏔️' },
  { id: 'bhai-dooj-2026', name: 'Bhai Dooj 2026', name_hi: 'भाई दूज (यम द्वितीया) 2026', date: '2026-11-10', deva: 'कार्तिक शुक्ल द्वितीया · 10 November, 2026', icon: '🌸' },
  { id: 'chhath-puja-2026', name: 'Chhath Puja 2026', name_hi: 'छठ पूजा (संध्या अर्घ्य) 2026', date: '2026-11-14', deva: 'कार्तिक शुक्ल षष्ठी · 14 November, 2026', icon: '☀️' },
  { id: 'dev-utthana-ekadashi-2026', name: 'Dev Uthani Ekadashi 2026', name_hi: 'देवउठनी एकादशी (तुलसी विवाह) 2026', date: '2026-11-20', deva: 'कार्तिक शुक्ल एकादशी · 20 November, 2026', icon: '🌿' },
  { id: 'dev-deepawali-2026', name: 'Dev Deepawali 2026', name_hi: 'देव दीपावली (कार्तिक पूर्णिमा) 2026', date: '2026-11-24', deva: 'कार्तिक शुक्ल पूर्णिमा · 24 November, 2026', icon: '✨' },
  { id: 'gita-jayanti-2026', name: 'Gita Jayanti 2026', name_hi: 'गीता जयंती (मोक्षदा एकादशी) 2026', date: '2026-12-20', deva: 'मार्गशीर्ष शुक्ल एकादशी · 20 December, 2026', icon: '📖' },
  { id: 'makar-sankranti-2027', name: 'Makar Sankranti 2027', name_hi: 'मकर संक्रांति 2027', date: '2027-01-14', deva: 'सूर्य का मकर संक्रमण · 14 January, 2027', icon: '🪁' },
  { id: 'vasant-panchami-2027', name: 'Vasant Panchami 2027', name_hi: 'सरस्वती पूजा (बसंत पंचमी) 2027', date: '2027-02-11', deva: 'माघ शुक्ल पंचमी · 11 February, 2027', icon: '🌼' },
  { id: 'maha-shivratri-2027', name: 'Maha Shivratri 2027', name_hi: 'महाशिवरात्रि 2027', date: '2027-03-06', deva: 'फाल्गुन कृष्ण चतुर्दशी · 6 March, 2027', icon: '🔱' },
  { id: 'holika-dahan-2027', name: 'Holika Dahan 2027', name_hi: 'होलिका दहन 2027', date: '2027-03-21', deva: 'फाल्गुन शुक्ल पूर्णिमा · 21 March, 2027', icon: '🔥' },
  { id: 'holi-2027', name: 'Holi 2027', name_hi: 'होली (धुलेंडी) 2027', date: '2027-03-22', deva: 'चैत्र कृष्ण प्रतिपदा · 22 March, 2027', icon: '🎨' },
  { id: 'chaitra-navratri-2027', name: 'Chaitra Navratri 2027', name_hi: 'चैत्र नवरात्रि / नव संवत्सर 2084', date: '2027-04-07', deva: 'चैत्र शुक्ल प्रतिपदा · 7 April, 2027', icon: '🌺' },
  { id: 'ram-navami-2027', name: 'Ram Navami 2027', name_hi: 'श्री राम नवमी 2027', date: '2027-04-15', deva: 'चैत्र शुक्ल नवमी · 15 April, 2027', icon: '🚩' },
  { id: 'hanuman-jayanti-2027', name: 'Hanuman Jayanti 2027', name_hi: 'श्री हनुमान जयंती 2027', date: '2027-04-20', deva: 'चैत्र शुक्ल पूर्णिमा · 20 April, 2027', icon: '🐒' }
];

BAS.initFestivalCountdown = function () {
  const daysEl  = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl  = document.getElementById('cd-mins');
  const secsEl  = document.getElementById('cd-secs');
  const nameEl  = document.getElementById('festival-name');
  const dateEl  = document.getElementById('festival-date');
  const tagEl   = document.getElementById('fest-banner-tag');
  if (!daysEl) return;

  function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

  function update() {
    const selectedTz = localStorage.getItem('bas_panchang_tz') || 'Asia/Kolkata';
    let localNow = new Date();
    try {
      const tzStr = new Date().toLocaleString('en-US', { timeZone: selectedTz });
      localNow = new Date(tzStr);
    } catch (e) {}

    const y = localNow.getFullYear();
    const m = String(localNow.getMonth() + 1).padStart(2, '0');
    const d = String(localNow.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;

    let activeFest = null;
    let isToday = false;

    // 1. Check if today matches any festival
    for (let i = 0; i < BAS.festivalDatabase.length; i++) {
      const f = BAS.festivalDatabase[i];
      if (f.date === todayStr) {
        activeFest = f;
        isToday = true;
        break;
      }
    }

    // 2. Otherwise find the earliest future festival
    if (!activeFest) {
      for (let i = 0; i < BAS.festivalDatabase.length; i++) {
        const f = BAS.festivalDatabase[i];
        if (f.date > todayStr) {
          activeFest = f;
          break;
        }
      }
    }

    // Fallback if year ends or all passed
    if (!activeFest) {
      activeFest = BAS.festivalDatabase[BAS.festivalDatabase.length - 1];
    }

    if (nameEl) nameEl.textContent = activeFest.name_hi || activeFest.name;
    if (dateEl) dateEl.textContent = activeFest.deva;

    if (isToday) {
      if (tagEl) tagEl.textContent = '🎉 आज पावन पर्व है! (Celebrating Today)';
      const endOfDay = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate(), 23, 59, 59);
      const remSecs = Math.max(0, Math.floor((endOfDay - localNow) / 1000));
      daysEl.textContent = '00';
      hoursEl.textContent = pad(Math.floor(remSecs / 3600));
      minsEl.textContent  = pad(Math.floor((remSecs % 3600) / 60));
      secsEl.textContent  = pad(remSecs % 60);
    } else {
      if (tagEl) tagEl.textContent = '🎉 NEXT MAJOR FESTIVAL';
      const parts = activeFest.date.split('-');
      const targetMidnight = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 0, 0, 0);
      const diffMs = targetMidnight.getTime() - localNow.getTime();

      if (diffMs <= 0) {
        // Immediate transition when boundary is crossed
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
      } else {
        const totalSecs = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        daysEl.textContent  = pad(days);
        hoursEl.textContent = pad(hours);
        minsEl.textContent  = pad(mins);
        secsEl.textContent  = pad(secs);
      }
    }
  }

  update();
  if (BAS._festTimer) clearInterval(BAS._festTimer);
  BAS._festTimer = setInterval(update, 1000);
};

// ── P1-B CLEAN LANGUAGE SWITCHER RETIREMENT ─────────────────
BAS.initLanguageToggle = function () {
  try {
    document.querySelectorAll('.lang-toggle-btn, .lang-btn, #lang-toggle-btn, #google_translate_element').forEach(el => {
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    });
    localStorage.removeItem('bas_lang');
    document.cookie = 'googtrans=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.documentElement.lang = 'hi';
  } catch (e) {}
};

BAS.initGoogleTranslate = function () {
  // Permanently disabled in P1-B to preserve pristine Hindi typography and avoid mixed language artifacts.
};


// ── ROTATING SPIRITUAL QUOTES ──────────────────────────
BAS.initRotatingQuotes = function () {
  const el     = document.getElementById('rotating-quote');
  const srcEl  = document.getElementById('rotating-quote-source');
  if (!el) return;

  const quotes = [
    { text: 'सत्यमेव जयते — सत्य की ही जीत होती है।', src: '— मुण्डक उपनिषद' },
    { text: 'वसुधैव कुटुम्बकम् — सम्पूर्ण पृथ्वी ही एक परिवार है।', src: '— महा उपनिषद' },
    { text: 'अहिंसा परमो धर्मः — अहिंसा सबसे बड़ा धर्म है।', src: '— महाभारत' },
    { text: 'यत्र नार्यस्तु पूज्यन्ते रमन्ते तत्र देवताः — जहाँ नारी की पूजा होती है, वहाँ देवता विराजते हैं।', src: '— मनुस्मृति' },
    { text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन — कर्म करो, फल की चिंता मत करो।', src: '— भगवद्गीता 2.47' },
    { text: 'योगः कर्मसु कौशलम् — कर्म में कुशलता ही योग है।', src: '— भगवद्गीता 2.50' },
    { text: 'अयं निजः परो वेति गणना लघुचेतसाम् — यह मेरा है, यह पराया है — ऐसी सोच छोटे मन की होती है।', src: '— महा उपनिषद' },
    { text: 'ॐ सह नाववतु, सह नौ भुनक्तु — हम साथ-साथ पलें और बढ़ें।', src: '— कठ उपनिषद' },
  ];

  let idx = 0;

  function showQuote() {
    el.style.opacity = '0';
    setTimeout(() => {
      idx = (idx + 1) % quotes.length;
      el.textContent  = quotes[idx].text;
      if (srcEl) srcEl.textContent = quotes[idx].src;
      el.style.opacity = '1';
    }, 500);
  }

  el.textContent  = quotes[0].text;
  if (srcEl) srcEl.textContent = quotes[0].src;
  el.style.transition = 'opacity 0.5s ease';
  setInterval(showQuote, 5000);
};

// ── SEARCH SUGGESTIONS ─────────────────────────────────
BAS.initSearchBar = function () {
  const form  = document.getElementById('hero-search-form');
  if (!form) return;

  const input = form.querySelector('input');
  if (!input) return;

  const suggestions = ['गायत्री मंत्र', 'महामृत्युंजय मंत्र', 'हनुमान चालीसा', 'दुर्गा पूजा विधि', 'एकादशी व्रत', 'नवरात्रि व्रत', 'गीता श्लोक', 'शिव पूजा', 'सोमवार व्रत'];

  const list = document.createElement('ul');
  list.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:rgba(13,0,31,0.97);border:1px solid rgba(245,158,11,0.25);border-radius:16px;margin-top:8px;overflow:hidden;list-style:none;padding:8px 0;display:none;z-index:100;backdrop-filter:blur(20px);';
  form.style.position = 'relative';
  form.appendChild(list);

  input.addEventListener('focus', () => {
    list.innerHTML = '';
    suggestions.forEach(s => {
      const li = document.createElement('li');
      li.textContent = '🔍 ' + s;
      li.style.cssText = 'padding:10px 20px;cursor:pointer;font-family:var(--font-deva);font-size:0.875rem;color:rgba(255,255,255,0.75);transition:background 0.15s;';
      li.addEventListener('mouseenter', () => li.style.background = 'rgba(245,158,11,0.1)');
      li.addEventListener('mouseleave', () => li.style.background = '');
      li.addEventListener('mousedown', (e) => { e.preventDefault(); input.value = s; list.style.display = 'none'; form.submit(); });
      list.appendChild(li);
    });
    list.style.display = 'block';
  });

  input.addEventListener('blur', () => setTimeout(() => { list.style.display = 'none'; }, 200));

  input.addEventListener('input', () => {
    const val = input.value.trim().toLowerCase();
    const items = list.querySelectorAll('li');
    items.forEach(li => {
      li.style.display = li.textContent.toLowerCase().includes(val) ? 'block' : 'none';
    });
    list.style.display = 'block';
  });
};



// ── BILINGUAL LANGUAGE SWITCHER (EN / HI) ─────────────────
BAS.currentLang = (typeof localStorage !== 'undefined' ? localStorage.getItem('bas_lang') : null) || 'hi';

BAS.translations = {
  hi: {
    nav_home: '🏠 Home',
    nav_articles: '📚 सभी लेख (286)',
    nav_mantras: '🔱 Mantras',
    nav_puja: '🪔 Puja Vidhi',
    nav_vrat: '📅 Vrat & Festivals',
    nav_katha: '📖 Dev Katha',
    nav_geeta: '🕉️ Geeta Gyan',
    nav_donate: '🙏 Donate',
    lang_btn: 'English',
    hero_badge: 'सनातन धर्म की सम्पूर्ण जानकारी',
    hero_cta_articles: '📕 सम्पूर्ण 286 लेख संग्रह',
    hero_quick_label: 'त्वरित दर्शन:',
    hero_search_ph: 'मंत्र, व्रत, देव कथा खोजें...',
    hero_search_btn: '🔍 Search',
    stat_articles_label: 'प्रकाशित लेख (Articles Published)',
    stat_mantras_label: 'मंत्र एवं स्तोत्र (Mantras & Stotras)',
    stat_trust_number: 'शास्त्र-सम्मत',
    stat_trust_label: 'परंपरा-आधारित सामग्री',
    panchang_title: 'दैनिक हिन्दू पंचांग',
    label_tithi: 'तिथि (TITHI)',
    label_paksha: 'पक्ष (PAKSHA)',
    label_nakshatra: 'नक्षत्र (NAKSHATRA)',
    label_var: 'वार (DAY)',
    label_abhijit: 'शुभ मुहूर्त (Abhijit):',
    label_rahu: 'राहुकाल (Rahu Kaal):',
    panchang_footer: '📅 सम्पूर्ण पंचांग व शुभ मुहूर्त देखें →',
    fest_sec_badge: '🎉 UPCOMING FESTIVAL',
    fest_sec_title: 'आगामी पर्व — Countdown',
    fest_banner_tag: '🎉 NEXT MAJOR FESTIVAL',
    fest_banner_btn: '📅 Vrat & Festival Calendar',
    wisdom_badge: 'सनातन शाश्वत विचार · Sanatan Wisdom',
    cat_section_label: '🙏 सनातन ज्ञान',
    cat_section_title: 'Explore Sanatan Dharma',
    cat_section_sub: 'सनातन धर्म की सम्पूर्ण जानकारी',
    posts_section_label: '✨ Latest Articles',
    posts_section_title: 'Featured Bhakti Articles',
    posts_section_sub: 'नवीनतम आध्यात्मिक लेख',
    view_all_articles_btn: '📚 सभी 286 प्रामाणिक लेख देखें (View All Articles) →',
    today_gita_label: '🕉️ गीता ज्ञान',
    today_gita_title: "Today's Divine Message",
    today_gita_sub: 'आज का गीता श्लोक',
    today_gita_btn: '🕉️ Read More Geeta Gyan',
    yt_label: '▶ YouTube Channel',
    yt_title: 'Watch & Listen<br>to Divine Bhajans',
    yt_sub: 'भजन, कथा और आरती',
    yt_desc: 'हमारे YouTube चैनल पर भजन, देव कथा, मंत्र जाप और पूजा विधि के लाइव प्रसारण देखें। अभी Subscribe करें और कभी कोई उत्सव या व्रत मिस न करें।',
    yt_sub_btn: '▶ Subscribe Now',
    yt_all_btn: 'View All Videos',
    newsletter_title: '🔔 <strong>Never miss a festival, vrat, or divine article</strong><br><small>सनातन धर्म की सम्पूर्ण जानकारी सबसे पहले पाएं — निःशुल्क</small>',
    newsletter_btn: '🙏 Subscribe Free',
    amrit_vachan_label: '📜 सनातन अमृत वचन',
    amrit_vachan_title: 'शाश्वत वैदिक विचार एवं सूक्तियां',
    amrit_vachan_sub: 'Timeless Wisdom from Sacred Scriptures',
    rashifal_label: '✨ आज का भविष्यफल',
    rashifal_title: 'दैनिक राशिफल (Daily Horoscope)',
    rashifal_sub: 'अपनी राशि चुनें और जानें आज का दिन, शुभ रंग, अंक व विशेष उपाय',
    stat_articles_label: 'प्रकाशित लेख',
    stat_mantras_label: 'मंत्र व स्तोत्र',
    stat_trust_number: 'शास्त्र-सम्मत',
    stat_trust_label: 'परंपरा-आधारित सामग्री'
  },
  en: {
    nav_home: '🏠 Home',
    nav_articles: '📚 All Articles (286)',
    nav_mantras: '🔱 Mantras',
    nav_puja: '🪔 Puja Vidhi',
    nav_vrat: '📅 Vrat & Festivals',
    nav_katha: '📖 Dev Katha',
    nav_geeta: '🕉️ Geeta Wisdom',
    nav_donate: '🙏 Donate',
    lang_btn: 'हिन्दी',
    hero_badge: 'Complete Guide to Sanatan Dharma',
    hero_cta_articles: '📕 All 286 Articles Library',
    hero_quick_label: 'Quick Links:',
    hero_search_ph: 'Search mantras, rituals, sacred stories...',
    hero_search_btn: '🔍 Search',
    stat_articles_label: 'Articles Published',
    stat_mantras_label: 'Mantras & Stotras',
    stat_trust_number: 'Scripture-Backed',
    stat_trust_label: 'Tradition-Based Content',
    panchang_title: 'Daily Hindu Panchang',
    label_tithi: 'TITHI (LUNAR DAY)',
    label_paksha: 'PAKSHA (FORTNIGHT)',
    label_nakshatra: 'NAKSHATRA (CONSTELLATION)',
    label_var: 'DAY OF WEEK',
    label_abhijit: 'Auspicious Time (Abhijit):',
    label_rahu: 'Inauspicious Time (Rahu Kaal):',
    panchang_footer: '📅 View Complete Panchang & Muhurat →',
    fest_sec_badge: '🎉 UPCOMING FESTIVAL',
    fest_sec_title: 'Upcoming Festival — Countdown',
    fest_banner_tag: '🎉 NEXT MAJOR FESTIVAL',
    fest_banner_btn: '📅 Vrat & Festival Calendar',
    wisdom_badge: 'Eternal Vedic Insights · Sanatan Wisdom',
    cat_section_label: '🙏 Sacred Knowledge',
    cat_section_title: 'Explore Sanatan Dharma',
    cat_section_sub: 'Complete authentic insights into Sanatan Vedic traditions',
    posts_section_label: '✨ Latest Wisdom Articles',
    posts_section_title: 'Featured Devotional Articles',
    posts_section_sub: 'Latest authentic scriptural publications',
    view_all_articles_btn: '📚 Explore All 286 Authentic Articles Library →',
    today_gita_label: '🕉️ Geeta Wisdom',
    today_gita_title: "Today's Divine Message",
    today_gita_sub: 'Daily Bhagavad Gita Shloka & Life Insight',
    today_gita_btn: '🕉️ Read More Geeta Gyan Chapters',
    yt_label: '▶ YouTube Channel',
    yt_title: 'Watch & Listen<br>to Divine Bhajans & Satsang',
    yt_sub: 'Bhajans, Divine Kathas & Sacred Aarti',
    yt_desc: 'Watch live broadcasts of Bhajans, sacred Puranic stories, mantra chanting, and authentic puja vidhi on our official YouTube channel. Subscribe now to never miss an auspicious festival or vrat.',
    yt_sub_btn: '▶ Subscribe on YouTube',
    yt_all_btn: 'View All Videos',
    newsletter_title: '🔔 <strong>Never miss a festival, vrat, or divine article</strong><br><small>Get authentic Sanatan Dharma guidance directly to your inbox — 100% Free</small>',
    newsletter_btn: '🙏 Subscribe Free',
    amrit_vachan_label: '📜 Vedic Amrit Vachan',
    amrit_vachan_title: 'Timeless Vedic Maxims & Truths',
    amrit_vachan_sub: 'Universal Sacred Wisdom from the Vedas, Upanishads & Gita',
    rashifal_label: "✨ Today's Forecast",
    rashifal_title: 'Daily Horoscope (दैनिक राशिफल)',
    rashifal_sub: 'Select your zodiac sign to explore daily guidance, lucky color, lucky number, and sacred remedies'
  }
};

BAS.setCookie = function (name, value, days) {
  let expires = "";
  if (days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + d.toUTCString();
  }
  const host = window.location.hostname;
  document.cookie = name + "=" + (value || "") + expires + "; path=/;";
  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=" + host + ";";
    const parts = host.split('.');
    if (parts.length > 1) {
      document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=." + parts.slice(-2).join('.') + ";";
    }
  }
};

BAS.getCookie = function (name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

BAS.initGoogleTranslate = function () {
  if (!document.getElementById('google_translate_element')) {
    const el = document.createElement('div');
    el.id = 'google_translate_element';
    el.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;';
    document.body.appendChild(el);
  }

  window.googleTranslateElementInit = function () {
    try {
      new window.google.translate.TranslateElement({
        pageLanguage: 'hi',
        includedLanguages: 'en,hi',
        autoDisplay: false
      }, 'google_translate_element');
    } catch (e) {}
  };

  if (!document.getElementById('google-translate-script')) {
    const s = document.createElement('script');
    s.id = 'google-translate-script';
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);
  }
};

BAS.applyLanguage = function (lang, userTriggered) {
  BAS.currentLang = lang;
  try { localStorage.setItem('bas_lang', lang); } catch (e) {}
  document.documentElement.lang = lang;
  const t = BAS.translations[lang] || BAS.translations.hi;

  // Language toggle buttons
  document.querySelectorAll('.lang-label, .lang-btn-text').forEach(el => {
    el.textContent = t.lang_btn;
  });

  // Nav menu
  const menuMap = {
    home: t.nav_home,
    articles: t.nav_articles,
    mantras: t.nav_mantras,
    puja: t.nav_puja,
    vrat: t.nav_vrat,
    katha: t.nav_katha,
    geeta: t.nav_geeta,
    donate: t.nav_donate
  };
  Object.keys(menuMap).forEach(key => {
    document.querySelectorAll(`[data-nav="${key}"]`).forEach(el => {
      el.textContent = menuMap[key];
    });
  });

  // Hero
  const badgeEl = document.getElementById('hero-badge-text');
  if (badgeEl) badgeEl.textContent = t.hero_badge;

  const ctaArticles = document.getElementById('hero-cta-articles');
  if (ctaArticles) ctaArticles.textContent = t.hero_cta_articles;

  const quickLabel = document.getElementById('quick-pill-label');
  if (quickLabel) quickLabel.textContent = t.hero_quick_label;

  const searchInput = document.getElementById('hero-search-input');
  if (searchInput) searchInput.setAttribute('placeholder', t.hero_search_ph);

  const searchBtn = document.getElementById('hero-search-btn');
  if (searchBtn) searchBtn.textContent = t.hero_search_btn;

  const statArticles = document.getElementById('stat-articles-label');
  if (statArticles) statArticles.textContent = t.stat_articles_label;
  const statMantras = document.getElementById('stat-mantras-label');
  if (statMantras) statMantras.textContent = t.stat_mantras_label;
  const statTrustNum = document.getElementById('stat-trust-number');
  if (statTrustNum) statTrustNum.textContent = t.stat_trust_number;
  const statTrustLabel = document.getElementById('stat-trust-label');
  if (statTrustLabel) statTrustLabel.textContent = t.stat_trust_label;

  // Panchang
  const pTitle = document.getElementById('panchang-widget-title');
  if (pTitle) pTitle.textContent = t.panchang_title;
  const lTithi = document.getElementById('label-tithi');
  if (lTithi) lTithi.textContent = t.label_tithi;
  const lPaksha = document.getElementById('label-paksha');
  if (lPaksha) lPaksha.textContent = t.label_paksha;
  const lNakshatra = document.getElementById('label-nakshatra');
  if (lNakshatra) lNakshatra.textContent = t.label_nakshatra;
  const lVar = document.getElementById('label-var');
  if (lVar) lVar.textContent = t.label_var;
  const lAbhijit = document.getElementById('label-abhijit');
  if (lAbhijit) lAbhijit.textContent = t.label_abhijit;
  const lRahu = document.getElementById('label-rahu');
  if (lRahu) lRahu.textContent = t.label_rahu;
  const pFooter = document.getElementById('panchang-footer-link');
  if (pFooter) {
    const span = pFooter.querySelector('span');
    if (span) span.textContent = t.panchang_footer;
  }

  // Festival Section
  const fBadge = document.getElementById('fest-sec-badge');
  if (fBadge) fBadge.textContent = t.fest_sec_badge;
  const fTitle = document.getElementById('fest-sec-title');
  if (fTitle) fTitle.textContent = t.fest_sec_title;
  const fTag = document.getElementById('fest-banner-tag');
  if (fTag) fTag.textContent = t.fest_banner_tag;
  const fBtn = document.getElementById('fest-banner-btn');
  if (fBtn) {
    const span = fBtn.querySelector('span');
    if (span) span.textContent = t.fest_banner_btn;
  }

  // Wisdom Badge
  const wBadge = document.getElementById('wisdom-card-badge-text');
  if (wBadge) wBadge.textContent = t.wisdom_badge;

  // Categories Section
  const catSec = document.querySelector('.categories');
  if (catSec) {
    const lbl = catSec.querySelector('.section-label');
    if (lbl) lbl.textContent = t.cat_section_label;
    const title = catSec.querySelector('.section-title');
    if (title) title.textContent = t.cat_section_title;
    const sub = catSec.querySelector('.section-subtitle');
    if (sub) sub.textContent = t.cat_section_sub;
  }

  // Posts Section
  const postSec = document.querySelector('.posts-section');
  if (postSec) {
    const lbl = postSec.querySelector('.section-label');
    if (lbl) lbl.textContent = t.posts_section_label;
    const title = postSec.querySelector('.section-title');
    if (title) title.textContent = t.posts_section_title;
    const sub = postSec.querySelector('.section-subtitle');
    if (sub) sub.textContent = t.posts_section_sub;
    const btnAll = postSec.querySelector('.btn.btn--primary');
    if (btnAll) btnAll.textContent = t.view_all_articles_btn;
  }

  // Daily Gita Quote Section
  const gitaSec = document.querySelector('.quote-section');
  if (gitaSec) {
    const lbl = gitaSec.querySelector('.section-label');
    if (lbl) lbl.textContent = t.today_gita_label;
    const title = gitaSec.querySelector('.section-title');
    if (title) title.textContent = t.today_gita_title;
    const sub = gitaSec.querySelector('.section-subtitle');
    if (sub) sub.textContent = t.today_gita_sub;
    const btn = gitaSec.querySelector('.btn.btn--primary');
    if (btn) btn.textContent = t.today_gita_btn;
  }

  // YouTube Section
  const ytSec = document.querySelector('.youtube-section');
  if (ytSec) {
    const lbl = ytSec.querySelector('.section-label');
    if (lbl) lbl.textContent = t.yt_label;
    const title = ytSec.querySelector('.section-title');
    if (title) title.innerHTML = t.yt_title;
    const sub = ytSec.querySelector('.section-subtitle');
    if (sub) sub.textContent = t.yt_sub;
    const pDesc = ytSec.querySelector('.youtube-text > p:nth-of-type(2)');
    if (pDesc) pDesc.textContent = t.yt_desc;
    const subBtn = ytSec.querySelector('.btn--primary');
    if (subBtn) subBtn.textContent = t.yt_sub_btn;
    const allBtn = ytSec.querySelector('.btn--ghost');
    if (allBtn) allBtn.textContent = t.yt_all_btn;
  }

  // Newsletter Section
  const nlText = document.getElementById('newsletter-heading');
  if (nlText) nlText.innerHTML = t.newsletter_title;
  const nlBtn = document.querySelector('.cta-strip__form .btn--primary');
  if (nlBtn) nlBtn.textContent = t.newsletter_btn;

  // Vedic Wisdom Section
  const vwSec = document.querySelector('[aria-labelledby="vedic-wisdom-heading"]');
  if (vwSec) {
    const lbl = vwSec.querySelector('.section-label');
    if (lbl) lbl.textContent = t.amrit_vachan_label;
    const title = vwSec.querySelector('.section-title');
    if (title) title.textContent = t.amrit_vachan_title;
    const sub = vwSec.querySelector('.section-subtitle');
    if (sub) sub.textContent = t.amrit_vachan_sub;
  }

  // Daily Rashifal Section
  const rashiSec = document.getElementById('daily-rashifal-section');
  if (rashiSec) {
    const lbl = rashiSec.querySelector('.section-label');
    if (lbl) lbl.textContent = t.rashifal_label;
    const title = rashiSec.querySelector('.section-title');
    if (title) title.textContent = t.rashifal_title;
    const sub = rashiSec.querySelector('.section-subtitle');
    if (sub) sub.textContent = t.rashifal_sub;
  }

  // Refresh Panchang text in accordance with current language
  if (typeof BAS.initHeroPanchang === 'function') {
    BAS.initHeroPanchang();
  }

  // Sync Google Translate cookie
  if (lang === 'en') {
    BAS.setCookie('googtrans', '/hi/en', 30);
  } else {
    BAS.setCookie('googtrans', '/hi/hi', 30);
    document.cookie = 'googtrans=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  // Trigger Google Translate engine
  const combo = document.querySelector('.goog-te-combo');
  if (combo) {
    if (combo.value !== lang) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
    }
    if (userTriggered && lang === 'hi') {
      setTimeout(() => { window.location.reload(); }, 200);
    }
  } else if (userTriggered) {
    window.location.reload();
  }
};

// ── P1-B CLEAN LANGUAGE SWITCHER RETIREMENT ─────────────────
BAS.initLanguageToggle = function () {
  try {
    document.querySelectorAll('.lang-toggle-btn, .lang-btn, #lang-toggle-btn, #google_translate_element').forEach(el => {
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    });
    localStorage.removeItem('bas_lang');
    document.cookie = 'googtrans=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.documentElement.lang = 'hi';
  } catch (e) {}
};

BAS.initGoogleTranslate = function () {};
// ── MOBILE PWA INSTALL POPUP ────────────────────────────
BAS.initPwaInstallPopup = function () {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone) return;

  const dismissedTime = localStorage.getItem('bas_pwa_dismissed');
  if (dismissedTime && (Date.now() - parseInt(dismissedTime, 10)) < 3 * 24 * 60 * 60 * 1000) {
    return;
  }

  let deferredPrompt = null;
  const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isMobile = window.innerWidth <= 820 || /android|iphone|ipad|ipod|mobile/i.test(window.navigator.userAgent);

  const banner = document.createElement('div');
  banner.className = 'pwa-install-banner';
  banner.id = 'pwa-install-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Install Bhakti Amrit Sanatan App');

  const isEn = (BAS.currentLang === 'en');
  const title = isEn ? 'Bhakti Amrit Sanatan App' : 'भक्ति अमृत सनातन ऐप';
  const badge = isEn ? 'ॐ OFFICIAL APP' : 'ॐ आधिकारिक ऐप';
  const desc = isEn ? 'Fast access to Daily Panchang, 286 Vedic articles, Aartis & Mantras on your home screen!' : 'दैनिक पंचांग, आरती, चालीसा और 286 सनातन लेख सीधे अपनी होम स्क्रीन पर पाएं!';
  const installBtnText = isEn ? '📲 Install App' : '📲 ऐप इंस्टॉल करें';
  const laterBtnText = isEn ? 'Later' : 'बाद में';
  const iosHelp = isEn ? 'To install on iPhone/iPad: Tap Share ⎋ below, then choose "Add to Home Screen ➕".' : 'iPhone/iPad पर इंस्टॉल करने के लिए: सफारी में नीचे Share ⎋ दबाएं और "Add to Home Screen ➕" चुनें।';

  banner.innerHTML = `
    <div class="pwa-banner-header">
      <div class="pwa-banner-brand">
        <img class="pwa-banner-icon" src="/assets/images/cropped-Logo-150x150.png" alt="Logo" width="44" height="44">
        <div>
          <div class="pwa-banner-title">${title}</div>
          <div class="pwa-banner-sub">${badge}</div>
        </div>
      </div>
      <button class="pwa-banner-close" id="pwa-banner-close" aria-label="Close">✕</button>
    </div>
    <div class="pwa-banner-body">
      ${desc}
      <div class="pwa-ios-instructions" id="pwa-ios-instructions">${iosHelp}</div>
    </div>
    <div class="pwa-banner-actions">
      <button class="pwa-install-btn" id="pwa-install-btn">${installBtnText}</button>
      <button class="pwa-dismiss-btn" id="pwa-dismiss-btn">${laterBtnText}</button>
    </div>
  `;

  document.body.appendChild(banner);

  const closeBtn = document.getElementById('pwa-banner-close');
  const dismissBtn = document.getElementById('pwa-dismiss-btn');
  const installBtn = document.getElementById('pwa-install-btn');
  const iosBox = document.getElementById('pwa-ios-instructions');

  function hideBanner() {
    banner.classList.remove('show');
    try { localStorage.setItem('bas_pwa_dismissed', Date.now().toString()); } catch (e) {}
    setTimeout(() => { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 450);
  }

  if (closeBtn) closeBtn.addEventListener('click', hideBanner);
  if (dismissBtn) dismissBtn.addEventListener('click', hideBanner);

  if (installBtn) {
    installBtn.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            hideBanner();
          }
          deferredPrompt = null;
        });
      } else if (isIos && iosBox) {
        iosBox.style.display = 'block';
      } else {
        alert(isEn ? 'Please use browser menu (⋮) -> "Install App" or "Add to Home Screen".' : 'कृपया ब्राउज़र मेनू (⋮) खोलें और "Install app" या "होम स्क्रीन में जोड़ें" चुनें।');
        hideBanner();
      }
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => { banner.classList.add('show'); }, 2000);
  });

  if (isMobile) {
    setTimeout(() => {
      if (!banner.classList.contains('show')) {
        banner.classList.add('show');
      }
    }, 3500);
  }
};

// ── INIT ALL ───────────────────────────────────────────
BAS.init = function () {
  if ('scrollRestoration' in history && !window.location.hash) {
    history.scrollRestoration = 'manual';
  }
  BAS.initTicker();
  BAS.initNav();
  BAS.initBackToTop();
  BAS.initScrollReveal();
  BAS.initParticles();
  BAS.initFilters();
  BAS.initDonateAmounts();
  BAS.animateCounters();
  BAS.initNewsletterForm();
  BAS.initLazyImages();
  BAS.initPageTransitions();
  BAS.initCursorGlow();
  BAS.initReadingProgress();
  BAS.updateDates();
  BAS.initFestivalCountdown();
  if (typeof BAS.initHeroPanchang === 'function') BAS.initHeroPanchang();
  if (typeof BAS.initHeroAudio === 'function') BAS.initHeroAudio();
  if (typeof BAS.initDailyGitaQuote === 'function') BAS.initDailyGitaQuote();
  if (typeof BAS.initDailyRashifal === 'function') BAS.initDailyRashifal();
  BAS.initLanguageToggle();
  if (typeof BAS.initRotatingQuotes === 'function') BAS.initRotatingQuotes();
  BAS.initSearchBar();
  BAS.initWhatsAppShare();
  BAS.initPwaInstallPopup();

  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
};

// DOM Ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', BAS.init);
  } else {
    BAS.init();
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (typeof BAS.initHeroFestival === 'function') BAS.initHeroFestival();
    }, 100);
  });
}

// ── ASTRONOMICAL PANCHANG & GRAHAN ENGINE ────────────────────────────
/* ==========================================================================
   BHAKTI AMRIT SANATAN — HIGH-PRECISION ASTRONOMICAL PANCHANG & GRAHAN ENGINE
   - Geocentric Sun (Meeus Ch. 25 Solar Equation of Center) & Moon (Meeus Ch. 47 Truncated 60-Term Periodic Series)
   - Lahiri (Chitrapaksha) Ayanamsa for Sidereal Lunar Mansions (Nakshatras)
   - NOAA Solar Geometry (Refraction -0.8333°) for Sunrise, Sunset & Solar Noon
   - Dynamic 8-fold Daytime Division for Rahu Kaal & 15-fold for Abhijit
   - Global Catalog vs Local Circumstance Grahan (Eclipse) Visibility Engine
   ========================================================================== */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BAS = root.BAS || {};
    root.BAS.Astro = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const Astro = {};

  // ── SUPPORTED CITIES & VERIFIED COORDINATES ──────────────────────
  Astro.CITIES = {
    'Asia/Kolkata': {
      id: 'delhi',
      name_hi: 'नई दिल्ली',
      name_en: 'New Delhi',
      tz: 'Asia/Kolkata',
      lat: 28.6139,
      lon: 77.2090,
      flag: '🇮🇳'
    },
    'Asia/Dubai': {
      id: 'dubai',
      name_hi: 'दुबई',
      name_en: 'Dubai',
      tz: 'Asia/Dubai',
      lat: 25.2048,
      lon: 55.2708,
      flag: '🇦🇪'
    },
    'Europe/London': {
      id: 'london',
      name_hi: 'लंदन',
      name_en: 'London',
      tz: 'Europe/London',
      lat: 51.5074,
      lon: -0.1278,
      flag: '🇬🇧'
    },
    'America/New_York': {
      id: 'new_york',
      name_hi: 'न्यूयॉर्क',
      name_en: 'New York',
      tz: 'America/New_York',
      lat: 40.7128,
      lon: -74.0060,
      flag: '🇺🇸'
    },
    'America/Los_Angeles': {
      id: 'los_angeles',
      name_hi: 'लॉस एंजिल्स',
      name_en: 'Los Angeles',
      tz: 'America/Los_Angeles',
      lat: 34.0522,
      lon: -118.2437,
      flag: '🇺🇸'
    },
    'America/Toronto': {
      id: 'toronto',
      name_hi: 'टोरंटो',
      name_en: 'Toronto',
      tz: 'America/Toronto',
      lat: 43.6532,
      lon: -79.3832,
      flag: '🇨🇦'
    },
    'Australia/Sydney': {
      id: 'sydney',
      name_hi: 'सिडनी',
      name_en: 'Sydney',
      tz: 'Australia/Sydney',
      lat: -33.8688,
      lon: 151.2093,
      flag: '🇦🇺'
    }
  };

  // ── VEDIC TERMINOLOGY DATASETS ──────────────────────────────────
  Astro.TITHIS = [
    { hi: 'प्रतिपदा', en: 'Pratipada' },
    { hi: 'द्वितीया', en: 'Dwitiya' },
    { hi: 'तृतीया', en: 'Tritiya' },
    { hi: 'चतुर्थी', en: 'Chaturthi' },
    { hi: 'पंचमी', en: 'Panchami' },
    { hi: 'षष्ठी', en: 'Shashthi' },
    { hi: 'सप्तमी', en: 'Saptami' },
    { hi: 'अष्टमी', en: 'Ashtami' },
    { hi: 'नवमी', en: 'Navami' },
    { hi: 'दशमी', en: 'Dashami' },
    { hi: 'एकादशी', en: 'Ekadashi' },
    { hi: 'द्वादशी', en: 'Dwadashi' },
    { hi: 'त्रयोदशी', en: 'Trayodashi' },
    { hi: 'चतुर्दशी', en: 'Chaturdashi' },
    { hi: 'पूर्णिमा', en: 'Purnima', amavasya_hi: 'अमावस्या', amavasya_en: 'Amavasya' }
  ];

  Astro.NAKSHATRAS = [
    { hi: 'अश्विनी', en: 'Ashwini' },
    { hi: 'भरणी', en: 'Bharani' },
    { hi: 'कृत्तिका', en: 'Krittika' },
    { hi: 'रोहिणी', en: 'Rohini' },
    { hi: 'मृगशिरा', en: 'Mrigashirsha' },
    { hi: 'आर्द्रा', en: 'Ardra' },
    { hi: 'पुनर्वसु', en: 'Punarvasu' },
    { hi: 'पुष्य', en: 'Pushya' },
    { hi: 'आश्लेषा', en: 'Ashlesha' },
    { hi: 'मघा', en: 'Magha' },
    { hi: 'पूर्वाफाल्गुनी', en: 'Purva Phalguni' },
    { hi: 'उत्तराफाल्गुनी', en: 'Uttara Phalguni' },
    { hi: 'हस्त', en: 'Hasta' },
    { hi: 'चित्रा', en: 'Chitra' },
    { hi: 'स्वाति', en: 'Swati' },
    { hi: 'विशाखा', en: 'Vishakha' },
    { hi: 'अनुराधा', en: 'Anuradha' },
    { hi: 'ज्येष्ठा', en: 'Jyeshtha' },
    { hi: 'मूल', en: 'Mula' },
    { hi: 'पूर्वाषाढ़ा', en: 'Purva Ashadha' },
    { hi: 'उत्तराषाढ़ा', en: 'Uttara Ashadha' },
    { hi: 'श्रवण', en: 'Shravana' },
    { hi: 'धनिष्ठा', en: 'Dhanishta' },
    { hi: 'शतभिषा', en: 'Shatabhisha' },
    { hi: 'पूर्वाभाद्रपद', en: 'Purva Bhadrapada' },
    { hi: 'उत्तराभाद्रपद', en: 'Uttara Bhadrapada' },
    { hi: 'रेवती', en: 'Revati' }
  ];

  Astro.DAYS = [
    { hi: 'रविवार', en: 'Sunday' },
    { hi: 'सोमवार', en: 'Monday' },
    { hi: 'मंगलवार', en: 'Tuesday' },
    { hi: 'बुधवार', en: 'Wednesday' },
    { hi: 'गुरुवार', en: 'Thursday' },
    { hi: 'शुक्रवार', en: 'Friday' },
    { hi: 'शनिवार', en: 'Saturday' }
  ];

  Astro.HINDI_MONTHS = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  // ── 27 YOGAS (योग) ──────────────────────────────────────────────
  Astro.YOGAS = [
    { hi: 'विष्कम्भ', en: 'Vishkambha' },
    { hi: 'प्रीति', en: 'Priti' },
    { hi: 'आयुष्मान्', en: 'Ayushman' },
    { hi: 'सौभाग्य', en: 'Saubhagya' },
    { hi: 'शोभन', en: 'Shobhana' },
    { hi: 'अतिगण्ड', en: 'Atiganda' },
    { hi: 'सुकर्मा', en: 'Sukarma' },
    { hi: 'धृति', en: 'Dhriti' },
    { hi: 'शूल', en: 'Shula' },
    { hi: 'गण्ड', en: 'Ganda' },
    { hi: 'वृद्धि', en: 'Vriddhi' },
    { hi: 'ध्रुव', en: 'Dhruva' },
    { hi: 'व्याघात', en: 'Vyaghata' },
    { hi: 'हर्षण', en: 'Harshana' },
    { hi: 'वज्र', en: 'Vajra' },
    { hi: 'सिद्धि', en: 'Siddhi' },
    { hi: 'व्यतीपात', en: 'Vyatipata' },
    { hi: 'वरीयान्', en: 'Variyana' },
    { hi: 'परिघ', en: 'Parigha' },
    { hi: 'शिव', en: 'Shiva' },
    { hi: 'सिद्ध', en: 'Siddha' },
    { hi: 'साध्य', en: 'Sadhya' },
    { hi: 'शुभ', en: 'Shubha' },
    { hi: 'शुक्ल', en: 'Shukla' },
    { hi: 'ब्रह्म', en: 'Brahma' },
    { hi: 'ऐन्द्र', en: 'Indra' },
    { hi: 'वैधृति', en: 'Vaidhriti' }
  ];

  // ── 11 KARANAS (करण) ────────────────────────────────────────────
  Astro.KARANAS = [
    { hi: 'बव', en: 'Bava' },
    { hi: 'बालव', en: 'Balava' },
    { hi: 'कौलव', en: 'Kaulava' },
    { hi: 'तैतिल', en: 'Taitila' },
    { hi: 'गर', en: 'Gara' },
    { hi: 'वणिज', en: 'Vanija' },
    { hi: 'विष्टि (भद्रा)', en: 'Vishti (Bhadra)' },
    { hi: 'शकुनि', en: 'Shakuni' },
    { hi: 'चतुष्पाद', en: 'Chatushpada' },
    { hi: 'नाग', en: 'Naga' },
    { hi: 'किंस्तुघ्न', en: 'Kimstughna' }
  ];

  // ── 12 VEDIC HINDU MONTHS (मास) ─────────────────────────────────
  Astro.HINDU_MASAS = [
    { hi: 'चैत्र', en: 'Chaitra' },
    { hi: 'वैशाख', en: 'Vaishakha' },
    { hi: 'ज्येष्ठ', en: 'Jyeshtha' },
    { hi: 'आषाढ़', en: 'Ashadha' },
    { hi: 'श्रावण', en: 'Shravana' },
    { hi: 'भाद्रपद', en: 'Bhadrapada' },
    { hi: 'आश्विन', en: 'Ashwin' },
    { hi: 'कार्तिक', en: 'Kartik' },
    { hi: 'मार्गशीर्ष', en: 'Margashirsha' },
    { hi: 'पौष', en: 'Pausha' },
    { hi: 'माघ', en: 'Magha' },
    { hi: 'फाल्गुन', en: 'Phalguna' }
  ];


  // ── AUTHORITATIVE GRAHAN (ECLIPSE) DATABASE (2026–2028) ────────
  Astro.GRAHAN_DATABASE = [
    {
      id: 'solar-eclipse-2026-02-17',
      type: 'surya',
      subtype: 'वलयाकार सूर्य ग्रहण (Annular)',
      name_hi: 'वलयाकार सूर्य ग्रहण',
      name_en: 'Annular Solar Eclipse',
      icon: '☀️',
      utc_start: '2026-02-17T10:00:00Z',
      utc_peak: '2026-02-17T12:13:00Z',
      utc_end: '2026-02-17T14:30:00Z',
      global_region: 'अंटार्कटिका व दक्षिणी महासागर',
      sutak_hours: null,
      visibility: {
        'Asia/Kolkata': { visible: false, note: 'नई दिल्ली: अदृश्य' },
        'Asia/Dubai': { visible: false, note: 'दुबई: अदृश्य' },
        'Europe/London': { visible: false, note: 'लंदन: अदृश्य' },
        'America/New_York': { visible: false, note: 'न्यूयॉर्क: अदृश्य' },
        'America/Los_Angeles': { visible: false, note: 'लॉस एंजिल्स: अदृश्य' },
        'America/Toronto': { visible: false, note: 'टोरंटो: अदृश्य' },
        'Australia/Sydney': { visible: false, note: 'सिडनी: अदृश्य' }
      }
    },
    {
      id: 'lunar-eclipse-2026-03-03',
      type: 'chandra',
      subtype: 'पूर्ण चंद्र ग्रहण (Total)',
      name_hi: 'पूर्ण चंद्र ग्रहण',
      name_en: 'Total Lunar Eclipse',
      icon: '🌕',
      utc_start: '2026-03-03T09:50:00Z',
      utc_peak: '2026-03-03T11:34:00Z',
      utc_end: '2026-03-03T15:24:00Z',
      global_region: 'एशिया, ऑस्ट्रेलिया, प्रशांत महासागर एवं अमेरिका',
      sutak_hours: 9,
      visibility: {
        'Asia/Kolkata': { visible: true, note: 'नई दिल्ली: दृश्य (चंद्रोदय के समय, सूतक प्रभावी)' },
        'Asia/Dubai': { visible: true, note: 'दुबई: दृश्य (सूतक प्रभावी)' },
        'Europe/London': { visible: false, note: 'लंदन: अदृश्य' },
        'America/New_York': { visible: true, note: 'न्यूयॉर्क: दृश्य' },
        'America/Los_Angeles': { visible: true, note: 'लॉस एंजिल्स: दृश्य' },
        'America/Toronto': { visible: true, note: 'टोरंटो: दृश्य' },
        'Australia/Sydney': { visible: true, note: 'सिडनी: पूर्ण दृश्य (सूतक प्रभावी)' }
      }
    },
    {
      id: 'solar-eclipse-2026-08-12',
      type: 'surya',
      subtype: 'पूर्ण सूर्य ग्रहण (Total)',
      name_hi: 'पूर्ण सूर्य ग्रहण',
      name_en: 'Total Solar Eclipse',
      icon: '🌑',
      utc_start: '2026-08-12T15:40:00Z',
      utc_peak: '2026-08-12T17:47:00Z',
      utc_end: '2026-08-12T19:54:00Z',
      global_region: 'आर्कटिक, ग्रीनलैंड, आइसलैंड व उत्तरी स्पेन',
      sutak_hours: null,
      visibility: {
        'Asia/Kolkata': { visible: false, note: 'नई दिल्ली: अदृश्य' },
        'Asia/Dubai': { visible: false, note: 'दुबई: अदृश्य' },
        'Europe/London': { visible: true, note: 'लंदन: दृश्य (आंशिक ~90%, सूतक प्रभावी)' },
        'America/New_York': { visible: true, note: 'न्यूयॉर्क: आंशिक दृश्य' },
        'America/Los_Angeles': { visible: false, note: 'लॉस एंजिल्स: अदृश्य' },
        'America/Toronto': { visible: true, note: 'टोरंटो: आंशिक दृश्य' },
        'Australia/Sydney': { visible: false, note: 'सिडनी: अदृश्य' }
      }
    },
    {
      id: 'lunar-eclipse-2026-08-28',
      type: 'chandra',
      subtype: 'आंशिक चंद्र ग्रहण (Partial)',
      name_hi: 'खंडग्रास (आंशिक) चंद्र ग्रहण',
      name_en: 'Partial Lunar Eclipse',
      icon: '🌘',
      utc_start: '2026-08-28T02:20:00Z',
      utc_peak: '2026-08-28T04:14:00Z',
      utc_end: '2026-08-28T06:08:00Z',
      global_region: 'प्रशांत, अमेरिका, यूरोप और पश्चिमी अफ्रीका',
      sutak_hours: 9,
      visibility: {
        'Asia/Kolkata': { visible: false, note: 'नई दिल्ली: अदृश्य (दिन का समय)' },
        'Asia/Dubai': { visible: false, note: 'दुबई: अदृश्य' },
        'Europe/London': { visible: true, note: 'लंदन: दृश्य (सूतक प्रभावी)' },
        'America/New_York': { visible: true, note: 'न्यूयॉर्क: दृश्य (सूतक प्रभावी)' },
        'America/Los_Angeles': { visible: true, note: 'लॉस एंजिल्स: दृश्य (सूतक प्रभावी)' },
        'America/Toronto': { visible: true, note: 'टोरंटो: दृश्य (सूतक प्रभावी)' },
        'Australia/Sydney': { visible: false, note: 'सिडनी: अदृश्य' }
      }
    },
    {
      id: 'solar-eclipse-2027-02-06',
      type: 'surya',
      subtype: 'वलयाकार सूर्य ग्रहण (Annular)',
      name_hi: 'वलयाकार सूर्य ग्रहण',
      name_en: 'Annular Solar Eclipse',
      icon: '☀️',
      utc_start: '2027-02-06T13:58:00Z',
      utc_peak: '2027-02-06T16:00:00Z',
      utc_end: '2027-02-06T18:04:00Z',
      global_region: 'दक्षिण प्रशांत, चिली, अर्जेंटीना एवं अंटार्कटिका',
      sutak_hours: null,
      visibility: {
        'Asia/Kolkata': { visible: false, note: 'नई दिल्ली: अदृश्य' },
        'Asia/Dubai': { visible: false, note: 'दुबई: अदृश्य' },
        'Europe/London': { visible: false, note: 'लंदन: अदृश्य' },
        'America/New_York': { visible: false, note: 'न्यूयॉर्क: अदृश्य' },
        'America/Los_Angeles': { visible: false, note: 'लॉस एंजिल्स: अदृश्य' },
        'America/Toronto': { visible: false, note: 'टोरंटो: अदृश्य' },
        'Australia/Sydney': { visible: false, note: 'सिडनी: अदृश्य' }
      }
    },
    {
      id: 'lunar-eclipse-2027-02-20',
      type: 'chandra',
      subtype: 'मांद्य (उपच्छाया) चंद्र ग्रहण (Penumbral)',
      name_hi: 'मांद्य (उपच्छाया) चंद्र ग्रहण',
      name_en: 'Penumbral Lunar Eclipse',
      icon: '🌕',
      utc_start: '2027-02-20T21:40:00Z',
      utc_peak: '2027-02-20T23:14:00Z',
      utc_end: '2027-02-21T00:48:00Z',
      global_region: 'यूरोप, अफ्रीका, मध्य पूर्व (दुबई), पश्चिमी एशिया',
      sutak_hours: null, // Vedic rule: Penumbral eclipses do not observe temple/religious Sutak
      visibility: {
        'Asia/Kolkata': { visible: true, note: 'नई दिल्ली: दृश्य (21 फ़रवरी भोर)' },
        'Asia/Dubai': { visible: true, note: 'दुबई: दृश्य (21 फ़रवरी 01:40 AM – 04:48 AM GST)' },
        'Europe/London': { visible: true, note: 'लंदन: दृश्य (20 फ़रवरी रात्रि)' },
        'America/New_York': { visible: true, note: 'न्यूयॉर्क: दृश्य' },
        'America/Los_Angeles': { visible: false, note: 'लॉस एंजिल्स: अदृश्य' },
        'America/Toronto': { visible: true, note: 'टोरंटो: दृश्य' },
        'Australia/Sydney': { visible: false, note: 'सिडनी: अदृश्य' }
      }
    },
    {
      id: 'solar-eclipse-2027-08-02',
      type: 'surya',
      subtype: 'पूर्ण सूर्य ग्रहण (Total)',
      name_hi: 'पूर्ण सूर्य ग्रहण',
      name_en: 'Total Solar Eclipse',
      icon: '🌑',
      utc_start: '2027-08-02T08:30:00Z',
      utc_peak: '2027-08-02T10:07:00Z',
      utc_end: '2027-08-02T11:45:00Z',
      global_region: 'जिब्राल्टर, उत्तरी अफ्रीका, मध्य पूर्व, मिस्र, सऊदी अरब',
      sutak_hours: 12,
      visibility: {
        'Asia/Kolkata': { visible: true, note: 'नई दिल्ली: आंशिक दृश्य (~30%, सूतक प्रभावी)' },
        'Asia/Dubai': { visible: true, note: 'दुबई: दृश्य (आंशिक ~50%, सूतक प्रभावी)' },
        'Europe/London': { visible: true, note: 'लंदन: दृश्य (आंशिक ~40%, सूतक प्रभावी)' },
        'America/New_York': { visible: false, note: 'न्यूयॉर्क: अदृश्य' },
        'America/Los_Angeles': { visible: false, note: 'लॉस एंजिल्स: अदृश्य' },
        'America/Toronto': { visible: false, note: 'टोरंटो: अदृश्य' },
        'Australia/Sydney': { visible: false, note: 'सिडनी: अदृश्य' }
      }
    }
  ];

  // ── TIME & CLOCK INJECTION HELPER ──────────────────────────────
  Astro.getNow = function () {
    // 1. Injected global test clock
    if (typeof window !== 'undefined' && window.BAS_TEST_CLOCK) {
      return new Date(window.BAS_TEST_CLOCK);
    }
    // 2. Query parameter test_clock
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const match = window.location.search.match(/[?&]test_clock=([^&]+)/);
      if (match) {
        return new Date(decodeURIComponent(match[1]));
      }
    }
    // 3. LocalStorage override
    if (typeof localStorage !== 'undefined') {
      const savedTest = localStorage.getItem('bas_test_clock');
      if (savedTest) {
        return new Date(savedTest);
      }
    }
    return new Date();
  };

  // ── JULIAN DATE CONVERSIONS ─────────────────────────────────────
  Astro.dtToJd = function (year, month, day, hour = 0, minute = 0, second = 0) {
    let y = year;
    let m = month;
    if (m <= 2) {
      y -= 1;
      m += 12;
    }
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const dayFrac = (hour + minute / 60.0 + second / 3600.0) / 24.0;
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
    return jd + dayFrac;
  };

  Astro.dateToJd = function (d) {
    return Astro.dtToJd(
      d.getUTCFullYear(),
      d.getUTCMonth() + 1,
      d.getUTCDate(),
      d.getUTCHours(),
      d.getUTCMinutes(),
      d.getUTCSeconds()
    );
  };

  Astro.jdToDate = function (jd) {
    const jdAdjusted = jd + 0.5;
    const Z = Math.floor(jdAdjusted);
    const F = jdAdjusted - Z;
    let A = Z;
    if (Z >= 2299161) {
      const alpha = Math.floor((Z - 1867216.25) / 36524.25);
      A = Z + 1 + alpha - Math.floor(alpha / 4);
    }
    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);
    const day = B - D - Math.floor(30.6001 * E);
    const month = E < 14 ? E - 1 : E - 13;
    const year = month > 2 ? C - 4716 : C - 4715;

    const totalSeconds = Math.round(F * 86400);
    const hour = Math.floor(totalSeconds / 3600);
    const minute = Math.floor((totalSeconds % 3600) / 60);
    const second = totalSeconds % 60;

    return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  };

  // ── SUN & MOON GEOCENTRIC LONGITUDES (MEEUS CH. 25 & CH. 47 TRUNCATED SERIES) ─────
  Astro.getSunMoonLongitudes = function (jd) {
    const T = (jd - 2451545.0) / 36525.0;

    // --- Geocentric Sun Longitude ---
    const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360.0;
    const M_sun_deg = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360.0;
    const Mr = (M_sun_deg * Math.PI) / 180.0;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
              (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
              0.000289 * Math.sin(3 * Mr);
    const sunLong = (L0 + C + 360.0) % 360.0;

    // --- Fundamental Lunar Arguments ---
    const L_prime = (218.3164477 + 481267.88123421 * T - 0.0015786 * T * T) % 360.0;
    const D = (297.8501921 + 445267.1114034 * T - 0.0018819 * T * T) % 360.0;
    const M_sun = (357.5291092 + 35999.0502909 * T - 0.0001536 * T * T) % 360.0;
    const M_moon = (134.9633964 + 477198.8675055 * T + 0.0087414 * T * T) % 360.0;
    const F = (93.2720950 + 483202.0175233 * T - 0.0036539 * T * T) % 360.0;

    // Major periodic perturbations in longitude (Meeus truncated series)
    const terms = [
      [0, 0, 1, 0, 6.288774],
      [2, 0, -1, 0, 1.274027],
      [2, 0, 0, 0, 0.658314],
      [0, 0, 2, 0, 0.213618],
      [0, 1, 0, 0, -0.185116],
      [0, 0, 0, 2, -0.114332],
      [2, 0, -2, 0, 0.058793],
      [2, -1, -1, 0, 0.057066],
      [2, 0, 1, 0, 0.053322],
      [2, -1, 0, 0, 0.045758],
      [0, 1, -1, 0, -0.040923],
      [1, 0, 0, 0, -0.034720],
      [0, 1, 1, 0, -0.030383],
      [2, 0, 0, -2, 0.015327],
      [0, 0, 1, 2, -0.012528],
      [0, 0, 1, -2, 0.010980],
      [4, 0, -1, 0, 0.010675],
      [0, 0, 3, 0, 0.010463],
      [4, 0, -2, 0, -0.008627],
      [2, 1, -1, 0, -0.006994],
      [2, 1, 0, 0, 0.006842],
      [1, 0, -1, 0, 0.006325],
      [1, 1, 0, 0, -0.005884],
      [2, -1, 1, 0, -0.005696],
      [2, 0, 2, 0, 0.005615],
      [4, 0, 0, 0, 0.004957],
      [0, 1, -2, 0, 0.004719],
      [2, -1, -2, 0, 0.003920],
      [2, 0, -1, -2, 0.003249],
      [2, -2, 0, 0, -0.002991],
      [0, 1, 2, 0, -0.002740],
      [2, 0, -3, 0, 0.002424],
      [2, 2, 0, 0, -0.002067],
      [4, 0, -3, 0, 0.002484],
      [2, 0, 0, 2, -0.001872],
      [0, 0, 2, 2, -0.001673],
      [2, -2, -1, 0, -0.001502],
      [0, 2, 0, 0, 0.001476],
      [2, -1, 0, -2, -0.001410],
      [4, 0, 1, 0, -0.001351],
      [0, 0, 4, 0, 0.000773],
      [4, -1, -1, 0, 0.000758],
      [1, 0, 1, 0, 0.000713],
      [0, 2, -1, 0, -0.000700],
      [2, 1, -2, 0, 0.000691],
      [2, 0, -1, 2, 0.000596],
      [2, -1, -1, -2, 0.000549],
      [4, -1, -2, 0, 0.000537],
      [0, 1, 1, -2, 0.000524],
      [2, -1, 2, 0, -0.000514],
      [1, 0, 0, -2, 0.000485],
      [2, 1, 1, 0, -0.000485],
      [0, 0, 2, -2, -0.000408],
      [4, 0, -1, -2, -0.000350],
      [2, 2, -1, 0, -0.000349],
      [1, 1, -1, 0, 0.000309],
      [2, 0, 3, 0, 0.000301],
      [2, 0, -2, -2, 0.000282],
      [2, -1, 0, 2, -0.000236],
      [4, 0, 0, -2, -0.000229]
    ];

    let sigmaL = 0;
    const deg2rad = Math.PI / 180.0;
    for (let i = 0; i < terms.length; i++) {
      const t = terms[i];
      const arg = (t[0] * D + t[1] * M_sun + t[2] * M_moon + t[3] * F) * deg2rad;
      sigmaL += t[4] * Math.sin(arg);
    }

    const moonLong = (L_prime + sigmaL + 3600.0) % 360.0;
    const elongation = (moonLong - sunLong + 360.0) % 360.0;

    return { sun: sunLong, moon: moonLong, elongation: elongation };
  };

  // ── LAHIRI AYANAMSA ─────────────────────────────────────────────
  Astro.getLahiriAyanamsa = function (jd) {
    const T = (jd - 2451545.0) / 36525.0;
    return (23.858333 + 1.39694 * T) % 360.0;
  };

  // ── NOAA SOLAR EVENTS (SUNRISE, SUNSET, SOLAR NOON) ─────────────
  Astro.getSolarTimes = function (year, month, day, lat, lon) {
    const jd = Astro.dtToJd(year, month, day, 0, 0, 0);
    const T = (jd - 2451545.0) / 36525.0;

    const L0 = (280.46646 + T * (36000.76983 + 0.0003032 * T)) % 360.0;
    const M = (357.52911 + T * (35999.05029 - 0.0001537 * T)) % 360.0;
    const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);

    const Mr = (M * Math.PI) / 180.0;
    const C = Math.sin(Mr) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
              Math.sin(2 * Mr) * (0.019993 - 0.000101 * T) +
              Math.sin(3 * Mr) * 0.000289;
    const sunTrue = L0 + C;
    const sunApp = sunTrue - 0.00569 - 0.00478 * Math.sin(((125.04 - 1934.136 * T) * Math.PI) / 180.0);

    const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813)))) / 3600.0;
    const eps = eps0 + 0.00256 * Math.cos(((125.04 - 1934.136 * T) * Math.PI) / 180.0);
    const epsRad = (eps * Math.PI) / 180.0;

    const sinDelta = Math.sin(epsRad) * Math.sin((sunApp * Math.PI) / 180.0);
    const delta = Math.asin(sinDelta);

    const yTan = Math.tan(epsRad / 2.0) ** 2;
    const L0Rad = (L0 * Math.PI) / 180.0;
    const eotRad = yTan * Math.sin(2 * L0Rad) -
                   2 * e * Math.sin(Mr) +
                   4 * e * yTan * Math.sin(Mr) * Math.cos(2 * L0Rad) -
                   0.5 * (yTan ** 2) * Math.sin(4 * L0Rad) -
                   1.25 * (e ** 2) * Math.sin(2 * Mr);
    const eotMin = 4.0 * ((eotRad * 180.0) / Math.PI);

    // Solar noon in UTC minutes from 00:00 UTC
    const solarNoonUtcMin = 720.0 - 4.0 * lon - eotMin;

    const latRad = (lat * Math.PI) / 180.0;
    // Standard atmospheric refraction + solar disc semi-diameter = 90.8333 degrees
    const cosH0 = (Math.cos((90.8333 * Math.PI) / 180.0) - Math.sin(latRad) * Math.sin(delta)) /
                  (Math.cos(latRad) * Math.cos(delta));

    if (cosH0 > 1.0 || cosH0 < -1.0) {
      return { isPolar: true, sunriseUtcMin: null, solarNoonUtcMin, sunsetUtcMin: null };
    }

    const h0Deg = (Math.acos(cosH0) * 180.0) / Math.PI;
    const sunriseUtcMin = solarNoonUtcMin - 4.0 * h0Deg;
    const sunsetUtcMin = solarNoonUtcMin + 4.0 * h0Deg;

    return {
      isPolar: false,
      sunriseUtcMin: sunriseUtcMin,
      solarNoonUtcMin: solarNoonUtcMin,
      sunsetUtcMin: sunsetUtcMin
    };
  };

  // ── TRANSITION SOLVER FOR TITHI & NAKSHATRA ─────────────────────
  Astro.solveTithiTransition = function (currentJd, targetElongation) {
    let jd1 = currentJd;
    let jd2 = currentJd + 1.25; // 30 hours search bracket
    for (let iter = 0; iter < 30; iter++) {
      const mid = (jd1 + jd2) / 2.0;
      const { elongation } = Astro.getSunMoonLongitudes(mid);
      let diff = elongation - targetElongation;
      // Handle 360 wrap-around
      if (diff < -180) diff += 360;
      if (diff > 180) diff -= 360;

      if (diff < 0) {
        jd1 = mid;
      } else {
        jd2 = mid;
      }
    }
    return (jd1 + jd2) / 2.0;
  };

  Astro.solveNakshatraTransition = function (currentJd, targetSidereal) {
    let jd1 = currentJd;
    let jd2 = currentJd + 1.25; // 30 hours search bracket
    for (let iter = 0; iter < 30; iter++) {
      const mid = (jd1 + jd2) / 2.0;
      const { moon } = Astro.getSunMoonLongitudes(mid);
      const ayanamsa = Astro.getLahiriAyanamsa(mid);
      const sidereal = (moon - ayanamsa + 360.0) % 360.0;
      let diff = sidereal - targetSidereal;
      if (diff < -180) diff += 360;
      if (diff > 180) diff -= 360;

      if (diff < 0) {
        jd1 = mid;
      } else {
        jd2 = mid;
      }
    }
    return (jd1 + jd2) / 2.0;
  };


  Astro.solveYogaTransition = function (currentJd, targetYoga) {
    let jd1 = currentJd;
    let jd2 = currentJd + 1.25;
    for (let iter = 0; iter < 30; iter++) {
      const mid = (jd1 + jd2) / 2.0;
      const { sun, moon } = Astro.getSunMoonLongitudes(mid);
      const ayanamsa = Astro.getLahiriAyanamsa(mid);
      const sidSun = (sun - ayanamsa + 360.0) % 360.0;
      const sidMoon = (moon - ayanamsa + 360.0) % 360.0;
      const ySum = (sidSun + sidMoon) % 360.0;
      let diff = ySum - targetYoga;
      if (diff < -180) diff += 360;
      if (diff > 180) diff -= 360;
      if (diff < 0) jd1 = mid;
      else jd2 = mid;
    }
    return (jd1 + jd2) / 2.0;
  };

  // ── FORMAT TIME HELPER ──────────────────────────────────────────
  function minToTimeStr(utcMidnightDate, utcMin, tz) {
    const d = new Date(utcMidnightDate.getTime() + utcMin * 60000);
    return d.toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  // ── MAIN PANCHANG CALCULATION ENGINE ────────────────────────────
    Astro.calculatePanchang = function (instantUtcDate, cityTz) {
    const tz = cityTz || 'Asia/Kolkata';
    const city = Astro.CITIES[tz] || Astro.CITIES['Asia/Kolkata'];
    const now = instantUtcDate || Astro.getNow();

    // 1. Convert instant to local civil date components in the selected timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const dateStr = formatter.format(now); // "YYYY-MM-DD"
    const [localYear, localMonth, localDay] = dateStr.split('-').map(Number);

    // Determine weekday (0 = Sun, ..., 6 = Sat in selected city)
    const localWeekdayNum = new Date(Date.UTC(localYear, localMonth - 1, localDay)).getUTCDay();

    // 2. Solar calculations for observer's coordinates and local civil day
    const solar = Astro.getSolarTimes(localYear, localMonth, localDay, city.lat, city.lon);
    const utcMidnight = new Date(Date.UTC(localYear, localMonth - 1, localDay, 0, 0, 0));

    let sunriseStr = '--:--';
    let sunsetStr = '--:--';
    let rahuKaalStr = '--:-- – --:--';
    let abhijitStr = '--:-- – --:--';
    let brahmaStr = '--:-- – --:--';
    let vijayaStr = '--:-- – --:--';
    let godhuliStr = '--:-- – --:--';
    let amritKaalStr = '--:-- – --:--';
    let yamagandaStr = '--:-- – --:--';
    let gulikaStr = '--:-- – --:--';
    let durmuhuratStr = '--:-- – --:--';

    const dayChoghadiya = [];
    const nightChoghadiya = [];

    const choghadiyaDayOrder = [
      ['उद्वेग', 'चर', 'लाभ', 'अमृत', 'काल', 'शुभ', 'रोग', 'उद्वेग'],
      ['अमृत', 'काल', 'शुभ', 'रोग', 'उद्वेग', 'चर', 'लाभ', 'अमृत'],
      ['रोग', 'उद्वेग', 'चर', 'लाभ', 'अमृत', 'काल', 'शुभ', 'रोग'],
      ['लाभ', 'अमृत', 'काल', 'शुभ', 'रोग', 'उद्वेग', 'चर', 'लाभ'],
      ['शुभ', 'रोग', 'उद्वेग', 'चर', 'लाभ', 'अमृत', 'काल', 'शुभ'],
      ['चर', 'लाभ', 'अमृत', 'काल', 'शुभ', 'रोग', 'उद्वेग', 'चर'],
      ['काल', 'शुभ', 'रोग', 'उद्वेग', 'चर', 'लाभ', 'अमृत', 'काल']
    ];

    const choghadiyaNightOrder = [
      ['शुभ', 'अमृत', 'चर', 'रोग', 'काल', 'लाभ', 'उद्वेग', 'शुभ'],
      ['चर', 'रोग', 'काल', 'लाभ', 'उद्वेग', 'शुभ', 'अमृत', 'चर'],
      ['काल', 'लाभ', 'उद्वेग', 'शुभ', 'अमृत', 'चर', 'रोग', 'काल'],
      ['उद्वेग', 'शुभ', 'अमृत', 'चर', 'रोग', 'काल', 'लाभ', 'उद्वेग'],
      ['अमृत', 'चर', 'रोग', 'काल', 'लाभ', 'उद्वेग', 'शुभ', 'अमृत'],
      ['रोग', 'काल', 'लाभ', 'उद्वेग', 'शुभ', 'अमृत', 'चर', 'रोग'],
      ['लाभ', 'उद्वेग', 'शुभ', 'अमृत', 'चर', 'रोग', 'काल', 'लाभ']
    ];

    const choghadiyaMeta = {
      'अमृत': { type: 'shubh', label: 'अमृत (सर्वोत्तम / Best)', icon: '✨' },
      'शुभ':  { type: 'shubh', label: 'शुभ (उत्तम / Auspicious)', icon: '⭐' },
      'लाभ':  { type: 'shubh', label: 'लाभ (उन्नति / Prosperous)', icon: '🌟' },
      'चर':   { type: 'neutral', label: 'चर (सामान्य / Neutral)', icon: '🚶' },
      'रोग':  { type: 'ashubh', label: 'रोग (अशुभ / Inauspicious)', icon: '⚠️' },
      'काल':  { type: 'ashubh', label: 'काल (हानि / Inauspicious)', icon: '⛔' },
      'उद्वेग':{ type: 'ashubh', label: 'उद्वेग (अशुभ / Inauspicious)', icon: '⚠️' }
    };

    if (!solar.isPolar && solar.sunriseUtcMin !== null && solar.sunsetUtcMin !== null) {
      sunriseStr = minToTimeStr(utcMidnight, solar.sunriseUtcMin, tz);
      sunsetStr = minToTimeStr(utcMidnight, solar.sunsetUtcMin, tz);

      const daylight = solar.sunsetUtcMin - solar.sunriseUtcMin;

      // Rahu Kaal: authentic 8-part division of daytime
      const rahuSegments = [7, 1, 6, 4, 5, 3, 2];
      const rIdx = rahuSegments[localWeekdayNum];
      const rahuStartMin = solar.sunriseUtcMin + rIdx * (daylight / 8.0);
      const rahuEndMin = solar.sunriseUtcMin + (rIdx + 1) * (daylight / 8.0);
      rahuKaalStr = `${minToTimeStr(utcMidnight, rahuStartMin, tz)} – ${minToTimeStr(utcMidnight, rahuEndMin, tz)}`;

      // Abhijit Muhurat: 8th of 15 divisions centered on solar noon (prohibited on Wednesday)
      if (localWeekdayNum === 3) {
        abhijitStr = 'बुधवार को वर्जित (Not Applicable)';
      } else {
        const abhijitStartMin = solar.sunriseUtcMin + 7 * (daylight / 15.0);
        const abhijitEndMin = solar.sunriseUtcMin + 8 * (daylight / 15.0);
        abhijitStr = `${minToTimeStr(utcMidnight, abhijitStartMin, tz)} – ${minToTimeStr(utcMidnight, abhijitEndMin, tz)}`;
      }

      // Brahma Muhurat: 96 min to 48 min before sunrise
      const bStart = solar.sunriseUtcMin - 96;
      const bEnd = solar.sunriseUtcMin - 48;
      brahmaStr = `${minToTimeStr(utcMidnight, bStart, tz)} – ${minToTimeStr(utcMidnight, bEnd, tz)}`;

      // Vijaya Muhurat: 11th division of daylight
      const vStart = solar.sunriseUtcMin + 10 * (daylight / 15.0);
      const vEnd = solar.sunriseUtcMin + 11 * (daylight / 15.0);
      vijayaStr = `${minToTimeStr(utcMidnight, vStart, tz)} – ${minToTimeStr(utcMidnight, vEnd, tz)}`;

      // Godhuli: 12 min before to 12 min after sunset
      const gStart = solar.sunsetUtcMin - 12;
      const gEnd = solar.sunsetUtcMin + 12;
      godhuliStr = `${minToTimeStr(utcMidnight, gStart, tz)} – ${minToTimeStr(utcMidnight, gEnd, tz)}`;

      // Amrit Kaal
      const aStart = solar.sunriseUtcMin + 8.5 * (daylight / 15.0);
      const aEnd = solar.sunriseUtcMin + 10 * (daylight / 15.0);
      amritKaalStr = `${minToTimeStr(utcMidnight, aStart, tz)} – ${minToTimeStr(utcMidnight, aEnd, tz)}`;

      // Yamaganda (8 divisions of daylight)
      const yamaSegments = [4, 3, 2, 1, 0, 6, 5];
      const yIdx = yamaSegments[localWeekdayNum];
      const yStart = solar.sunriseUtcMin + yIdx * (daylight / 8.0);
      const yEnd = solar.sunriseUtcMin + (yIdx + 1) * (daylight / 8.0);
      yamagandaStr = `${minToTimeStr(utcMidnight, yStart, tz)} – ${minToTimeStr(utcMidnight, yEnd, tz)}`;

      // Gulika (8 divisions of daylight)
      const gulikaSegments = [6, 5, 4, 3, 2, 1, 0];
      const guIdx = gulikaSegments[localWeekdayNum];
      const guStart = solar.sunriseUtcMin + guIdx * (daylight / 8.0);
      const guEnd = solar.sunriseUtcMin + (guIdx + 1) * (daylight / 8.0);
      gulikaStr = `${minToTimeStr(utcMidnight, guStart, tz)} – ${minToTimeStr(utcMidnight, guEnd, tz)}`;

      // Durmuhurat
      const durStart = solar.sunriseUtcMin + 5 * (daylight / 15.0);
      const durEnd = solar.sunriseUtcMin + 6 * (daylight / 15.0);
      durmuhuratStr = `${minToTimeStr(utcMidnight, durStart, tz)} – ${minToTimeStr(utcMidnight, durEnd, tz)}`;

      // Choghadiya - Day (8 parts)
      const daySeg = daylight / 8.0;
      const dOrder = choghadiyaDayOrder[localWeekdayNum];
      for (let i = 0; i < 8; i++) {
        const sMin = solar.sunriseUtcMin + i * daySeg;
        const eMin = solar.sunriseUtcMin + (i + 1) * daySeg;
        const name = dOrder[i];
        dayChoghadiya.push({
          index: i + 1,
          name,
          timeStr: `${minToTimeStr(utcMidnight, sMin, tz)} – ${minToTimeStr(utcMidnight, eMin, tz)}`,
          meta: choghadiyaMeta[name]
        });
      }

      // Choghadiya - Night (8 parts)
      const nightDuration = 1440 - daylight;
      const nightSeg = nightDuration / 8.0;
      const nOrder = choghadiyaNightOrder[localWeekdayNum];
      for (let i = 0; i < 8; i++) {
        const sMin = solar.sunsetUtcMin + i * nightSeg;
        const eMin = solar.sunsetUtcMin + (i + 1) * nightSeg;
        const name = nOrder[i];
        nightChoghadiya.push({
          index: i + 1,
          name,
          timeStr: `${minToTimeStr(utcMidnight, sMin, tz)} – ${minToTimeStr(utcMidnight, eMin, tz)}`,
          meta: choghadiyaMeta[name]
        });
      }
    }

    // 5. Current Instantaneous Tithi and Nakshatra
    const curJd = Astro.dateToJd(now);
    const { sun, moon, elongation } = Astro.getSunMoonLongitudes(curJd);

    const tithiIndex = Math.floor(elongation / 12.0) % 30;
    const isShukla = tithiIndex < 15;
    const tithiRawIndex = isShukla ? tithiIndex : tithiIndex - 15;

    let tithiObj = Astro.TITHIS[tithiRawIndex];
    let tithiDisplayHi = tithiObj.hi;
    let tithiDisplayEn = tithiObj.en;
    if (!isShukla && tithiRawIndex === 14) {
      tithiDisplayHi = tithiObj.amavasya_hi;
      tithiDisplayEn = tithiObj.amavasya_en;
    }

    const pakshaHi = isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
    const pakshaEn = isShukla ? 'Shukla Paksha' : 'Krishna Paksha';

    // Solve Tithi end time
    const nextTithiTargetElong = ((tithiIndex + 1) * 12.0) % 360.0;
    const tithiEndJd = Astro.solveTithiTransition(curJd, nextTithiTargetElong);
    const tithiEndDate = Astro.jdToDate(tithiEndJd);
    const tithiEndFormatted = tithiEndDate.toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const tithiEndDateFormatted = tithiEndDate.toLocaleDateString('hi-IN', {
      timeZone: tz,
      day: 'numeric',
      month: 'long'
    });

    // 6. Current Nakshatra
    const ayanamsa = Astro.getLahiriAyanamsa(curJd);
    const siderealMoon = (moon - ayanamsa + 360.0) % 360.0;
    const nakshatraIndex = Math.floor(siderealMoon / (360.0 / 27.0)) % 27;
    const nakshatraObj = Astro.NAKSHATRAS[nakshatraIndex];

    // Solve Nakshatra end time
    const nextNakshatraTargetSid = ((nakshatraIndex + 1) * (360.0 / 27.0)) % 360.0;
    const nakshatraEndJd = Astro.solveNakshatraTransition(curJd, nextNakshatraTargetSid);
    const nakshatraEndDate = Astro.jdToDate(nakshatraEndJd);
    const nakshatraEndFormatted = nakshatraEndDate.toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const nakshatraEndDateFormatted = nakshatraEndDate.toLocaleDateString('hi-IN', {
      timeZone: tz,
      day: 'numeric',
      month: 'long'
    });

    // 7. Yoga Calculation
    const siderealSun = (sun - ayanamsa + 360.0) % 360.0;
    const yogaSum = (siderealSun + siderealMoon) % 360.0;
    const yogaIndex = Math.floor(yogaSum / (360.0 / 27.0)) % 27;
    const yogaObj = Astro.YOGAS[yogaIndex];
    const nextYogaTarget = ((yogaIndex + 1) * (360.0 / 27.0)) % 360.0;
    const yogaEndJd = Astro.solveYogaTransition(curJd, nextYogaTarget);
    const yogaEndDate = Astro.jdToDate(yogaEndJd);
    const yogaEndFormatted = yogaEndDate.toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // 8. Karana Calculation
    const halfTithiIndex = Math.floor(elongation / 6.0) % 60;
    let karanaObj;
    if (halfTithiIndex === 0) {
      karanaObj = Astro.KARANAS[10]; // Kimstughna
    } else if (halfTithiIndex >= 57) {
      karanaObj = Astro.KARANAS[halfTithiIndex - 50]; // 57->Shakuni(7), 58->Chatushpada(8), 59->Naga(9)
    } else {
      karanaObj = Astro.KARANAS[(halfTithiIndex - 1) % 7];
    }

    // 9. Hindu Month (Masa) & Samvat
    const solarRashi = Math.floor(siderealSun / 30.0);
    const masaIndex = (solarRashi + 1) % 12;
    const masaObj = Astro.HINDU_MASAS[masaIndex];
    const isPostChaitra2026 = (localMonth > 3 || (localMonth === 3 && localDay >= 19));
    const vikramSamvat = isPostChaitra2026 ? 2083 : 2082;
    const shakaSamvat = isPostChaitra2026 ? 1948 : 1947;
    const ayanaHi = (solarRashi >= 9 || solarRashi < 3) ? 'उत्तरायण' : 'दक्षिणायन';
    const ayanaEn = (solarRashi >= 9 || solarRashi < 3) ? 'Uttarayana' : 'Dakshinayana';

    // 10. Sunrise Tithi (Udaya Tithi)
    let sunriseTithiObj = tithiObj;
    let sunriseTithiDisplayHi = tithiDisplayHi;
    let sunriseTithiDisplayEn = tithiDisplayEn;
    if (!solar.isPolar && solar.sunriseUtcMin !== null) {
      const sunriseUtcInstant = new Date(utcMidnight.getTime() + solar.sunriseUtcMin * 60000);
      const srJd = Astro.dateToJd(sunriseUtcInstant);
      const srElong = Astro.getSunMoonLongitudes(srJd).elongation;
      const srTithiIdx = Math.floor(srElong / 12.0) % 30;
      const srIsShukla = srTithiIdx < 15;
      const srRawIdx = srIsShukla ? srTithiIdx : srTithiIdx - 15;
      const sObj = Astro.TITHIS[srRawIdx];
      sunriseTithiDisplayHi = (!srIsShukla && srRawIdx === 14) ? sObj.amavasya_hi : sObj.hi;
      sunriseTithiDisplayEn = (!srIsShukla && srRawIdx === 14) ? sObj.amavasya_en : sObj.en;
    }

    return {
      now,
      city,
      localYear,
      localMonth,
      localDay,
      dayOfWeek: Astro.DAYS[localWeekdayNum],
      dateStrFormatted: `${localDay} ${Astro.HINDI_MONTHS[localMonth - 1]} ${localYear}`,
      timeStr: now.toLocaleTimeString('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      // Limbs of Panchang
      tithi: {
        index: tithiIndex,
        hi: tithiDisplayHi,
        en: tithiDisplayEn,
        pakshaHi,
        pakshaEn,
        endTimeFormatted: tithiEndFormatted,
        endDateFormatted: tithiEndDateFormatted
      },
      nakshatra: {
        index: nakshatraIndex,
        hi: nakshatraObj.hi,
        en: nakshatraObj.en,
        endTimeFormatted: nakshatraEndFormatted,
        endDateFormatted: nakshatraEndDateFormatted
      },
      yoga: {
        index: yogaIndex,
        hi: yogaObj.hi,
        en: yogaObj.en,
        endTimeFormatted: yogaEndFormatted
      },
      karana: {
        index: halfTithiIndex,
        hi: karanaObj.hi,
        en: karanaObj.en
      },
      sunriseTithi: {
        hi: sunriseTithiDisplayHi,
        en: sunriseTithiDisplayEn
      },
      masa: {
        hi: masaObj.hi,
        en: masaObj.en,
        pakshaHi,
        pakshaEn
      },
      samvat: {
        vikram: vikramSamvat,
        shaka: shakaSamvat,
        ayanaHi,
        ayanaEn
      },
      solar: {
        sunrise: sunriseStr,
        sunset: sunsetStr,
        rahuKaal: rahuKaalStr,
        abhijit: abhijitStr
      },
      muhurats: {
        brahma: brahmaStr,
        abhijit: abhijitStr,
        vijaya: vijayaStr,
        godhuli: godhuliStr,
        amritKaal: amritKaalStr,
        rahuKaal: rahuKaalStr,
        yamaganda: yamagandaStr,
        gulika: gulikaStr,
        durmuhurat: durmuhuratStr
      },
      choghadiya: {
        day: dayChoghadiya,
        night: nightChoghadiya
      }
    };
  };

  return Astro;
});

BAS.Astro = (typeof globalThis !== 'undefined' && globalThis.BAS && globalThis.BAS.Astro) ? globalThis.BAS.Astro : (typeof window !== 'undefined' && window.BAS && window.BAS.Astro ? window.BAS.Astro : null);

BAS.grahanDatabase = (BAS.Astro && BAS.Astro.GRAHAN_DATABASE) ? BAS.Astro.GRAHAN_DATABASE : [];

BAS.updateHeroGrahan = function (selectedTz) {
  const cardEl = document.getElementById('panchang-grahan-card');
  const tagEl = document.getElementById('grahan-tag');
  const pillEl = document.getElementById('grahan-status-pill');
  const normalView = document.getElementById('grahan-normal-view');
  const normalMsg = normalView ? normalView.querySelector('.grahan-normal-msg') : null;
  const upcomingNote = document.getElementById('grahan-upcoming-note');
  const locVisSpan = document.getElementById('grahan-loc-vis');

  const eclipseView = document.getElementById('grahan-eclipse-view');
  const typeVal = document.getElementById('grahan-type-val');
  const startVal = document.getElementById('grahan-start-val');
  const peakVal = document.getElementById('grahan-peak-val');
  const endVal = document.getElementById('grahan-end-val');
  const locLabel = document.getElementById('grahan-loc-label');
  const visVal = document.getElementById('grahan-vis-val');
  const sutakRow = document.getElementById('grahan-sutak-detail-row');
  const sutakVal = document.getElementById('grahan-sutak-val');

  if (!cardEl || !normalView) return;

  const tz = selectedTz || localStorage.getItem('bas_panchang_tz') || 'Asia/Kolkata';
  const now = (BAS.Astro && BAS.Astro.getNow) ? BAS.Astro.getNow() : new Date();

  const cityMap = {
    'Asia/Kolkata': 'नई दिल्ली',
    'Asia/Dubai': 'दुबई',
    'Europe/London': 'लंदन',
    'America/New_York': 'न्यूयॉर्क',
    'America/Los_Angeles': 'लॉस एंजिल्स',
    'America/Toronto': 'टोरंटो',
    'Australia/Sydney': 'सिडनी'
  };
  const cityName = cityMap[tz] || 'स्थानीय';

  function formatTzTime(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  function formatTzDate(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleDateString('hi-IN', {
      timeZone: tz,
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  const db = (BAS.Astro && BAS.Astro.GRAHAN_DATABASE) ? BAS.Astro.GRAHAN_DATABASE : BAS.grahanDatabase;

  // Check if today has an active eclipse in the selected timezone
  let activeGrahan = null;
  let isToday = false;

  for (let i = 0; i < db.length; i++) {
    const g = db[i];
    const startTime = new Date(g.utc_start).getTime();
    const endTime = new Date(g.utc_end).getTime();

    if (now.getTime() >= startTime && now.getTime() <= endTime) {
      activeGrahan = g;
      isToday = true;
      break;
    }

    const gDate = new Date(g.utc_start).toLocaleDateString('en-CA', { timeZone: tz });
    const todayDate = now.toLocaleDateString('en-CA', { timeZone: tz });
    if (gDate === todayDate) {
      activeGrahan = g;
      isToday = true;
      break;
    }
  }

  if (isToday && activeGrahan) {
    const visRule = (activeGrahan.visibility && activeGrahan.visibility[tz]) ? activeGrahan.visibility[tz] : { visible: false, note: 'अदृश्य' };

    if (visRule.visible) {
      // ── LOCALLY VISIBLE ECLIPSE TODAY (Auto-Expand with Verified Information) ──
      cardEl.className = 'panchang-grahan-card panchang-grahan-card--active';
      normalView.style.display = 'none';
      if (eclipseView) eclipseView.style.display = 'flex';

      tagEl.innerHTML = `🚨 <strong style="color:#f59e0b;">आज ग्रहण:</strong> ${activeGrahan.icon} ${activeGrahan.name_hi}`;
      if (pillEl) {
        pillEl.style.background = 'rgba(234, 88, 12, 0.25)';
        pillEl.style.color = '#fdba74';
        pillEl.style.borderColor = 'rgba(249, 115, 22, 0.45)';
        pillEl.textContent = `${cityName}: दृश्य`;
      }

      if (typeVal) typeVal.textContent = activeGrahan.name_hi;
      if (startVal) startVal.textContent = formatTzTime(activeGrahan.utc_start);
      if (peakVal) peakVal.textContent = formatTzTime(activeGrahan.utc_peak);
      if (endVal) endVal.textContent = formatTzTime(activeGrahan.utc_end);
      if (locLabel) locLabel.textContent = `दृश्यता (${cityName}):`;
      if (visVal) visVal.textContent = visRule.note;

      if (visRule.visible && activeGrahan.sutak_hours) {
        if (sutakRow) sutakRow.style.display = 'flex';
        const sutakStartTime = new Date(new Date(activeGrahan.utc_start).getTime() - (activeGrahan.sutak_hours * 3600000));
        const sStr = sutakStartTime.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true });
        if (sutakVal) sutakVal.textContent = `${sStr} से मोक्ष तक (सूतक प्रभावी)`;
      } else {
        if (sutakRow) sutakRow.style.display = 'none';
      }
    } else {
      // ── GLOBALLY ACTIVE TODAY BUT INVISIBLE LOCALLY ──
      cardEl.className = 'panchang-grahan-card';
      normalView.style.display = 'flex';
      if (eclipseView) eclipseView.style.display = 'none';

      tagEl.innerHTML = '🌘 ग्रहण जानकारी';
      if (pillEl) {
        pillEl.style.background = 'rgba(100, 116, 139, 0.25)';
        pillEl.style.color = '#cbd5e1';
        pillEl.style.borderColor = 'rgba(148, 163, 184, 0.3)';
        pillEl.textContent = `${cityName}: अदृश्य`;
      }
      if (normalMsg) {
        normalMsg.textContent = `आज ग्रहण है, लेकिन ${cityName} में दिखाई नहीं देगा। धार्मिक मान्यतानुसार जहाँ ग्रहण अदृश्य हो, वहाँ सूतक मान्य नहीं होता।`;
      }
      if (upcomingNote) {
        upcomingNote.innerHTML = `· वैश्विक ग्रहण: ${activeGrahan.name_hi} <span id="grahan-loc-vis">[${cityName}: अदृश्य]</span>`;
      }
    }
  } else {
    // ── NORMAL DAY — NO ECLIPSE TODAY (Compact & Clean) ──
    cardEl.className = 'panchang-grahan-card';
    normalView.style.display = 'flex';
    if (eclipseView) eclipseView.style.display = 'none';

    tagEl.innerHTML = '🌘 ग्रहण जानकारी';
    if (pillEl) {
      pillEl.style.background = 'rgba(16, 185, 129, 0.12)';
      pillEl.style.color = '#6ee7b7';
      pillEl.style.borderColor = 'rgba(16, 185, 129, 0.28)';
      pillEl.textContent = 'आज कोई ग्रहण नहीं';
    }
    if (normalMsg) {
      normalMsg.textContent = 'आज कोई सूर्य या चंद्र ग्रहण नहीं है।';
    }

    // Find next verified upcoming global eclipse
    let nextGlobal = null;
    for (let i = 0; i < db.length; i++) {
      const g = db[i];
      if (new Date(g.utc_end).getTime() > now.getTime()) {
        nextGlobal = g;
        break;
      }
    }

    // Find next locally visible eclipse
    let nextLocalVisible = null;
    for (let i = 0; i < db.length; i++) {
      const g = db[i];
      if (new Date(g.utc_end).getTime() > now.getTime() && g.visibility && g.visibility[tz] && g.visibility[tz].visible) {
        nextLocalVisible = g;
        break;
      }
    }

    if (nextGlobal && upcomingNote) {
      const gDateStr = formatTzDate(nextGlobal.utc_start);
      const visRule = (nextGlobal.visibility && nextGlobal.visibility[tz]) ? nextGlobal.visibility[tz] : { visible: false };
      const visText = visRule.visible ? 'दृश्य' : 'अदृश्य';
      const typeLabel = nextGlobal.type === 'surya' ? 'सूर्य ग्रहण' : 'चन्द्र ग्रहण';

      let localNote = '';
      if (!visRule.visible && nextLocalVisible) {
        const localDateStr = formatTzDate(nextLocalVisible.utc_start);
        const localType = nextLocalVisible.type === 'surya' ? 'सूर्य ग्रहण' : 'चन्द्र ग्रहण';
        localNote = ` · स्थानीय दृश्य: ${localDateStr} (${localType})`;
      }

      upcomingNote.innerHTML = `· अगला ग्रहण: ${gDateStr} (${typeLabel}) <span id="grahan-loc-vis">[${cityName}: ${visText}]</span>${localNote}`;
    }
  }
};

BAS.initHeroPanchang = function () {
  const dateEl      = document.getElementById('panchang-date');
  const timeValEl   = document.getElementById('panchang-time-val');
  const tithiEl     = document.getElementById('panchang-tithi');
  const pakshaEl    = document.getElementById('panchang-paksha');
  const nakshatraEl = document.getElementById('panchang-nakshatra');
  const varEl       = document.getElementById('panchang-var');
  const abhijitEl   = document.getElementById('panchang-abhijit');
  const rahuEl      = document.getElementById('panchang-rahukaal');
  const citySelect  = document.getElementById('panchang-city-select');

  if (!tithiEl && !dateEl) return;

  // Selected timezone
  let selectedTz = localStorage.getItem('bas_panchang_tz') || 'Asia/Kolkata';
  if (citySelect) {
    citySelect.value = selectedTz;
    if (!citySelect.dataset.listenerAttached) {
      citySelect.dataset.listenerAttached = 'true';
      citySelect.addEventListener('change', function () {
        const newTz = this.value;
        localStorage.setItem('bas_panchang_tz', newTz);
        BAS.initHeroPanchang();
        BAS.updateHeroGrahan(newTz);
        if (BAS.showToast) {
          BAS.showToast('पंचांग शहर अपडेट हुआ: ' + this.options[this.selectedIndex].text);
        }
      });
    }
  }

  const isEn = BAS.currentLang === 'en';
  const now = (BAS.Astro && BAS.Astro.getNow) ? BAS.Astro.getNow() : new Date();

  // High-precision astronomical calculation
  const p = (BAS.Astro && BAS.Astro.calculatePanchang)
    ? BAS.Astro.calculatePanchang(now, selectedTz)
    : null;

  if (p) {
    if (dateEl) {
      dateEl.innerHTML = `<span aria-hidden="true">📅</span> ${p.dateStrFormatted}`;
    }
    if (timeValEl) {
      timeValEl.textContent = p.timeStr;
    }
    if (varEl) {
      varEl.textContent = isEn ? `${p.dayOfWeek.en} (${p.dayOfWeek.hi})` : `${p.dayOfWeek.hi} (${p.dayOfWeek.en})`;
    }
    if (tithiEl) {
      tithiEl.textContent = isEn ? `${p.tithi.en} (${p.tithi.hi})` : `${p.tithi.hi} (${p.tithi.en})`;
      tithiEl.title = `समाप्ति: ${p.tithi.endDateFormatted}, ${p.tithi.endTimeFormatted}`;
    }
    if (pakshaEl) {
      pakshaEl.textContent = isEn ? p.tithi.pakshaEn : `${p.tithi.pakshaHi} (${p.tithi.pakshaEn})`;
    }
    if (nakshatraEl) {
      nakshatraEl.textContent = isEn ? `${p.nakshatra.en} (${p.nakshatra.hi})` : `${p.nakshatra.hi} (${p.nakshatra.en})`;
      nakshatraEl.title = `समाप्ति: ${p.nakshatra.endDateFormatted}, ${p.nakshatra.endTimeFormatted}`;
    }
    if (abhijitEl) {
      abhijitEl.textContent = p.solar.abhijit;
    }
    if (rahuEl) {
      rahuEl.textContent = p.solar.rahuKaal;
    }
    const refNoteEl = document.getElementById('panchang-ref-note');
    if (refNoteEl) {
      const tzShortMap = {
        'Asia/Kolkata': 'IST (UTC+5:30)',
        'Asia/Dubai': 'GST (UTC+4:00)',
        'Europe/London': 'GMT/BST (UTC+0/+1)',
        'America/New_York': 'EST/EDT (UTC-5/-4)',
        'America/Los_Angeles': 'PST/PDT (UTC-8/-7)',
        'America/Toronto': 'EST/EDT (UTC-5/-4)',
        'Australia/Sydney': 'AEST/AEDT (UTC+10/+11)'
      };
      const tzLabel = tzShortMap[selectedTz] || selectedTz;
      refNoteEl.textContent = `📍 चयनित स्थान: ${p.city.name_hi} • ${tzLabel} | सूर्योदय व मुहूर्त स्थानीय समय आधारित`;
    }
  }

  // Update Grahan information for the selected city
  BAS.updateHeroGrahan(selectedTz);

  // Live Local Time ticker
  if (BAS._panchangClockTimer) clearInterval(BAS._panchangClockTimer);
  BAS._panchangClockTimer = setInterval(() => {
    const curNow = (BAS.Astro && BAS.Astro.getNow) ? BAS.Astro.getNow() : new Date();
    if (timeValEl) {
      timeValEl.textContent = curNow.toLocaleTimeString('en-US', {
        timeZone: selectedTz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }
  }, 1000);
};

// ── DEVOTIONAL BACKGROUND AUDIO PLAYER ──────────────────
BAS.initHeroAudio = function () {
  const audio = document.getElementById('hero-bg-audio');
  const toggleBtn = document.getElementById('hero-audio-toggle');
  const audioText = document.getElementById('audio-text');
  if (!audio || !toggleBtn) return;

  function updateAudioState(isPlaying) {
    if (isPlaying) {
      toggleBtn.classList.add('playing');
      if (audioText) audioText.textContent = 'संगीत चालू ॐ';
    } else {
      toggleBtn.classList.remove('playing');
      if (audioText) audioText.textContent = 'भक्ति संगीत';
    }
  }

  // Attempt autoplay immediately
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      updateAudioState(true);
    }).catch(() => {
      // Autoplay blocked by browser policy without user gesture.
      // Automatically start playing on the very first user interaction anywhere!
      updateAudioState(false);
      const startAudioOnce = () => {
        audio.play().then(() => {
          updateAudioState(true);
        }).catch(() => {});
        ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
          document.removeEventListener(evt, startAudioOnce, true);
        });
      };
      ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
        document.addEventListener(evt, startAudioOnce, { capture: true, once: true });
      });
    });
  }

  // User click toggle
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
      audio.play().then(() => {
        updateAudioState(true);
      }).catch(() => {});
    } else {
      audio.pause();
      updateAudioState(false);
    }
  });

  audio.addEventListener('play', () => updateAudioState(true));
  audio.addEventListener('pause', () => updateAudioState(false));
  audio.addEventListener('ended', () => updateAudioState(false));
};

// ── TODAY'S DIVINE MESSAGE (DAILY BHAGAVAD GITA WISDOM) ────
BAS.gitaQuotes = [
  {
    "shloka": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।<br>मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    "hindi": "तुम्हारा अधिकार केवल कर्म करने में है, कर्मों के फल में कभी नहीं। फल की इच्छा से कभी कर्म मत करो और न ही कर्म त्यागने में तुम्हारी आसक्ति हो।",
    "english": "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of results, nor be attached to inaction.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय २, श्लोक ४७)"
  },
  {
    "shloka": "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।<br>अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    "hindi": "हे भारत! जब-जब धर्म की हानि और अधर्म का उत्थान होता है, तब-तब मैं धर्म की रक्षा व सज्जनों के उद्धार हेतु स्वयं को प्रकट करता हूँ।",
    "english": "Whenever there is a decline in righteousness and a rise in unrighteousness, O Bharata, I manifest Myself on earth.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ४, श्लोक ७)"
  },
  {
    "shloka": "परित्राणाय साधूनां विनाशाय च दुष्कृताम्।<br>धर्मसंस्थापनार्थाय सम्भवामि युगे युगे॥",
    "hindi": "सज्जनों के कल्याण, दुष्टों के विनाश और धर्म की पुनः स्थापना के लिए मैं प्रत्येक युग में प्रकट होता हूँ।",
    "english": "For the protection of the virtuous, the destruction of evil-doers, and the establishment of dharma, I appear age after age.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ४, श्लोक ८)"
  },
  {
    "shloka": "न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः।<br>अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥",
    "hindi": "आत्मा न कभी जन्म लेती है और न कभी मरती है। यह अजन्मा, नित्य, शाश्वत और पुरातन है। शरीर के नष्ट होने पर भी आत्मा का नाश नहीं होता।",
    "english": "The soul is never born, nor does it die. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय २, श्लोक २०)"
  },
  {
    "shloka": "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि।<br>तथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही॥",
    "hindi": "जैसे मनुष्य पुराने वस्त्रों को त्यागकर नए वस्त्र धारण करता है, वैसे ही जीवात्मा पुराने शरीरों को छोड़कर नए शरीरों में प्रवेश करती है।",
    "english": "As a person sheds worn-out garments and puts on new ones, so does the embodied soul cast away worn-out bodies and enter new ones.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय २, श्लोक २२)"
  },
  {
    "shloka": "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।<br>आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    "hindi": "मनुष्य को अपने विवेक द्वारा अपना उद्धार करना चाहिए, अपना पतन नहीं होने देना चाहिए। क्योंकि मनुष्य स्वयं ही अपना सच्चा मित्र है और स्वयं ही अपना शत्रु।",
    "english": "Elevate yourself through your own mind, and do not degrade yourself. For the mind alone is one's friend, and the mind alone is one's enemy.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ६, श्लोक ५)"
  },
  {
    "shloka": "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।<br>तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
    "hindi": "जो अनन्य भाव से केवल मेरा ही चिंतन करते हुए निष्काम उपासना करते हैं, उन नित्य युक्त भक्तों के योग और क्षेम (सुरक्षा व कल्याण) का वहन मैं स्वयं करता हूँ।",
    "english": "To those who always remember Me with focused devotion, meditating on My divine form, I supply what they lack and preserve what they have.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ९, श्लोक २२)"
  },
  {
    "shloka": "पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति।<br>तदहं भक्त्युपहृतमश्नामि प्रयतात्मनः॥",
    "hindi": "जो कोई भक्त प्रेम और निष्काम भक्ति से मुझे एक पत्ता, फूल, फल या जल भी अर्पित करता है, उस शुद्ध अंतःकरण वाले भक्त के उपहार को मैं सहर्ष स्वीकार करता हूँ।",
    "english": "Whoever offers Me with devotion a leaf, a flower, a fruit, or even water, I accept that love-filled offering of a pure heart.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ९, श्लोक २६)"
  },
  {
    "shloka": "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु।<br>मामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे॥",
    "hindi": "अपने मन को मुझमें लगाओ, मेरे भक्त बनो, मेरी पूजा करो और मुझे प्रणाम करो। ऐसा करने पर तुम निश्चित ही मुझे प्राप्त होगे, यह मेरी सच्ची प्रतिज्ञा है।",
    "english": "Fix your mind on Me, be devoted to Me, worship Me, and bow down to Me. Thus you will come to Me without doubt; I promise you truly, for you are dear to Me.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय १८, श्लोक ६५)"
  },
  {
    "shloka": "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।<br>अहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
    "hindi": "सभी धर्मों और चिंताओं को त्यागकर केवल मेरी शरण में आ जाओ। मैं तुम्हें समस्त पापों और बंधनों से मुक्त कर दूँगा, शोक मत करो।",
    "english": "Abandon all varieties of attachment and simply surrender unto Me alone. I shall liberate you from all bondage; do not grieve.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय १८, श्लोक ६६)"
  },
  {
    "shloka": "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।<br>आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
    "hindi": "हे कौन्तेय! सर्दी-गर्मी और सुख-दुःख की अनुभूति इंद्रियों और विषयों के संयोग से होती है। ये क्षणभंगुर व अनित्य हैं, अतः हे भारत, तुम इन्हें धैर्यपूर्वक सहन करो।",
    "english": "The contact of senses with their objects brings heat and cold, pleasure and pain. They are fleeting and impermanent; learn to endure them patiently.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय २, श्लोक १४)"
  },
  {
    "shloka": "बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते।<br>तस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम्॥",
    "hindi": "समबुद्धि से युक्त व्यक्ति इसी जीवन में पुण्य और पाप दोनों की आसक्ति त्याग देता है। इसलिए तुम योग में स्थित हो जाओ; कर्मों में कुशलता ही योग है।",
    "english": "One who possesses equanimity of intellect transcends both good and bad karma in this life. Strive for yoga; excellence in action is yoga.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय २, श्लोक ५०)"
  },
  {
    "shloka": "यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः।<br>स यत्प्रमाणं कुरुते लोकस्तदनुवर्तते॥",
    "hindi": "श्रेष्ठ पुरुष जैसा-जैसा आचरण करता है, समाज के अन्य लोग भी वैसा ही आचरण करते हैं। वह जो आदर्श प्रस्तुत करता है, समस्त संसार उसी का अनुसरण करता है।",
    "english": "Whatever action a great leader performs, common people follow. Whatever standard exemplary leaders set, the whole world pursues.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ३, श्लोक २१)"
  },
  {
    "shloka": "यतो यतो निश्चरति मनश्चञ्चलमस्थिरम्।<br>ततस्ततो नियम्यैतदात्मन्येव वशं नयेत्॥",
    "hindi": "यह चंचल और अस्थिर मन जहाँ-जहाँ भटके, वहाँ-वहाँ से इसे रोककर बार-बार परमात्मा के ध्यान में ही स्थिर करना चाहिए।",
    "english": "From wherever the restless and unsteady mind wanders away, one should rein it in and bring it back under the steady contemplation of the Self.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ६, श्लोक २६)"
  },
  {
    "shloka": "मत्तः परतरं नान्यत्किञ्चिदस्ति धनञ्जय।<br>मयि सर्वमिदं प्रोतं सूत्रे मणिगणा इव॥",
    "hindi": "हे धनंजय! मुझसे परे श्रेष्ठ कोई अन्य तत्त्व नहीं है। यह सम्पूर्ण ब्रह्मांड मुझमें उसी प्रकार पिरोया हुआ है, जैसे धागे में मणियाँ पिरोई होती हैं।",
    "english": "O conqueror of wealth, there is nothing superior to Me. Everything rests upon Me as pearls are strung upon a thread.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ७, श्लोक ७)"
  },
  {
    "shloka": "यद्यद्विभूतिमत्सत्त्वं श्रीमदूर्जितमेव वा।<br>तत्तदेवावगच्छ त्वं मम तेजोऽंशसम्भवम्॥",
    "hindi": "संसार में जो कुछ भी ऐश्वर्ययुक्त, कान्तियुक्त और शक्ति से परिपूर्ण है, उसे तुम मेरे ही तेज के अंश से उत्पन्न हुआ जानो।",
    "english": "Know that all opulent, radiant, and powerful creations spring from but a spark of My divine splendor.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय १०, श्लोक ४१)"
  },
  {
    "shloka": "यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः।<br>हर्षामर्षभयोद्वेगैर्मुक्तो यः स च मे प्रियः॥",
    "hindi": "जिससे कोई भी प्राणी उद्विग्न नहीं होता और जो स्वयं किसी से उद्विग्न नहीं होता, तथा जो हर्ष, ईर्ष्या, भय और चिंता से मुक्त है—वह भक्त मुझे अत्यंत प्रिय है।",
    "english": "He by whom no one is agitated and who is not disturbed by anyone, who is freed from excessive joy, envy, fear, and anxiety—he is dear to Me.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय १२, श्लोक १५)"
  },
  {
    "shloka": "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते।<br>सङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥",
    "hindi": "विषयों का चिंतन करने से उनमें आसक्ति होती है, आसक्ति से कामना और कामना में बाधा पड़ने से क्रोध उत्पन्न होता है, जो विवेक का नाश करता है।",
    "english": "Dwelling on sense objects causes attachment; attachment breeds desire, and frustrated desire gives rise to anger and delusion.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय २, श्लोक ६२)"
  },
  {
    "shloka": "आपूर्यमाणमचलप्रतिष्ठं समुद्रमापः प्रविशन्ति यद्वत्।<br>तद्वत्कामा यं प्रविशन्ति सर्वे स शान्तिमाप्नोति न कामकामी॥",
    "hindi": "जैसे चारों ओर से जल से परिपूर्ण समुद्र में नदियाँ मिलने पर भी वह शांत रहता है, वैसे ही जिसके मन में समस्त कामनाएं बिना विक्षेप लीन हो जाती हैं, वही परम शांति पाता है।",
    "english": "As the ocean remains calm and unmoved though rivers flow into it from all sides, so one into whom all desires merge without agitation attains lasting peace.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय २, श्लोक ७०)"
  },
  {
    "shloka": "तस्मादसक्तः सततं कार्यं कर्म समाचर।<br>असक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः॥",
    "hindi": "इसलिए निरंतर अनासक्त होकर अपने कर्तव्य कर्मों का सम्यक आचरण करो; क्योंकि अनासक्त भाव से कर्म करता हुआ मनुष्य परम पद को प्राप्त करता है।",
    "english": "Therefore, without being attached to results, constantly perform your duties; for by working without selfish attachment, one attains the Supreme.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ३, श्लोक १९)"
  },
  {
    "shloka": "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।<br>तत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति॥",
    "hindi": "इस संसार में आत्मज्ञान के समान पवित्र करने वाला वास्तव में कुछ भी नहीं है। योग में सिद्ध हुआ मनुष्य समय पाकर उस ज्ञान को स्वतः अपने हृदय में अनुभव करता है।",
    "english": "In this world, there is nothing as purifying as transcendental knowledge. One who attains perfection in yoga finds this wisdom within in due course.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ४, श्लोक ३८)"
  },
  {
    "shloka": "ब्रह्मण्याधाय कर्माणि सङ्गं त्यक्त्वा करोति यः।<br>लिप्यते न स पापेन पद्मपत्रमिवाम्भसा॥",
    "hindi": "जो व्यक्ति समस्त कर्मों को परमात्मा को समर्पित करके, आसक्ति त्यागकर कर्म करता है, वह पाप से वैसे ही अछूता रहता है जैसे कमल का पत्ता जल से नहीं भीगता।",
    "english": "One who performs duties without attachment, offering the results to the Divine, is unaffected by sin as a lotus leaf is untouched by water.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ५, श्लोक १०)"
  },
  {
    "shloka": "यो मां पश्यति सर्वत्र सर्वं च मयि पश्यति।<br>तस्याहं न प्रणश्यामि स च मे न प्रणश्यति॥",
    "hindi": "जो मुझे सर्वत्र देखता है और सब कुछ मुझमें देखता है, उसके लिए मैं कभी अदृश्य नहीं होता और वह मेरे लिए कभी ओझल नहीं होता।",
    "english": "For one who sees Me in all beings and sees all beings in Me, I am never lost to him, nor is he ever lost to Me.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ६, श्लोक ३०)"
  },
  {
    "shloka": "तेषां सततयुक्तानां भजतां प्रीतिपूर्वकम्।<br>ददामि बुद्धियोगं तं येन मामुपयान्ति ते॥",
    "hindi": "जो निरंतर प्रेमपूर्वक मेरा भजन और स्मरण करते हैं, उन्हें मैं वह दिव्य बुद्धियोग प्रदान करता हूँ जिसके द्वारा वे परम पद को प्राप्त होते हैं।",
    "english": "To those who are constantly devoted and adore Me with love, I give that divine intellect by which they attain Me.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय १०, श्लोक १०)"
  },
  {
    "shloka": "मत्कर्मकृन्मत्परमो मद्भक्तः सङ्गवर्जितः।<br>निर्वैरः सर्वभूतेषु यः स मामेति पाण्डव॥",
    "hindi": "हे पाण्डव! जो केवल मेरे निमित्त कर्म करता है, मुझे ही परम लक्ष्य मानता है, मेरा अनन्य भक्त है और समस्त प्राणियों के प्रति वैरभाव से मुक्त है, वह मुझे प्राप्त करता है।",
    "english": "One who performs actions for My sake, regards Me as the supreme goal, is devoted to Me, free from malice toward all beings, comes unto Me.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ११, श्लोक ५५)"
  },
  {
    "shloka": "समं पश्यन्हि सर्वत्र समवस्थितमीश्वरम्।<br>न हिनस्त्यात्मनात्मानं ततो याति परां गतिम्॥",
    "hindi": "जो समस्त चराचर प्राणियों में परमात्मा को समान रूप से विद्यमान देखता है, वह अपने अंतःकरण को कभी कलुषित नहीं करता और परम गति को प्राप्त होता है।",
    "english": "Seeing the Divine equally present everywhere in all living beings, one does not degrade the self by negative thoughts, and thus attains the supreme goal.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय १३, श्लोक २८)"
  },
  {
    "shloka": "ब्रह्मणो हि प्रतिष्ठाहममृतस्याव्ययस्य च।<br>शाश्वतस्य च धर्मस्य सुखस्यैकान्तिकस्य च॥",
    "hindi": "उस अविनाशी ब्रह्म, अमरता, सनातन धर्म और अखंड परम आनंद का चरम आश्रय मैं ही हूँ।",
    "english": "For I am the foundational abode of the immortal and immutable Brahman, the eternal dharma, and everlasting spiritual bliss.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय १४, श्लोक २७)"
  },
  {
    "shloka": "सर्वस्य चाहं हृदि सन्निविष्टो मत्तः स्मृतिर्ज्ञानमपोहनं च।<br>वेदैश्च सर्वैरहमेव वेद्यो वेदान्तकृद्वेदविदेव चाहम्॥",
    "hindi": "मैं समस्त प्राणियों के हृदय में अंतर्यामी रूप से स्थित हूँ। मुझसे ही स्मृति, ज्ञान और विस्मृति होती है। समस्त वेदों द्वारा मैं ही जानने योग्य हूँ।",
    "english": "I am seated in everyone's heart, and from Me arise memory, knowledge, and their loss. By all sacred scriptures, I alone am to be known.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय १५, श्लोक १५)"
  },
  {
    "shloka": "सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत।<br>श्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः॥",
    "hindi": "हे भारत! प्रत्येक मनुष्य की श्रद्धा उसके अंतःकरण के स्वभाव के अनुरूप होती है। मनुष्य श्रद्धामय है; जिसकी जैसी श्रद्धा होती है, वह वैसा ही बन जाता है।",
    "english": "The faith of each person is according to their inner nature, O Bharata. A person is made of faith; whatever one's faith is, that indeed one becomes.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय १७, श्लोक ३)"
  },
  {
    "shloka": "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः।<br>तत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम॥",
    "hindi": "जहाँ योगेश्वर भगवान श्रीकृष्ण हैं और जहाँ गाण्डीवधारी धनुर्धर अर्जुन हैं, वहीं श्री (ऐश्वर्य), विजय, कल्याण और अचल नीति है।",
    "english": "Wherever there is Krishna, the Master of Yoga, and wherever there is Arjuna, the supreme archer, there will surely be fortune, victory, prosperity, and moral righteousness.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय १८, श्लोक ७८)"
  },
  {
    "shloka": "ये यथा मां प्रपद्यन्ते तांस्तथैव भजाम्यहम्।<br>मम वर्त्मानुवर्तन्ते मनुष्याः पार्थ सर्वशः॥",
    "hindi": "हे पार्थ! जो भक्त जिस भाव से मेरी शरण में आते हैं, मैं भी उन्हें उसी प्रकार अनुग्रह प्रदान करता हूँ। सभी मनुष्य सभी प्रकार से मेरे ही मार्ग पर चल रहे हैं।",
    "english": "As all surrender unto Me, I reward them accordingly. Everyone follows My path in all respects, O son of Pritha.",
    "source": "— श्रीमद्भगवद्गीता (अध्याय ४, श्लोक ११)"
  }
];

BAS.initDailyGitaQuote = function () {
  const card = document.querySelector('.quote-card');
  if (!card) return;
  const devaEl  = card.querySelector('.quote-deva');
  const transEl = card.querySelector('.quote-translation');
  const srcEl   = card.querySelector('.quote-source');
  if (!devaEl || !transEl) return;

  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const qIdx = Math.abs((dayOfYear + now.getFullYear()) % BAS.gitaQuotes.length);
  const q = BAS.gitaQuotes[qIdx];
  if (!q) return;

  devaEl.innerHTML = q.shloka;
  transEl.innerHTML = `"${q.hindi}"<br><span style="display:block;margin-top:10px;font-size:0.92em;opacity:0.85;font-style:italic;">"${q.english}"</span>`;
  if (srcEl) srcEl.textContent = q.source;
};

// ── DAILY RASHIFAL (DYNAMIC VEDIC HOROSCOPE) ─────────────
BAS.rashisCatalog = [
  {
    "name": "मेष राशि (Aries)",
    "icon": "♈",
    "lord": "मंगल",
    "element": "अग्नि",
    "predictions": [
      "आज सूर्य-मंगल के शुभ प्रभाव से आत्मविश्वास में वृद्धि होगी। कार्यक्षेत्र में नए उत्तरदायित्व मिल सकते हैं। प्रशासनिक कार्यों में सफलता के उत्तम योग हैं।",
      "आज मन शांत व एकाग्र रहेगा। परिवार में सामंजस्य बढ़ेगा और किसी बड़े निर्णय में वरिष्ठों का सहयोग मिलेगा। आर्थिक स्थिति सुदृढ़ होगी।",
      "आपकी राशि के स्वामी मंगल का दिन होने से पराक्रम व ऊर्जा चरम पर रहेगी। भूमि-भवन या नई परियोजना के कार्यों में अप्रत्याशित सफलता मिलेगी।",
      "संवाद व बुद्धिमानी के बल पर व्यापारिक समझौते सफल होंगे। मित्रों के साथ मिलकर बनाई गई योजनाएं लाभकारी सिद्ध होंगी। वाणी में संयम रखें।",
      "गुरु की शुभ दृष्टि से ज्ञान, धर्म व आध्यात्मिक कार्यों में रुचि बढ़ेगी। समाज में मान-सम्मान बढ़ेगा। उच्च शिक्षा व प्रतियोगी परीक्षाओं में प्रगति होगी।",
      "भौतिक सुख-सुविधाओं और रचनात्मक कार्यों में वृद्धि होगी। दांपत्य जीवन में मधुरता आएगी और किसी सुखद यात्रा की योजना बन सकती है।",
      "कार्यक्षेत्र में धैर्य और अनुशासन से बड़ी सफलता हासिल होगी। पुराने रुके हुए कार्यों को गति मिलेगी। स्वास्थ्य का विशेष ध्यान रखें।"
    ],
    "colors": [
      "लाल",
      "सिंदूरी",
      "नारंगी",
      "पीला",
      "स्वर्णिम",
      "केसरिया",
      "गहरा लाल"
    ],
    "numbers": [
      "9",
      "1",
      "3",
      "5",
      "7",
      "6",
      "8"
    ],
    "upays": [
      "प्रातः तांबे के लोटे में रोली-अक्षत मिलाकर भगवान सूर्य को अर्घ्य दें।",
      "शिवलिंग पर कच्चा दूध व जल अर्पित कर 'ॐ नमः शिवाय' का 11 बार जप करें।",
      "हनुमान जी को सिंदूर-चमेली का तेल अर्पित करें व हनुमान चालीसा पढ़ें।",
      "श्री गणेश जी को 21 दूर्वा दल अर्पित करें और 'ॐ गं गणपतये नमः' जपें।",
      "केले के वृक्ष में जल दें और भगवान श्री हरि विष्णु का स्मरण करें।",
      "कन्याओं को फल या मिष्ठान भेंट करें और महालक्ष्मी जी की वंदना करें।",
      "पीपल के नीचे सरसों तेल का दीपक जलाएं और सुंदरकांड का पाठ करें।"
    ]
  },
  {
    "name": "वृषभ राशि (Taurus)",
    "icon": "♉",
    "lord": "शुक्र",
    "element": "पृथ्वी",
    "predictions": [
      "आर्थिक स्थिति में सुधार के प्रबल संकेत हैं। रचनात्मक कार्यों में मन लगेगा। वरिष्ठजनों की सलाह से महत्वपूर्ण निर्णय लेना हितकर रहेगा।",
      "आज मन में सकारात्मक विचार रहेंगे। पारिवारिक जीवन सुखद रहेगा और माता के आशीर्वाद से मनोकामनाएं पूर्ण होंगी।",
      "कार्यक्षेत्र में आपकी कर्मठता की सराहना होगी। विरोधियों पर विजय प्राप्त होगी। फिजूलखर्ची पर नियंत्रण रखना आवश्यक है।",
      "व्यापार में नए अवसर प्राप्त होंगे। धन संचय के प्रयासों में सफलता मिलेगी। बुद्धि और विवेक से जटिल समस्याओं का समाधान होगा।",
      "भाग्य का पूरा सहयोग मिलेगा। घर में किसी मांगलिक कार्य की रूपरेखा बनेगी। गुरुजनों और मार्गदर्शकों का सानिध्य प्राप्त होगा।",
      "आपकी राशि के स्वामी शुक्र का प्रभाव सौंदर्य, ऐश्वर्य और दांपत्य सुख में वृद्धि करेगा। आर्थिक लाभ के नए मार्ग प्रशस्त होंगे।",
      "करियर में स्थिरता और प्रगति का दिन है। पूर्व में किए गए कठिन परिश्रम का उचित प्रतिफल प्राप्त होगा। स्वास्थ्य उत्तम रहेगा।"
    ],
    "colors": [
      "सफेद",
      "गुलाबी",
      "चमकीला सफेद",
      "आसमानी",
      "चांदी जैसा",
      "क्रीम",
      "हल्का हरा"
    ],
    "numbers": [
      "6",
      "2",
      "5",
      "8",
      "3",
      "7",
      "1"
    ],
    "upays": [
      "भगवान सूर्य को जल में थोड़ा लाल पुष्प डालकर अर्घ्य दें।",
      "शिवलिंग पर पंचामृत या कच्चा दूध अर्पित कर शिव तांडव स्तोत्र का श्रवण करें।",
      "हनुमान मंदिर में चमेली के तेल का दीपक प्रज्वलित करें।",
      "गौमाता को हरा चारा या हरी पालक खिलाएं।",
      "भगवान विष्णु को पीले पुष्प अर्पित कर 'ॐ नमो नारायणाय' जपें।",
      "माता लक्ष्मी को खीर का भोग लगाएं और 'ॐ श्रीं महालक्ष्म्यै नमः' का जप करें।",
      "शनि देव को काले तिल व सरसों का तेल अर्पित करें।"
    ]
  },
  {
    "name": "मिथुन राशि (Gemini)",
    "icon": "♊",
    "lord": "बुध",
    "element": "वायु",
    "predictions": [
      "आत्मविश्वास और निर्णय क्षमता में वृद्धि होगी। उच्च अधिकारियों से मधुर संबंध बनेंगे। नई योजनाएं शुरू करने के लिए दिन अनुकूल है।",
      "मानसिक चंचलता पर नियंत्रण रखें। ध्यान और साधना से शांति प्राप्त होगी। कला व साहित्य के क्षेत्र में विशेष उपलब्धि मिल सकती है।",
      "ऊर्जा और उत्साह बना रहेगा, परंतु जल्दबाजी में कोई वित्तीय निर्णय न लें। पारिवारिक सहयोग से कठिन कार्य भी सरल होंगे।",
      "आपकी राशि के स्वामी बुध का दिन है; संवाद कौशल व बुद्धिमत्ता से सभी को प्रभावित करेंगे। व्यापारिक सौदों में अप्रत्याशित लाभ होगा।",
      "ज्ञानार्जन और बौद्धिक कार्यों में मन लगेगा। धार्मिक यात्रा के योग बन सकते हैं। विद्यार्थियों को प्रतियोगिता में सफलता मिलेगी।",
      "मित्रों और परिजनों के साथ समय आनंदपूर्वक बीतेगा। भौतिक सुख-साधनों की प्राप्ति होगी। प्रेम संबंधों में प्रगाढ़ता आएगी।",
      "कार्यक्षेत्र में जिम्मेदारियां बढ़ सकती हैं, परंतु आपकी कार्यकुशलता से सभी काम समय पर पूरे होंगे। स्वास्थ्य के प्रति सचेत रहें।"
    ],
    "colors": [
      "हरा",
      "तोतिया हरा",
      "पन्ना हरा",
      "पीला",
      "सफेद",
      "आसमानी",
      "धूमिल हरा"
    ],
    "numbers": [
      "5",
      "3",
      "1",
      "6",
      "7",
      "8",
      "4"
    ],
    "upays": [
      "प्रातः सूर्योदय के समय गायत्री मंत्र का 24 बार शांत मन से जप करें।",
      "शिवलिंग पर जल व अक्षत अर्पित कर 'ॐ सोमेश्वराय नमः' जपें।",
      "हनुमान जी को बूंदी का प्रसाद लगाएं और संकटमोचन का पाठ करें।",
      "भगवान गणेश जी को 21 दूर्वा अर्पित करें और 'ॐ गं गणपतये नमः' जपें।",
      "विष्णु सहस्रनाम का पाठ करें अथवा श्रवण करें।",
      "छोटी कन्याओं को मिष्ठान देकर उनका आशीर्वाद लें।",
      "पक्षियों को बाजरा या अनाज के दाने डालें।"
    ]
  },
  {
    "name": "कर्क राशि (Cancer)",
    "icon": "♋",
    "lord": "चंद्रमा",
    "element": "जल",
    "predictions": [
      "मान-सम्मान और सामाजिक प्रतिष्ठा में वृद्धि होगी। पिता अथवा उच्चाधिकारियों का स्नेह मिलेगा। मन में आध्यात्मिक भाव जागृत होंगे।",
      "आपकी राशि के स्वामी चंद्रमा का दिन है; मानसिक शांति, अंतःप्रेरणा और रचनात्मक ऊर्जा चरम पर रहेगी। सभी कार्य सहजता से संपन्न होंगे।",
      "पराक्रम और साहस से अटके हुए कार्य पूर्ण होंगे। कोर्ट-कचहरी अथवा विवादित मामलों में आपके पक्ष में प्रगति होगी।",
      "आर्थिक प्रबंधन मजबूत होगा। घर-परिवार में मांगलिक चर्चाएं होंगी। वाणी के प्रभाव से बिगड़े काम भी बन जाएंगे।",
      "गुरु-चंद्र का शुभ प्रभाव जीवन में सुख-समृद्धि लाएगा। धार्मिक कार्यों और परोपकार में मन लगेगा। संतान पक्ष से शुभ समाचार मिलेगा।",
      "भौतिक सुखों में वृद्धि होगी। जीवनसाथी का पूर्ण सहयोग प्राप्त होगा। घर के सौंदर्य और साज-सज्जा में रुचि बढ़ेगी।",
      "कार्यक्षेत्र में धैर्य और संयम बनाए रखें। वरिष्ठों का सहयोग मिलेगा। संध्या के समय परिवार के साथ समय बिताना शुभ रहेगा।"
    ],
    "colors": [
      "सफेद",
      "चांदी",
      "दूधिया",
      "हल्का नीला",
      "क्रीम",
      "हल्का पीला",
      "मोती जैसा सफेद"
    ],
    "numbers": [
      "2",
      "7",
      "9",
      "4",
      "1",
      "3",
      "6"
    ],
    "upays": [
      "सूर्य नमस्कार करें और आदित्य हृदय स्तोत्र का पाठ करें।",
      "शिवलिंग पर कच्चा दूध व जल अर्पित करें और 'ॐ नमः शिवाय' का 108 बार जप करें।",
      "हनुमान जी के मंदिर में जाकर सिंदूर का तिलक लगाएं।",
      "हरी मूंग की दाल का दान करें अथवा गाय को खिलाएं।",
      "केले के वृक्ष की जड़ में जल और चने की दाल अर्पित करें।",
      "माता लक्ष्मी को श्वेत पुष्प अर्पित करें और श्री सूक्त का पाठ करें।",
      "शिवलिंग पर काले तिल मिलाकर जल चढ़ाएं।"
    ]
  },
  {
    "name": "सिंह राशि (Leo)",
    "icon": "♌",
    "lord": "सूर्य",
    "element": "अग्नि",
    "predictions": [
      "आपकी राशि के स्वामी सूर्यदेव का दिन है; यश, पराक्रम और नेतृत्व क्षमता चरम पर रहेगी। राजकीय कार्यों में अभूतपूर्व सफलता प्राप्त होगी।",
      "मन प्रसन्न रहेगा। परिवार में सुख-शांति का वातावरण रहेगा। महत्वपूर्ण लोगों से मुलाकात भविष्य में लाभकारी सिद्ध होगी।",
      "आपके साहस और आत्मविश्वास के आगे विरोधी परास्त होंगे। अचल संपत्ति से जुड़े सौदों में लाभ की संभावना है।",
      "वित्तीय मामलों में सूझबूझ से लिए गए निर्णय सार्थक सिद्ध होंगे। व्यापार में विस्तार की योजनाएं बनेंगी। संवाद में स्पष्टता रखें।",
      "गुरु की शुभ दृष्टि से बुद्धि और ज्ञान में वृद्धि होगी। किसी धार्मिक अनुष्ठान में भाग लेने का अवसर मिलेगा। भाग्य प्रबल रहेगा।",
      "दांपत्य जीवन में सुख और सामंजस्य रहेगा। नई खरीदारी के योग हैं। सामाजिक समारोहों में आपका आकर्षण और प्रभाव बढ़ेगा।",
      "कार्यक्षेत्र में अत्यधिक व्यस्तता रहेगी। अपने कर्मचारियों और सहयोगियों से सौहार्दपूर्ण व्यवहार रखें। स्वास्थ्य का ध्यान रखें।"
    ],
    "colors": [
      "सुनहरा",
      "नारंगी",
      "केसरिया",
      "लाल",
      "गुलाबी",
      "पीला",
      "सिंदूरी"
    ],
    "numbers": [
      "1",
      "5",
      "9",
      "3",
      "2",
      "7",
      "4"
    ],
    "upays": [
      "प्रातः तांबे के लोटे में रोली-अक्षत मिलाकर सूर्यदेव को अर्घ्य दें और सूर्य गायत्री का जप करें।",
      "शिवलिंग पर जल अर्पित कर ॐ महादेवाय नमः का स्मरण करें।",
      "हनुमान जी को लाल पुष्प व गुड़-चने का भोग लगाएं।",
      "श्री गणेश जी को मोदक या दूर्वा अर्पित करें।",
      "भगवान नारायण को पीला चंदन लगाएं और ॐ नमो भगवते वासुदेवाय जपें।",
      "किसी जरूरतमंद को वस्त्र या भोजन दान करें।",
      "पीपल वृक्ष के पास दीपक जलाकर परिक्रमा करें।"
    ]
  },
  {
    "name": "कन्या राशि (Virgo)",
    "icon": "♍",
    "lord": "बुध",
    "element": "पृथ्वी",
    "predictions": [
      "कार्यक्षेत्र में आपकी रणनीतिक सोच की सराहना होगी। वरिष्ठजनों का मार्गदर्शन मिलेगा। स्वास्थ्य में ताजगी और नई ऊर्जा महसूस होगी।",
      "मानसिक संतुलन बना रहेगा। भावनात्मक रूप से आप मजबूत महसूस करेंगे। मित्रों और स्वजनों के साथ मधुर संबंध बने रहेंगे।",
      "प्रतिस्पर्धी माहौल में आप आगे निकलेंगे। पराक्रम से कठिन चुनौतियों को पार करेंगे। क्रोध और उत्तेजना पर नियंत्रण रखें।",
      "आपकी राशि के स्वामी बुध का दिन है; बुद्धि, विश्लेषण और लेखा-जोखा के कार्यों में उत्कृष्ट सफलता मिलेगी। आर्थिक लाभ होगा।",
      "धर्म-कर्म और परोपकार में मन लगेगा। उच्च अधिकारियों और गुरुओं का आशीर्वाद मिलेगा। विद्यार्थियों के लिए अति उत्तम समय है।",
      "सुख-सुविधाओं की प्राप्ति होगी। व्यापारिक अनुबंधों में लाभ होगा। घर में किसी उत्सव या शुभ कार्य की योजना बन सकती है।",
      "कार्यस्थल पर अनुशासन और निष्ठा से कार्य करें। पुराने रुके हुए कार्यों के संपन्न होने से मन में संतोष रहेगा।"
    ],
    "colors": [
      "गहरा हरा",
      "तोतिया",
      "नीला",
      "पीला",
      "सफेद",
      "धूमिल हरा",
      "हल्का बादामी"
    ],
    "numbers": [
      "5",
      "6",
      "2",
      "7",
      "3",
      "8",
      "1"
    ],
    "upays": [
      "सूर्यदेव को अर्घ्य देकर गायत्री मंत्र का पाठ करें।",
      "शिवलिंग पर श्वेत चंदन व गंगाजल अर्पित करें।",
      "हनुमान चालीसा का पाठ करें और बंदरों को चने खिलाएं।",
      "गौमाता को हरा चारा खिलाएं और बुध मंत्र 'ॐ बुं बुधाय नमः' का जप करें।",
      "विष्णु सहस्रनाम सुनें और पीले वस्त्र का दान करें।",
      "कन्याओं को खीर या मिष्ठान खिलाकर उनका आशीष लें।",
      "पक्षियों को सप्तधान्य (सात प्रकार के अनाज) डालें।"
    ]
  },
  {
    "name": "तुला राशि (Libra)",
    "icon": "♎",
    "lord": "शुक्र",
    "element": "वायु",
    "predictions": [
      "समाज में आपकी मान-प्रतिष्ठा में वृद्धि होगी। कला, संस्कृति और सामाजिक गतिविधियों में सक्रिय रहेंगे। मन प्रसन्न रहेगा।",
      "पारिवारिक जीवन में सुख-शांति बनी रहेगी। दांपत्य संबंधों में मधुरता और एक-दूसरे के प्रति विश्वास बढ़ेगा।",
      "पराक्रम और साहस से व्यापारिक बाधाएं दूर होंगी। नई योजनाओं में उत्साहपूर्वक निवेश के योग हैं। वाणी में संतुलन रखें।",
      "बौद्धिक क्षमता और तार्किक शक्ति से व्यापार में लाभ होगा। मित्रों के सहयोग से नए संपर्क बनेंगे जो भविष्य में लाभकारी होंगे।",
      "गुरु का आशीर्वाद जीवन में स्थिरता और शुभता लाएगा। धार्मिक कार्यों में भागीदारी बढ़ेगी और आर्थिक स्थिति मजबूत होगी।",
      "आपकी राशि के स्वामी शुक्र का दिन होने से आकर्षण, ऐश्वर्य और रचनात्मकता में अपार वृद्धि होगी। दांपत्य जीवन में आनंद रहेगा।",
      "शनि देव के प्रभाव से करियर में नए अवसर मिलेंगे। कड़ी मेहनत का भरपूर फल मिलेगा। संपत्ति से जुड़े मामलों में प्रगति होगी।"
    ],
    "colors": [
      "चमकीला सफेद",
      "आसमानी",
      "गुलाबी",
      "रजत",
      "नीला",
      "हल्का पीला",
      "फिरोजी"
    ],
    "numbers": [
      "6",
      "7",
      "2",
      "9",
      "4",
      "5",
      "8"
    ],
    "upays": [
      "सूर्यदेव को जल अर्पित करें और पिता का आशीर्वाद लें।",
      "शिवलिंग पर जल व दूध चढ़ाकर 'ॐ नमः शिवाय' जपें।",
      "हनुमान जी को सिंदूर लगाएं और सुंदरकांड का पाठ करें।",
      "भगवान गणेश को दूर्वा चढ़ाएं और मोदक का भोग लगाएं।",
      "श्री हरि विष्णु को पीले फूल अर्पित कर ॐ नमो नारायणाय जपें।",
      "महालक्ष्मी जी के समक्ष घी का दीपक जलाएं और कनकधारा स्तोत्र पढ़ें।",
      "काले उड़द या सरसों का तेल शनि मंदिर में दान करें।"
    ]
  },
  {
    "name": "वृश्चिक राशि (Scorpio)",
    "icon": "♏",
    "lord": "मंगल",
    "element": "जल",
    "predictions": [
      "सरकारी व प्रशासनिक कार्यों में सफलता मिलेगी। आत्मविश्वास से भरे रहेंगे। किसी प्रभावशाली व्यक्ति से भेंट लाभकारी सिद्ध होगी।",
      "अंतर्मन में शांति और सकारात्मकता बनी रहेगी। आध्यात्मिक ज्ञान की ओर झुकाव होगा। परिवार का पूर्ण सहयोग प्राप्त होगा।",
      "आपकी राशि के स्वामी मंगल का दिन है; असीम ऊर्जा और पराक्रम से विरोधियों को शांत करेंगे। अटके हुए वित्तीय काम पूरे होंगे।",
      "कार्यक्षेत्र में योजनाओं को क्रियान्वित करने का उपयुक्त समय है। संवाद में विनम्रता बनाए रखें, व्यापार में बड़ा लाभ हो सकता है।",
      "गुरु की शुभ दृष्टि से ज्ञान, विवेक और धर्म में वृद्धि होगी। परिवार में किसी मांगलिक आयोजन की चर्चा हो सकती है।",
      "सुख-साधनों की प्राप्ति होगी। दांपत्य जीवन में सुखद पल व्यतीत होंगे। कला व संगीत में रुचि बढ़ेगी।",
      "कार्यक्षेत्र में धैर्य से आगे बढ़ें। अचानक धन लाभ के योग बन सकते हैं। स्वास्थ्य को लेकर नियमित दिनचर्या का पालन करें।"
    ],
    "colors": [
      "महरून",
      "गहरा लाल",
      "केसरिया",
      "पीला",
      "नारंगी",
      "सिंदूरी",
      "स्वर्णिम"
    ],
    "numbers": [
      "9",
      "1",
      "4",
      "3",
      "7",
      "8",
      "2"
    ],
    "upays": [
      "प्रातः सूर्य नमस्कार करें और आदित्य हृदय स्तोत्र का पाठ करें।",
      "शिवलिंग पर जलाभिषेक कर महामृत्युंजय मंत्र का 11 बार जप करें।",
      "हनुमान जी को चमेली का तेल व सिंदूर चढ़ाएं, हनुमान चालीसा पढ़ें।",
      "श्री गणेश जी को दूर्वा अर्पित कर मोदक का भोग लगाएं।",
      "केले के पेड़ में जल दें और ॐ नमो भगवते वासुदेवाय जपें।",
      "माता दुर्गा की पूजा करें और दुर्गा सप्तशती का पाठ करें।",
      "पीपल के वृक्ष के नीचे सरसों तेल का चौमुखी दीपक प्रज्वलित करें।"
    ]
  },
  {
    "name": "धनु राशि (Sagittarius)",
    "icon": "♐",
    "lord": "गुरु (बृहस्पति)",
    "element": "अग्नि",
    "predictions": [
      "समाज में सम्मान और प्रतिष्ठा बढ़ेगी। वरिष्ठजनों व गुरुजनों का सानिध्य प्राप्त होगा। महत्वपूर्ण योजनाओं में सफलता मिलेगी।",
      "मानसिक शांति का अनुभव होगा। परिवार में खुशियों का माहौल रहेगा। विद्यार्थियों के लिए अध्ययन हेतु समय अत्यंत अनुकूल है।",
      "ऊर्जा और उत्साह के साथ नए कार्यों की शुरुआत होगी। भूमि और वाहन से जुड़े मामलों में प्रगति होगी। निर्णय क्षमता मजबूत होगी।",
      "व्यापार में नए अनुबंधों से लाभ होगा। आर्थिक नियोजन सफल रहेगा। मित्रों के साथ मधुरता और सहयोग बढ़ेगा।",
      "आपकी राशि के स्वामी देवगुरु बृहस्पति का दिन है; अध्यात्म, ज्ञान और भाग्य में अभूतपूर्व वृद्धि होगी। रुके हुए कार्य सरलता से पूरे होंगे।",
      "दांपत्य सुख में वृद्धि होगी। भौतिक सुख-साधनों की प्राप्ति होगी। किसी मांगलिक उत्सव में जाने का अवसर मिलेगा।",
      "कार्यक्षेत्र में परिश्रम का पूर्ण फल मिलेगा। स्थिर संपत्ति में निवेश लाभकारी सिद्ध हो सकता है। स्वास्थ्य उत्तम रहेगा।"
    ],
    "colors": [
      "पीला",
      "केसरिया",
      "स्वर्णिम",
      "हल्का नारंगी",
      "गुलाबी",
      "सफेद",
      "हल्का हरा"
    ],
    "numbers": [
      "3",
      "9",
      "1",
      "7",
      "5",
      "2",
      "8"
    ],
    "upays": [
      "भगवान सूर्य को तांबे के पात्र से जल अर्पित करें।",
      "शिवलिंग पर कच्चा दूध व बेलपत्र अर्पित कर ॐ नमः शिवाय जपें।",
      "हनुमान जी के मंदिर में लाल ध्वज या सिंदूर अर्पित करें।",
      "भगवान गणेश को दूर्वा चढ़ाकर गणेश अष्टक का पाठ करें।",
      "भगवान श्री हरि विष्णु को हल्दी व पीले पुष्प अर्पित करें, विष्णु सहस्रनाम सुनें।",
      "माता लक्ष्मी को खीर का भोग लगाएं और श्री सूक्त का पाठ करें।",
      "शनि देव के नाम पर काले तिल और तेल का दान करें।"
    ]
  },
  {
    "name": "मकर राशि (Capricorn)",
    "icon": "♑",
    "lord": "शनि",
    "element": "पृथ्वी",
    "predictions": [
      "करियर में नई जिम्मेदारियां मिल सकती हैं। कार्यशैली की प्रशंसा होगी। आत्मविश्वास से लिए गए फैसले लाभप्रद रहेंगे।",
      "मन शांत रहेगा और घर-परिवार में सहयोग मिलेगा। माता के स्वास्थ्य में सुधार होगा। आध्यात्मिक शांति की अनुभूति होगी।",
      "साहस और पराक्रम से कठिन लक्ष्यों को प्राप्त करेंगे। तकनीकी और निर्माण कार्यों से जुड़े जातकों को विशेष लाभ होगा।",
      "आर्थिक मामलों में योजनाबद्ध प्रयास सफल होंगे। व्यापार में नई दिशा मिलेगी। मित्रों का सहयोग प्राप्त होगा।",
      "भाग्य का साथ मिलेगा। वरिष्ठों और गुरुजनों का मार्गदर्शन जीवन में नई रोशनी लाएगा। ज्ञानार्जन में प्रगति होगी।",
      "जीवनसाथी के साथ सुखद समय बीतेगा। सुख-सुविधाओं में वृद्धि होगी। रचनात्मक कार्यों में मन लगेगा।",
      "आपकी राशि के स्वामी शनि देव का दिन है; कठिन परिश्रम और निष्ठा से सभी कार्यों में विजय प्राप्त होगी। कर्मक्षेत्र में स्थायित्व आएगा।"
    ],
    "colors": [
      "नीला",
      "स्लेटी",
      "गहरा नीला",
      "बैंगनी",
      "सफेद",
      "काला / श्याम",
      "आसमानी"
    ],
    "numbers": [
      "8",
      "6",
      "5",
      "4",
      "7",
      "3",
      "1"
    ],
    "upays": [
      "सूर्यदेव को जल में लाल पुष्प डालकर अर्घ्य दें।",
      "शिवलिंग पर पंचामृत चढ़ाकर शिव पंचाक्षर मंत्र का जप करें।",
      "हनुमान जी को बूंदी का प्रसाद लगाएं और सुंदरकांड का पाठ करें।",
      "गौमाता को हरा चारा या पालक खिलाएं।",
      "केले के वृक्ष के पास घी का दीपक जलाएं और ॐ नमो नारायणाय जपें।",
      "कन्याओं को फल या मिष्ठान देकर उनका आशीष प्राप्त करें।",
      "पीपल के वृक्ष के नीचे सरसों तेल का दीपक जलाएं और शनि चालीसा पढ़ें।"
    ]
  },
  {
    "name": "कुंभ राशि (Aquarius)",
    "icon": "♒",
    "lord": "शनि",
    "element": "वायु",
    "predictions": [
      "मान-सम्मान और प्रतिष्ठा में वृद्धि होगी। सामाजिक कार्यों में आपकी भूमिका सराही जाएगी। नेतृत्व क्षमता में निखार आएगा।",
      "मानसिक शांति का अनुभव होगा। नवीन विचारों से कार्यों में सफलता मिलेगी। परिवार में सौहार्दपूर्ण वातावरण बना रहेगा।",
      "ऊर्जा और पराक्रम से अटके हुए कार्य गति पकड़ेंगे। प्रतिस्पर्धियों पर विजय प्राप्त होगी। वित्तीय संतुलन बनाए रखें।",
      "बुद्धि और तर्क से व्यापार में लाभ होगा। नए संपर्क और संचार माध्यमों से लाभ की संभावनाएं बनेंगी।",
      "आध्यात्मिक चिंतन और ज्ञान में वृद्धि होगी। गुरुजनों का आशीर्वाद मिलेगा। किसी पवित्र तीर्थ या स्थान की चर्चा हो सकती है।",
      "दांपत्य जीवन में प्रेम और सामंजस्य बढ़ेगा। कलात्मक कार्यों में रुचि होगी। सुख-साधनों की खरीदारी हो सकती है।",
      "आपकी राशि के स्वामी शनि देव का दिन है; दीर्घकालिक योजनाओं को क्रियान्वित करने का उत्तम समय है। कर्मठता से अप्रत्याशित सफलता मिलेगी।"
    ],
    "colors": [
      "बैंगनी",
      "गहरा नीला",
      "आसमानी",
      "नीला",
      "श्वेत",
      "फिरोजी",
      "स्लेटी"
    ],
    "numbers": [
      "8",
      "7",
      "3",
      "5",
      "4",
      "9",
      "2"
    ],
    "upays": [
      "प्रातः सूर्योदय के समय गायत्री मंत्र का श्रद्धापूर्वक जप करें।",
      "शिवलिंग पर गंगाजल व कच्चा दूध अर्पित कर ॐ नमः शिवाय जपें।",
      "हनुमान जी के चरणों में सिंदूर अर्पित करें व संकटमोचन का पाठ करें।",
      "श्री गणेश जी को 21 दूर्वा दल अर्पित कर मोदक का भोग लगाएं।",
      "भगवान विष्णु को पीले फूल चढ़ाएं और ॐ नमो भगवते वासुदेवाय जपें।",
      "माता लक्ष्मी को श्वेत मिष्ठान का भोग लगाएं और महालक्ष्मी स्तुति करें।",
      "काले तिल व उड़द की दाल का दान करें अथवा किसी जरूरतमंद की सहायता करें।"
    ]
  },
  {
    "name": "मीन राशि (Pisces)",
    "icon": "♓",
    "lord": "गुरु (बृहस्पति)",
    "element": "जल",
    "predictions": [
      "यश, सम्मान और आत्मविश्वास में वृद्धि होगी। पिता और वरिष्ठों का स्नेह मिलेगा। मन में सात्विक और उदार भाव रहेंगे।",
      "मानसिक शांति और कल्पनाशीलता बढ़ेगी। माता का पूर्ण आशीर्वाद मिलेगा। रचनात्मक और कलात्मक कार्यों में सफलता मिलेगी।",
      "पराक्रम और साहस से रुके हुए कार्य पूर्ण होंगे। विरोधी शांत रहेंगे। संपत्ति और निवेश के मामलों में शुभ परिणाम मिलेंगे।",
      "व्यापार में नए अवसर मिलेंगे। आर्थिक प्रबंधन सुदृढ़ होगा। वाणी में मधुरता से सभी बिगड़े काम बन जाएंगे।",
      "आपकी राशि के स्वामी देवगुरु बृहस्पति का दिन है; ज्ञान, धर्म और विवेक में असीम वृद्धि होगी। गुरु और ईश्वर की विशेष कृपा प्राप्त होगी।",
      "भौतिक सुख-सुविधाओं और दांपत्य जीवन में सुखद अनुभव होंगे। प्रेम संबंधों में प्रगाढ़ता आएगी। किसी शुभ उत्सव में भाग लेंगे।",
      "कार्यक्षेत्र में धैर्य और अनुशासन से बड़ी सफलता मिलेगी। पूर्व में किए गए सत्कर्मों का उत्तम प्रतिफल प्राप्त होगा।"
    ],
    "colors": [
      "पीला",
      "सुनहरा",
      "केसरिया",
      "सफेद",
      "हल्का नारंगी",
      "चांदी जैसा",
      "हल्का गुलाबी"
    ],
    "numbers": [
      "3",
      "2",
      "7",
      "9",
      "1",
      "6",
      "5"
    ],
    "upays": [
      "भगवान सूर्य को तांबे के लोटे से जल अर्पित करें और सूर्य स्तोत्र पढ़ें।",
      "शिवलिंग पर जल व दूध अर्पित कर ॐ सोमेश्वराय नमः का जप करें।",
      "हनुमान चालीसा का पाठ करें और बंदरों को फल अथवा चना खिलाएं।",
      "भगवान गणेश जी को दूर्वा चढ़ाकर ॐ गं गणपतये नमः का 21 बार जप करें।",
      "भगवान श्री हरि विष्णु को तुलसी दल व पीले पुष्प अर्पित करें, विष्णु सहस्रनाम सुनें।",
      "माता लक्ष्मी को श्वेत पुष्प अर्पित कर कनकधारा स्तोत्र का पाठ करें।",
      "पीपल के वृक्ष के नीचे सरसों तेल का दीपक जलाकर सात परिक्रमा करें।"
    ]
  }
];

BAS.initDailyRashifal = function () {
  const rashiTrack = document.getElementById('rashi-selector-track');
  const heroIcon   = document.getElementById('rashifal-hero-icon');
  const heroTitle  = document.getElementById('rashifal-hero-title');
  const heroMeta   = document.getElementById('rashifal-hero-meta');
  const heroDate   = document.getElementById('rashifal-hero-date');
  const heroPred   = document.getElementById('rashifal-hero-prediction');
  const heroColor  = document.getElementById('rashifal-hero-color');
  const heroNum    = document.getElementById('rashifal-hero-number');
  const heroUpay   = document.getElementById('rashifal-hero-upay');
  const shareBtn   = document.getElementById('btn-share-rashi-wa');
  const saveBtn    = document.getElementById('btn-save-my-rashi');
  const saveLabel  = document.getElementById('save-rashi-btn-label');

  if (!rashiTrack || !heroTitle) return;

  const now = new Date();
  const todayStr = now.toLocaleDateString('hi-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  if (heroDate) heroDate.textContent = `📅 आज: ${todayStr}`;

  const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const weekShift = Math.floor(dayOfYear / 7);

  // Compute today's active data for all 12 rashis
  const rashisData = BAS.rashisCatalog.map((r, idx) => {
    const predIdx = (dayOfWeek + weekShift) % r.predictions.length;
    const colorIdx = (dayOfWeek + idx + weekShift) % r.colors.length;
    const numIdx = (dayOfWeek + idx * 2 + weekShift) % r.numbers.length;
    const upayIdx = (dayOfWeek + idx) % r.upays.length;

    return {
      name: r.name,
      icon: r.icon,
      lord: r.lord,
      element: r.element,
      prediction: r.predictions[predIdx],
      color: r.colors[colorIdx],
      number: r.numbers[numIdx],
      upay: r.upays[upayIdx]
    };
  });

  let currentRashiIdx = parseInt(localStorage.getItem('bas_my_rashi') || '0', 10);
  if (isNaN(currentRashiIdx) || currentRashiIdx < 0 || currentRashiIdx > 11) currentRashiIdx = 0;

  function renderRashi(idx, shouldScrollTrack = false) {
    const data = rashisData[idx];
    if (!data) return;

    currentRashiIdx = idx;

    const buttons = rashiTrack.querySelectorAll('.rashi-btn');
    buttons.forEach((b, i) => {
      if (i === idx) {
        b.classList.add('active');
        if (shouldScrollTrack) {
          const wrap = rashiTrack.closest('.rashi-selector-wrap') || rashiTrack.parentElement;
          if (wrap && wrap.scrollWidth > wrap.clientWidth) {
            const btnLeft = b.offsetLeft;
            const btnWidth = b.offsetWidth;
            const wrapWidth = wrap.clientWidth;
            wrap.scrollTo({
              left: btnLeft - (wrapWidth / 2) + (btnWidth / 2),
              behavior: 'smooth'
            });
          }
        }
      } else {
        b.classList.remove('active');
      }
    });

    if (heroIcon)  heroIcon.textContent  = data.icon;
    if (heroTitle) heroTitle.textContent = data.name;
    if (heroMeta)  heroMeta.textContent  = `स्वामी ग्रह: ${data.lord} · तत्व: ${data.element}`;
    if (heroPred)  heroPred.textContent  = data.prediction;
    if (heroColor) heroColor.textContent = data.color;
    if (heroNum)   heroNum.textContent   = data.number;
    if (heroUpay)  heroUpay.textContent  = data.upay;

    const savedRashi = localStorage.getItem('bas_my_rashi');
    if (savedRashi !== null && parseInt(savedRashi, 10) === idx) {
      if (saveLabel) saveLabel.textContent = 'मेरी पसंदीदा राशि ✓';
      if (saveBtn) {
        saveBtn.style.background = 'linear-gradient(135deg, #f59e0b, #ea580c)';
        saveBtn.style.color = '#ffffff';
      }
    } else {
      if (saveLabel) saveLabel.textContent = 'मेरी राशि सेट करें';
      if (saveBtn) {
        saveBtn.style.background = 'rgba(245, 158, 11, 0.15)';
        saveBtn.style.color = '#fbbf24';
      }
    }

    if (shareBtn) {
      const shareText = `✨ *दैनिक राशिफल — ${data.name}* ✨\n📅 *दिनांक:* ${todayStr}\n\n🔮 *आज का फलकथन:*\n${data.prediction}\n\n🎨 *शुभ रंग:* ${data.color}\n🔢 *शुभ अंक:* ${data.number}\n🪔 *दैनिक उपाय:* ${data.upay}\n\n🕉️ अपना दैनिक पंचांग व राशिफल पढ़ें: ${window.location.origin}/#daily-rashifal-section`;
      shareBtn.href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText);
    }
  }

  const buttons = rashiTrack.querySelectorAll('.rashi-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const idx = parseInt(this.dataset.rashi, 10);
      renderRashi(idx, true);
    });
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      localStorage.setItem('bas_my_rashi', currentRashiIdx);
      renderRashi(currentRashiIdx, false);
    });
  }

  renderRashi(currentRashiIdx, false);
};
