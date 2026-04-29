import { supabase } from '../supabaseClient';

export async function loadCurrentReflection() {
    const { data, error } = await supabase
        .from('weekly_reflections')
        .select('*')
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .order('week_number', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function loadPlayerResponse(reflectionId, authUserId) {
    const { data, error } = await supabase
        .from('weekly_reflection_responses')
        .select('*')
        .eq('reflection_id', reflectionId)
        .eq('auth_user_id', authUserId)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

export async function submitResponse(reflectionId, playerId, authUserId, answers) {
    const payload = {
        reflection_id: reflectionId,
        player_id: playerId,
        auth_user_id: authUserId,
        answers,
        submitted_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('weekly_reflection_responses')
        .insert(payload)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateResponse(responseId, answers) {
    const { data, error } = await supabase
        .from('weekly_reflection_responses')
        .update({ answers, updated_at: new Date().toISOString() })
        .eq('id', responseId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function loadResponseHistory(authUserId) {
    const { data, error } = await supabase
        .from('weekly_reflection_responses')
        .select('*, weekly_reflections(week_number, week_label, questions)')
        .eq('auth_user_id', authUserId)
        .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
}
