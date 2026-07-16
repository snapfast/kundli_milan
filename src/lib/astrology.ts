import * as AstModule from 'astronomy-engine';

// Workaround for ESM/CJS interop in various environments (tsx, vite, etc.)
const Ast = (AstModule as any).default || AstModule;

export interface PlanetData {
    name: string;
    symbol: string;
    degree: string;
    rasi: string;
    house: number;
}

export interface PanchangData {
    tithi: string;
    nakshatra: string;
    nakshatraIdx: number;
    yoga: string;
    karana: string;
    vara: string;
    varaLord: string;
    sunSign: string;
    moonSign: string;
    moonSignIdx: number;
    sunrise: string;
    sunset: string;
    isMoonManglik: boolean;
    isLaganManglik: boolean;
}

export interface ChartData {
    planets: PlanetData[];
    panchang: PanchangData;
}

const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const RASIS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const VARAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const VARA_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

const TITHIS = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

const YOGAS = [
    "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
];

const KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"];

const PLANET_MAP = [
    { name: "Sun", body: Ast.Body.Sun, symbol: "Su" },
    { name: "Moon", body: Ast.Body.Moon, symbol: "Mo" },
    { name: "Mars", body: Ast.Body.Mars, symbol: "Ma" },
    { name: "Mercury", body: Ast.Body.Mercury, symbol: "Me" },
    { name: "Jupiter", body: Ast.Body.Jupiter, symbol: "Ju" },
    { name: "Venus", body: Ast.Body.Venus, symbol: "Ve" },
    { name: "Saturn", body: Ast.Body.Saturn, symbol: "Sa" },
];

function getLahiriAyanamsa(time: Ast.AstroTime): number {
    const T = time.tt / 36525.0;
    return 23.85 + 1.39638 * T + 0.000308 * T * T;
}

function formatTime(date: Date | null): string {
    if (!date) return "--:--";
    return date.getUTCHours().toString().padStart(2, '0') + ":" +
           date.getUTCMinutes().toString().padStart(2, '0');
}

export function calculateAstrology(dob: string, tob: string, lat: number = 28.6139, lon: number = 77.2090): ChartData {
    if (!dob || !tob) {
        throw new Error("Date of Birth and Time of Birth are required for astrology calculation.");
    }
    const [year, month, day] = dob.split('-').map(Number);
    const [hour, minute] = tob.split(':').map(Number);

    // Assuming input is IST (UTC+5:30)
    const istDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
    if (isNaN(istDate.getTime())) {
        throw new Error(`Invalid Date generated from ${dob} ${tob}`);
    }
    const utcDate = new Date(istDate.getTime() - (5.5 * 60 * 60 * 1000));
    const time = Ast.MakeTime(utcDate);
    const ayanamsa = getLahiriAyanamsa(time);

    // 1. Ascendant (Simplified Lagna calculation)
    const siderealTime = Ast.SiderealTime(time);
    const RAMC = (siderealTime * 15 + lon) % 360;
    const rad = Math.PI / 180;
    const phi = lat * rad;
    const rot = Ast.Rotation_ECL_EQD(time);
    const eps = Math.acos(rot.rot[2][2]);
    const alpha = RAMC * rad;
    const lagnaTropical = (Math.atan2(Math.cos(alpha), -(Math.sin(alpha) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) / rad + 360) % 360;
    const lagnaSidereal = (lagnaTropical - ayanamsa + 360) % 360;
    const lagnaRasiIdx = Math.floor(lagnaSidereal / 30);

    const planets: PlanetData[] = [];

    // Add Ascendant
    planets.push({
        name: "Ascendant",
        symbol: "As",
        degree: formatDegree(lagnaSidereal % 30),
        rasi: RASIS[lagnaRasiIdx],
        house: 1
    });

    // Pre-allocate variables to capture values during planetary iteration to avoid redundant astronomy-engine queries
    let siderealSunLong = 0;
    let siderealMoonLong = 0;
    let moonRasiIdx = 0;
    let marsRasiIdx = 0;

    // 2. Planets
    PLANET_MAP.forEach(p => {
        // Compute position vector once
        const pos = Ast.GeoVector(p.body, time, true);
        const ecl = Ast.Ecliptic(pos);
        const siderealLong = (ecl.elon - ayanamsa + 360) % 360;
        const rasiIdx = Math.floor(siderealLong / 30);
        const house = ((rasiIdx - lagnaRasiIdx + 12) % 12) + 1;

        // Capture Sun, Moon, and Mars properties during iteration to optimize down duplicate calls
        if (p.name === "Sun") {
            siderealSunLong = siderealLong;
        } else if (p.name === "Moon") {
            siderealMoonLong = siderealLong;
            moonRasiIdx = rasiIdx;
        } else if (p.name === "Mars") {
            marsRasiIdx = rasiIdx;
        }

        planets.push({
            name: p.name,
            symbol: p.symbol,
            degree: formatDegree(siderealLong % 30),
            rasi: RASIS[rasiIdx],
            house: house
        });
    });

    // 3. Panchang (Using cached sidereal solar and lunar values)
    // The relative angular difference between Moon and Sun is invariant under sidereal/tropical shift (Ayanamsa cancels out)
    const diff = (siderealMoonLong - siderealSunLong + 360) % 360;
    const tithiIdx = Math.floor(diff / 12);
    const nakIdx = Math.floor(siderealMoonLong / (360 / 27));
    const yogaIdx = Math.floor(((siderealSunLong + siderealMoonLong) % 360) / (360 / 27));

    const karanaIdxTotal = Math.floor(diff / 6);
    let karanaIdx;
    if (karanaIdxTotal === 0) karanaIdx = 10;
    else if (karanaIdxTotal >= 57) karanaIdx = 7 + (karanaIdxTotal - 57);
    else karanaIdx = (karanaIdxTotal - 1) % 7;

    const observer = new Ast.Observer(lat, lon, 0);
    const sunrise = Ast.SearchRiseSet(Ast.Body.Sun, observer, 1, time, -24);
    const sunset = Ast.SearchRiseSet(Ast.Body.Sun, observer, -1, time, 24);

    // Calculate Manglik Dosha (Using cached Mars position to avoid redundant astronomy-engine queries)
    // Mars (Mangal) in 1, 4, 7, 8, or 12 house from Ascendant (Lagna) or Moon (Chandra)
    const houseFromLagna = ((marsRasiIdx - lagnaRasiIdx + 12) % 12) + 1;
    const houseFromMoon = ((marsRasiIdx - moonRasiIdx + 12) % 12) + 1;

    const manglikHouses = [1, 4, 7, 8, 12];
    const isLaganManglik = manglikHouses.includes(houseFromLagna);
    const isMoonManglik = manglikHouses.includes(houseFromMoon);

    const dayIdx = istDate.getUTCDay();
    const panchang: PanchangData = {
        tithi: TITHIS[tithiIdx],
        nakshatra: NAKSHATRAS[nakIdx],
        nakshatraIdx: nakIdx,
        yoga: YOGAS[yogaIdx],
        karana: KARANAS[karanaIdx],
        vara: VARAS[dayIdx],
        varaLord: VARA_LORDS[dayIdx],
        sunSign: RASIS[Math.floor(siderealSunLong / 30)],
        moonSign: RASIS[moonRasiIdx],
        moonSignIdx: moonRasiIdx,
        sunrise: formatTime(sunrise ? new Date(sunrise.date.getTime() + 5.5*60*60*1000) : null),
        sunset: formatTime(sunset ? new Date(sunset.date.getTime() + 5.5*60*60*1000) : null),
        isMoonManglik,
        isLaganManglik
    };

    return { planets, panchang };
}

function formatDegree(deg: number): string {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    return `${d}° ${m}'`;
}
