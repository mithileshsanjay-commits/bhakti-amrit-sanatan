/* ======================================================
   BHAKTI AMRIT SANATAN — JavaScript Core
   Animations, Interactions, Panchang, Particles
   ====================================================== */

'use strict';

// ── NAMESPACE ──────────────────────────────────────────
const BAS = {};

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

// ── COUNTER ANIMATION ──────────────────────────────────
BAS.animateCounters = function () {
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
BAS.currentLang = localStorage.getItem('bas_lang') || 'hi';

BAS.translations = {
  hi: {
    nav_home: '🏠 Home',
    nav_articles: '📚 सभी लेख (281)',
    nav_mantras: '🔱 Mantras',
    nav_puja: '🪔 Puja Vidhi',
    nav_vrat: '📅 Vrat & Festivals',
    nav_katha: '📖 Dev Katha',
    nav_geeta: '🕉️ Geeta Gyan',
    nav_donate: '🙏 Donate',
    lang_btn: 'English',
    hero_badge: 'सनातन धर्म की सम्पूर्ण जानकारी',
    hero_cta_articles: '📕 सम्पूर्ण 281 लेख संग्रह',
    hero_quick_label: 'त्वरित दर्शन:',
    hero_search_ph: 'मंत्र, व्रत, देव कथा खोजें...',
    hero_search_btn: '🔍 Search',
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
    view_all_articles_btn: '📚 सभी 281 प्रामाणिक लेख देखें (View All Articles) →',
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
    nav_articles: '📚 All Articles (281)',
    nav_mantras: '🔱 Mantras',
    nav_puja: '🪔 Puja Vidhi',
    nav_vrat: '📅 Vrat & Festivals',
    nav_katha: '📖 Dev Katha',
    nav_geeta: '🕉️ Geeta Wisdom',
    nav_donate: '🙏 Donate',
    lang_btn: 'हिन्दी',
    hero_badge: 'Complete Guide to Sanatan Dharma',
    hero_cta_articles: '📕 All 281 Articles Library',
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
    view_all_articles_btn: '📚 Explore All 281 Authentic Articles Library →',
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

BAS.initLanguageToggle = function () {
  // Inject language toggle button into nav if not present
  if (!document.querySelector('.lang-toggle-btn')) {
    const navActions = document.querySelector('.nav__actions') || document.querySelector('.nav__cta');
    if (navActions) {
      const btn = document.createElement('button');
      btn.className = 'lang-toggle-btn';
      btn.id = 'lang-toggle-btn';
      btn.setAttribute('aria-label', 'Toggle language between Hindi and English');
      btn.innerHTML = '<span class="lang-icon">🌐</span><span class="lang-label">English</span>';
      navActions.insertBefore(btn, navActions.firstChild);
    }
  }

  const mobileActions = document.querySelector('.nav__mobile-actions');
  if (mobileActions && !mobileActions.querySelector('.lang-toggle-btn')) {
    const mBtn = document.createElement('button');
    mBtn.className = 'lang-toggle-btn';
    mBtn.style.cssText = 'width:100%; justify-content:center; margin-bottom:10px;';
    mBtn.innerHTML = '<span class="lang-icon">🌐</span><span class="lang-label">English</span>';
    mobileActions.insertBefore(mBtn, mobileActions.firstChild);
  }

  const toggleBtns = document.querySelectorAll('.lang-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const nextLang = (BAS.currentLang === 'hi') ? 'en' : 'hi';
      BAS.applyLanguage(nextLang, true);
    });
  });

  // Determine initial language from storage or cookie
  let initialLang = 'hi';
  try {
    const saved = localStorage.getItem('bas_lang');
    if (saved === 'en' || saved === 'hi') initialLang = saved;
  } catch (e) {}

  const gtCookie = BAS.getCookie('googtrans');
  if (gtCookie && gtCookie.includes('/en')) {
    initialLang = 'en';
  }

  BAS.applyLanguage(initialLang, false);

  // Initialize invisible Google Translate engine
  BAS.initGoogleTranslate();

  // If initial language is English, ensure combo matches once loaded
  if (initialLang === 'en') {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        if (combo.value !== 'en') {
          combo.value = 'en';
          combo.dispatchEvent(new Event('change'));
        }
        clearInterval(timer);
      }
      if (attempts >= 25) clearInterval(timer);
    }, 200);
  }
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
  const desc = isEn ? 'Fast access to Daily Panchang, 281 Vedic articles, Aartis & Mantras on your home screen!' : 'दैनिक पंचांग, आरती, चालीसा और 281 सनातन लेख सीधे अपनी होम स्क्रीन पर पाएं!';
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
  if (typeof BAS.initDailyRashifal === 'function') BAS.initDailyRashifal();
  BAS.initLanguageToggle();
  BAS.initRotatingQuotes();
  BAS.initSearchBar();
  BAS.initWhatsAppShare();
  BAS.initPwaInstallPopup();

  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
};

// DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', BAS.init);
} else {
  BAS.init();
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if(typeof BAS.initHeroFestival === 'function') BAS.initHeroFestival();
    }, 100);
});

// ── ASTRONOMICAL GRAHAN (ECLIPSE) DATABASE & TIMEZONE ENGINE ────────
BAS.grahanDatabase = [
  {
    id: 'lunar-eclipse-2026-03',
    type: 'chandra',
    icon: '🌘',
    name_hi: 'खग्रास चन्द्र ग्रहण (Total Lunar Eclipse)',
    name_en: 'Total Lunar Eclipse',
    utc_start: '2026-03-03T09:50:00Z',
    utc_peak: '2026-03-03T11:34:00Z',
    utc_end: '2026-03-03T15:40:00Z',
    sutak_hours: 9,
    visibility: {
      'Asia/Kolkata': { visible: true, note: 'भारत: चंद्रोदय समय खंडग्रास दृश्य (सूतक प्रभावी)' },
      'Asia/Dubai': { visible: false, note: 'दुबई: अदृश्य (सूतक मान्य नहीं)' },
      'Europe/London': { visible: false, note: 'लंदन: अदृश्य (सूतक मान्य नहीं)' },
      'America/New_York': { visible: true, note: 'न्यूयॉर्क: दृश्य (सूतक प्रभावी)' },
      'America/Los_Angeles': { visible: true, note: 'लॉस एंजिल्स: दृश्य (सूतक प्रभावी)' },
      'America/Toronto': { visible: true, note: 'टोरंटो: दृश्य (सूतक प्रभावी)' },
      'Australia/Sydney': { visible: true, note: 'सिडनी: दृश्य (सूतक प्रभावी)' }
    }
  },
  {
    id: 'solar-eclipse-2026-08',
    type: 'surya',
    icon: '☀️',
    name_hi: 'खग्रास सूर्य ग्रहण (Total Solar Eclipse)',
    name_en: 'Total Solar Eclipse',
    utc_start: '2026-08-12T15:40:00Z',
    utc_peak: '2026-08-12T17:46:00Z',
    utc_end: '2026-08-12T19:55:00Z',
    sutak_hours: 12,
    visibility: {
      'Asia/Kolkata': { visible: false, note: 'भारत: अदृश्य (सूतक मान्य नहीं)' },
      'Asia/Dubai': { visible: false, note: 'दुबई: अदृश्य (सूतक मान्य नहीं)' },
      'Europe/London': { visible: true, note: 'लंदन: आंशिक दृश्य (सूतक मान्य)' },
      'America/New_York': { visible: true, note: 'न्यूयॉर्क: आंशिक दृश्य (सूतक मान्य)' },
      'America/Los_Angeles': { visible: false, note: 'लॉस एंजिल्स: अदृश्य' },
      'America/Toronto': { visible: true, note: 'टोरंटो: आंशिक दृश्य' },
      'Australia/Sydney': { visible: false, note: 'सिडनी: अदृश्य' }
    }
  },
  {
    id: 'lunar-eclipse-2026-08',
    type: 'chandra',
    icon: '🌘',
    name_hi: 'खंडग्रास चन्द्र ग्रहण (Partial Lunar Eclipse)',
    name_en: 'Partial Lunar Eclipse',
    utc_start: '2026-08-28T02:20:00Z',
    utc_peak: '2026-08-28T04:13:00Z',
    utc_end: '2026-08-28T05:50:00Z',
    sutak_hours: 9,
    visibility: {
      'Asia/Kolkata': { visible: false, note: 'भारत: अदृश्य (सूतक मान्य नहीं)' },
      'Asia/Dubai': { visible: false, note: 'दुबई: अदृश्य (सूतक मान्य नहीं)' },
      'Europe/London': { visible: true, note: 'लंदन: दृश्य (सूतक प्रभावी)' },
      'America/New_York': { visible: true, note: 'न्यूयॉर्क: दृश्य (सूतक प्रभावी)' },
      'America/Los_Angeles': { visible: true, note: 'लॉस एंजिल्स: दृश्य (सूतक प्रभावी)' },
      'America/Toronto': { visible: true, note: 'टोरंटो: दृश्य (सूतक प्रभावी)' },
      'Australia/Sydney': { visible: false, note: 'सिडनी: अदृश्य' }
    }
  },
  {
    id: 'solar-eclipse-2027-02',
    type: 'surya',
    icon: '☀️',
    name_hi: 'वलयाकार सूर्य ग्रहण (Annular Solar Eclipse)',
    name_en: 'Annular Solar Eclipse',
    utc_start: '2027-02-06T13:50:00Z',
    utc_peak: '2027-02-06T16:00:00Z',
    utc_end: '2027-02-06T18:15:00Z',
    sutak_hours: 12,
    visibility: {
      'Asia/Kolkata': { visible: false, note: 'भारत: अदृश्य (सूतक मान्य नहीं)' },
      'Asia/Dubai': { visible: false, note: 'दुबई: अदृश्य' },
      'Europe/London': { visible: false, note: 'लंदन: अदृश्य' },
      'America/New_York': { visible: false, note: 'न्यूयॉर्क: अदृश्य' },
      'America/Los_Angeles': { visible: false, note: 'अदृश्य' },
      'America/Toronto': { visible: false, note: 'अदृश्य' },
      'Australia/Sydney': { visible: false, note: 'अदृश्य' }
    }
  },
  {
    id: 'solar-eclipse-2027-08',
    type: 'surya',
    icon: '☀️',
    name_hi: 'खग्रास सूर्य ग्रहण (Total Solar Eclipse)',
    name_en: 'Total Solar Eclipse',
    utc_start: '2027-08-02T08:30:00Z',
    utc_peak: '2027-08-02T10:07:00Z',
    utc_end: '2027-08-02T13:45:00Z',
    sutak_hours: 12,
    visibility: {
      'Asia/Kolkata': { visible: true, note: 'भारत (पश्चिम/उत्तर): आंशिक दृश्य (सूतक मान्य)' },
      'Asia/Dubai': { visible: true, note: 'दुबई: अत्यधिक दृश्य (सूतक प्रभावी)' },
      'Europe/London': { visible: true, note: 'लंदन: दृश्य (सूतक प्रभावी)' },
      'America/New_York': { visible: false, note: 'न्यूयॉर्क: अदृश्य' },
      'America/Los_Angeles': { visible: false, note: 'अदृश्य' },
      'America/Toronto': { visible: false, note: 'अदृश्य' },
      'Australia/Sydney': { visible: false, note: 'अदृश्य' }
    }
  }
];

BAS.updateHeroGrahan = function (selectedTz) {
  const cardEl = document.getElementById('panchang-grahan-card');
  const tagEl = document.getElementById('grahan-tag');
  const pillEl = document.getElementById('grahan-status-pill');
  const normalView = document.getElementById('grahan-normal-view');
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
  const now = new Date();

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

  // Check if today has an active eclipse
  let activeGrahan = null;
  let isToday = false;

  for (let i = 0; i < BAS.grahanDatabase.length; i++) {
    const g = BAS.grahanDatabase[i];
    const startTime = new Date(g.utc_start).getTime();
    const endTime = new Date(g.utc_end).getTime();

    // Check if within window of eclipse event
    if (now.getTime() >= startTime && now.getTime() <= endTime) {
      activeGrahan = g;
      isToday = true;
      break;
    }

    // Or same calendar day in the selected timezone
    const gDate = new Date(g.utc_start).toLocaleDateString('en-CA', { timeZone: tz });
    const todayDate = now.toLocaleDateString('en-CA', { timeZone: tz });
    if (gDate === todayDate) {
      activeGrahan = g;
      isToday = true;
      break;
    }
  }

  if (isToday && activeGrahan) {
    // ── ECLIPSE DAY (Auto-Expand with Verified Information) ──
    cardEl.className = 'panchang-grahan-card panchang-grahan-card--active';
    normalView.style.display = 'none';
    eclipseView.style.display = 'flex';

    const visRule = activeGrahan.visibility[tz] || { visible: false, note: 'अदृश्य' };

    tagEl.innerHTML = `🚨 <strong style="color:#f59e0b;">आज ग्रहण:</strong> ${activeGrahan.icon} ${activeGrahan.name_hi}`;
    if (pillEl) {
      pillEl.style.background = visRule.visible ? 'rgba(234, 88, 12, 0.25)' : 'rgba(100, 116, 139, 0.25)';
      pillEl.style.color = visRule.visible ? '#fdba74' : '#cbd5e1';
      pillEl.style.borderColor = visRule.visible ? 'rgba(249, 115, 22, 0.45)' : 'rgba(148, 163, 184, 0.3)';
      pillEl.textContent = visRule.visible ? `${cityName}: दृश्य` : `${cityName}: अदृश्य`;
    }

    if (typeVal) typeVal.textContent = activeGrahan.name_hi;
    if (startVal) startVal.textContent = formatTzTime(activeGrahan.utc_start);
    if (peakVal) peakVal.textContent = formatTzTime(activeGrahan.utc_peak);
    if (endVal) endVal.textContent = formatTzTime(activeGrahan.utc_end);
    if (locLabel) locLabel.textContent = `दृश्यता (${cityName}):`;
    if (visVal) visVal.textContent = visRule.note;

    // Sutak: Only display if applicability and timing are reliably determined for the selected location
    if (visRule.visible && activeGrahan.sutak_hours) {
      sutakRow.style.display = 'flex';
      const sutakStartTime = new Date(new Date(activeGrahan.utc_start).getTime() - (activeGrahan.sutak_hours * 3600000));
      const sStr = sutakStartTime.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true });
      sutakVal.textContent = `${sStr} से मोक्ष तक (सूतक प्रभावी)`;
    } else {
      sutakRow.style.display = 'none';
    }
  } else {
    // ── NORMAL DAY — NO ECLIPSE (Compact & Clean, No '--') ──
    cardEl.className = 'panchang-grahan-card';
    normalView.style.display = 'flex';
    eclipseView.style.display = 'none';

    tagEl.innerHTML = '🌘 ग्रहण जानकारी';
    if (pillEl) {
      pillEl.style.background = 'rgba(16, 185, 129, 0.12)';
      pillEl.style.color = '#6ee7b7';
      pillEl.style.borderColor = 'rgba(16, 185, 129, 0.28)';
      pillEl.textContent = 'आज कोई ग्रहण नहीं';
    }

    // Find next verified upcoming eclipse
    let nextG = null;
    for (let i = 0; i < BAS.grahanDatabase.length; i++) {
      const g = BAS.grahanDatabase[i];
      if (new Date(g.utc_end).getTime() > now.getTime()) {
        nextG = g;
        break;
      }
    }

    if (nextG && upcomingNote) {
      const gDateStr = formatTzDate(nextG.utc_start);
      const visRule = nextG.visibility[tz] || { visible: false };
      const visText = visRule.visible ? 'दृश्य' : 'अदृश्य';
      const typeLabel = nextG.type === 'surya' ? 'सूर्य ग्रहण' : 'चन्द्र ग्रहण';
      if (locVisSpan) {
        locVisSpan.textContent = `[${cityName}: ${visText}]`;
      }
      upcomingNote.innerHTML = `· अगला ग्रहण: ${gDateStr} (${typeLabel}) <span id="grahan-loc-vis">[${cityName}: ${visText}]</span>`;
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

  // Handle city / timezone change
  let selectedTz = localStorage.getItem('bas_panchang_tz') || 'Asia/Kolkata';
  if (citySelect) {
    citySelect.value = selectedTz;
    if (!citySelect.dataset.listenerAttached) {
      citySelect.dataset.listenerAttached = 'true';
      citySelect.addEventListener('change', function () {
        localStorage.setItem('bas_panchang_tz', this.value);
        BAS.initHeroPanchang();
        if (BAS.showToast) {
          BAS.showToast('पंचांग शहर अपडेट हुआ: ' + this.options[this.selectedIndex].text);
        }
      });
    }
  }

  // Calculate local time in the selected timezone
  let now = new Date();
  try {
    const tzString = new Date().toLocaleString('en-US', { timeZone: selectedTz });
    now = new Date(tzString);
  } catch (e) {}

  const dayIdx = now.getDay();

  const dayNames = [
    { hi: 'रविवार', en: 'Sunday' },
    { hi: 'सोमवार', en: 'Monday' },
    { hi: 'मंगलवार', en: 'Tuesday' },
    { hi: 'बुधवार', en: 'Wednesday' },
    { hi: 'गुरुवार', en: 'Thursday' },
    { hi: 'शुक्रवार', en: 'Friday' },
    { hi: 'शनिवार', en: 'Saturday' }
  ];

  const hindiMonths = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];
  const enMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isEn = BAS.currentLang === 'en';

  function formatLocalTime(d) {
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, '0');
    return `${strHours}:${minutes}:${seconds} ${ampm}`;
  }

  // Date formatting with icon
  if (dateEl) {
    const monthName = isEn ? enMonths[now.getMonth()] : hindiMonths[now.getMonth()];
    dateEl.innerHTML = `<span aria-hidden="true">📅</span> ${now.getDate()} ${monthName} ${now.getFullYear()}`;
  }

  // Live Local Time
  if (timeValEl) {
    timeValEl.textContent = formatLocalTime(now);
  }

  if (BAS._panchangClockTimer) clearInterval(BAS._panchangClockTimer);
  BAS._panchangClockTimer = setInterval(() => {
    let tNow = new Date();
    try {
      const tzStr = new Date().toLocaleString('en-US', { timeZone: selectedTz });
      tNow = new Date(tzStr);
    } catch (e) {}
    if (timeValEl) {
      timeValEl.textContent = formatLocalTime(tNow);
    }
  }, 1000);

  // Day of week
  if (varEl) {
    const curDay = dayNames[dayIdx];
    varEl.textContent = isEn ? `${curDay.en} (${curDay.hi})` : `${curDay.hi} (${curDay.en})`;
  }

  // Rahu Kaal by day of week (standard Vedic 90-minute muhurtas)
  const rahuTimes = [
    '04:30 PM – 06:00 PM', // Sun (8th)
    '07:30 AM – 09:00 AM', // Mon (2nd)
    '03:00 PM – 04:30 PM', // Tue (7th)
    '12:00 PM – 01:30 PM', // Wed (5th)
    '01:30 PM – 03:00 PM', // Thu (6th)
    '10:30 AM – 12:00 PM', // Fri (4th)
    '09:00 AM – 10:30 AM'  // Sat (3rd)
  ];
  if (rahuEl) {
    rahuEl.textContent = rahuTimes[dayIdx];
  }

  if (abhijitEl) {
    abhijitEl.textContent = '11:50 AM – 12:40 PM';
  }

  // 15 Tithis of a Paksha
  const tithisList = [
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
    { hi: 'पूर्णिमा', en: 'Purnima' }
  ];

  // 27 Vedic Nakshatras
  const nakshatras = [
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

  // Authentic Vedic Anchor: 6 September 2026 (Sunday)
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const anchorMidnight = new Date(2026, 8, 6).getTime(); // Month 8 = September
  const diffDays = Math.round((todayMidnight - anchorMidnight) / 86400000);

  let tithiIndex = (24 + diffDays) % 30;
  if (tithiIndex < 0) tithiIndex += 30;

  if (tithiIndex < 15) {
    const t = tithisList[tithiIndex];
    if (tithiEl)  tithiEl.textContent  = isEn ? `${t.en} (${t.hi})` : `${t.hi} (${t.en})`;
    if (pakshaEl) pakshaEl.textContent = isEn ? 'Shukla Paksha (Waxing Moon)' : 'शुक्ल पक्ष (Shukla Paksha)';
  } else {
    const kIdx = tithiIndex - 15;
    const tName = kIdx === 14 ? { hi: 'अमावस्या', en: 'Amavasya' } : tithisList[kIdx];
    if (tithiEl)  tithiEl.textContent  = isEn ? `${tName.en} (${tName.hi})` : `${tName.hi} (${tName.en})`;
    if (pakshaEl) pakshaEl.textContent = isEn ? 'Krishna Paksha (Waning Moon)' : 'कृष्ण पक्ष (Krishna Paksha)';
  }

  // Nakshatra: on 6 Sept 2026, Ardra is index 5
  let nIdx = (5 + diffDays) % 27;
  if (nIdx < 0) nIdx += 27;
  if (nakshatraEl) {
    const n = nakshatras[nIdx];
    nakshatraEl.textContent = isEn ? `${n.en} (${n.hi})` : `${n.hi} (${n.en})`;
  }
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

// ── DAILY RASHIFAL (HOROSCOPE) ─────────────────────────
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

  const todayStr = new Date().toLocaleDateString('hi-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  if (heroDate) heroDate.textContent = `📅 आज: ${todayStr}`;

  const rashisData = [
    { name: 'मेष राशि (Aries)', icon: '♈', lord: 'मंगल', element: 'अग्नि', color: 'लाल / सिंदूरी', number: '9', prediction: 'आज का दिन आपके लिए ऊर्जा और नवीन अवसरों से परिपूर्ण रहेगा। कार्यक्षेत्र में आपके पराक्रम की प्रशंसा होगी। परिवार में किसी शुभ कार्य की योजना बन सकती है। स्वास्थ्य उत्तम रहेगा।', upay: 'हनुमान जी को सिंदूर व चमेली का तेल अर्पित करें तथा संकटमोचन हनुमानाष्टक का पाठ करें।' },
    { name: 'वृषभ राशि (Taurus)', icon: '♉', lord: 'शुक्र', element: 'पृथ्वी', color: 'सफेद / गुलाबी', number: '6', prediction: 'आर्थिक स्थिति में सुधार के प्रबल योग हैं। रुके हुए धन की प्राप्ति हो सकती है। व्यापार में नए संबंध लाभकारी सिद्ध होंगे। दांपत्य जीवन में सुख-शांति बनी रहेगी।', upay: 'माता लक्ष्मी को खीर या सफेद मिष्ठान का भोग लगाएं व ॐ श्रीं नमः का 11 बार जप करें।' },
    { name: 'मिथुन राशि (Gemini)', icon: '♊', lord: 'बुध', element: 'वायु', color: 'हरा / पन्ना', number: '5', prediction: 'बुद्धि और संवाद के बल पर कठिन कार्य भी सुगमता से संपन्न होंगे। मित्रों का सहयोग प्राप्त होगा। विद्यार्थियों के लिए आज का दिन अत्यंत अनुकूल और प्रगतिशील रहेगा।', upay: 'भगवान श्री गणेश जी को 21 दूर्वा अर्पित करें और ॐ गं गणपतये नमः मंत्र जपें।' },
    { name: 'कर्क राशि (Cancer)', icon: '♋', lord: 'चंद्रमा', element: 'जल', color: 'सफेद / चांदी', number: '2', prediction: 'आज मानसिक शांति और भावनात्मक संतुलन बना रहेगा। माता का पूर्ण आशीर्वाद प्राप्त होगा। कला, साहित्य अथवा रचनात्मक कार्यों में रुचि बढ़ेगी। यात्रा सुखद रहेगी।', upay: 'शिवलिंग पर कच्चा दूध, जल व अक्षत अर्पित कर ॐ नमः शिवाय का श्रद्धापूर्वक जप करें।' },
    { name: 'सिंह राशि (Leo)', icon: '♌', lord: 'सूर्य', element: 'अग्नि', color: 'सुनहरा / नारंगी', number: '1', prediction: 'आत्मविश्वास और प्रतिष्ठा में उल्लेखनीय वृद्धि होगी। उच्च अधिकारियों का सहयोग मिलेगा। सामाजिक जीवन में सम्मान बढ़ेगा। महत्वपूर्ण निर्णय लेने के लिए श्रेष्ठ दिन है।', upay: 'प्रातःकाल तांबे के लोटे में रोली-अक्षत मिलाकर भगवान सूर्यदेव को अर्घ्य दें।' },
    { name: 'कन्या राशि (Virgo)', icon: '♍', lord: 'बुध', element: 'पृथ्वी', color: 'गहरा हरा', number: '5', prediction: 'व्यापार और कार्यक्षेत्र में योजनाबद्ध तरीके से किए गए प्रयासों में पूर्ण सफलता मिलेगी। स्वास्थ्य के प्रति थोड़ी सजगता रखें। अनावश्यक व्यय पर नियंत्रण रखें।', upay: 'गौमाता को हरा चारा अथवा पालक खिलाएं और बुध गायत्री मंत्र का स्मरण करें।' },
    { name: 'तुला राशि (Libra)', icon: '♎', lord: 'शुक्र', element: 'वायु', color: 'चमकीला सफेद / आसमानी', number: '6', prediction: 'सौहार्द और सामंजस्य से भरा दिन रहेगा। व्यापार में साझेदारी से लाभ की संभावना है। जीवनसाथी के साथ संबंध और अधिक मधुर होंगे। धार्मिक यात्रा का योग बन सकता है।', upay: 'कन्याओं को फल अथवा सफेद मिष्ठान भेंट करें और महालक्ष्मी स्तुति का पाठ करें।' },
    { name: 'वृश्चिक राशि (Scorpio)', icon: '♏', lord: 'मंगल', element: 'जल', color: 'महरून / गहरा लाल', number: '9', prediction: 'साहस और धैर्य से आप सभी विरोधियों पर विजय प्राप्त करेंगे। गूढ़ विषयों व धर्म-कर्म में मन लगेगा। किसी महत्वपूर्ण अनुबंध पर हस्ताक्षर हो सकते हैं।', upay: 'सुंदरकांड अथवा हनुमान चालीसा का पाठ करें और बंदरों को गुड़-चना खिलाएं।' },
    { name: 'धनु राशि (Sagittarius)', icon: '♐', lord: 'गुरु (बृहस्पति)', element: 'अग्नि', color: 'पीला / केसरिया', number: '3', prediction: 'भाग्य का भरपूर साथ मिलेगा। आध्यात्मिक कार्यों में संलग्नता बढ़ेगी। गुरुजनों और वरिष्ठों का मार्गदर्शन आपको नई दिशा देगा। धन लाभ के अवसर प्राप्त होंगे।', upay: 'केले के वृक्ष में जल अर्पित करें, हल्दी का तिलक लगाएं और ॐ नमो भगवते वासुदेवाय जपें।' },
    { name: 'मकर राशि (Capricorn)', icon: '♑', lord: 'शनि', element: 'पृथ्वी', color: 'नीला / स्लेटी', number: '8', prediction: 'परिश्रम का उत्तम फल प्राप्त होगा। पैतृक संपत्ति से जुड़े मामलों में प्रगति होगी। शांत मन से अपने लक्ष्यों पर केंद्रित रहें। सांयकाल में परिवार संग समय बीतेगा।', upay: 'पीपल के वृक्ष के नीचे सरसों के तेल का चौमुखी दीपक जलाएं और शनि चालीसा पढ़ें।' },
    { name: 'कुंभ राशि (Aquarius)', icon: '♒', lord: 'शनि', element: 'वायु', color: 'बैंगनी / गहरा नीला', number: '8', prediction: 'नवीन विचारों और योजनाओं को क्रियान्वित करने का अनुकूल समय है। जनसंपर्क और मित्रों से लाभ होगा। भविष्य की चिंता छोड़कर वर्तमान कार्यों पर ध्यान केंद्रित करें।', upay: 'काले तिल और उड़द की दाल का दान करें अथवा किसी जरूरतमंद को भोजन कराएं।' },
    { name: 'मीन राशि (Pisces)', icon: '♓', lord: 'गुरु (बृहस्पति)', element: 'जल', color: 'पीला / सुनहरा', number: '3', prediction: 'सकारात्मकता और दयालु भाव से आपका प्रभाव बढ़ेगा। किसी शुभ समाचार से घर में हर्ष का वातावरण रहेगा। धार्मिक साहित्य और सत्संग में रुचि बढ़ेगी।', upay: 'भगवान श्री हरि विष्णु को पीले फूल व तुलसी दल अर्पित करें और विष्णु सहस्रनाम सुनें।' }
  ];

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
      const shareText = `✨ *दैनिक राशिफल — ${data.name}* ✨\n\n🔮 *आज का फलकथन:*\n${data.prediction}\n\n🎨 *शुभ रंग:* ${data.color}\n🔢 *शुभ अंक:* ${data.number}\n🪔 *दैनिक उपाय:* ${data.upay}\n\n🕉️ अपना दैनिक पंचांग व राशिफल पढ़ें: ${window.location.origin}/#daily-rashifal-section`;
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
