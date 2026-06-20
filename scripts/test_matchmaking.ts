import * as Ast from 'astronomy-engine';
import { calculateAstrology } from '../src/lib/astrology';
import { calculateCompatibility } from '../src/lib/compatibility';

// Workaround for astronomy-engine ESM/CJS interop in tsx
const Astronomy = (Ast as any).default || Ast;

function runTest(label: string, person1: any, person2: any) {
    console.log(`--- ${label} ---`);

    // We need to inject the workaround if necessary, but calculateAstrology already uses Ast.
    // However, if calculateAstrology uses Ast internally and it fails, we have a problem.
    // Let's see if we can just fix the import in calculateAstrology to be more robust or if it was just a tsx issue.

    const astro1 = calculateAstrology(person1.dob, person1.tob, person1.lat, person1.lon);
    const astro2 = calculateAstrology(person2.dob, person2.tob, person2.lat, person2.lon);

    console.log(`${person1.name}: Nakshatra=${astro1.panchang.nakshatra}, MoonSign=${astro1.panchang.moonSign}, LaganManglik=${astro1.panchang.isLaganManglik}, MoonManglik=${astro1.panchang.isMoonManglik}`);
    console.log(`${person2.name}: Nakshatra=${astro2.panchang.nakshatra}, MoonSign=${astro2.panchang.moonSign}, LaganManglik=${astro2.panchang.isLaganManglik}, MoonManglik=${astro2.panchang.isMoonManglik}`);

    const user1 = {
        name: person1.name,
        nakshatraIdx: astro1.panchang.nakshatraIdx,
        moonSignIdx: astro1.panchang.moonSignIdx,
        isMoonManglik: astro1.panchang.isMoonManglik,
        isLaganManglik: astro1.panchang.isLaganManglik
    };

    const user2 = {
        name: person2.name,
        nakshatraIdx: astro2.panchang.nakshatraIdx,
        moonSignIdx: astro2.panchang.moonSignIdx,
        isMoonManglik: astro2.panchang.isMoonManglik,
        isLaganManglik: astro2.panchang.isLaganManglik
    };

    const result = calculateCompatibility(user1, user2);

    console.log(`\nCompatibility Result: ${result.category}`);
    console.log(`Score: ${result.score}/${result.maxScore}`);
    console.log(`Description: ${result.description}`);

    console.log("\nKoota Breakdown:");
    result.kootas.forEach(k => {
        console.log(`- ${k.name}: ${k.score}/${k.max}`);
    });

    if (result.doshas.length > 0) {
        console.log("\nDosha Alerts:");
        result.doshas.forEach(d => {
            console.log(`- ${d.name}${d.isCancelled ? " (Cancelled)" : ""}: ${d.description}`);
        });
    } else {
        console.log("\nNo Dosha detected.");
    }
    console.log("\n");
}

// Scenario 1: Kamini & Rahul (Provided)
const kamini = { name: "Kamini", dob: "1995-10-06", tob: "18:00", lat: 31.2167, lon: 76.1333 };
const rahul = { name: "Rahul", dob: "1993-11-02", tob: "13:10", lat: 31.3850, lon: 76.3750 };

// Scenario 2: Aditi & Karan (Representative)
const aditi = { name: "Aditi", dob: "1992-08-12", tob: "08:30", lat: 12.9716, lon: 77.5946 };
const karan = { name: "Karan", dob: "1990-11-25", tob: "23:15", lat: 18.5204, lon: 73.8567 };

try {
    runTest("Scenario 1: Kamini & Rahul", kamini, rahul);
    runTest("Scenario 2: Aditi & Karan", aditi, karan);
} catch (e) {
    console.error("Test execution failed:", e);
    process.exit(1);
}
