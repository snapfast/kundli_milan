import * as AstModule from 'astronomy-engine';
import { calculateAstrology } from '../src/lib/astrology';
import { calculateCompatibility } from '../src/lib/compatibility';

// Workaround for ESM/CJS interop in various environments (tsx, vite, etc.)
const Ast = (AstModule as any).default || AstModule;

interface ExpectedScores {
    total: number;
    kootas: Record<string, number>;
}

function runTest(label: string, person1: any, person2: any, expected?: ExpectedScores) {
    console.log(`--- ${label} ---`);

    const astro1 = calculateAstrology(person1.dob, person1.tob, person1.lat, person1.lon);
    const astro2 = calculateAstrology(person2.dob, person2.tob, person2.lat, person2.lon);

    console.log(`${person1.name}: Nakshatra=${astro1.panchang.nakshatra}, MoonSign=${astro1.panchang.moonSign}`);
    console.log(`${person2.name}: Nakshatra=${astro2.panchang.nakshatra}, MoonSign=${astro2.panchang.moonSign}`);

    const user1 = {
        name: person1.name,
        gender: person1.gender,
        nakshatraIdx: astro1.panchang.nakshatraIdx,
        moonSignIdx: astro1.panchang.moonSignIdx,
        isMoonManglik: astro1.panchang.isMoonManglik,
        isLaganManglik: astro1.panchang.isLaganManglik
    };

    const user2 = {
        name: person2.name,
        gender: person2.gender,
        nakshatraIdx: astro2.panchang.nakshatraIdx,
        moonSignIdx: astro2.panchang.moonSignIdx,
        isMoonManglik: astro2.panchang.isMoonManglik,
        isLaganManglik: astro2.panchang.isLaganManglik
    };

    const result = calculateCompatibility(user1, user2);

    console.log(`\nCompatibility Result: ${result.category}`);
    console.log(`Score: ${result.score}/${result.maxScore}`);

    console.log("\nKoota Breakdown:");
    result.kootas.forEach(k => {
        console.log(`- ${k.name}: ${k.score}/${k.max}`);
    });

    if (expected) {
        console.log("\n--- Verification ---");
        let passed = true;
        if (result.score !== expected.total) {
            console.error(`❌ Total score mismatch: Expected ${expected.total}, Got ${result.score}`);
            passed = false;
        }

        for (const [name, score] of Object.entries(expected.kootas)) {
            const koota = result.kootas.find(k => k.name === name);
            if (!koota || koota.score !== score) {
                console.error(`❌ Koota ${name} mismatch: Expected ${score}, Got ${koota?.score}`);
                passed = false;
            }
        }

        if (passed) {
            console.log("✅ Verification Passed!");
        } else {
            console.error("❌ Verification Failed!");
            process.exit(1);
        }
    }
    console.log("\n");
}

// Scenario 1: Kamini & Rahul (Verified against User Table)
const kamini = { name: "Kamini", gender: "female", dob: "1995-10-06", tob: "18:00", lat: 31.2167, lon: 76.1333 };
const rahul = { name: "Rahul", gender: "male", dob: "1993-11-02", tob: "13:10", lat: 31.3850, lon: 76.3750 };

const scenario1Expected: ExpectedScores = {
    total: 31.5,
    kootas: {
        "Varna": 1,
        "Vashya": 1,
        "Tara": 1.5,
        "Yoni": 2,
        "Maitri": 5,
        "Gana": 6,
        "Bhakoot": 7, // It seems Bhakoot dosha cancellation giving 7 points is the expected baseline in the project for this specific older test case if it wasn't dosha, or maybe they didn't have Bhakoot dosha? Wait, Aquarius and Taurus is 4-10 (Sad Bhakoot), so 7 points natively! No cancellation needed.
        "Nadi": 8
    }
};

// Scenario 2: Shweta & Rahul (Verified against User Table)
const shweta = { name: "Shweta", gender: "female", dob: "1995-08-07", tob: "08:01", lat: 25.7358, lon: 86.9792 };

const scenario2Expected: ExpectedScores = {
    total: 22.5,
    kootas: {
        "Varna": 0,
        "Vashya": 1,
        "Tara": 1.5,
        "Yoni": 2,
        "Maitri": 3,
        "Gana": 0,
        "Bhakoot": 7,
        "Nadi": 8
    }
};

// Scenario 3: Kamini (14 Jan 1995) & Rahul (02 Nov 1993)
const kaminiJan1995 = { name: "Kamini (Jan 1995)", gender: "female", dob: "1995-01-14", tob: "21:45", lat: 31.2144, lon: 76.1432 };
const rahulNov1993 = { name: "Rahul (Nov 1993)", gender: "male", dob: "1993-11-02", tob: "13:10", lat: 31.3934, lon: 76.3869 };

const scenario3Expected: ExpectedScores = {
    total: 27,
    kootas: {
        "Varna": 1,
        "Vashya": 1,
        "Tara": 3,
        "Yoni": 4,
        "Maitri": 5,
        "Gana": 5,
        "Bhakoot": 0,
        "Nadi": 8
    }
};

try {
    runTest("Scenario 1: Kamini & Rahul", kamini, rahul, scenario1Expected);
    runTest("Scenario 2: Shweta & Rahul", shweta, rahul, scenario2Expected);
    runTest("Scenario 3: Kamini (Jan 1995) & Rahul", kaminiJan1995, rahulNov1993, scenario3Expected);
} catch (e) {
    console.error("Test execution failed:", e);
    process.exit(1);
}
