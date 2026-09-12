/* ======================================================
   BHAKTI AMRIT SANATAN — JavaScript Core
   Animations, Interactions, Panchang, Particles
   ====================================================== */

'use strict';

// ── NAMESPACE ──────────────────────────────────────────
const BAS = {};

// ── PANCHANG DATA ──────────────────────────────────────
BAS.panchangData = (function () {
  const now   = new Date();
  const day   = now.getDay();
  const days  = ['रविवार','सोमवार','मंगलवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'];
  const tithis = ['प्रतिपदा','द्वितीया','तृतीया','चतुर्थी','पंचमी','षष्ठी','सप्तमी','अष्टमी','नवमी','दशमी','एकादशी','द्वादशी','त्रयोदशी','चतुर्दशी','पूर्णिमा/अमावस्या'];

  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const anchorMidnight = new Date(2026, 8, 6).getTime();
  const diffDays = Math.round((todayMidnight - anchorMidnight) / 86400000);

  // 6 Sept 2026 = Bhadrapada Krishna Dashami (index 9 in tithis)
  let tIdx = (9 + diffDays) % 15;
  if (tIdx < 0) tIdx += 15;

  return {
    varara: days[day],
    tithi:  (diffDays >= 0 && diffDays < 5 ? 'कृष्ण ' : '') + tithis[tIdx],
    masa:   'भाद्रपद',
  };
})();

// ── HERO DAILY HINDU PANCHANG WIDGET ───────────────────
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
  const menu   = document.getElementById('main-nav-drawer') || document.querySelector('.nav__drawer') || document.querySelector('.nav__menu');
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
      
      const filterValue = btn.getAttribute('data-filter') || 'all';
      const items = document.querySelectorAll('[data-category]');
      
      if (!items.length) return;

      items.forEach(item => {
        const catStr = item.getAttribute('data-category') || '';
        const cats = catStr.split(/\s+/);
        if (filterValue === 'all' || cats.includes(filterValue)) {
          item.style.display = '';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });

      document.querySelectorAll('.month-group').forEach(group => {
        const visibleCards = group.querySelectorAll('.festival-card:not([style*="display: none"])');
        if (visibleCards.length === 0 && filterValue !== 'all') {
          group.style.display = 'none';
        } else {
          group.style.display = '';
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
  document.querySelectorAll('[data-newsletter-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input=form.querySelector('input[type="email"]'), btn=form.querySelector('button[type="submit"]'), status=form.querySelector('.bas-form-status');
      if(!input || !btn || !window.BAS_WP) return;
      if(!input.checkValidity()){ input.reportValidity(); return; }
      const original=btn.textContent; btn.disabled=true; btn.textContent='Please wait…'; if(status){status.textContent='';status.className='bas-form-status';}
      try{
        const data=new URLSearchParams({action:'bas_newsletter_subscribe',nonce:BAS_WP.newsletterNonce,email:input.value.trim()});
        throw new Error('Newsletter functionality is currently being upgraded.');},body:data.toString(),credentials:'same-origin'});
        const json=await res.json();
        if(!json.success) throw new Error(json?.data?.message || 'Subscription failed.');
        if(status){status.textContent=json.data.message;status.classList.add('is-success');} input.value='';
      }catch(err){ if(status){status.textContent=err.message || 'Please try again.';status.classList.add('is-error');} }
      finally{btn.disabled=false;btn.textContent=original;}
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

// ── SMOOTH PAGE TRANSITIONS ────────────────────────────
BAS.initPageTransitions = function () {
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    // Only same-origin internal links
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.2s ease';
      setTimeout(() => {
        window.location.href = href;
      }, 200);
    });
  });

  // Fade in on load
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.4s ease';
  });

  document.body.style.opacity = '0';
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

  // Comprehensive list of upcoming Sanatan festivals 2026-2027
  const festivals = [
    { name: 'Sharad Navratri 2026', date: '2026-10-02', deva: 'आश्विन शुक्ल प्रतिपदा', icon: '🌺' },
    { name: 'Dussehra / Vijayadashami 2026', date: '2026-10-11', deva: 'आश्विन शुक्ल दशमी', icon: '🏹' },
    { name: 'Karwa Chauth 2026', date: '2026-10-20', deva: 'कार्तिक कृष्ण चतुर्थी', icon: '🌕' },
    { name: 'Dhanteras & Diwali 2026', date: '2026-11-01', deva: 'कार्तिक अमावस्या', icon: '🪔' },
    { name: 'Chhath Puja 2026', date: '2026-11-05', deva: 'कार्तिक शुक्ल षष्ठी', icon: '☀️' },
    { name: 'Dev Deepawali 2026', date: '2026-11-15', deva: 'कार्तिक शुक्ल पूर्णिमा', icon: '✨' },
    { name: 'Makar Sankranti 2027', date: '2027-01-14', deva: 'सूर्य का मकर संक्रमण', icon: '🪁' },
    { name: 'Vasant Panchami 2027', date: '2027-02-01', deva: 'माघ शुक्ल पंचमी', icon: '📚' },
    { name: 'Maha Shivratri 2027', date: '2027-02-26', deva: 'फाल्गुन कृष्ण त्रयोदशी', icon: '🔱' },
    { name: 'Holi 2027', date: '2027-03-22', deva: 'फाल्गुन शुक्ल पूर्णिमा', icon: '🎨' },
    { name: 'Ram Navami 2027', date: '2027-04-15', deva: 'चैत्र शुक्ल नवमी', icon: '🚩' },
    { name: 'Hanuman Jayanti 2027', date: '2027-04-20', deva: 'चैत्र शुक्ल पूर्णिमा', icon: '🐒' },
    { name: 'Krishna Janmashtami 2027', date: '2027-08-25', deva: 'भाद्रपद कृष्ण अष्टमी', icon: '🦚' },
    { name: 'Ganesh Chaturthi 2027', date: '2027-09-04', deva: 'भाद्रपद शुक्ल चतुर्थी', icon: '🐘' }
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

// ── SEARCH SUGGESTIONS & AUTOCOMPLETE ──────────────────
BAS.initSearchBar = function () {
  const form  = document.getElementById('hero-search-form');
  if (!form) return;

  const input = form.querySelector('input');
  if (!input) return;

  form.setAttribute('action', '/articles');
  form.setAttribute('method', 'GET');
  input.setAttribute('name', 'q');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) {
      window.location.href = '/articles?q=' + encodeURIComponent(q);
    } else {
      window.location.href = '/articles';
    }
  });

  const defaultSuggestions = ['गायत्री मंत्र', 'महामृत्युंजय मंत्र', 'हनुमान चालीसा', 'दुर्गा पूजा विधि', 'एकादशी व्रत', 'नवरात्रि व्रत', 'गीता श्लोक', 'शिव पूजा', 'सोमवार व्रत'];

  const list = document.createElement('ul');
  list.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:rgba(13,0,31,0.98);border:1px solid rgba(245,158,11,0.3);border-radius:16px;margin-top:8px;overflow-y:auto;max-height:360px;list-style:none;padding:8px 0;display:none;z-index:9999;backdrop-filter:blur(20px);box-shadow:0 16px 36px rgba(0,0,0,0.8);';
  form.style.position = 'relative';
  form.appendChild(list);

  function renderList(items) {
    list.innerHTML = '';
    if (!items.length) {
      list.style.display = 'none';
      return;
    }
    items.slice(0, 8).forEach(item => {
      const li = document.createElement('li');
      li.style.cssText = 'padding:10px 20px;cursor:pointer;font-family:var(--font-deva);font-size:0.9rem;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:10px;transition:background 0.15s;border-bottom:1px solid rgba(255,255,255,0.05);';
      
      const titleSpan = document.createElement('span');
      titleSpan.textContent = '📖 ' + (item.title || item);
      li.appendChild(titleSpan);

      if (item.category) {
        const catBadge = document.createElement('span');
        catBadge.textContent = item.category;
        catBadge.style.cssText = 'font-size:0.75rem;background:rgba(245,158,11,0.15);color:var(--clr-gold-light);padding:2px 8px;border-radius:10px;border:1px solid rgba(245,158,11,0.3);';
        li.appendChild(catBadge);
      }

      li.addEventListener('mouseenter', () => li.style.background = 'rgba(245,158,11,0.15)');
      li.addEventListener('mouseleave', () => li.style.background = '');
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (item.url) {
          window.location.href = item.url;
        } else {
          window.location.href = '/articles?q=' + encodeURIComponent(item.title || item);
        }
      });
      list.appendChild(li);
    });
    list.style.display = 'block';
  }

  input.addEventListener('focus', () => {
    if (!input.value.trim()) {
      renderList(defaultSuggestions.map(s => ({ title: s })));
    }
  });

  input.addEventListener('blur', () => setTimeout(() => { list.style.display = 'none'; }, 250));

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      renderList(defaultSuggestions.map(s => ({ title: s })));
      return;
    }

    if (window.SANATAN_ARTICLES && Array.isArray(window.SANATAN_ARTICLES)) {
      const matches = window.SANATAN_ARTICLES.filter(a =>
        a.t.toLowerCase().includes(q) || a.e.toLowerCase().includes(q) || a.c.toLowerCase().includes(q)
      ).map(a => ({ title: a.t, url: a.u, category: a.ch || a.c }));
      renderList(matches);
    } else {
      const matches = defaultSuggestions.filter(s => s.toLowerCase().includes(q)).map(s => ({ title: s }));
      renderList(matches);
    }
  });
};

// ── DEVOTIONAL TOAST HELPER ─────────────────────────────
BAS.showToast = function (msg) {
  const toast = document.getElementById('bas-devotional-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(BAS._toastTimer);
  BAS._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
};

// ── DAILY SHLOKA & WHATSAPP SHARE ──────────────────────
BAS.initDailyShloka = function () {
  const waBtn   = document.getElementById('btn-share-shloka-wa');
  const copyBtn = document.getElementById('btn-copy-shloka-text');
  const japaBtn = document.getElementById('btn-open-japa-from-shloka');

  const sanskritEl = document.getElementById('shloka-sanskrit-text');
  const hindiEl    = document.getElementById('shloka-hindi-meaning');
  const sourceEl   = document.getElementById('shloka-source-label');

  if (waBtn && sanskritEl) {
    const sText = sanskritEl.innerText.replace(/"/g, '').trim();
    const hText = hindiEl ? hindiEl.innerText.replace('दिव्य भावार्थ:', '').trim() : '';
    const src   = sourceEl ? sourceEl.innerText.trim() : 'श्रीमद्भगवद्गीता';

    const shareMsg = `🌸 *आज का अमृत विचार | Bhakti Amrit Sanatan* 🌸\n\n"${sText}"\n\n📖 *भावार्थ:* ${hText}\n— ${src}\n\n🚩 *सम्पूर्ण पंचांग, मंत्र व सनातन ज्ञान पढ़ें:*\nhttps://www.bhaktiamritsanatan.com/\n\n॥ ॐ नमो भगवते वासुदेवाय ॥`;
    waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`;
  }

  if (copyBtn && sanskritEl) {
    copyBtn.addEventListener('click', function () {
      const sText = sanskritEl.innerText.replace(/"/g, '').trim();
      const hText = hindiEl ? hindiEl.innerText.replace('दिव्य भावार्थ:', '').trim() : '';
      const src   = sourceEl ? sourceEl.innerText.trim() : 'श्रीमद्भगवद्गीता';
      const fullText = `"${sText}"\n\nभावार्थ: ${hText}\n— ${src}\nhttps://www.bhaktiamritsanatan.com/`;

      navigator.clipboard.writeText(fullText).then(() => {
        BAS.showToast('अमृत विचार क्लिपबोर्ड पर कॉपी हो गया! 🙏');
      }).catch(() => {
        BAS.showToast('कॉपी करने के लिए टेक्स्ट का चयन करें 🙏');
      });
    });
  }

  if (japaBtn) {
    japaBtn.addEventListener('click', function () {
      if (BAS.openJapaModal) BAS.openJapaModal();
    });
  }
};

// ── VIRTUAL 108 JAPA MALA COUNTER ──────────────────────
BAS.initJapaCounter = function () {
  const overlay     = document.getElementById('japa-modal-overlay');
  const closeBtn    = document.getElementById('japa-modal-close-btn');
  const tapZone     = document.getElementById('japa-tap-zone');
  const beadCountEl = document.getElementById('japa-current-bead');
  const progressSvg = document.getElementById('japa-svg-progress');
  const malasTodayEl= document.getElementById('japa-malas-today');
  const totalChantsEl= document.getElementById('japa-total-chants');
  const celebrateEl = document.getElementById('japa-celebration-banner');
  const resetBtn    = document.getElementById('japa-reset-btn');
  const soundToggle = document.getElementById('japa-sound-toggle');
  const vibToggle   = document.getElementById('japa-vibrate-toggle');
  const mantraSelect= document.getElementById('japa-mantra-dropdown');
  const mantraText  = document.getElementById('japa-active-mantra-display');

  if (!overlay || !tapZone) return;

  const mantras = {
    om_namah_shivaya: 'ॐ नमः शिवाय',
    hare_krishna: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ।\nहरे राम हरे राम राम राम हरे हरे ॥',
    gayatri_mantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
    mahamrityunjaya: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात् ॥',
    shri_ram: 'श्री राम जय राम जय जय राम',
    om_namo_bhagavate: 'ॐ नमो भगवते वासुदेवाय'
  };

  let count = parseInt(localStorage.getItem('bas_japa_bead') || '0', 10);
  let malas = parseInt(localStorage.getItem('bas_japa_malas') || '0', 10);
  let totalChants = parseInt(localStorage.getItem('bas_japa_total') || '0', 10);
  let soundEnabled = localStorage.getItem('bas_japa_sound') !== 'false';
  let vibEnabled = localStorage.getItem('bas_japa_vib') !== 'false';

  const circumference = 540.35; // 2 * Math.PI * 86

  function updateUI() {
    if (beadCountEl) beadCountEl.textContent = count;
    if (malasTodayEl) malasTodayEl.textContent = malas;
    if (totalChantsEl) totalChantsEl.textContent = totalChants;

    if (progressSvg) {
      const offset = circumference - (count / 108) * circumference;
      progressSvg.style.strokeDashoffset = offset;
    }
  }

  function playBellChime() {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!BAS._audioCtx) BAS._audioCtx = new AudioContext();
      if (BAS._audioCtx.state === 'suspended') BAS._audioCtx.resume();

      const now = BAS._audioCtx.currentTime;
      const osc1 = BAS._audioCtx.createOscillator();
      const osc2 = BAS._audioCtx.createOscillator();
      const gain = BAS._audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, now); // 528 Hz peace solfeggio
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1056, now);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(BAS._audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.4);
      osc2.stop(now + 1.4);
    } catch (e) {}
  }

  function playMalaCompletionFanfare() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!BAS._audioCtx) BAS._audioCtx = new AudioContext();
      if (BAS._audioCtx.state === 'suspended') BAS._audioCtx.resume();
      const now = BAS._audioCtx.currentTime;

      [432, 528, 660, 864].forEach((freq, idx) => {
        const osc = BAS._audioCtx.createOscillator();
        const gain = BAS._audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);
        gain.gain.setValueAtTime(0.26, now + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 2.2);
        osc.connect(gain);
        gain.connect(BAS._audioCtx.destination);
        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 2.2);
      });
    } catch (e) {}
  }

  function tapBead() {
    count++;
    totalChants++;

    if (vibEnabled && navigator.vibrate) {
      navigator.vibrate(35);
    }

    if (count >= 108) {
      count = 0;
      malas++;
      if (celebrateEl) {
        celebrateEl.classList.add('active');
        setTimeout(() => celebrateEl.classList.remove('active'), 5000);
      }
      playMalaCompletionFanfare();
      if (vibEnabled && navigator.vibrate) {
        navigator.vibrate([100, 50, 200, 50, 300]);
      }
      BAS.showToast('🎉 १ माला (१०८ जप) पूर्ण हुई! भगवान आपका कल्याण करें 🙏');
    } else {
      playBellChime();
    }

    localStorage.setItem('bas_japa_bead', count.toString());
    localStorage.setItem('bas_japa_malas', malas.toString());
    localStorage.setItem('bas_japa_total', totalChants.toString());
    updateUI();
  }

  tapZone.addEventListener('click', tapBead);

  // Keyboard spacebar support when modal is open
  window.addEventListener('keydown', function (e) {
    if (overlay.classList.contains('active') && (e.code === 'Space' || e.key === ' ')) {
      e.preventDefault();
      tapBead();
    }
  });

  if (mantraSelect && mantraText) {
    mantraSelect.addEventListener('change', function () {
      mantraText.textContent = mantras[this.value] || 'ॐ नमः शिवाय';
      localStorage.setItem('bas_japa_mantra', this.value);
    });
    const savedMantra = localStorage.getItem('bas_japa_mantra');
    if (savedMantra && mantras[savedMantra]) {
      mantraSelect.value = savedMantra;
      mantraText.textContent = mantras[savedMantra];
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      count = 0;
      localStorage.setItem('bas_japa_bead', '0');
      updateUI();
      BAS.showToast('जप माला रीसेट हो गई 🙏');
    });
  }

  if (soundToggle) {
    const sIcon = document.getElementById('japa-sound-icon');
    const sLabel= document.getElementById('japa-sound-label');
    function updateSoundBtn() {
      if (sIcon) sIcon.textContent = soundEnabled ? '🔔' : '🔕';
      if (sLabel) sLabel.textContent = soundEnabled ? 'घंटी On' : 'घंटी Off';
    }
    updateSoundBtn();
    soundToggle.addEventListener('click', function () {
      soundEnabled = !soundEnabled;
      localStorage.setItem('bas_japa_sound', soundEnabled.toString());
      updateSoundBtn();
      BAS.showToast(soundEnabled ? 'ध्वनि चालू की गई 🔔' : 'ध्वनि बंद की गई 🔕');
    });
  }

  if (vibToggle) {
    const vIcon = document.getElementById('japa-vibrate-icon');
    const vLabel= document.getElementById('japa-vibrate-label');
    function updateVibBtn() {
      if (vIcon) vIcon.textContent = vibEnabled ? '📳' : '📵';
      if (vLabel) vLabel.textContent = vibEnabled ? 'कंपन On' : 'कंपन Off';
    }
    updateVibBtn();
    vibToggle.addEventListener('click', function () {
      vibEnabled = !vibEnabled;
      localStorage.setItem('bas_japa_vib', vibEnabled.toString());
      updateVibBtn();
      BAS.showToast(vibEnabled ? 'कंपन (Haptics) चालू 📳' : 'कंपन बंद 📵');
    });
  }

  BAS.openJapaModal = function () {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateUI();
  };

  BAS.closeJapaModal = function () {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', BAS.closeJapaModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) BAS.closeJapaModal();
  });

  // Topbar and mobile triggers
  const topbarJapa = document.getElementById('open-japa-topbar');
  const mobileJapa = document.getElementById('open-japa-mobile');
  if (topbarJapa) topbarJapa.addEventListener('click', BAS.openJapaModal);
  if (mobileJapa) mobileJapa.addEventListener('click', BAS.openJapaModal);

  updateUI();
};

// ── FULL-SITE ARTICLE TRANSLATION (HINDI <-> ENGLISH) ─────
BAS.initLanguageToggle = function () {
  const langButtons = document.querySelectorAll('.bas-lang-opt');
  if (!langButtons.length) return;

  function getCookie(name) {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }

  function setGoogtransCookie(lang) {
    const domain = window.location.hostname;
    const cookieVal = lang === 'en' ? '/hi/en' : '/hi/hi';
    
    // Path / on current domain
    document.cookie = 'googtrans=' + cookieVal + '; path=/; max-age=31536000';
    document.cookie = 'googtrans=' + cookieVal + '; path=/; domain=' + domain + '; max-age=31536000';

    // Set for root domain if applicable (e.g. .bhaktiamritsanatan.com)
    const parts = domain.split('.');
    if (parts.length >= 2) {
      const rootDomain = '.' + parts.slice(-2).join('.');
      document.cookie = 'googtrans=' + cookieVal + '; path=/; domain=' + rootDomain + '; max-age=31536000';
    }
  }

  function clearGoogtransCookie() {
    const domain = window.location.hostname;
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'googtrans=; path=/; domain=' + domain + '; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    const parts = domain.split('.');
    if (parts.length >= 2) {
      const rootDomain = '.' + parts.slice(-2).join('.');
      document.cookie = 'googtrans=; path=/; domain=' + rootDomain + '; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    }
  }

  function updateButtonsUI(lang) {
    langButtons.forEach((btn) => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Shloka card emphasis
    const enMeaning = document.getElementById('shloka-english-meaning');
    const hiMeaning = document.getElementById('shloka-hindi-meaning');
    if (enMeaning && hiMeaning) {
      if (lang === 'en') {
        enMeaning.style.fontSize = '1.05rem';
        enMeaning.style.color = '#fbbf24';
        hiMeaning.style.fontSize = '0.90rem';
        hiMeaning.style.color = '#94a3b8';
      } else {
        hiMeaning.style.fontSize = '0.98rem';
        hiMeaning.style.color = '#e2e8f0';
        enMeaning.style.fontSize = '0.88rem';
        enMeaning.style.color = 'rgba(226, 232, 240, 0.8)';
      }
    }
  }

  function triggerGoogleTranslate(lang) {
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
      return true;
    }
    return false;
  }

  function switchLanguage(targetLang, isInitial) {
    localStorage.setItem('bas_site_lang', targetLang);
    document.documentElement.lang = targetLang;
    updateButtonsUI(targetLang);

    if (targetLang === 'en') {
      setGoogtransCookie('en');
      const triggered = triggerGoogleTranslate('en');
      if (!triggered && !isInitial) {
        // If Google Translate combo is still initialising, retry after a short delay
        setTimeout(() => {
          if (!triggerGoogleTranslate('en')) {
            window.location.reload();
          }
        }, 600);
      }
      if (!isInitial && BAS.showToast) {
        BAS.showToast('Articles translating to English... 🌐');
      }
    } else {
      setGoogtransCookie('hi');
      clearGoogtransCookie();
      const triggered = triggerGoogleTranslate('hi');
      if (!triggered && !isInitial) {
        setTimeout(() => {
          if (!triggerGoogleTranslate('hi')) {
            window.location.reload();
          }
        }, 600);
      }
      if (!isInitial && BAS.showToast) {
        BAS.showToast('लेख मूल हिंदी में लोड हुए 🇮🇳');
      }
    }
  }

  // Click listeners on all language buttons
  langButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const targetLang = this.dataset.lang;
      switchLanguage(targetLang, false);
    });
  });

  // Initial language check
  let initialLang = localStorage.getItem('bas_site_lang');
  const googCookie = getCookie('googtrans');
  if (googCookie && googCookie.includes('/en')) {
    initialLang = 'en';
  } else if (!initialLang) {
    initialLang = 'hi';
  }

  updateButtonsUI(initialLang);

  if (initialLang === 'en') {
    setGoogtransCookie('en');
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (triggerGoogleTranslate('en') || attempts > 20) {
        clearInterval(interval);
      }
    }, 250);
  }
};

// ── PROGRESSIVE WEB APP (PWA) ───────────────────────────
BAS.initPWA = function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  let deferredPrompt = null;
  const pwaInstallBtn = document.getElementById('btn-pwa-install-action');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaInstallBtn) {
      pwaInstallBtn.style.display = 'inline-block';
    }
  });

  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          BAS.showToast('Bhakti Amrit App सफलतापूर्वक इंस्टॉल हो गया! 🙏');
        }
        deferredPrompt = null;
      } else {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
          BAS.showToast("iPhone पर: नीचे Share बटन [⎋] दबाएं, फिर 'Add to Home Screen' चुनें 🙏");
        } else {
          BAS.showToast("ब्राउज़र मेनू (⋮) खोलें और 'Add to Home screen' चुनें 🙏");
        }
      }
    });
  }
};

// ── DAILY RASHIFAL (12 RASHIS HOROSCOPE & UPAY) ───────────
BAS.initRashifal = function () {
  const rashiTrack = document.getElementById('rashi-selector-track');
  const heroIcon   = document.getElementById('rashifal-hero-icon');
  const heroTitle  = document.getElementById('rashifal-hero-title');
  const heroMeta   = document.getElementById('rashifal-hero-meta');
  const heroPred   = document.getElementById('rashifal-hero-prediction');
  const heroColor  = document.getElementById('rashifal-hero-color');
  const heroNum    = document.getElementById('rashifal-hero-number');
  const heroUpay   = document.getElementById('rashifal-hero-upay');
  const shareBtn   = document.getElementById('btn-share-rashi-wa');
  const saveBtn    = document.getElementById('btn-save-my-rashi');
  const saveLabel  = document.getElementById('save-rashi-btn-label');

  if (!rashiTrack || !heroTitle) return;

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

    // Update buttons
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

    // Update card
    heroIcon.textContent = data.icon;
    heroTitle.textContent = data.name;
    heroMeta.textContent = `स्वामी ग्रह: ${data.lord} · तत्व: ${data.element}`;
    heroPred.textContent = data.prediction;
    heroColor.textContent = data.color;
    heroNum.textContent = data.number;
    heroUpay.textContent = data.upay;

    // Update save button label
    const savedRashi = localStorage.getItem('bas_my_rashi');
    if (savedRashi !== null && parseInt(savedRashi, 10) === idx) {
      if (saveLabel) saveLabel.textContent = 'मेरी पसंदीदा राशि ✓';
      if (saveBtn) saveBtn.style.background = 'linear-gradient(135deg,#f59e0b,#ea580c)';
      if (saveBtn) saveBtn.style.color = '#ffffff';
    } else {
      if (saveLabel) saveLabel.textContent = 'मेरी राशि सेट करें';
      if (saveBtn) saveBtn.style.background = 'rgba(245,158,11,0.15)';
      if (saveBtn) saveBtn.style.color = '#fbbf24';
    }

    // Update WhatsApp share url
    if (shareBtn) {
      const shareText = `✨ *दैनिक राशिफल — ${data.name}* ✨\n\n🔮 *आज का फलकथन:*\n${data.prediction}\n\n🎨 *शुभ रंग:* ${data.color}\n🔢 *शुभ अंक:* ${data.number}\n🪔 *दैनिक उपाय:* ${data.upay}\n\n🕉️ अपना दैनिक पंचांग व राशिफल पढ़ें: ${window.location.origin}/#daily-rashifal-section`;
      shareBtn.href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText);
    }
  }

  // Click listeners on rashi buttons
  const buttons = rashiTrack.querySelectorAll('.rashi-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const idx = parseInt(this.dataset.rashi, 10);
      renderRashi(idx, true);
    });
  });

  // Save as my rashi button
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      localStorage.setItem('bas_my_rashi', currentRashiIdx);
      renderRashi(currentRashiIdx, false);
      if (BAS.showToast) {
        BAS.showToast(`⭐ ${rashisData[currentRashiIdx].name} को आपकी स्थायी राशि सेट किया गया!`);
      }
    });
  }

  renderRashi(currentRashiIdx, false);
};

// ── MERI PUJA DIARY (BOOKMARKS & RESOLUTION) ──────────────
BAS.initPujaDiary = function () {
  const overlay        = document.getElementById('puja-diary-overlay');
  const closeBtn       = document.getElementById('close-puja-diary-btn');
  const openTopbarBtn  = document.getElementById('open-diary-topbar');
  const openMobileBtn  = document.getElementById('open-diary-mobile');
  const badgeTopbar    = document.getElementById('diary-badge-topbar');
  const badgeMobile    = document.getElementById('diary-badge-mobile');
  const modalCount     = document.getElementById('diary-modal-count');
  const listContainer  = document.getElementById('diary-items-container');
  const clearBtn       = document.getElementById('btn-clear-diary');
  const sankalpInput   = document.getElementById('diary-sankalp-text');
  const sankalpSavedMsg = document.getElementById('diary-sankalp-saved-msg');

  function getDiary() {
    try {
      return JSON.parse(localStorage.getItem('bas_puja_diary') || '[]');
    } catch {
      return [];
    }
  }

  function setDiary(items) {
    localStorage.setItem('bas_puja_diary', JSON.stringify(items));
    updateDiaryUI();
  }

  function updateDiaryUI() {
    const items = getDiary();
    const count = items.length;

    if (badgeTopbar) badgeTopbar.textContent = count;
    if (badgeMobile) badgeMobile.textContent = count;
    if (modalCount) modalCount.textContent = count;

    // Update bookmark buttons across the page
    const bookmarkBtns = document.querySelectorAll('.btn-diary-bookmark');
    bookmarkBtns.forEach((btn) => {
      const id = btn.dataset.id;
      const isSaved = items.some(item => item.id === id);
      const textSpan = btn.querySelector('.bookmark-text');
      if (isSaved) {
        btn.classList.add('saved');
        if (textSpan) textSpan.textContent = 'सेव्ड ✓';
      } else {
        btn.classList.remove('saved');
        if (textSpan) textSpan.textContent = 'सेव करें';
      }
    });

    // Render modal items
    if (listContainer) {
      if (items.length === 0) {
        listContainer.innerHTML = `
          <div class="diary-empty-msg">
            <div style="font-size:2rem;margin-bottom:8px;">📿</div>
            <p>आपकी डायरी अभी खाली है।</p>
            <small style="color:var(--clr-gold);">आरती, चालीसा और पूजा विधि के कार्ड पर '⭐ सेव करें' दबाकर अपनी दैनिक प्रार्थनाएं जोड़ें।</small>
          </div>
        `;
      } else {
        listContainer.innerHTML = items.map((item, idx) => `
          <div class="diary-item-card">
            <div class="diary-item__left">
              <span class="diary-item__badge">${item.type || 'पाठ'}</span>
              <a href="${item.url || '#'}" class="diary-item__title">${item.title}</a>
            </div>
            <div class="diary-item__actions">
              <a href="${item.url || '#'}" class="btn-read-diary-item">📖 पढ़ें</a>
              <button type="button" class="btn-remove-diary-item" data-index="${idx}" title="हटाएं">✕</button>
            </div>
          </div>
        `).join('');

        const removeBtns = listContainer.querySelectorAll('.btn-remove-diary-item');
        removeBtns.forEach((btn) => {
          btn.addEventListener('click', function () {
            const index = parseInt(this.dataset.index, 10);
            const current = getDiary();
            const removed = current.splice(index, 1);
            setDiary(current);
            if (BAS.showToast && removed.length) {
              BAS.showToast(`'${removed[0].title}' डायरी से हटा दिया गया`);
            }
          });
        });
      }
    }
  }

  function openDiary() {
    if (overlay) overlay.classList.add('open');
  }

  function closeDiary() {
    if (overlay) overlay.classList.remove('open');
  }

  if (openTopbarBtn) openTopbarBtn.addEventListener('click', openDiary);
  if (openMobileBtn) openMobileBtn.addEventListener('click', openDiary);
  if (closeBtn) closeBtn.addEventListener('click', closeDiary);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDiary();
    });
  }

  // Clear all button
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (confirm('क्या आप अपनी पूजा डायरी के सभी सहेजे गए पाठ हटाना चाहते हैं?')) {
        setDiary([]);
        if (BAS.showToast) BAS.showToast('डायरी खाली कर दी गई');
      }
    });
  }

  // Bookmark buttons click listener
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-diary-bookmark');
    if (!btn) return;

    e.preventDefault();
    const id    = btn.dataset.id || ('item-' + Date.now());
    const title = btn.dataset.title || 'पूजा पाठ';
    const url   = btn.dataset.url || window.location.href;
    const type  = btn.dataset.type || 'पाठ';

    const items = getDiary();
    const existingIdx = items.findIndex(item => item.id === id);

    if (existingIdx >= 0) {
      items.splice(existingIdx, 1);
      setDiary(items);
      if (BAS.showToast) BAS.showToast(`'${title}' डायरी से हटाया गया`);
    } else {
      items.push({ id, title, url, type, savedAt: new Date().toISOString() });
      setDiary(items);
      if (BAS.showToast) BAS.showToast(`⭐ '${title}' आपकी पूजा डायरी में जुड़ गया!`);
    }
  });

  // Daily Sankalp Note Persistence
  if (sankalpInput) {
    sankalpInput.value = localStorage.getItem('bas_daily_sankalp') || '';
    sankalpInput.addEventListener('input', function () {
      localStorage.setItem('bas_daily_sankalp', this.value);
      if (sankalpSavedMsg) {
        sankalpSavedMsg.textContent = '✓ स्वतः सुरक्षित';
      }
    });
  }

  updateDiaryUI();
};

// ── PUJA VIDHI FAQ ACCORDION ──────────────────────────────
BAS.initFAQAccordion = function () {
  const faqAccordion = document.getElementById('puja-faq-accordion');
  if (!faqAccordion) return;

  const questions = faqAccordion.querySelectorAll('.faq-question');
  questions.forEach((q) => {
    q.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      if (!item) return;

      const isOpen = item.classList.contains('active');
      faqAccordion.querySelectorAll('.faq-item').forEach((it) => {
        if (it !== item) {
          it.classList.remove('active');
          const otherQ = it.querySelector('.faq-question');
          if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        this.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });
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
  BAS.initHeroPanchang();
  BAS.initRotatingQuotes();
  BAS.initSearchBar();
  BAS.initWhatsAppShare();
  BAS.initDailyShloka();
  BAS.initJapaCounter();
  BAS.initLanguageToggle();
  BAS.initPWA();
  BAS.initRashifal();
  BAS.initPujaDiary();
  BAS.initFAQAccordion();
};

// DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', BAS.init);
} else {
  BAS.init();
}



// ── STATIC VRAT CALENDAR ──────────────────────────────────────
BAS.vratFestivals = [
  { date: '2026-10-02', name: 'Sharad Navratri', deva: 'आश्विन शुक्ल प्रतिपदा', icon: '🌺', desc: 'माँ दुर्गा के ९ पावन स्वरूपों की आराधना' },
  { date: '2026-10-20', name: 'Karwa Chauth', deva: 'कार्तिक कृष्ण चतुर्थी', icon: '🌙', desc: 'अखंड सौभाग्य की प्राप्ति' },
  { date: '2026-11-08', name: 'Diwali', deva: 'कार्तिक अमावस्या', icon: '🪔', desc: 'प्रकाश पर्व और महालक्ष्मी पूजन' },
  { date: '2026-11-23', name: 'Tulsi Vivah', deva: 'कार्तिक शुक्ल एकादशी', icon: '🌿', desc: 'तुलसी और शालिग्राम का पावन विवाह' }
];

BAS.initHeroFestival = function() {
  const nameEl = document.getElementById('festival-name');
  const dateEl = document.getElementById('festival-date');
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!nameEl || !dateEl) return;

  const now = new Date();
  let nextFest = BAS.vratFestivals.find(f => new Date(f.date) > now);
  if (!nextFest) nextFest = BAS.vratFestivals[0]; // fallback

  nameEl.innerHTML = nextFest.icon + ' ' + nextFest.name;
  dateEl.innerHTML = nextFest.deva + ' · ' + new Date(nextFest.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const targetDate = new Date(nextFest.date).getTime();

  function updateTimer() {
    const nowMs = new Date().getTime();
    const distance = targetDate - nowMs;

    if (distance < 0) return;

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = d.toString().padStart(2, '0');
    if (hoursEl) hoursEl.innerText = h.toString().padStart(2, '0');
    if (minsEl) minsEl.innerText = m.toString().padStart(2, '0');
    if (secsEl) secsEl.innerText = s.toString().padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if(typeof BAS.initHeroFestival === 'function') BAS.initHeroFestival();
    }, 100);
});
