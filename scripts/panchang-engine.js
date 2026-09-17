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
    let muhuratsRaw = {};

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

      const toMs = (m) => utcMidnight.getTime() + Math.round(m * 60000);

      // Muhurats Raw Timestamps for Realtime Active Detection
      muhuratsRaw = {
        rahuKaal: { startMs: toMs(rahuStartMin), endMs: toMs(rahuEndMin), isAshubh: true, name: 'राहुकाल' },
        abhijit: localWeekdayNum === 3 ? null : { startMs: toMs(solar.sunriseUtcMin + 7 * (daylight / 15.0)), endMs: toMs(solar.sunriseUtcMin + 8 * (daylight / 15.0)), isAshubh: false, name: 'अभिजीत मुहूर्त' },
        brahma: { startMs: toMs(bStart), endMs: toMs(bEnd), isAshubh: false, name: 'ब्रह्म मुहूर्त' },
        vijaya: { startMs: toMs(vStart), endMs: toMs(vEnd), isAshubh: false, name: 'विजय मुहूर्त' },
        godhuli: { startMs: toMs(gStart), endMs: toMs(gEnd), isAshubh: false, name: 'गोधूलि मुहूर्त' },
        amritKaal: { startMs: toMs(aStart), endMs: toMs(aEnd), isAshubh: false, name: 'अमृत काल' },
        yamaganda: { startMs: toMs(yStart), endMs: toMs(yEnd), isAshubh: true, name: 'यमगण्ड' },
        gulika: { startMs: toMs(guStart), endMs: toMs(guEnd), isAshubh: false, name: 'गुलिक काल' },
        durmuhurat: { startMs: toMs(durStart), endMs: toMs(durEnd), isAshubh: true, name: 'दुर्मुहूर्त' }
      };

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
          startMs: toMs(sMin),
          endMs: toMs(eMin),
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
          startMs: toMs(sMin),
          endMs: toMs(eMin),
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
      muhuratsRaw,
      isDaytime: !solar.isPolar && solar.sunriseUtcMin !== null && solar.sunsetUtcMin !== null
        ? (now.getTime() >= (utcMidnight.getTime() + Math.round(solar.sunriseUtcMin * 60000)) && now.getTime() < (utcMidnight.getTime() + Math.round(solar.sunsetUtcMin * 60000)))
        : true,
      sunriseMs: !solar.isPolar && solar.sunriseUtcMin !== null ? (utcMidnight.getTime() + Math.round(solar.sunriseUtcMin * 60000)) : null,
      sunsetMs: !solar.isPolar && solar.sunsetUtcMin !== null ? (utcMidnight.getTime() + Math.round(solar.sunsetUtcMin * 60000)) : null,
      tithiEndMs: tithiEndDate ? tithiEndDate.getTime() : null,
      nakshatraEndMs: nakshatraEndDate ? nakshatraEndDate.getTime() : null,
      yogaEndMs: yogaEndDate ? yogaEndDate.getTime() : null,
      choghadiya: {
        day: dayChoghadiya,
        night: nightChoghadiya
      }
    };
  };

  return Astro;
});
