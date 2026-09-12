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
      const items = document.querySelectorAll('[data-category]');
      
      if (!items.length) return;

      items.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          setTimeout(() => item.style.opacity = '1', 50);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 300);
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

// ── FESTIVAL COUNTDOWN ─────────────────────────────────
BAS.initFestivalCountdown = function () {
  const daysEl  = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl  = document.getElementById('cd-mins');
  const secsEl  = document.getElementById('cd-secs');
  const nameEl  = document.getElementById('festival-name');
  const dateEl  = document.getElementById('festival-date');
  if (!daysEl) return;

  // Upcoming Hindu festivals in 2026
  const festivals = [
    { name: 'Ganesh Chaturthi 2026', date: '2026-08-27', deva: 'भाद्रपद शुक्ल चतुर्थी', icon: '🐘' },
    { name: 'Navratri 2026 (Sharad)',  date: '2026-10-02', deva: 'आश्विन शुक्ल प्रतिपदा', icon: '🌺' },
    { name: 'Dussehra 2026',           date: '2026-10-11', deva: 'विजयादशमी', icon: '🏹' },
    { name: 'Karwa Chauth 2026',       date: '2026-10-20', deva: 'कार्तिक कृष्ण चतुर्थी', icon: '🌕' },
    { name: 'Diwali 2026',             date: '2026-11-01', deva: 'कार्तिक अमावस्या', icon: '🪔' },
    { name: 'Chhath Puja 2026',        date: '2026-11-05', deva: 'कार्तिक शुक्ल षष्ठी', icon: '☀️' },
    { name: 'Maha Shivratri 2027',     date: '2027-02-26', deva: 'फाल्गुन कृष्ण त्रयोदशी', icon: '🔱' },
  ];

  const now  = new Date();
  const next = festivals.find(f => new Date(f.date) > now) || festivals[0];
  const target = new Date(next.date + 'T00:00:00');

  if (nameEl) nameEl.textContent = next.icon + ' ' + next.name;
  if (dateEl) dateEl.textContent = next.deva + ' · ' + new Date(next.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = target - new Date();
    if (diff <= 0) { daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = '00'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    daysEl.textContent  = pad(d);
    hoursEl.textContent = pad(h);
    minsEl.textContent  = pad(m);
    secsEl.textContent  = pad(s);
  }
  tick();
  setInterval(tick, 1000);
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

// ── FESTIVAL COUNTDOWN (Image 3) ──────────────────────
BAS.initFestivalCountdown = function () {
  const daysEl  = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl  = document.getElementById('cd-mins');
  const secsEl  = document.getElementById('cd-secs');
  const nameEl  = document.getElementById('festival-name');
  const dateEl  = document.getElementById('festival-date');
  if (!daysEl) return;

  // Major Sanatan Festivals
  const festivals = [
    { name: 'Ganesh Chaturthi 2026', date: '2026-09-14', deva: 'भाद्रपद शुक्ल चतुर्थी · 14 September, 2026', icon: '🐘' },
    { name: 'Sharad Navratri 2026', date: '2026-10-02', deva: 'आश्विन शुक्ल प्रतिपदा · 2 October, 2026', icon: '🌺' },
    { name: 'Dussehra / Vijayadashami 2026', date: '2026-10-11', deva: 'आश्विन शुक्ल दशमी · 11 October, 2026', icon: '🏹' },
    { name: 'Karwa Chauth 2026', date: '2026-10-20', deva: 'कार्तिक कृष्ण चतुर्थी · 20 October, 2026', icon: '🌕' },
    { name: 'Dhanteras & Diwali 2026', date: '2026-11-01', deva: 'कार्तिक अमावस्या · 1 November, 2026', icon: '🪔' },
    { name: 'Chhath Puja 2026', date: '2026-11-05', deva: 'कार्तिक शुक्ल षष्ठी · 5 November, 2026', icon: '☀️' },
    { name: 'Dev Deepawali 2026', date: '2026-11-15', deva: 'कार्तिक शुक्ल पूर्णिमा · 15 November, 2026', icon: '✨' },
    { name: 'Makar Sankranti 2027', date: '2027-01-14', deva: 'सूर्य का मकर संक्रमण · 14 January, 2027', icon: '🪁' },
    { name: 'Maha Shivratri 2027', date: '2027-02-26', deva: 'फाल्गुन कृष्ण त्रयोदशी · 26 February, 2027', icon: '🔱' },
    { name: 'Holi 2027', date: '2027-03-22', deva: 'फाल्गुन शुक्ल पूर्णिमा · 22 March, 2027', icon: '🎨' },
    { name: 'Ram Navami 2027', date: '2027-04-15', deva: 'चैत्र शुक्ल नवमी · 15 April, 2027', icon: '🚩' }
  ];

  const now = new Date();
  const next = festivals.find(f => new Date(f.date) > now) || festivals[0];
  const target = new Date(next.date + 'T00:00:00');

  if (nameEl) nameEl.textContent = next.name;
  if (dateEl) dateEl.textContent = next.deva;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = target - new Date();
    if (diff <= 0) {
      daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    daysEl.textContent  = pad(d);
    hoursEl.textContent = pad(h);
    minsEl.textContent  = pad(m);
    secsEl.textContent  = pad(s);
  }
  tick();
  setInterval(tick, 1000);
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
    hero_tagline: 'मंत्र · पूजा विधि · व्रत कथा · देव कथा · गीता ज्ञान\nYour complete guide to Sanatan Dharma',
    hero_cta_articles: '📚 सम्पूर्ण 281 लेख संग्रह',
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
    fest_banner_btn: '📅 Vrat & Festival Calendar'
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
    hero_tagline: 'Mantras · Puja Vidhi · Vrat Katha · Dev Stories · Geeta Wisdom\nYour complete spiritual resource',
    hero_cta_articles: '📚 All 281 Articles Library',
    hero_quick_label: 'Quick Links:',
    hero_search_ph: 'Search mantras, rituals, sacred stories...',
    hero_search_btn: '🔍 Search',
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
    fest_banner_btn: '📅 Vrat & Festival Calendar'
  }
};

BAS.applyLanguage = function (lang) {
  BAS.currentLang = lang;
  localStorage.setItem('bas_lang', lang);
  document.documentElement.lang = lang;
  const t = BAS.translations[lang] || BAS.translations.hi;

  // Language toggle buttons
  document.querySelectorAll('.lang-btn-text').forEach(el => {
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
};

BAS.initLanguageToggle = function () {
  const toggleBtns = document.querySelectorAll('.lang-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextLang = (BAS.currentLang === 'hi') ? 'en' : 'hi';
      BAS.applyLanguage(nextLang);
    });
  });
  BAS.applyLanguage(BAS.currentLang);
};

// ── INIT ALL ───────────────────────────────────────────
BAS.init = function () {
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

BAS.initHeroPanchang = function () {
  const dateEl      = document.getElementById('panchang-date');
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

  // Date formatting (e.g. 6 सितंबर 2026)
  if (dateEl) {
    dateEl.textContent = `${now.getDate()} ${hindiMonths[now.getMonth()]} ${now.getFullYear()}`;
  }

  // Day of week
  if (varEl) {
    const curDay = dayNames[dayIdx];
    varEl.textContent = `${curDay.hi} (${curDay.en})`;
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
    'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य',
    'आश्लेषा', 'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति',
    'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण',
    'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती'
  ];

  // Authentic Vedic Anchor: 6 September 2026 (Sunday)
  // Tithi: Bhadrapada Krishna Paksha Dashami (index 9 in Krishna paksha)
  // Nakshatra: Ardra (index 5)
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const anchorMidnight = new Date(2026, 8, 6).getTime(); // Note: Month 8 = September
  const diffDays = Math.round((todayMidnight - anchorMidnight) / 86400000);

  // In our 30-day lunar cycle:
  // 0-14: Shukla Paksha (0: Pratipada -> 14: Purnima)
  // 15-29: Krishna Paksha (15: Pratipada -> 24: Dashami -> 29: Amavasya)
  // On 6 Sept 2026, Krishna Dashami is index 24
  let tithiIndex = (24 + diffDays) % 30;
  if (tithiIndex < 0) tithiIndex += 30;

  if (tithiIndex < 15) {
    if (tithiEl)  tithiEl.textContent  = `${tithisList[tithiIndex].hi} (${tithisList[tithiIndex].en})`;
    if (pakshaEl) pakshaEl.textContent = 'शुक्ल पक्ष (Shukla Paksha)';
  } else {
    const kIdx = tithiIndex - 15;
    const tName = kIdx === 14 ? { hi: 'अमावस्या', en: 'Amavasya' } : tithisList[kIdx];
    if (tithiEl)  tithiEl.textContent  = `${tName.hi} (${tName.en})`;
    if (pakshaEl) pakshaEl.textContent = 'कृष्ण पक्ष (Krishna Paksha)';
  }

  // Nakshatra: on 6 Sept 2026, Ardra is index 5
  let nIdx = (5 + diffDays) % 27;
  if (nIdx < 0) nIdx += 27;
  if (nakshatraEl) nakshatraEl.textContent = nakshatras[nIdx];
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

  function renderRashi(idx) {
    const data = rashisData[idx];
    if (!data) return;

    currentRashiIdx = idx;

    const buttons = rashiTrack.querySelectorAll('.rashi-btn');
    buttons.forEach((b, i) => {
      if (i === idx) {
        b.classList.add('active');
        b.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
      renderRashi(idx);
    });
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      localStorage.setItem('bas_my_rashi', currentRashiIdx);
      renderRashi(currentRashiIdx);
    });
  }

  renderRashi(currentRashiIdx);
};
