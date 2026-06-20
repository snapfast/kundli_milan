const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbyTluHa86rzRHytgMJo0drfiTbksNsTMp-eKWyS04OEIc5zXBa4e19nrVXrHIvzCfzn/exec';

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    dob: string;
    tob: string;
    gender: string;
    location: string;
    lat?: string;
    lon?: string;
    nakshatraIdx?: number;
    moonSignIdx?: number;
    isMoonManglik?: boolean;
    isLaganManglik?: boolean;
    matches?: {
        uid: string;
        name: string;
        score: number;
        category: string;
    }[];
}

export async function fetchUsers(): Promise<UserProfile[]> {
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

        // Map userId to uid if necessary from backend
        return data.map((u: any) => ({
            ...u,
            uid: u.uid || u.userId || ''
        })) as UserProfile[];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
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
        return true;
    } catch (error) {
        console.error('Critical error during profile deletion:', error);
        return false;
    }
}
