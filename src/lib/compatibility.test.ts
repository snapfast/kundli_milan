import { calculateAstrology } from './astrology';
import { calculateCompatibility } from './compatibility';

describe('Astrology and Compatibility Tests', () => {
    // Scenario 1: Kamini & Rahul
    const kamini = { name: "Kamini", dob: "1995-10-06", tob: "18:00", lat: 31.2167, lon: 76.1333 };
    const rahul = { name: "Rahul", dob: "1993-11-02", tob: "13:10", lat: 31.3850, lon: 76.3750 };

    test('Scenario 1: Kamini & Rahul Match', () => {
        const astro1 = calculateAstrology(kamini.dob, kamini.tob, kamini.lat, kamini.lon);
        const astro2 = calculateAstrology(rahul.dob, rahul.tob, rahul.lat, rahul.lon);

        expect(astro1.panchang.nakshatra).toBe("Purva Bhadrapada");
        expect(astro2.panchang.nakshatra).toBe("Rohini");

        const user1 = {
            name: kamini.name,
            nakshatraIdx: astro1.panchang.nakshatraIdx,
            moonSignIdx: astro1.panchang.moonSignIdx,
            isMoonManglik: astro1.panchang.isMoonManglik,
            isLaganManglik: astro1.panchang.isLaganManglik
        };

        const user2 = {
            name: rahul.name,
            nakshatraIdx: astro2.panchang.nakshatraIdx,
            moonSignIdx: astro2.panchang.moonSignIdx,
            isMoonManglik: astro2.panchang.isMoonManglik,
            isLaganManglik: astro2.panchang.isLaganManglik
        };

        const result = calculateCompatibility(user1, user2);

        expect(result.score).toBe(31.5);
        expect(result.kootas.find(k => k.name === "Varna")?.score).toBe(1);
        expect(result.kootas.find(k => k.name === "Vashya")?.score).toBe(1);
        expect(result.kootas.find(k => k.name === "Tara")?.score).toBe(1.5);
        expect(result.kootas.find(k => k.name === "Yoni")?.score).toBe(2);
        expect(result.kootas.find(k => k.name === "Maitri")?.score).toBe(5);
        expect(result.kootas.find(k => k.name === "Gana")?.score).toBe(6);
        expect(result.kootas.find(k => k.name === "Bhakoot")?.score).toBe(7);
        expect(result.kootas.find(k => k.name === "Nadi")?.score).toBe(8);
    });

    // Scenario 2: Shweta & Rahul
    const shweta = { name: "Shweta", dob: "1995-08-07", tob: "08:01", lat: 25.7358, lon: 86.9792 };

    test('Scenario 2: Shweta & Rahul Match', () => {
        const astro1 = calculateAstrology(shweta.dob, shweta.tob, shweta.lat, shweta.lon);
        const astro2 = calculateAstrology(rahul.dob, rahul.tob, rahul.lat, rahul.lon);

        const user1 = {
            name: shweta.name,
            nakshatraIdx: astro1.panchang.nakshatraIdx,
            moonSignIdx: astro1.panchang.moonSignIdx,
            isMoonManglik: astro1.panchang.isMoonManglik,
            isLaganManglik: astro1.panchang.isLaganManglik
        };

        const user2 = {
            name: rahul.name,
            nakshatraIdx: astro2.panchang.nakshatraIdx,
            moonSignIdx: astro2.panchang.moonSignIdx,
            isMoonManglik: astro2.panchang.isMoonManglik,
            isLaganManglik: astro2.panchang.isLaganManglik
        };

        const result = calculateCompatibility(user1, user2);

        expect(result.score).toBe(22.5);
        expect(result.kootas.find(k => k.name === "Varna")?.score).toBe(0);
        expect(result.kootas.find(k => k.name === "Vashya")?.score).toBe(1);
        expect(result.kootas.find(k => k.name === "Tara")?.score).toBe(1.5);
        expect(result.kootas.find(k => k.name === "Yoni")?.score).toBe(2);
        expect(result.kootas.find(k => k.name === "Maitri")?.score).toBe(3);
        expect(result.kootas.find(k => k.name === "Gana")?.score).toBe(0);
        expect(result.kootas.find(k => k.name === "Bhakoot")?.score).toBe(7);
        expect(result.kootas.find(k => k.name === "Nadi")?.score).toBe(8);
    });

    // Scenario 3: Kamini 2 & Rahul 2 (From Backend Records)
    const kamini2 = { name: "kamini", dob: "1995-01-14", tob: "16:23", lat: 31.2154716, lon: 76.1426888 };
    const rahul2 = { name: "Rahul", dob: "1993-11-02", tob: "07:48", lat: 31.3837484, lon: 76.3754353 };

    test('Scenario 3: Kamini 2 & Rahul 2 Match (High Score)', () => {
        const astro1 = calculateAstrology(kamini2.dob, kamini2.tob, kamini2.lat, kamini2.lon);
        const astro2 = calculateAstrology(rahul2.dob, rahul2.tob, rahul2.lat, rahul2.lon);

        expect(astro1.panchang.nakshatra).toBe("Mrigashira");
        expect(astro2.panchang.nakshatra).toBe("Rohini");

        const user1 = {
            name: kamini2.name,
            nakshatraIdx: astro1.panchang.nakshatraIdx,
            moonSignIdx: astro1.panchang.moonSignIdx,
            isMoonManglik: astro1.panchang.isMoonManglik,
            isLaganManglik: astro1.panchang.isLaganManglik
        };

        const user2 = {
            name: rahul2.name,
            nakshatraIdx: astro2.panchang.nakshatraIdx,
            moonSignIdx: astro2.panchang.moonSignIdx,
            isMoonManglik: astro2.panchang.isMoonManglik,
            isLaganManglik: astro2.panchang.isLaganManglik
        };

        const result = calculateCompatibility(user1, user2);

        expect(result.score).toBe(34);
        expect(result.kootas.find(k => k.name === "Varna")?.score).toBe(1);
        expect(result.kootas.find(k => k.name === "Vashya")?.score).toBe(1);
        expect(result.kootas.find(k => k.name === "Tara")?.score).toBe(3);
        expect(result.kootas.find(k => k.name === "Yoni")?.score).toBe(4);
        expect(result.kootas.find(k => k.name === "Maitri")?.score).toBe(5);
        expect(result.kootas.find(k => k.name === "Gana")?.score).toBe(5);
        expect(result.kootas.find(k => k.name === "Bhakoot")?.score).toBe(7);
        expect(result.kootas.find(k => k.name === "Nadi")?.score).toBe(8);
    });
});
