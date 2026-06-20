import { calculateAstrology } from '../src/lib/astrology';
import { calculateCompatibility } from '../src/lib/compatibility';

const k2 = { name: "kamini", dob: "1995-01-14", tob: "16:23", lat: 31.2154716, lon: 76.1426888 };
const r2 = { name: "Rahul", dob: "1993-11-02", tob: "07:48", lat: 31.3837484, lon: 76.3754353 };

const a1 = calculateAstrology(k2.dob, k2.tob, k2.lat, k2.lon);
const a2 = calculateAstrology(r2.dob, r2.tob, r2.lat, r2.lon);

console.log('K2:', a1.panchang.nakshatra, a1.panchang.moonSign);
console.log('R2:', a2.panchang.nakshatra, a2.panchang.moonSign);

const res = calculateCompatibility(
    { name: k2.name, nakshatraIdx: a1.panchang.nakshatraIdx, moonSignIdx: a1.panchang.moonSignIdx, isMoonManglik: a1.panchang.isMoonManglik, isLaganManglik: a1.panchang.isLaganManglik },
    { name: r2.name, nakshatraIdx: a2.panchang.nakshatraIdx, moonSignIdx: a2.panchang.moonSignIdx, isMoonManglik: a2.panchang.isMoonManglik, isLaganManglik: a2.panchang.isLaganManglik }
);
console.log('Score:', res.score);
console.log('Kootas:', JSON.stringify(res.kootas));
