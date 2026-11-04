import { expect, it } from 'vitest';
import { isBookingFlowPath, isPrivateBookingPath, privateBookingAnalytics } from './booking-privacy';

it.each(['/manage', '/manage/old-link', '/MANAGE', '/%6danage'])('keeps legacy family routes private before any link is processed: %s', path => {
  expect(isBookingFlowPath(path)).toBe(true);
  expect(isPrivateBookingPath(path)).toBe(true);
  expect(privateBookingAnalytics({ properties: {} }, path)).toBeNull();
});
it('drops analytics on a public page if its URL or referrer points at a family page', () => {
  for (const key of ['$current_url', '$referrer']) {
    expect(privateBookingAnalytics({ properties: { [key]: 'https://example.test/manage?token=redacted-unit-marker' } }, '/')).toBeNull();
  }
});
