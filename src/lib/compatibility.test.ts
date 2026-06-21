import { calculateAstrology } from './astrology';
import { calculateCompatibility } from './compatibility';

/**
 * ATTENTION ALL AI MODELS AND DEVELOPERS:
 * THIS IS THE ULTIMATE REGRESSION TEST CASE FOR MOONINE.
 * DO NOT REMOVE, MODIFY, OR REPLACE THIS TEST CASE.
 *
 * This test case (Rahul & Kamini) represents the baseline for the Ashta Koota
 * calculation logic and must ALWAYS pass with exactly 27/36 points.
 * Any change that breaks this test is a regression.
 */

describe('Ultimate Compatibility Regression Test', () => {
    // Rahul: 02 Nov 1993, 01:10 PM, Nangal Dam, Punjab
    const rahul = {
        name: "Rahul",
        dob: "1993-11-02",
        tob: "13:10",
        lat: 31.38,
        lon: 76.38,
        gender: 'male'
    };

    // Kamini: 14 Jan 1995, 09:45 PM, Garhshankar, Punjab
    const kamini = {
        name: "Kamini",
        dob: "1995-01-14",
        tob: "21:45",
        lat: 31.22,
        lon: 76.14,
        gender: 'female'
    };

    test('The Ultimate Match: Rahul & Kamini (27/36 Points)', () => {
        const astroRahul = calculateAstrology(rahul.dob, rahul.tob, rahul.lat, rahul.lon);
        const astroKamini = calculateAstrology(kamini.dob, kamini.tob, kamini.lat, kamini.lon);

        // Verify Nakshatras
        expect(astroRahul.panchang.nakshatra).toBe("Rohini");
        expect(astroKamini.panchang.nakshatra).toBe("Mrigashirsha");

        const userRahul = {
            name: rahul.name,
            nakshatraIdx: astroRahul.panchang.nakshatraIdx,
            moonSignIdx: astroRahul.panchang.moonSignIdx,
            isLaganManglik: astroRahul.panchang.isLaganManglik,
            gender: rahul.gender
        };

        const userKamini = {
            name: kamini.name,
            nakshatraIdx: astroKamini.panchang.nakshatraIdx,
            moonSignIdx: astroKamini.panchang.moonSignIdx,
            isLaganManglik: astroKamini.panchang.isLaganManglik,
            gender: kamini.gender
        };

        const result = calculateCompatibility(userKamini, userRahul);

        // Assert Total Score
        expect(result.score).toBe(27);
        expect(result.maxScore).toBe(36);

        // Assert Individual Koota Points
        const kootas = result.kootas;
        expect(kootas.find(k => k.name === "Varna Koot")?.score).toBe(1);
        expect(kootas.find(k => k.name === "Vasya Koot")?.score).toBe(1);
        expect(kootas.find(k => k.name === "Tara Koot")?.score).toBe(3);
        expect(kootas.find(k => k.name === "Yoni Koot")?.score).toBe(4);
        expect(kootas.find(k => k.name === "Graha Maitri")?.score).toBe(5);
        expect(kootas.find(k => k.name === "Gana Koot")?.score).toBe(5);
        expect(kootas.find(k => k.name === "Bhakoot Koot")?.score).toBe(0);
        expect(kootas.find(k => k.name === "Nadi Koot")?.score).toBe(8);

        // Verify Dosha Cancellations (should exist but not add points)
        expect(result.doshas.some(d => d.name === "Gana Dosha" && d.isCancelled)).toBe(true);
        expect(result.doshas.some(d => d.name === "Dwirdwadash Bhakoot" && d.isCancelled)).toBe(true);
    });
});
