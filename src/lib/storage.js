import { supabase } from './supabase';

const CV_BUCKET = 'cvs';
const DEFAULT_SIGNED_URL_TTL_SECONDS = 300;

// Uploads a CV/resume file and returns the storage path written into
// the `cv_url` column. New uploads use crypto.randomUUID() so paths
// cannot be brute-forced by walking timestamp + base36 random suffix
// (the legacy pattern).
//
// IMPORTANT: this returns the storage PATH (e.g. "ab12cd34.pdf"), not
// a public URL. The `cvs` bucket should be private in Supabase; admin
// reads must go through getSignedCVUrl() to mint a short-lived signed
// URL on demand. Legacy rows containing full https:// URLs continue
// to work — see getSignedCVUrl().
export async function uploadCV(file) {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const safeExt = (fileExt || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || 'bin';
    const path = `${crypto.randomUUID()}.${safeExt}`;
    const { error } = await supabase.storage.from(CV_BUCKET).upload(path, file);
    if (error) throw error;
    return path;
}

// Resolves whatever was stored in the cv_url column into a URL the
// admin can click. Two cases:
//   1. Legacy value containing "://" — a full public URL from the
//      old getPublicUrl pattern. Returned as-is.
//   2. New value — a storage path. Sign it with createSignedUrl so
//      it works even after the `cvs` bucket is set private.
export async function getSignedCVUrl(stored, ttl = DEFAULT_SIGNED_URL_TTL_SECONDS) {
    if (!stored) return null;
    if (stored.includes('://')) return stored;
    const { data, error } = await supabase.storage
        .from(CV_BUCKET)
        .createSignedUrl(stored, ttl);
    if (error) throw error;
    return data?.signedUrl || null;
}
