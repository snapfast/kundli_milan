const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbyOhkO-K9w-ErN47ZSYSfYqohMTU0VMi6ytTZKI_9lGprRKORxQ8zRDNXns7vM9dHS15g/exec';

export interface UserProfile {
    userId: string;
    name: string;
    dob: string;
    tob: string;
    gender: string;
    location: string;
    nakshatraIdx?: number;
    moonSignIdx?: number;
    matches?: {
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
        if (Array.isArray(result)) {
            return result as UserProfile[];
        } else if (result && typeof result === 'object' && Array.isArray(result.data)) {
            return result.data as UserProfile[];
        }

        console.warn('API returned unexpected format:', result);
        return [];
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

export async function resetUserProfile(userId: string): Promise<boolean> {
    return saveUserProfile({
        userId,
        name: '',
        dob: '',
        tob: '',
        gender: '',
        location: '',
        matches: []
    });
}
