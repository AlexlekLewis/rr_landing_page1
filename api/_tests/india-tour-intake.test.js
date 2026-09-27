// The retired intake endpoint must refuse everything and store nothing — it used
// to accept children's passport and medical details from an open page.
import { describe, it, expect } from 'vitest';
import handler from '../india-tour-intake.js';

const call = (method, body) => {
    const res = {
        statusCode: null,
        headers: {},
        payload: undefined,
        setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
        status(code) { this.statusCode = code; return this; },
        json(p) { this.payload = p; return this; },
    };
    handler({ method, body }, res);
    return res;
};

describe('api/india-tour-intake (retired)', () => {
    it.each(['POST', 'GET', 'PUT', 'OPTIONS'])('answers %s with 410 Gone', (method) => {
        const res = call(method, { traveller_type: 'minor', given_names: 'Sample', surname: 'Player', email: 'a@b.co', passport_no: 'X1' });
        expect(res.statusCode).toBe(410);
        expect(res.payload.error).toBe('gone');
        expect(res.headers['cache-control']).toBe('no-store');
    });

    it('points people to the working inbox, not the dead rrmelbourne.com.au address', () => {
        const res = call('POST', {});
        expect(res.payload.message).toContain('info@rramelbourne.com');
        expect(res.payload.message).not.toContain('rrmelbourne.com.au');
    });
});
