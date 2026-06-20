export interface UserAstrology {
    name: string;
    nakshatraIdx: number;
    moonSignIdx: number;
    isMoonManglik?: boolean;
    isLaganManglik?: boolean;
    gender?: string;
}

export interface CompatibilityResult {
    score: number;
    maxScore: number;
    category: string;
    description: string;
    kootas: {
        name: string;
        score: number;
        max: number;
    }[];
    doshas: {
        name: string;
        description: string;
        isCancelled: boolean;
    }[];
}

// 27 Nakshatras properties
// Gana: 0 = Deva, 1 = Manushya, 2 = Rakshasa
// Yoni: 0 = Ashwa, 1 = Gaja, 2 = Mesha, 3 = Sarpa, 4 = Shwan, 5 = Marjar, 6 = Mushak, 7 = Gau, 8 = Mahish, 9 = Vyagrah, 10 = Mrig, 11 = Vanar, 12 = Nakul, 13 = Singh
// Nadi: 0 = Adi, 1 = Madhya, 2 = Antya

const NAKSHATRA_PROPS = [
    { name: "Ashwini", gana: 0, yoni: 0, nadi: 0 },
    { name: "Bharani", gana: 1, yoni: 1, nadi: 1 },
    { name: "Krittika", gana: 2, yoni: 2, nadi: 2 },
    { name: "Rohini", gana: 1, yoni: 3, nadi: 2 },
    { name: "Mrigashira", gana: 0, yoni: 3, nadi: 1 },
    { name: "Ardra", gana: 1, yoni: 4, nadi: 0 },
    { name: "Punarvasu", gana: 0, yoni: 5, nadi: 0 },
    { name: "Pushya", gana: 0, yoni: 2, nadi: 1 },
    { name: "Ashlesha", gana: 2, yoni: 5, nadi: 2 },
    { name: "Magha", gana: 2, yoni: 6, nadi: 2 },
    { name: "Purva Phalguni", gana: 1, yoni: 6, nadi: 1 },
    { name: "Uttara Phalguni", gana: 1, yoni: 7, nadi: 0 },
    { name: "Hasta", gana: 0, yoni: 8, nadi: 0 },
    { name: "Chitra", gana: 2, yoni: 9, nadi: 1 },
    { name: "Swati", gana: 0, yoni: 8, nadi: 2 },
    { name: "Vishakha", gana: 2, yoni: 9, nadi: 2 },
    { name: "Anuradha", gana: 0, yoni: 10, nadi: 1 },
    { name: "Jyeshtha", gana: 2, yoni: 10, nadi: 0 },
    { name: "Mula", gana: 2, yoni: 4, nadi: 0 },
    { name: "Purva Ashadha", gana: 1, yoni: 11, nadi: 1 },
    { name: "Uttara Ashadha", gana: 1, yoni: 12, nadi: 2 },
    { name: "Shravana", gana: 0, yoni: 11, nadi: 2 },
    { name: "Dhanishta", gana: 2, yoni: 13, nadi: 1 },
    { name: "Shatabhisha", gana: 2, yoni: 0, nadi: 0 },
    { name: "Purva Bhadrapada", gana: 1, yoni: 13, nadi: 0 },
    { name: "Uttara Bhadrapada", gana: 1, yoni: 7, nadi: 1 },
    { name: "Revati", gana: 0, yoni: 1, nadi: 2 }
];

// Rasi Properties
// Varna: 0 = Brahmin, 1 = Kshatriya, 2 = Vaishya, 3 = Shudra
// Lord: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
const RASI_PROPS = [
    { name: "Aries", varna: 1, lord: 2, vashya: 1 },
    { name: "Taurus", varna: 2, lord: 5, vashya: 1 },
    { name: "Gemini", varna: 3, lord: 3, vashya: 0 },
    { name: "Cancer", varna: 0, lord: 1, vashya: 3 },
    { name: "Leo", varna: 1, lord: 0, vashya: 2 },
    { name: "Virgo", varna: 3, lord: 3, vashya: 0 },
    { name: "Libra", varna: 2, lord: 5, vashya: 0 },
    { name: "Scorpio", varna: 0, lord: 2, vashya: 4 },
    { name: "Sagittarius", varna: 1, lord: 4, vashya: 0 },
    { name: "Capricorn", varna: 2, lord: 6, vashya: 1 },
    { name: "Aquarius", varna: 3, lord: 6, vashya: 0 },
    { name: "Pisces", varna: 0, lord: 4, vashya: 3 }
];

// Friendship table for Lords
// 0: Neutral, 1: Friend, -1: Enemy
const LORD_FRIENDSHIP: Record<number, Record<number, number>> = {
    0: { 0: 1, 1: 1, 2: 1, 3: 0, 4: 1, 5: -1, 6: -1 }, // Sun
    1: { 0: 1, 1: 1, 2: 0, 3: 1, 4: 0, 5: 0, 6: 0 }, // Moon
    2: { 0: 1, 1: 1, 2: 1, 3: -1, 4: 1, 5: 0, 6: 0 }, // Mars
    3: { 0: 1, 1: -1, 2: 0, 3: 1, 4: 0, 5: 1, 6: 0 }, // Mercury
    4: { 0: 1, 1: 1, 2: 1, 3: -1, 4: 1, 5: -1, 6: 0 }, // Jupiter
    5: { 0: -1, 1: -1, 2: 0, 3: 1, 4: 0, 5: 1, 6: 1 }, // Venus
    6: { 0: -1, 1: -1, 2: -1, 3: 1, 4: 0, 5: 1, 6: 1 }  // Saturn
};

// Yoni Compatibility Matrix
const YONI_COMPAT = [
    [4, 2, 2, 3, 2, 2, 2, 1, 0, 2, 1, 1, 2, 1], // Ashwa
    [2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0], // Gaja
    [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1], // Mesha
    [3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2], // Sarpa
    [2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1], // Shwan
    [2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 2, 1, 1], // Marjar
    [2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2], // Mushak
    [1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1], // Gau
    [0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1], // Mahish
    [2, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1], // Vyagrah
    [1, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1], // Mrig
    [1, 3, 0, 2, 2, 2, 2, 2, 2, 1, 2, 4, 3, 2], // Vanar
    [2, 2, 3, 0, 1, 1, 1, 2, 2, 2, 2, 3, 4, 2], // Nakul
    [1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 2, 4]  // Singh
];

export function calculateCompatibility(user1: UserAstrology, user2: UserAstrology): CompatibilityResult {
    const kootas = [];
    const doshas: { name: string; description: string; isCancelled: boolean }[] = [];

    // Defensive checks for valid indices
    const isValidRasi = (idx: number) => typeof idx === 'number' && !isNaN(idx) && idx >= 0 && idx < RASI_PROPS.length;
    const isValidNak = (idx: number) => typeof idx === 'number' && !isNaN(idx) && idx >= 0 && idx < NAKSHATRA_PROPS.length;

    if (!isValidRasi(user1.moonSignIdx) || !isValidRasi(user2.moonSignIdx) ||
        !isValidNak(user1.nakshatraIdx) || !isValidNak(user2.nakshatraIdx)) {
        return {
            score: 0,
            maxScore: 36,
            category: "Incomplete Data",
            description: "Some cosmic details are missing for this pairing, making it impossible to calculate a precise match.",
            kootas: [
                { name: "Varna", score: 0, max: 1 },
                { name: "Vashya", score: 0, max: 2 },
                { name: "Tara", score: 0, max: 3 },
                { name: "Yoni", score: 0, max: 4 },
                { name: "Maitri", score: 0, max: 5 },
                { name: "Gana", score: 0, max: 6 },
                { name: "Bhakoot", score: 0, max: 7 },
                { name: "Nadi", score: 0, max: 8 }
            ],
            doshas: []
        };
    }

    // Determine Boy and Girl for Varna calculation
    let boy = user1;
    let girl = user2;

    const gender1 = user1.gender?.toLowerCase() || '';
    const gender2 = user2.gender?.toLowerCase() || '';

    if (gender1 === 'male' && gender2 !== 'male') {
        boy = user1;
        girl = user2;
    } else if (gender2 === 'male' && gender1 !== 'male') {
        boy = user2;
        girl = user1;
    } else if (gender1 === 'female' && gender2 !== 'female') {
        boy = user2;
        girl = user1;
    } else if (gender2 === 'female' && gender1 !== 'female') {
        boy = user1;
        girl = user2;
    } else {
        // Fallback for same gender or unknown: sort by name to ensure symmetry
        if (user1.name > user2.name) {
            boy = user1;
            girl = user2;
        } else {
            boy = user2;
            girl = user1;
        }
    }

    // 1. Varna (1 point)
    // 0 = Brahmin, 1 = Kshatriya, 2 = Vaishya, 3 = Shudra
    // Score 1 point if Boy's Varna is higher than or equal to Girl's Varna (i.e. lower or equal number)
    const vBoy = RASI_PROPS[boy.moonSignIdx].varna;
    const vGirl = RASI_PROPS[girl.moonSignIdx].varna;
    let varnaScore = 0;
    if (vBoy <= vGirl) varnaScore = 1;
    kootas.push({ name: "Varna", score: varnaScore, max: 1 });

    // 2. Vashya (2 points)
    const VASHYA_MATRIX = [
        [2, 1, 0, 1, 1], // Manushya
        [1, 2, 0, 1, 1], // Chatushpada
        [0, 0, 2, 0, 0], // Vanachara
        [1, 1, 0, 2, 1], // Jalachara
        [1, 1, 0, 1, 2]  // Keeta
    ];
    const vas1 = RASI_PROPS[user1.moonSignIdx].vashya;
    const vas2 = RASI_PROPS[user2.moonSignIdx].vashya;
    const vashyaScore = VASHYA_MATRIX[vas1][vas2];
    kootas.push({ name: "Vashya", score: vashyaScore, max: 2 });

    // 3. Tara (3 points)
    const diff1 = (user2.nakshatraIdx - user1.nakshatraIdx + 27) % 9;
    const diff2 = (user1.nakshatraIdx - user2.nakshatraIdx + 27) % 9;
    const goodTara = [1, 3, 5, 7, 8];
    let taraScore = 0;
    if (goodTara.includes(diff1) && goodTara.includes(diff2)) taraScore = 3;
    else if (goodTara.includes(diff1) || goodTara.includes(diff2)) taraScore = 1.5;
    kootas.push({ name: "Tara", score: taraScore, max: 3 });

    // 4. Yoni (4 points)
    const y1 = NAKSHATRA_PROPS[user1.nakshatraIdx].yoni;
    const y2 = NAKSHATRA_PROPS[user2.nakshatraIdx].yoni;
    const yoniScore = YONI_COMPAT[y1][y2];
    if (yoniScore === 0) {
        doshas.push({
            name: "Yoni Vairya",
            description: "Natural enmity between your animal types can lead to instinctive friction.",
            isCancelled: false
        });
    }
    kootas.push({ name: "Yoni", score: yoniScore, max: 4 });

    // 5. Maitri (5 points)
    const l1 = RASI_PROPS[user1.moonSignIdx].lord;
    const l2 = RASI_PROPS[user2.moonSignIdx].lord;
    let maitriScore = 0;
    const f1 = LORD_FRIENDSHIP[l1][l2];
    const f2 = LORD_FRIENDSHIP[l2][l1];
    if (f1 === 1 && f2 === 1) maitriScore = 5;
    else if ((f1 === 1 && f2 === 0) || (f1 === 0 && f2 === 1)) maitriScore = 4;
    else if (f1 === 0 && f2 === 0) maitriScore = 3;
    else if ((f1 === 1 && f2 === -1) || (f1 === -1 && f2 === 1)) maitriScore = 1;
    else if ((f1 === 0 && f2 === -1) || (f1 === -1 && f2 === 0)) maitriScore = 0.5;
    kootas.push({ name: "Maitri", score: maitriScore, max: 5 });

    // 6. Gana (6 points)
    const g1 = NAKSHATRA_PROPS[user1.nakshatraIdx].gana;
    const g2 = NAKSHATRA_PROPS[user2.nakshatraIdx].gana;
    let ganaScore = 0;
    if (g1 === g2) ganaScore = 6;
    else if ((g1 === 0 && g2 === 1) || (g1 === 1 && g2 === 0)) ganaScore = 5;
    else if ((g1 === 0 && g2 === 2) || (g1 === 2 && g2 === 0)) ganaScore = 1;

    if (ganaScore === 0) {
        doshas.push({
            name: "Gana Dosha",
            description: "Significant differences in temperament and character traits.",
            isCancelled: false
        });
    }
    kootas.push({ name: "Gana", score: ganaScore, max: 6 });

    // 7. Bhakoot (7 points)
    const rDiff = (user2.moonSignIdx - user1.moonSignIdx + 12) % 12 + 1;
    let bhakootScore = 7;
    const badDiffs = [2, 5, 6, 8, 9, 12];
    if (badDiffs.includes(rDiff)) bhakootScore = 0;
    if (rDiff === 7) bhakootScore = 7;

    if (bhakootScore === 0) {
        let name = "Bhakoot Dosha";
        if (rDiff === 2 || rDiff === 12) name = "Dwirdwadash Bhakoot";
        if (rDiff === 5 || rDiff === 9) name = "Navpancham Bhakoot";
        if (rDiff === 6 || rDiff === 8) name = "Shadashtak Bhakoot";

        // Cancellation logic
        const isCancelled = l1 === l2 || (f1 === 1 && f2 === 1);
        // Note: Even if cancelled, Bhakoot score remains 0, but the malefic effect is nullified.

        doshas.push({
            name,
            description: isCancelled ? "Cancelled due to friendly Rasi lords." : "May impact prosperity and relationship longevity.",
            isCancelled
        });
    }
    kootas.push({ name: "Bhakoot", score: bhakootScore, max: 7 });

    // 8. Nadi (8 points)
    const n1 = NAKSHATRA_PROPS[user1.nakshatraIdx].nadi;
    const n2 = NAKSHATRA_PROPS[user2.nakshatraIdx].nadi;
    let nadiScore = 8;

    if (n1 === n2) {
        nadiScore = 0;
        let name = n1 === 2 ? "Antya Nadi Dosha" : "Nadi Dosha";

        // Cancellation logic
        const isCancelled = (user1.moonSignIdx === user2.moonSignIdx && user1.nakshatraIdx !== user2.nakshatraIdx) ||
                            (user1.nakshatraIdx === user2.nakshatraIdx && user1.moonSignIdx !== user2.moonSignIdx);

        if (isCancelled) {
            nadiScore = 8;
        }

        doshas.push({
            name,
            description: isCancelled ? "Cancelled due to Nakshatra/Rasi variations." : "Relates to genetic compatibility and progeny vitality.",
            isCancelled
        });
    }
    kootas.push({ name: "Nadi", score: nadiScore, max: 8 });

    const totalScore = kootas.reduce((acc, k) => acc + k.score, 0);

    let category = "Casual Interest";
    let description = "You share some basic similarities, but might need to work on understanding each other's deeper motivations.";

    if (totalScore >= 28) {
        category = "Soul Connection";
        description = "A rare and powerful alignment. You likely feel an immediate sense of home and deep understanding with this person.";
    } else if (totalScore >= 21) {
        category = "Dynamic Duo";
        description = "Great harmony in major areas of life. You complement each other well and can build a strong, lasting partnership.";
    } else if (totalScore >= 18) {
        category = "Friendly Alliance";
        description = "A solid foundation for friendship or cooperation. You have enough in common to enjoy each other's company regularly.";
    } else if (totalScore >= 12) {
        category = "Growth Potential";
        description = "While there are some differences, there is enough common ground to build a relationship if both partners are willing to adapt and grow.";
    }

    // Creative Chemistry Overrides
    if (maitriScore === 5 && ganaScore === 6) {
        category = "Intellectual Harmony";
        description = "Your minds work on the same wavelength. Communication is effortless and you share many core values.";
    } else if (yoniScore === 4 && nadiScore === 8) {
        category = "Passionate Bond";
        description = "There is a strong physical and energetic attraction between you. Your vibes are highly complementary.";
    } else if (bhakootScore === 7 && nadiScore === 8) {
        category = "Destined Union";
        description = "Strong cosmic protection surrounds this match. You are likely to experience prosperity and deep longevity together.";
    } else if (maitriScore >= 4 && varnaScore === 1) {
        category = "Social Synergy";
        description = "You share similar worldviews and social standing, making for a very smooth and comfortable public life together.";
    }

    // Manglik Matching Logic (Lagan-based for calculations, Moon-based for representation)
    const m1 = !!user1.isLaganManglik;
    const m2 = !!user2.isLaganManglik;

    // Add partner's Manglik status to doshas for visibility on match cards
    if (user2.isMoonManglik) {
        doshas.push({
            name: "Moon Manglik* (Partner)",
            description: "Partner has Mars in 1, 4, 7, 8, or 12 house from the Moon. (Informational only)",
            isCancelled: !!user1.isMoonManglik // Representationally cancelled if both have it
        });
    }
    if (user2.isLaganManglik) {
        doshas.push({
            name: "Lagan Manglik (Partner)",
            description: "Partner has Mars in 1, 4, 7, 8, or 12 house from the Ascendant.",
            isCancelled: m1
        });
    }

    if (user1.isLaganManglik !== undefined && user2.isLaganManglik !== undefined) {
        if (m1 && !m2) {
            category = "Complex Alignment";
            description = "You have a Manglik Dosha while your partner does not. This can sometimes lead to imbalances in energy if not managed with patience.";
        } else if (!m1 && m2) {
            category = "Complex Alignment";
            description = "Your partner has a Manglik Dosha while you do not. This can sometimes lead to imbalances in energy if not managed with patience.";
        } else if (m1 && m2) {
            category = "Powerful Synergy";
            description = "Both of you are Manglik, which actually creates a balanced and high-energy partnership. You understand each other's intensity.";
        }
    }

    return {
        score: totalScore,
        maxScore: 36,
        category,
        description,
        kootas,
        doshas
    };
}
