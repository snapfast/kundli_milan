export interface UserAstrology {
    name: string;
    nakshatraIdx: number;
    moonSignIdx: number;
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
        areaOfLife: string;
        girlValue: string;
        boyValue: string;
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

const VARNA_NAMES = ["Brahmin", "Kshatriya", "Vaishya", "Shudra"];
const VASHYA_NAMES = ["Manava", "Chatushpada", "Vanachara", "Jalachara", "Keeta"];
const GANA_NAMES = ["Devata", "Manushya", "Rakshasa"];
const NADI_NAMES = ["Adi", "Madhya", "Antya"];
const LORD_NAMES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const YONI_NAMES = ["Ashwa", "Gaja", "Mesha", "Sarpa", "Shwan", "Marjar", "Mushak", "Gau", "Mahish", "Vyagrah", "Mrig", "Vanar", "Nakul", "Singh"];
const RASI_NAMES_SANSKRIT = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];

const NAKSHATRA_PROPS = [
    { name: "Ashwini", gana: 0, yoni: 0, nadi: 0 },
    { name: "Bharani", gana: 1, yoni: 1, nadi: 1 },
    { name: "Krittika", gana: 2, yoni: 2, nadi: 2 },
    { name: "Rohini", gana: 1, yoni: 3, nadi: 2 },
    { name: "Mrigashirsha", gana: 0, yoni: 3, nadi: 1 },
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
                { name: "Varna Koot", score: 0, max: 1, areaOfLife: "Aptitude", girlValue: "-", boyValue: "-" },
                { name: "Vasya Koot", score: 0, max: 2, areaOfLife: "Amenability", girlValue: "-", boyValue: "-" },
                { name: "Tara Koot", score: 0, max: 3, areaOfLife: "Compassion", girlValue: "-", boyValue: "-" },
                { name: "Yoni Koot", score: 0, max: 4, areaOfLife: "Chemistry", girlValue: "-", boyValue: "-" },
                { name: "Graha Maitri", score: 0, max: 5, areaOfLife: "Affection", girlValue: "-", boyValue: "-" },
                { name: "Gana Koot", score: 0, max: 6, areaOfLife: "Temperament", girlValue: "-", boyValue: "-" },
                { name: "Bhakoot Koot", score: 0, max: 7, areaOfLife: "Love", girlValue: "-", boyValue: "-" },
                { name: "Nadi Koot", score: 0, max: 8, areaOfLife: "Progeny", girlValue: "-", boyValue: "-" }
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

    // 1. Varna Koot (1 point)
    // 0 = Brahmin, 1 = Kshatriya, 2 = Vaishya, 3 = Shudra
    // Score 1 point if Boy's Varna is higher than or equal to Girl's Varna (i.e. lower or equal number)
    const vBoy = RASI_PROPS[boy.moonSignIdx].varna;
    const vGirl = RASI_PROPS[girl.moonSignIdx].varna;
    let varnaScore = 0;
    if (vBoy <= vGirl) varnaScore = 1;
    kootas.push({
        name: "Varna Koot",
        score: varnaScore,
        max: 1,
        areaOfLife: "Aptitude",
        girlValue: VARNA_NAMES[vGirl],
        boyValue: VARNA_NAMES[vBoy]
    });

    // 2. Vasya Koot (2 points)
    // Groom Row, Bride Column
    const VASHYA_MATRIX = [
        [2, 2, 0, 2, 1], // Boy Manushya
        [1, 2, 1, 1, 1], // Boy Chatushpada
        [0, 0, 2, 0, 0], // Boy Vanachara
        [1, 1, 0, 2, 1], // Boy Jalachara
        [1, 1, 0, 1, 2]  // Boy Keeta
    ];
    const vasBoy = RASI_PROPS[boy.moonSignIdx].vashya;
    const vasGirl = RASI_PROPS[girl.moonSignIdx].vashya;
    const vashyaScore = VASHYA_MATRIX[vasBoy][vasGirl];
    kootas.push({
        name: "Vasya Koot",
        score: vashyaScore,
        max: 2,
        areaOfLife: "Amenability",
        girlValue: VASHYA_NAMES[vasGirl],
        boyValue: VASHYA_NAMES[vasBoy]
    });

    // 3. Tara Koot (3 points)
    const diff1 = (user2.nakshatraIdx - user1.nakshatraIdx + 27) % 9;
    const diff2 = (user1.nakshatraIdx - user2.nakshatraIdx + 27) % 9;
    const goodTara = [1, 3, 5, 7, 8];
    let taraScore = 0;
    if (goodTara.includes(diff1) && goodTara.includes(diff2)) taraScore = 3;
    else if (goodTara.includes(diff1) || goodTara.includes(diff2)) taraScore = 1.5;
    kootas.push({
        name: "Tara Koot",
        score: taraScore,
        max: 3,
        areaOfLife: "Compassion",
        girlValue: NAKSHATRA_PROPS[girl.nakshatraIdx].name,
        boyValue: NAKSHATRA_PROPS[boy.nakshatraIdx].name
    });

    // 4. Yoni Koot (4 points)
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
    const yGirl = NAKSHATRA_PROPS[girl.nakshatraIdx].yoni;
    const yBoy = NAKSHATRA_PROPS[boy.nakshatraIdx].yoni;
    kootas.push({
        name: "Yoni Koot",
        score: yoniScore,
        max: 4,
        areaOfLife: "Chemistry",
        girlValue: YONI_NAMES[yGirl],
        boyValue: YONI_NAMES[yBoy]
    });

    // 5. Graha Maitri (5 points)
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

    const lGirl = RASI_PROPS[girl.moonSignIdx].lord;
    const lBoy = RASI_PROPS[boy.moonSignIdx].lord;
    kootas.push({
        name: "Graha Maitri",
        score: maitriScore,
        max: 5,
        areaOfLife: "Affection",
        girlValue: LORD_NAMES[lGirl],
        boyValue: LORD_NAMES[lBoy]
    });

    // 6. Gana Koot (6 points)
    // 0 = Deva, 1 = Manushya, 2 = Rakshasa
    // Groom Row, Bride Column
    const GANA_MATRIX = [
        [6, 6, 0], // Boy Deva
        [5, 6, 0], // Boy Manushya
        [1, 0, 6]  // Boy Rakshasa
    ];
    const gBoy = NAKSHATRA_PROPS[boy.nakshatraIdx].gana;
    const gGirl = NAKSHATRA_PROPS[girl.nakshatraIdx].gana;
    let ganaScore = GANA_MATRIX[gBoy][gGirl];

    if (ganaScore === 0) {
        doshas.push({
            name: "Gana Dosha",
            description: "Significant differences in temperament and character traits.",
            isCancelled: false
        });
    }
    kootas.push({
        name: "Gana Koot",
        score: ganaScore,
        max: 6,
        areaOfLife: "Temperament",
        girlValue: GANA_NAMES[gGirl],
        boyValue: GANA_NAMES[gBoy]
    });

    // 7. Bhakoot Koot (7 points)
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

        doshas.push({
            name,
            description: "May impact prosperity and relationship longevity.",
            isCancelled: false
        });
    }
    kootas.push({
        name: "Bhakoot Koot",
        score: bhakootScore,
        max: 7,
        areaOfLife: "Love",
        girlValue: RASI_NAMES_SANSKRIT[girl.moonSignIdx],
        boyValue: RASI_NAMES_SANSKRIT[boy.moonSignIdx]
    });

    // 8. Nadi Koot (8 points)
    const n1 = NAKSHATRA_PROPS[user1.nakshatraIdx].nadi;
    const n2 = NAKSHATRA_PROPS[user2.nakshatraIdx].nadi;
    let nadiScore = 8;

    if (n1 === n2) {
        nadiScore = 0;
        let name = n1 === 2 ? "Antya Nadi Dosha" : "Nadi Dosha";

        // Cancellation logic
        const isCancelled = (user1.moonSignIdx === user2.moonSignIdx && user1.nakshatraIdx !== user2.nakshatraIdx) ||
                            (user1.nakshatraIdx === user2.nakshatraIdx && user1.moonSignIdx !== user2.moonSignIdx);

        doshas.push({
            name,
            description: isCancelled ? "Cancelled due to Nakshatra/Rasi variations." : "Relates to genetic compatibility and progeny vitality.",
            isCancelled
        });
    }
    const nGirl = NAKSHATRA_PROPS[girl.nakshatraIdx].nadi;
    const nBoy = NAKSHATRA_PROPS[boy.nakshatraIdx].nadi;
    kootas.push({
        name: "Nadi Koot",
        score: nadiScore,
        max: 8,
        areaOfLife: "Progeny",
        girlValue: NADI_NAMES[nGirl],
        boyValue: NADI_NAMES[nBoy]
    });

    const totalScore = kootas.reduce((acc, k) => acc + k.score, 0);

    let category = "Bad";
    let description = "This person shows significant cosmic friction with you. While all relationships take work, a match with this person may face more fundamental challenges.";

    if (totalScore > 28) {
        category = "Excellent";
        description = "This person represents a rare and powerful alignment for you. You likely feel an immediate sense of home and deep understanding with this person.";
    } else if (totalScore >= 21) {
        category = "Very Good";
        description = "This person brings great harmony to major areas of your life. This person complements you well and you can build a strong, lasting partnership together.";
    } else if (totalScore >= 18) {
        category = "Good";
        description = "This person provides a solid foundation for friendship or cooperation. This person has enough in common with you to enjoy each other's company regularly.";
    } else if (totalScore >= 12) {
        category = "Not Good";
        description = "This person has some differences with you, but there is enough common ground to build a relationship if both of you are willing to adapt and grow.";
    }

    // Creative Chemistry Overrides (Add context to description)
    if (maitriScore === 5 && ganaScore === 6) {
        description = "Intellectual Harmony: This person's mind works on the same wavelength as yours. Communication with this person is effortless, and you share many core values. " + description;
    } else if (yoniScore === 4 && nadiScore === 8) {
        description = "Passionate Bond: This person sparks a strong physical and energetic attraction in you. This person's vibes are highly complementary to yours. " + description;
    } else if (bhakootScore === 7 && nadiScore === 8) {
        description = "Destined Union: This person brings strong cosmic protection to the match. You are likely to experience prosperity and deep longevity with this person. " + description;
    } else if (maitriScore >= 4 && varnaScore === 1) {
        description = "Social Synergy: This person shares similar worldviews and social standing with you, making for a very smooth and comfortable public life together. " + description;
    }

    // Manglik Matching Logic (Lagan-based for calculations)
    const m1 = !!user1.isLaganManglik;
    const m2 = !!user2.isLaganManglik;

    // Add partner's Manglik status to doshas for visibility on match cards
    if (user2.isLaganManglik) {
        doshas.push({
            name: "Lagan Manglik (This person)",
            description: "This person has Mars in 1, 4, 7, 8, or 12 house from the Ascendant.",
            isCancelled: m1
        });
    }

    if (user1.isLaganManglik !== undefined && user2.isLaganManglik !== undefined) {
        if (m1 && !m2) {
            description = "Complex Alignment: You have a Manglik Dosha while this person does not. A relationship with this person can sometimes lead to imbalances in energy if not managed with patience. " + description;
        } else if (!m1 && m2) {
            description = "Complex Alignment: This person has a Manglik Dosha while you do not. A relationship with this person can sometimes lead to imbalances in energy if not managed with patience. " + description;
        } else if (m1 && m2) {
            description = "Powerful Synergy: Both you and this person are Manglik, which creates a balanced and high-energy partnership. You and this person understand each other's intensity. " + description;
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
