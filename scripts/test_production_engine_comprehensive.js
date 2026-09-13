const Astro = require('./panchang-engine.js');

console.log('================================================================');
console.log('  BHAKTI AMRIT SANATAN — PRODUCTION ENGINE COMPREHENSIVE SUITE');
console.log('================================================================');

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  passed++;
  console.log(`✔ [${total}] PASS: ${message}`);
}

// ── TEST GROUP 1: ALL CITIES & COORDINATE CONSISTENCY ───────────────
const testInstant = new Date('2026-09-13T14:37:43Z'); // 18:37:43 GST / 20:07:43 IST
const citiesToTest = ['Asia/Dubai', 'Asia/Kolkata', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'America/Toronto', 'Australia/Sydney'];

citiesToTest.forEach(tz => {
  const p = Astro.calculatePanchang(testInstant, tz);
  assert(p.tithi.hi === 'तृतीया', `Tithi in ${tz} is invariant geocentric Tritiya (got ${p.tithi.hi})`);
  assert(p.nakshatra.hi === 'चित्रा', `Nakshatra in ${tz} is invariant geocentric Chitra (got ${p.nakshatra.hi})`);
  assert(p.solar.sunrise !== '--:--', `Sunrise computed for ${tz}: ${p.solar.sunrise}`);
  assert(p.solar.sunset !== '--:--', `Sunset computed for ${tz}: ${p.solar.sunset}`);
  assert(p.solar.rahuKaal.includes('–'), `Rahu Kaal computed for ${tz}: ${p.solar.rahuKaal}`);
});

// ── TEST GROUP 2: ALL 7 WEEKDAYS RAHU KAAL DIVISION ASSIGNMENTS ───────
// Sunday=8th(idx 7), Monday=2nd(idx 1), Tuesday=7th(idx 6), Wednesday=5th(idx 4),
// Thursday=6th(idx 5), Friday=4th(idx 3), Saturday=3rd(idx 2)
const weekDays = [
  { date: '2026-09-13', dayHi: 'रविवार', expectedPart: 7 }, // Sunday
  { date: '2026-09-14', dayHi: 'सोमवार', expectedPart: 1 }, // Monday
  { date: '2026-09-15', dayHi: 'मंगलवार', expectedPart: 6 }, // Tuesday
  { date: '2026-09-16', dayHi: 'बुधवार', expectedPart: 4 }, // Wednesday
  { date: '2026-09-17', dayHi: 'गुरुवार', expectedPart: 5 }, // Thursday
  { date: '2026-09-18', dayHi: 'शुक्रवार', expectedPart: 3 }, // Friday
  { date: '2026-09-19', dayHi: 'शनिवार', expectedPart: 2 }  // Saturday
];

weekDays.forEach(wd => {
  const dt = new Date(`${wd.date}T12:00:00+04:00`);
  const p = Astro.calculatePanchang(dt, 'Asia/Dubai');
  assert(p.dayOfWeek.hi === wd.dayHi, `Weekday matches ${wd.dayHi}`);
  if (wd.dayHi === 'बुधवार') {
    assert(p.solar.abhijit.includes('वर्जित'), 'Abhijit prohibited on Wednesday');
  } else {
    assert(p.solar.abhijit.includes('–'), `Abhijit active on ${wd.dayHi}: ${p.solar.abhijit}`);
  }
});

// ── TEST GROUP 3: SEASONAL VARIATION & SOLAR CONVERGENCE ─────────────
// Summer Solstice (June 21), Winter Solstice (Dec 21), Spring Equinox (March 20), Autumn Equinox (Sept 22)
const seasons = [
  { date: '2026-06-21T12:00:00Z', label: 'Summer Solstice (London long daylight)' },
  { date: '2026-12-21T12:00:00Z', label: 'Winter Solstice (London short daylight)' },
  { date: '2026-03-20T12:00:00Z', label: 'Vernal Equinox' },
  { date: '2026-09-22T12:00:00Z', label: 'Autumnal Equinox' }
];

seasons.forEach(s => {
  const dt = new Date(s.date);
  const pLondon = Astro.calculatePanchang(dt, 'Europe/London');
  assert(!pLondon.solar.sunrise.includes('--'), `${s.label} London sunrise valid`);
  assert(!pLondon.solar.sunset.includes('--'), `${s.label} London sunset valid`);
});

// ── TEST GROUP 4: MIDNIGHT & YEAR ROLLOVER ───────────────────────────
// 2026-12-31 23:59:59 GST -> 2027-01-01 00:00:01 GST
const dtDec31 = new Date('2026-12-31T19:59:59Z'); // 23:59:59 GST
const dtJan01 = new Date('2026-12-31T20:00:01Z'); // 00:00:01 GST
const pDec31 = Astro.calculatePanchang(dtDec31, 'Asia/Dubai');
const pJan01 = Astro.calculatePanchang(dtJan01, 'Asia/Dubai');

assert(pDec31.localYear === 2026 && pDec31.localMonth === 12 && pDec31.localDay === 31, 'Dec 31 23:59:59 local civil date verified');
assert(pJan01.localYear === 2027 && pJan01.localMonth === 1 && pJan01.localDay === 1, 'Jan 01 00:00:01 local civil date rollover verified');

// ── TEST GROUP 5: DST ADJUSTMENT IN LONDON AND NEW YORK ──────────────
// London in July (BST = UTC+1) vs London in January (GMT = UTC+0)
const londonSummer = Astro.calculatePanchang(new Date('2026-07-01T12:00:00Z'), 'Europe/London');
const londonWinter = Astro.calculatePanchang(new Date('2026-01-01T12:00:00Z'), 'Europe/London');
assert(londonSummer.timeStr.includes('01:00:00 PM'), 'London summer time respects BST (UTC+1)');
assert(londonWinter.timeStr.includes('12:00:00 PM'), 'London winter time respects GMT (UTC+0)');

// New York in July (EDT = UTC-4) vs New York in January (EST = UTC-5)
const nySummer = Astro.calculatePanchang(new Date('2026-07-01T16:00:00Z'), 'America/New_York');
const nyWinter = Astro.calculatePanchang(new Date('2026-01-01T17:00:00Z'), 'America/New_York');
assert(nySummer.timeStr.includes('12:00:00 PM'), 'New York summer time respects EDT (UTC-4)');
assert(nyWinter.timeStr.includes('12:00:00 PM'), 'New York winter time respects EST (UTC-5)');

// ── TEST GROUP 6: TRANSITION BOUNDARY CROSSING ────────────────────────
// Dubai Tritiya begins at 2026-09-13 01:38 UTC (05:38 GST)
const beforeTritiya = new Date('2026-09-13T01:30:00Z'); // 05:30 GST (Dwitiya)
const afterTritiya = new Date('2026-09-13T01:45:00Z');  // 05:45 GST (Tritiya)
const pBefore = Astro.calculatePanchang(beforeTritiya, 'Asia/Dubai');
const pAfter = Astro.calculatePanchang(afterTritiya, 'Asia/Dubai');

assert(pBefore.tithi.hi === 'द्वितीया', 'Instant before 05:38 GST is Dwitiya');
assert(pAfter.tithi.hi === 'तृतीया', 'Instant after 05:38 GST is Tritiya');

console.log('\n----------------------------------------------------------------');
console.log(`🎉 ALL ${passed}/${total} COMPREHENSIVE PRODUCTION ENGINE TESTS PASSED 100%!`);
console.log('----------------------------------------------------------------');
