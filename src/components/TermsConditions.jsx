import React from 'react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-white text-rr-dark">
            {/* Header */}
            <div
                className="py-20 md:py-28 text-center text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)' }}
            >
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 container mx-auto px-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-8 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wide">Terms &amp; Conditions</h1>
                    <p className="text-white/70 mt-4 text-sm">Last updated: February 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-16 max-w-3xl">
                <div className="prose prose-lg max-w-none space-y-10">

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">1. Introduction</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            These Terms and Conditions ("Terms") govern your use of the Rajasthan Royals Academy
                            Melbourne website and your participation in the application and selection process for
                            the Academy program. By submitting an application or using our website, you agree to
                            be bound by these Terms. Please read them carefully.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">2. Eligibility</h2>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">To be eligible to apply for the Rajasthan Royals Academy Melbourne program, applicants must:</p>
                        <ul className="list-disc pl-6 space-y-2 text-rr-dark/80">
                            <li>Meet the age and skill requirements specified in the current intake announcement.</li>
                            <li>Provide accurate and truthful information in their application.</li>
                            <li>Be legally permitted to participate in cricket programs within Australia or the relevant jurisdiction.</li>
                            <li>Have the consent of a parent or legal guardian if under the age of 18.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">3. Phases of Engagement</h2>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            Your interaction with the Rajasthan Royals Academy Melbourne occurs in distinct phases:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-rr-dark/80">
                            <li><strong>Phase 1: Initial Application.</strong> By submitting your initial application, you agree to these Terms for the purpose of evaluation and scouting. Submission does not guarantee an invitation to trial or acceptance.</li>
                            <li><strong>Phase 2: Assessment Session &amp; RSVP.</strong> If invited to an assessment session, your RSVP constitutes a secondary consent. By accepting the invitation, you (and your parent/guardian if under 18) acknowledge the physical risks, equipment requirements, and specific terms associated with attending an in-person, high-performance T20 assessment.</li>
                            <li><strong>Incomplete Applications:</strong> Applications that are incomplete, contain false information, or do not meet minimum requirements may be rejected.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">4. Selection Process</h2>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            The selection process is designed to identify talented cricketers who demonstrate the
                            potential to develop within the Rajasthan Royals Melbourne system. Please note:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-rr-dark/80">
                            <li><strong>Trials &amp; Assessment:</strong> Shortlisted applicants may be invited to attend in-person trials, skills assessments, fitness evaluations, and interviews at the Academy's discretion.</li>
                            <li><strong>Selection Criteria:</strong> Selection is based on a holistic evaluation including, but not limited to, technical skill, tactical awareness, physical fitness, mental resilience, attitude, and development potential.</li>
                            <li><strong>Panel Decisions:</strong> All selection decisions are made by the Academy's coaching and selection panel. Decisions are final and not subject to appeal or negotiation.</li>
                            <li><strong>No Guaranteed Outcome:</strong> Applying to or trialling for the Academy does not guarantee selection, placement, or any form of contractual engagement with the Rajasthan Royals or its affiliates.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">5. Right to Select</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            The Rajasthan Royals Academy Melbourne reserves the absolute and sole right to select, reject,
                            or defer any applicant at any stage of the application or selection process, without
                            obligation to provide reasons for its decisions. The Academy may also revoke an offer
                            of placement at any time prior to commencement of the program if it becomes aware of
                            information that, in its reasonable opinion, renders the applicant unsuitable for
                            participation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">6. Participant Conduct</h2>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            All participants accepted into the Academy are expected to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-rr-dark/80">
                            <li>Conduct themselves in a professional and respectful manner at all times.</li>
                            <li>Adhere to the Academy's code of conduct, training schedules, and program requirements.</li>
                            <li>Comply with all applicable laws, regulations, and anti-doping policies.</li>
                            <li>Respect the intellectual property and brand of the Rajasthan Royals Academy Melbourne.</li>
                        </ul>
                        <p className="text-rr-dark/80 leading-relaxed mt-4">
                            Failure to comply with these standards may result in immediate removal from the program
                            without refund.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">7. Health, Safety &amp; Equipment (CA/CV Compliance)</h2>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            The Rajasthan Royals Academy Melbourne takes player safety seriously and strictly adheres to the guidelines set out by Cricket Australia (CA) and Cricket Victoria (CV). By attending an assessment session or participating in the program, you agree to the following:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-rr-dark/80">
                            <li><strong>Helmets &amp; Protective Gear:</strong> It is mandatory for all players (regardless of age) to wear a British Standard (BS7928:2013) compliant helmet when batting, wicket-keeping standing up to the stumps, or fielding in close proximity to the batter.</li>
                            <li><strong>StemGuards:</strong> In alignment with Cricket Australia safety recommendations, the use of neck protectors (StemGuards) is strongly recommended for all players, and is enforced as mandatory for specific high-performance scenarios as directed by the coaching staff.</li>
                            <li><strong>Equipment Standard:</strong> Participants must provide their own personal protective equipment (pads, gloves, protectors) and ensure it is in good, safe working condition. Coaches reserve the right to prevent a player from participating if their equipment is deemed unsafe.</li>
                            <li><strong>Medical Conditions:</strong> It is the responsibility of the player (or parent/guardian if under 18) to disclose any pre-existing medical conditions, allergies, or injuries prior to participating.</li>
                            <li><strong>Risk Acknowledgement:</strong> Cricket is an active sport with inherent risks. By participating in the high-performance assessment sessions or the Elite Program, you acknowledge and accept all risks of physical injury, and agree that the Academy and its coaching staff are not liable for injuries sustained during standard training activities.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">8. Intellectual Property</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            All content on this website, including text, images, logos, graphics, and branding,
                            is the intellectual property of the Rajasthan Royals Academy Melbourne and its licensors.
                            You may not reproduce, distribute, modify, or create derivative works from any content
                            without prior written permission. By submitting media (e.g., performance videos) as
                            part of your application, you grant the Academy a non-exclusive, royalty-free licence
                            to use such media for evaluation, promotional, and marketing purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">9. Limitation of Liability</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            To the fullest extent permitted by law, the Rajasthan Royals Academy Melbourne, its directors,
                            officers, employees, and agents shall not be liable for any direct, indirect, incidental,
                            consequential, or special damages arising from your use of this website, participation
                            in the application process, attendance at the assessment sessions, or involvement in the Academy program. Participation in
                            any trials, assessments, or Academy activities is undertaken at the applicant's own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">10. Indemnification</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            You agree to indemnify and hold harmless the Rajasthan Royals Academy Melbourne and its affiliates
                            from any claims, damages, losses, or expenses (including legal fees) arising from your
                            breach of these Terms, your application, or your participation in the program.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">11. Program Changes &amp; Cancellation</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            The Academy reserves the right to modify, postpone, or cancel any aspect of the program,
                            including schedules, locations, coaching staff, and program structure, at its discretion.
                            In the event of cancellation by the Academy, participants will be offered a transfer to
                            a future program or a refund of applicable fees, at the Academy's discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">12. Governing Law</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of the
                            State of Victoria, Australia. Any disputes arising in connection with these Terms
                            shall be subject to the exclusive jurisdiction of the courts of Victoria.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">13. Amendments</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            We reserve the right to amend these Terms at any time. Updated Terms will be posted
                            on this page with a revised date. Continued use of the website or participation in
                            the application process and assessment RSVP following any changes constitutes acceptance of the revised Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">14. Contact Us</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            If you have any questions regarding these Terms, please contact us at:
                        </p>
                        <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="font-bold text-rr-navy">Rajasthan Royals Academy Melbourne</p>
                            <p className="text-rr-dark/70 mt-1">Email: eliteprogram@rramelbourne.com</p>
                        </div>
                    </section>
                </div>

                {/* Back to Home */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-rr-pink hover:text-rr-navy font-semibold transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
