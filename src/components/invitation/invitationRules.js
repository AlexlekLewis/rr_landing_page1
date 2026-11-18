// Rules for the invitation-list form: validation and the rows it saves.
// Kept out of the component so they can be tested (invitationRules.test.ts).

export const TABLE = 'invitation_list_registrations';

export const EXPERIENCE = [
    { value: 'new', label: 'New to cricket' },
    { value: 'social', label: 'School, backyard or social cricket' },
    { value: 'club', label: 'Plays for a club' },
    { value: 'representative', label: 'Representative or Premier level' },
];

export const GENDERS = ['Male', 'Female', 'Prefer not to say'];

export const emptyPlayer = () => ({ first_name: '', last_name: '', dob: '', gender: '', experience: '', club_name: '' });

export const EMPTY_FORM = {
    attendee_type: '',        // 'self' | 'child'
    contact_name: '',         // parent/guardian name; unused for 'self' (the player is the contact)
    email: '',
    phone: '',
    in_australia: '',         // 'yes' | 'no'
    in_melbourne: '',         // 'yes' | 'no' (only asked when in Australia)
    country: '',              // only asked when not in Australia
    street_address: '',
    suburb: '',
    postcode: '',
    notes: '',
    accept_terms: false,
    marketing_opt_in: false,
};

// Whole years between a YYYY-MM-DD date of birth and today. null if not a real date.
export const ageFromDob = (dob, today = new Date()) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob || '')) return null;
    const [y, m, d] = dob.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
    let age = today.getFullYear() - y;
    if (today.getMonth() < m - 1 || (today.getMonth() === m - 1 && today.getDate() < d)) age -= 1;
    return age;
};

// Returns { fieldKey: message }. Empty object = the form may be sent.
// Player fields are keyed `p{index}_{field}`.
export const validate = (form, players, today = new Date()) => {
    const e = {};
    const self = form.attendee_type === 'self';
    if (!form.attendee_type) e.attendee_type = 'Please tell us who will attend.';

    players.forEach((p, i) => {
        if (!p.first_name.trim()) e[`p${i}_first_name`] = 'Please enter a first name.';
        if (!p.last_name.trim()) e[`p${i}_last_name`] = 'Please enter a last name.';
        const age = ageFromDob(p.dob, today);
        if (age === null) e[`p${i}_dob`] = 'Please choose the day, month and year.';
        else if (age < 3 || age > 100) e[`p${i}_dob`] = 'Please check the date of birth.';
        else if (self && age < 18) e[`p${i}_dob`] = 'If the player is under 18, a parent or guardian must register them. Choose "My child" above.';
        if (!p.experience) e[`p${i}_experience`] = 'Please choose one.';
    });

    if (!self && form.attendee_type && !form.contact_name.trim()) e.contact_name = 'Please enter your name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address.';
    if (form.phone.replace(/\D/g, '').length < 8) e.phone = 'Please enter a valid phone number.';

    if (!form.in_australia) e.in_australia = 'Please choose yes or no.';
    if (form.in_australia === 'yes') {
        if (!form.in_melbourne) e.in_melbourne = 'Please choose yes or no.';
        if (!form.suburb.trim()) e.suburb = 'Please enter your suburb.';
        if (!/^\d{4}$/.test(form.postcode.trim())) e.postcode = 'Please enter your 4-digit postcode.';
    }
    if (form.in_australia === 'no') {
        if (!form.country.trim()) e.country = 'Please enter your country.';
        if (!form.suburb.trim()) e.suburb = 'Please enter your town or city.';
    }

    if (!form.accept_terms) e.accept_terms = 'Please tick this box to register.';
    return e;
};

// One row per player. Every row carries the same contact details and submission_id.
export const buildRows = (campaignSlug, form, players, { submissionId, attribution = {} }) => {
    const self = form.attendee_type === 'self';
    const inAus = form.in_australia === 'yes';
    return players.map((p) => {
        const first = p.first_name.trim();
        const last = p.last_name.trim();
        return {
            campaign: campaignSlug,
            submission_id: submissionId,
            attendee_type: form.attendee_type,
            player_first_name: first,
            player_last_name: last,
            player_dob: p.dob,
            player_gender: p.gender || null,
            cricket_experience: p.experience,
            club_name: p.club_name.trim() || null,
            contact_name: self ? `${first} ${last}` : form.contact_name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            lives_in_australia: inAus,
            lives_in_melbourne: inAus ? form.in_melbourne === 'yes' : null,
            country: inAus ? 'Australia' : form.country.trim(),
            street_address: form.street_address.trim() || null,
            suburb: form.suburb.trim(),
            postcode: form.postcode.trim() || null,
            notes: form.notes.trim() || null,
            accept_terms: true,
            marketing_opt_in: !!form.marketing_opt_in,
            ...attribution,
        };
    });
};
