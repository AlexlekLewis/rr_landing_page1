import { useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook providing automation actions triggered from the pipeline.
 * All automations are action-button-triggered (not automatic on drag).
 */
const useAutomations = () => {
    /**
     * Log a pipeline stage transition
     */
    const logTransition = useCallback(async ({ applicationId, fromStage, toStage, action, notes }) => {
        const { error } = await supabase.from('pipeline_activity_log').insert({
            application_id: applicationId,
            from_stage: fromStage,
            to_stage: toStage,
            action: action || 'manual_move',
            notes,
            performed_by: 'admin',
        });

        if (error) console.error('Error logging transition:', error);
        return !error;
    }, []);

    /**
     * Move an application to a new pipeline stage
     */
    const moveToStage = useCallback(async ({ applicationId, entryId, fromStage, toStage }) => {
        const { error } = await supabase
            .from('pipeline_entries')
            .update({ stage_slug: toStage, updated_at: new Date().toISOString() })
            .eq('id', entryId);

        if (error) {
            console.error('Error moving stage:', error);
            return false;
        }

        await logTransition({
            applicationId,
            fromStage,
            toStage,
            action: 'manual_move',
        });

        return true;
    }, [logTransition]);

    /**
     * Send credentials (move to 'credentials_sent' stage)
     * This would call the create-member Edge Function in a full implementation.
     */
    const sendCredentials = useCallback(async ({ application, entryId, currentStage }) => {
        // Log the intent
        await logTransition({
            applicationId: application.id,
            fromStage: currentStage,
            toStage: 'credentials_sent',
            action: 'auto_credentials',
            notes: `Credentials prepared for ${application.first_name} ${application.last_name}`,
        });

        // Move to credentials_sent stage
        await supabase
            .from('pipeline_entries')
            .update({ stage_slug: 'credentials_sent', updated_at: new Date().toISOString() })
            .eq('id', entryId);

        return true;
    }, [logTransition]);

    /**
     * Mark as accepted and onboarded
     */
    const markAccepted = useCallback(async ({ applicationId, entryId, currentStage }) => {
        await logTransition({
            applicationId,
            fromStage: currentStage,
            toStage: 'accepted',
            action: 'auto_onboard',
            notes: 'Marked as accepted and onboarding initiated',
        });

        await supabase
            .from('pipeline_entries')
            .update({ stage_slug: 'accepted', updated_at: new Date().toISOString() })
            .eq('id', entryId);

        return true;
    }, [logTransition]);

    return {
        logTransition,
        moveToStage,
        sendCredentials,
        markAccepted,
    };
};

export default useAutomations;
