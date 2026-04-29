import React, { useState, useEffect } from "react";
import {
    loadCurrentReflection,
    loadPlayerResponse,
    submitResponse,
    updateResponse,
    loadResponseHistory,
} from "../db/weeklyReflectionDb";
import { B, F, sCard } from "../data/theme";
import { supabase } from "../supabaseClient";

const TABS = [
    { id: 'current', label: 'This Week' },
    { id: 'history', label: 'Past Weeks' },
];

const CATEGORY_COLOURS = {
    'Short Ball': B.org,
    'Sweeps': B.bl,
    'Fielding': B.grn,
};

export default function WeeklyReflection({ session, userProfile }) {
    const [activeTab, setActiveTab] = useState("current");
    const [reflection, setReflection] = useState(null);
    const [existing, setExisting] = useState(null);
    const [answers, setAnswers] = useState({});
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState(null);
    const [playerId, setPlayerId] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (!session?.user?.id) return;
        let cancelled = false;

        async function load() {
            try {
                const { data: playerRow } = await supabase
                    .from('players')
                    .select('id')
                    .eq('auth_user_id', session.user.id)
                    .eq('submitted', true)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (cancelled) return;
                if (playerRow) setPlayerId(playerRow.id);

                const [ref, hist] = await Promise.all([
                    loadCurrentReflection(),
                    loadResponseHistory(session.user.id),
                ]);

                if (cancelled) return;
                setReflection(ref);
                setHistory(hist);

                if (ref) {
                    const resp = await loadPlayerResponse(ref.id, session.user.id);
                    if (!cancelled && resp) {
                        setExisting(resp);
                        setAnswers(resp.answers || {});
                    }
                }
            } catch (err) {
                console.error("Error loading reflections:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [session?.user?.id]);

    const showToast = (type, text) => {
        setSaveMsg({ type, text });
        setTimeout(() => setSaveMsg(null), 3000);
    };

    const handleSubmit = async () => {
        if (!reflection || !playerId) return;
        setSaving(true);
        try {
            const resp = await submitResponse(reflection.id, playerId, session.user.id, answers);
            setExisting(resp);
            setHistory(prev => [{ ...resp, weekly_reflections: { week_number: reflection.week_number, week_label: reflection.week_label, questions: reflection.questions } }, ...prev]);
            showToast('ok', 'Reflection submitted!');
        } catch (err) {
            console.error(err);
            showToast('err', 'Failed to submit — try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async () => {
        if (!existing) return;
        setSaving(true);
        try {
            const resp = await updateResponse(existing.id, answers);
            setExisting(resp);
            setEditing(false);
            setHistory(prev => prev.map(h => h.id === existing.id ? { ...h, answers } : h));
            showToast('ok', 'Reflection updated!');
        } catch (err) {
            console.error(err);
            showToast('err', 'Failed to update — try again.');
        } finally {
            setSaving(false);
        }
    };

    const questions = reflection?.questions || [];
    const categories = [...new Set(questions.map(q => q.category))];
    const hasContent = Object.values(answers).some(a => (a || '').trim().length > 0);

    const TabBtn = ({ id, label }) => (
        <button onClick={() => setActiveTab(id)} style={{
            flex: 1, padding: 12, border: 'none', background: 'transparent',
            borderBottom: activeTab === id ? `2px solid ${B.bl}` : '2px solid transparent',
            color: activeTab === id ? B.bl : B.g400, fontWeight: activeTab === id ? 800 : 600,
            fontSize: 11, fontFamily: F, cursor: 'pointer', transition: 'all 0.2s',
        }}>{label}</button>
    );

    if (loading) return <div style={{ padding: 24, fontSize: 13, color: B.g400, fontFamily: F, textAlign: 'center' }}>Loading...</div>;

    return (
        <div>
            {saveMsg && (
                <div style={{ padding: '10px 16px', margin: '8px 16px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: F, background: saveMsg.type === 'ok' ? `${B.grn}15` : '#fee2e2', color: saveMsg.type === 'ok' ? B.grn : '#dc2626', border: `1px solid ${saveMsg.type === 'ok' ? `${B.grn}30` : '#fca5a5'}` }}>
                    {saveMsg.text}
                </div>
            )}

            <div style={{ display: 'flex', background: B.w, borderBottom: `1px solid ${B.g200}` }}>
                {TABS.map(t => <TabBtn key={t.id} id={t.id} label={t.label} />)}
            </div>

            <div style={{ padding: 16 }}>
                {activeTab === 'current' && (
                    <>
                        {!reflection ? (
                            <div style={{ ...sCard, padding: 24, textAlign: 'center' }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: B.nvD, fontFamily: F, marginBottom: 4 }}>No Reflection Available Yet</div>
                                <div style={{ fontSize: 12, color: B.g400, fontFamily: F }}>Your coach hasn't published this week's reflection yet. Check back soon.</div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ ...sCard, padding: 16, marginBottom: 16, background: `linear-gradient(135deg, ${B.nvD}, ${B.bl})`, border: 'none' }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontFamily: F, textTransform: 'uppercase', letterSpacing: 1 }}>{reflection.week_label}</div>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: B.w, fontFamily: F, marginTop: 4 }}>End of Week Reflection</div>
                                    {existing && !editing && (
                                        <div style={{ display: 'inline-block', marginTop: 8, padding: '4px 10px', borderRadius: 12, background: 'rgba(16,185,129,0.2)', fontSize: 10, fontWeight: 700, color: B.grn, fontFamily: F }}>
                                            Submitted
                                        </div>
                                    )}
                                </div>

                                {existing && !editing ? (
                                    <div>
                                        {categories.map(cat => (
                                            <div key={cat} style={{ marginBottom: 16 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                                    <div style={{ width: 3, height: 16, borderRadius: 2, background: CATEGORY_COLOURS[cat] || B.bl }} />
                                                    <div style={{ fontSize: 11, fontWeight: 800, color: B.g600, fontFamily: F, textTransform: 'uppercase', letterSpacing: 1 }}>{cat}</div>
                                                </div>
                                                {questions.filter(q => q.category === cat).map(q => (
                                                    <div key={q.id} style={{ ...sCard, padding: 14, marginBottom: 8 }}>
                                                        <div style={{ fontSize: 12, fontWeight: 700, color: B.g600, fontFamily: F, marginBottom: 6 }}>{q.question}</div>
                                                        <div style={{ fontSize: 13, color: B.nv, fontFamily: F, lineHeight: 1.5, whiteSpace: 'pre-wrap', background: B.g50, padding: 10, borderRadius: 6 }}>
                                                            {answers[q.id] || <span style={{ color: B.g400, fontStyle: 'italic' }}>No answer provided.</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        <button onClick={() => setEditing(true)}
                                            style={{ width: '100%', padding: '12px 20px', borderRadius: 8, border: `1px solid ${B.bl}30`, background: `${B.bl}10`, color: B.bl, fontSize: 12, fontWeight: 700, fontFamily: F, cursor: 'pointer', marginTop: 4 }}>
                                            Edit My Responses
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        {categories.map(cat => (
                                            <div key={cat} style={{ marginBottom: 20 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                                    <div style={{ width: 3, height: 16, borderRadius: 2, background: CATEGORY_COLOURS[cat] || B.bl }} />
                                                    <div style={{ fontSize: 11, fontWeight: 800, color: B.g600, fontFamily: F, textTransform: 'uppercase', letterSpacing: 1 }}>{cat}</div>
                                                </div>
                                                {questions.filter(q => q.category === cat).map(q => (
                                                    <div key={q.id} style={{ marginBottom: 14 }}>
                                                        <div style={{ fontSize: 12, fontWeight: 700, color: B.g600, fontFamily: F, marginBottom: 6 }}>{q.question}</div>
                                                        <textarea
                                                            value={answers[q.id] || ''}
                                                            onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                            placeholder="Write your reflection..."
                                                            rows={4}
                                                            style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: `1px solid ${B.g200}`, fontSize: 13, fontFamily: F, background: B.g50, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}

                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button
                                                onClick={existing ? handleUpdate : handleSubmit}
                                                disabled={saving || !hasContent}
                                                style={{ flex: 1, padding: '14px 20px', borderRadius: 8, border: 'none', background: !hasContent ? B.g200 : `linear-gradient(135deg, ${B.bl}, ${B.pk})`, color: !hasContent ? B.g400 : B.w, fontSize: 13, fontWeight: 800, fontFamily: F, cursor: saving || !hasContent ? 'default' : 'pointer', letterSpacing: 0.5, opacity: saving ? 0.7 : 1 }}>
                                                {saving ? 'SAVING...' : existing ? 'UPDATE REFLECTION' : 'SUBMIT REFLECTION'}
                                            </button>
                                            {editing && (
                                                <button onClick={() => { setEditing(false); setAnswers(existing?.answers || {}); }}
                                                    style={{ padding: '14px 20px', borderRadius: 8, border: `1px solid ${B.g200}`, background: B.w, color: B.g600, fontSize: 12, fontWeight: 600, fontFamily: F, cursor: 'pointer' }}>
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'history' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {history.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '32px 0', color: B.g400, fontSize: 13, fontFamily: F }}>
                                No past reflections yet. Complete your first weekly review to start building your history.
                            </div>
                        ) : (
                            history.map(h => {
                                const wr = h.weekly_reflections;
                                const qs = wr?.questions || [];
                                const cats = [...new Set(qs.map(q => q.category))];

                                return (
                                    <div key={h.id} style={{ ...sCard, padding: 16, marginBottom: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 800, color: B.nvD, fontFamily: F }}>{wr?.week_label || `Week ${wr?.week_number}`}</div>
                                                <div style={{ fontSize: 10, color: B.g400, fontFamily: F, marginTop: 2 }}>
                                                    Submitted {new Date(h.submitted_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <div style={{ fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 4, background: `${B.grn}20`, color: B.grn, fontFamily: F }}>DONE</div>
                                        </div>

                                        {cats.map(cat => (
                                            <div key={cat} style={{ marginBottom: 10 }}>
                                                <div style={{ fontSize: 10, fontWeight: 800, color: CATEGORY_COLOURS[cat] || B.bl, fontFamily: F, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{cat}</div>
                                                {qs.filter(q => q.category === cat).map(q => (
                                                    <div key={q.id} style={{ background: B.g50, padding: 10, borderRadius: 6, marginBottom: 6 }}>
                                                        <div style={{ fontSize: 11, fontWeight: 700, color: B.g600, fontFamily: F, marginBottom: 3 }}>{q.question}</div>
                                                        <div style={{ fontSize: 12, color: B.nv, fontFamily: F, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
                                                            {h.answers?.[q.id] || <span style={{ color: B.g400, fontStyle: 'italic' }}>—</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
