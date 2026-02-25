import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://pudldzgmluwoocwxtzhw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZGxkemdtbHV3b29jd3h0emh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTA0OTQsImV4cCI6MjA4NDk4NjQ5NH0.X-pDkxLGDGIpno_HVmPTURXf4IZ2jucZURXjj3si0gg'
);

const newStages = [
    { name: 'Assessment Invited', slug: 'assessment_invited', sort_order: 5, color: '#8B5CF6', is_default: false },
    { name: 'Assessment Confirmed', slug: 'assessment_confirmed', sort_order: 6, color: '#06B6D4', is_default: false },
    { name: 'Assessment Unavailable', slug: 'assessment_unavailable', sort_order: 7, color: '#F97316', is_default: false },
    { name: 'Considering', slug: 'considering', sort_order: 8, color: '#EAB308', is_default: false },
    { name: 'Declined', slug: 'declined', sort_order: 9, color: '#EF4444', is_default: false },
    { name: 'Assessed', slug: 'assessed', sort_order: 10, color: '#14B8A6', is_default: false },
    { name: 'Offer Extended', slug: 'offer_extended', sort_order: 11, color: '#EC4899', is_default: false },
    { name: 'Enrolled', slug: 'enrolled', sort_order: 12, color: '#10B981', is_default: false },
];

async function addStages() {
    // Check existing slugs to avoid duplicates
    const { data: existing } = await supabase.from('pipeline_stages').select('slug');
    const existingSlugs = (existing || []).map(s => s.slug);

    const toInsert = newStages.filter(s => !existingSlugs.includes(s.slug));

    if (toInsert.length === 0) {
        console.log('All LP2 stages already exist. Nothing to insert.');
        return;
    }

    console.log(`Inserting ${toInsert.length} new pipeline stages...`);
    const { data, error } = await supabase.from('pipeline_stages').insert(toInsert).select();

    if (error) {
        console.error('Error inserting stages:', error.message);
    } else {
        console.log('Successfully added stages:');
        data.forEach(s => console.log(`  ✓ ${s.name} (${s.slug}) — sort_order: ${s.sort_order}`));
    }
}

addStages();
