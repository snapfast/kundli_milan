import { calculateAstrology } from './astrology';

describe('calculateAstrology', () => {
    test('throws error for invalid date/time', () => {
        const invalidDob = 'invalid-date';
        const invalidTob = 'invalid-time';

        expect(() => {
            calculateAstrology(invalidDob, invalidTob);
        }).toThrow(`Invalid Date generated from ${invalidDob} ${invalidTob}`);
    });
});
