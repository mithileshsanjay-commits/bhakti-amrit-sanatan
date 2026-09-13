const Astro = require('./panchang-engine.js');

console.log('====================================================');
console.log('  TESTING ECLIPSE STATES & LOGIC');
console.log('====================================================');

function resolveGrahan(now, tz) {
  const city = Astro.CITIES[tz] || Astro.CITIES['Asia/Kolkata'];
  const cityName = city.name_hi;

  let activeGrahan = null;
  let isToday = false;

  for (let i = 0; i < Astro.GRAHAN_DATABASE.length; i++) {
    const g = Astro.GRAHAN_DATABASE[i];
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

  // Find next global upcoming eclipse
  let nextGlobal = null;
  for (let i = 0; i < Astro.GRAHAN_DATABASE.length; i++) {
    const g = Astro.GRAHAN_DATABASE[i];
    if (new Date(g.utc_end).getTime() > now.getTime()) {
      nextGlobal = g;
      break;
    }
  }

  // Find next locally visible eclipse
  let nextLocalVisible = null;
  for (let i = 0; i < Astro.GRAHAN_DATABASE.length; i++) {
    const g = Astro.GRAHAN_DATABASE[i];
    if (new Date(g.utc_end).getTime() > now.getTime() && g.visibility[tz] && g.visibility[tz].visible) {
      nextLocalVisible = g;
      break;
    }
  }

  return { activeGrahan, isToday, nextGlobal, nextLocalVisible, cityName };
}

// Scenario 1: Dubai on 2026-09-13
const d1 = new Date('2026-09-13T18:37:43+04:00');
const s1 = resolveGrahan(d1, 'Asia/Dubai');
console.log('\nScenario 1: Dubai on 2026-09-13');
console.log('  Active Today:', s1.isToday);
console.log('  Next Global:', s1.nextGlobal ? `${s1.nextGlobal.name_hi} (${s1.nextGlobal.utc_start.slice(0, 10)})` : 'None');
const vis1 = s1.nextGlobal.visibility['Asia/Dubai'].visible ? 'दृश्य' : 'अदृश्य';
console.log(`  Dubai Visibility of Next Global: [${s1.cityName}: ${vis1}]`);
console.log('  Next Locally Visible in Dubai:', s1.nextLocalVisible ? `${s1.nextLocalVisible.name_hi} (${s1.nextLocalVisible.utc_start.slice(0, 10)})` : 'None');

if (s1.isToday !== false) throw new Error('Expected no eclipse on 2026-09-13');
if (vis1 !== 'अदृश्य') throw new Error('Dubai should be invisible for 2027-02-06 solar eclipse');
if (!s1.nextLocalVisible || !s1.nextLocalVisible.id.startsWith('lunar-eclipse-2027-02')) {
  throw new Error('Next locally visible eclipse in Dubai should be lunar-eclipse-2027-02');
}
console.log('✔ Scenario 1 PASSED!');

// Scenario 2: Dubai on 2027-02-06 (Global eclipse active, but invisible in Dubai)
const d2 = new Date('2027-02-06T15:00:00Z');
const s2 = resolveGrahan(d2, 'Asia/Dubai');
console.log('\nScenario 2: Dubai on 2027-02-06 (Solar eclipse active globally, invisible in Dubai)');
console.log('  Active Today:', s2.isToday);
console.log('  Active Grahan:', s2.activeGrahan.name_hi);
const vis2 = s2.activeGrahan.visibility['Asia/Dubai'].visible;
console.log('  Visible in Dubai:', vis2);
if (vis2 !== false) throw new Error('2027-02-06 should be invisible in Dubai');
console.log('✔ Scenario 2 PASSED!');

// Scenario 3: Dubai on 2027-02-21 (Penumbral lunar eclipse visible in Dubai)
const d3 = new Date('2027-02-20T23:00:00Z'); // 03:00 AM GST on Feb 21
const s3 = resolveGrahan(d3, 'Asia/Dubai');
console.log('\nScenario 3: Dubai on 2027-02-21 (Penumbral eclipse active & visible in Dubai)');
console.log('  Active Today:', s3.isToday);
console.log('  Active Grahan:', s3.activeGrahan.name_hi);
const vis3 = s3.activeGrahan.visibility['Asia/Dubai'].visible;
console.log('  Visible in Dubai:', vis3);
if (vis3 !== true) throw new Error('2027-02-20/21 should be visible in Dubai');
console.log('✔ Scenario 3 PASSED!');

console.log('\n🎉 ALL ECLIPSE RESOLUTION SCENARIOS PASSED!');
