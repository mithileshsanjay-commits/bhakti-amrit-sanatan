# Bhakti Amrit Sanatan — Panchang & Festival Methodology

## 1. Overview & Purpose
Bhakti Amrit Sanatan provides daily Hindu Panchang indicators and an automated festival countdown engine designed for spiritual seekers and devotees worldwide. Because Sanatan Dharma rituals and observances depend on lunar days (*tithis*), solar transits (*sankrantis*), and planetary divisions (*muhurtas*), this document details the mathematical models, astronomical references, assumptions, and limitations governing our implementation.

---

## 2. Panchang Calculations & Astrological Sources

### A. Core Limbs of Panchanga (पञ्चाङ्ग)
1. **Vara (वार — Day of the Week)**:
   - Determined from local civil midnight in the user's selected reference timezone.
   - Sunday to Saturday mapped directly to the traditional Vedic planetary rulers (रवि, सोम, मंगल, बुध, गुरु, शुक्र, शनि).

2. **Tithi (तिथि — Lunar Day)**:
   - A tithi represents a 12° increase in the longitudinal angular separation between the Moon and Sun ($360^\circ / 30 = 12^\circ$).
   - A synodic lunar month averages approximately $29.530588$ days, meaning individual tithis vary in duration between 19 and 26 hours due to lunar orbital eccentricity and planetary perturbations.
   - *Implementation*: Uses canonical Drik Siddhanta reference anchors aligned with Udaya Tithi (sunrise-prevailing tithi in New Delhi, IST) across the Shukla and Krishna Pakshas.

3. **Paksha (पक्ष — Lunar Fortnight)**:
   - **Shukla Paksha (शुक्ल पक्ष)**: Waxing moon (from Pratipada after Amavasya to Purnima).
   - **Krishna Paksha (कृष्ण पक्ष)**: Waning moon (from Pratipada after Purnima to Amavasya).

4. **Nakshatra (नक्षत्र — Lunar Constellation)**:
   - The ecliptic is divided into 27 lunar mansions of $13^\circ 20'$ each ($360^\circ / 27$).
   - Indexed from Ashwini (0) to Revati (26).

5. **Auspicious & Inauspicious Muhurtas**:
   - **Rahu Kaal (राहुकाल)**: Calculated according to the classical 8-part division of daytime between mean sunrise and sunset (approx. 90 minutes), governed by planetary lordships:
     - Sunday: 8th period (~04:30 PM – 06:00 PM)
     - Monday: 2nd period (~07:30 AM – 09:00 AM)
     - Tuesday: 7th period (~03:00 PM – 04:30 PM)
     - Wednesday: 5th period (~12:00 PM – 01:30 PM)
     - Thursday: 6th period (~01:30 PM – 03:00 PM)
     - Friday: 4th period (~10:30 AM – 12:00 PM)
     - Saturday: 3rd period (~09:00 AM – 10:30 AM)
   - **Abhijit Muhurat (अभिजीत मुहूर्त)**: The 8th muhurta of daytime (spanning 24 minutes before to 24 minutes after local solar noon, approx. 11:45 AM – 12:35 PM IST). It is considered universally auspicious for all satvik undertakings except on Wednesdays.

---

## 3. Location, Timezone & Reference Assumptions

1. **Default Reference Location**:
   - **City**: New Delhi, India
   - **Coordinates**: 28.6139° N, 77.2090° E
   - **Timezone**: Indian Standard Time (IST, UTC+5:30)
   - **Rationale**: Indian festivals, Udaya Tithi determinations, and Vedic astrological consensus in classical literature (such as *Nirnaya Sindhu* and *Dharma Sindhu*) use standard Indian longitude.

2. **Multi-Timezone Support**:
   - The client widget offers a reference selector covering major diaspora hubs:
     - New Delhi (IST, UTC+5:30)
     - Dubai (GST, UTC+4:00)
     - London (GMT/BST, UTC+0/+1)
     - New York (EST/EDT, UTC-5/-4)
     - Los Angeles (PST/PDT, UTC-8/-7)
     - Toronto (EST/EDT, UTC-5/-4)
     - Sydney (AEST/AEDT, UTC+10/+11)
   - When a city is selected, civil time, current date, and day of week immediately adjust to the selected local timezone.
   - The UI clearly states that astrological muhurtas are calculated relative to IST / New Delhi coordinates.

---

## 4. Festival Dataset & Engine Architecture

### A. Authoritative Source Consensus
Festival Gregorian dates are verified against established traditional authorities:
- *Nirnaya Sindhu* (निर्णय सिन्धु)
- *Dharma Sindhu* (धर्म सिन्धु)
- *Surya Siddhanta* (सूर्य सिद्धान्त)
- Consensus panchang schedules for 2026–2027

### B. Structured Record Schema
Every festival record contains:
- `id`: Canonical kebab-case identifier (e.g., `ganesh-chaturthi-2026`)
- `name_hi`: Sacred Hindi title with deity attribution
- `name_en`: English transliterated title
- `date`: ISO 8601 Gregorian date string (`YYYY-MM-DD`)
- `tithi_deva`: Scriptural tithi name and lunar month
- `icon`: Authentic cultural emoji icon
- `regional_applicability`: Geographic context (e.g., Pan-India, North India, Eastern India)
- `source`: Scriptural / traditional authority reference

### C. Automatic Progression & Rollover Logic
1. **Pre-Festival State**:
   - If `current_date < festival.date`: The countdown displays remaining Days, Hours, Minutes, and Seconds until local midnight of the festival date.
2. **Festival Day State**:
   - If `current_date === festival.date`:
     - Banner status changes to: `🎉 आज पावन पर्व है! (Celebrated Today!)`.
     - Displays the sacred tithi and observance message.
     - Never shows an expired `00 Days 00 Hours 00 Mins` banner labeled as "Upcoming".
3. **Post-Festival Rollover**:
   - As soon as `current_date > festival.date` (at 00:00:00 local midnight of the subsequent day), the engine automatically filters out the concluded festival and locks onto the next chronological future festival.
   - Completed festivals are strictly barred from the upcoming display.
4. **Year-End Transition (Dec 31 → Jan 1)**:
   - Uses ISO 8601 lexicographical date comparison (`2026-12-20` < `2027-01-14`), ensuring smooth, deterministic rollover across calendar years.

---

## 5. Known Limitations & Disclaimers
1. **Udaya Tithi Variations**: In certain boundary cases where a tithi begins shortly before sunrise or ends during midday, regional traditions may observe a festival on different days (e.g., Smartha vs. Vaishnava Ekadashi, or North vs. South Indian Sankranti observances). Our dataset specifies regional applicability where variations exist.
2. **Ephemeris Precision**: The client-side static engine provides high-accuracy reference data. For precise personal ritual timings (such as exact Vivah Muhurat or Graha Shanti), consulting a local priest (*Purohit*) with an astronomical ephemeris for exact geographic coordinates is recommended.
