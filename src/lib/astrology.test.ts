import { calculateAstrology } from './astrology';

describe('calculateAstrology', () => {
    test('throws error for invalid date/time', () => {
        const invalidDob = 'invalid-date';
        const invalidTob = 'invalid-time';

        expect(() => {
            calculateAstrology(invalidDob, invalidTob);
        }).toThrow(`Invalid Date generated from ${invalidDob} ${invalidTob}`);
    });

    test('memoizes/caches results for identical parameters', () => {
        const dob = '1993-11-02';
        const tob = '13:10';
        const lat = 31.38;
        const lon = 76.38;

        const result1 = calculateAstrology(dob, tob, lat, lon);
        const result2 = calculateAstrology(dob, tob, lat, lon);

        // Multiple calls with the identical inputs must return the exact same object reference
        expect(result1).toBe(result2);

        // Different parameters should return a new object reference
        const result3 = calculateAstrology(dob, tob, lat + 1, lon);
        expect(result1).not.toBe(result3);
    });
});
