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
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        return data as UserProfile[];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function saveUserProfile(profile: UserProfile): Promise<boolean> {
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });
        // Since we use no-cors, we can't really see the response body or status
        return true;
    } catch (error) {
        console.error('Error saving user profile:', error);
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
