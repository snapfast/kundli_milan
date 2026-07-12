const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbxRBzbfe8Crb7dsuqvTWRlYEHvL-ByaOcrrIEOVOuS0oXLaaaiR_-4iiXFy6hxxu2pF/exec';

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    phone: string;
    pin?: string;
    dob: string;
    tob: string;
    gender: string;
    location: string;
    lat?: string;
    lon?: string;
    currentLocation?: string;
    currentLat?: string;
    currentLon?: string;
    height?: string;
    maritalStatus?: string;
    education?: string;
    occupation?: string;
    income?: string;
    religion?: string;
    bio?: string;
    nakshatraIdx?: number;
    moonSignIdx?: number;
    isMoonManglik?: boolean;
    isLaganManglik?: boolean;
    matches?: {
        uid: string;
        name: string;
        score: number;
        category: string;
        description?: string;
        maxScore?: number;
        kootas?: {
            name: string;
            score: number;
            max: number;
            areaOfLife: string;
            girlValue: string;
            boyValue: string;
        }[];
        doshas?: {
            name: string;
            description: string;
            isCancelled: boolean;
        }[];
    }[];
    nearest?: {
        uid: string;
        name: string;
        score: number;
        category: string;
        description?: string;
        distance: number;
        maxScore?: number;
        kootas?: {
            name: string;
            score: number;
            max: number;
            areaOfLife: string;
            girlValue: string;
            boyValue: string;
        }[];
        doshas?: {
            name: string;
            description: string;
            isCancelled: boolean;
        }[];
    }[];
    matchesOppositeSex?: {
        uid: string;
        name: string;
        score: number;
        category: string;
        description?: string;
        maxScore?: number;
        kootas?: {
            name: string;
            score: number;
            max: number;
            areaOfLife: string;
            girlValue: string;
            boyValue: string;
        }[];
        doshas?: {
            name: string;
            description: string;
            isCancelled: boolean;
        }[];
    }[];
    nearestOppositeSex?: {
        uid: string;
        name: string;
        score: number;
        category: string;
        description?: string;
        distance: number;
        maxScore?: number;
        kootas?: {
            name: string;
            score: number;
            max: number;
            areaOfLife: string;
            girlValue: string;
            boyValue: string;
        }[];
        doshas?: {
            name: string;
            description: string;
            isCancelled: boolean;
        }[];
    }[];
}

let usersCache: UserProfile[] | null = null;
let fetchPromise: Promise<UserProfile[]> | null = null;
const USERS_CACHE_KEY = 'users_list_cache';
const USERS_CACHE_TIME_KEY = 'users_list_cache_timestamp';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export function invalidateUsersCache() {
    usersCache = null;
    if (typeof window !== 'undefined') {
        localStorage.removeItem(USERS_CACHE_KEY);
        localStorage.removeItem(USERS_CACHE_TIME_KEY);
    }
}

export async function fetchUserCount(): Promise<number> {
    // If we already have users in cache, just return the count from there
    if (usersCache) return usersCache.length;

    try {
        const response = await fetch(`${BACKEND_URL}?action=count`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result && result.status === 'success' && typeof result.count === 'number') {
            return result.count;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching user count:', error);
        // Fallback to full fetch if count-only fails or if backend isn't updated yet
        const users = await fetchUsers();
        return users.length;
    }
}

export async function fetchUsers(): Promise<UserProfile[]> {
    if (usersCache) return usersCache;

    if (typeof window !== 'undefined') {
        const cachedData = localStorage.getItem(USERS_CACHE_KEY);
        const cachedTime = localStorage.getItem(USERS_CACHE_TIME_KEY);
        const now = Date.now();

        if (cachedData && cachedTime && (now - parseInt(cachedTime) < CACHE_TTL)) {
            try {
                usersCache = JSON.parse(cachedData);
                return usersCache!;
            } catch (e) {
                console.warn('Failed to parse users cache:', e);
                invalidateUsersCache();
            }
        }
    }

    if (fetchPromise) return fetchPromise;

    async function doFetch(): Promise<UserProfile[]> {
        try {
            const response = await fetch(BACKEND_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            // Handle both direct array and { status: 'success', data: [...] } formats
            let data: any[] = [];
            if (Array.isArray(result)) {
                data = result;
            } else if (result && typeof result === 'object' && Array.isArray(result.data)) {
                data = result.data;
            } else {
                console.warn('API returned unexpected format:', result);
                return [];
            }

            // Map and clean data from backend
            const users = data.map((u: any) => ({
                ...u,
                uid: u.uid || u.userId || '',
                // Explicitly convert types as backend might return them as strings/various types
                nakshatraIdx: (u.nakshatraIdx !== '' && u.nakshatraIdx !== undefined) ? Number(u.nakshatraIdx) : undefined,
                moonSignIdx: (u.moonSignIdx !== '' && u.moonSignIdx !== undefined) ? Number(u.moonSignIdx) : undefined,
                isMoonManglik: String(u.isMoonManglik).toLowerCase() === 'true',
                isLaganManglik: String(u.isLaganManglik).toLowerCase() === 'true',
                lat: u.lat !== undefined ? String(u.lat) : undefined,
                lon: u.lon !== undefined ? String(u.lon) : undefined,
                currentLocation: u.currentLocation !== undefined ? String(u.currentLocation) : undefined,
                currentLat: u.currentLat !== undefined ? String(u.currentLat) : undefined,
                currentLon: u.currentLon !== undefined ? String(u.currentLon) : undefined,
                phone: u.phone !== undefined ? String(u.phone) : '',
                pin: u.pin !== undefined ? String(u.pin) : '',
                height: u.height !== undefined ? String(u.height) : undefined,
                maritalStatus: u.maritalStatus !== undefined ? String(u.maritalStatus) : undefined,
                education: u.education !== undefined ? String(u.education) : undefined,
                occupation: u.occupation !== undefined ? String(u.occupation) : undefined,
                income: u.income !== undefined ? String(u.income) : undefined,
                religion: u.religion !== undefined ? String(u.religion) : undefined,
                bio: u.bio !== undefined ? String(u.bio) : undefined
            })) as UserProfile[];

            usersCache = users;
            if (typeof window !== 'undefined') {
                localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(users));
                localStorage.setItem(USERS_CACHE_TIME_KEY, Date.now().toString());
            }
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        } finally {
            fetchPromise = null;
        }
    }

    fetchPromise = doFetch();
    return fetchPromise;
}

export async function saveUserProfile(profile: UserProfile): Promise<boolean> {
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            mode: 'no-cors', // This is used to bypass CORS preflight; response is opaque
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });

        // With 'no-cors', response.ok is always false and status is 0.
        // We assume success if no error was thrown during fetch.
        console.log('User profile submission sent to backend');
        invalidateUsersCache();
        return true;
    } catch (error) {
        console.error('Critical error during profile submission:', error);
        return false;
    }
}

export async function resetUserProfile(uid: string): Promise<boolean> {
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid,
                action: 'delete'
            }),
        });
        console.log('User profile deletion request sent to backend');
        invalidateUsersCache();
        return true;
    } catch (error) {
        console.error('Critical error during profile deletion:', error);
        return false;
    }
}
