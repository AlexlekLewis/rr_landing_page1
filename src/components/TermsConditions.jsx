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
                    <p className="text-white/70 mt-4 text-sm">Last updated: May 2026</p>
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
                            <li><strong>Phase 1: Initial Application.</strong> By submitting your initial application, you agree to these Terms for the purpose of evaluation and scouting. Submission does not guarantee an invitation to an assessment or acceptance.</li>
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
                            <li><strong>Assessment &amp; Evaluation:</strong> Shortlisted applicants may be invited to attend in-person skills assessments, fitness evaluations, and interviews at the Academy's discretion.</li>
                            <li><strong>Selection Criteria:</strong> Selection is based on a holistic evaluation including, but not limited to, technical skill, tactical awareness, physical fitness, mental resilience, attitude, and development potential.</li>
                            <li><strong>Panel Decisions:</strong> All selection decisions are made by the Academy's coaching and selection panel. Decisions are final and not subject to appeal or negotiation.</li>
                            <li><strong>No Guaranteed Outcome:</strong> Applying to or attending an assessment for the Academy does not guarantee selection, placement, or any form of contractual engagement with the Rajasthan Royals or its affiliates.</li>
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
                            Failure to comply with these standards may result in suspension or immediate removal from
                            the program. Where a participant is removed for misconduct, fees for the remainder of the
                            program are non-refundable. This does not limit any rights you may have under the
                            Australian Consumer Law.
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
                            any assessments or Academy activities is undertaken at the applicant's own risk.
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
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">12. Participant Withdrawal &amp; Refunds</h2>

                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            This clause applies once a player has been offered and has accepted a place in the Elite
                            Program and fees have been paid or become payable. It governs withdrawals initiated by
                            the participant or their family, and is separate from Clause 11, which governs changes
                            or cancellation initiated by the Academy.
                        </p>

                        <div className="my-6 p-5 border-l-4 border-rr-pink bg-rr-navy/5 rounded-r-lg">
                            <p className="font-bold uppercase tracking-wide text-rr-navy mb-2">Our position in plain terms</p>
                            <p className="text-rr-dark/90 leading-relaxed">
                                Program fees are <strong>non-refundable</strong> once a place in the Elite Program has been accepted.
                                The Academy does not provide cash refunds where a participant or their family chooses to withdraw.
                                Where a participant withdraws, the Academy may — at its sole discretion and subject to the
                                provisions below — offer a <strong>credit</strong> toward a future Academy intake or for transfer to a
                                sibling. This reflects costs the Academy commits to and cannot recover, and the loss of a squad
                                position another applicant could otherwise have taken.
                            </p>
                        </div>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">12.1  Statutory framework</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            This clause operates under, and is to be read consistently with, the
                            <strong> Australian Consumer Law</strong> (Schedule 2 of the
                            <em> Competition and Consumer Act 2010</em> (Cth)) (the "<strong>ACL</strong>"). Under the ACL,
                            a consumer is entitled to a refund only where a service fails to meet a consumer guarantee —
                            for example, where the service is not supplied, is not rendered with due care and skill,
                            is not of acceptable quality, or is not reasonably fit for its disclosed purpose.
                            A withdrawal by the participant for personal reasons — including travel, relocation,
                            scheduling, or a change of mind — is not a failure of a consumer guarantee and does not
                            give rise to a refund entitlement under the ACL. Nothing in this clause is intended to
                            limit, exclude, or modify any non-excludable right you may have under the ACL.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">12.2  Committed costs</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            When a place in the Elite Program is confirmed, the Academy commits in advance to costs that
                            cannot be recovered if a player later withdraws. These include coaching allocation, facility
                            and lane bookings, player resources, and administration. A confirmed place also removes that
                            position from a limited squad, meaning another applicant who could have taken it is turned away.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">12.3  Enrolment component (non-refundable)</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            A defined portion of the program fee — the Enrolment Component, specified on the enrolment
                            form — is non-refundable once a place is accepted. This reflects the committed costs
                            described above and represents a genuine pre-estimate of the loss the Academy incurs on a
                            withdrawal.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">12.4  Change-of-mind withdrawals — no cash refund</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            Withdrawals for reasons including travel, relocation, scheduling conflicts, family
                            circumstances, or a decision not to continue are treated as a change of mind. The Academy
                            is <strong>not obliged to provide, and will not provide, a cash refund</strong> in these circumstances. The only
                            remedy available is a discretionary credit issued in accordance with clauses 12.5 and 12.6
                            below.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">12.5  Discretionary credit — before the program commences</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            If a participant withdraws before the first scheduled session, the Academy may issue, at its
                            discretion, a credit equal to the program fee less the Enrolment Component. The credit may
                            be applied to a future Academy intake or transferred to a sibling, and is subject to such
                            reasonable conditions (including expiry) as the Academy specifies at the time of issue.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">12.6  Discretionary credit — after the program commences</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            If a participant withdraws after the program has commenced, the Academy may issue, at its
                            discretion, a credit for the portion of the program not yet delivered, less the Enrolment
                            Component, calculated on a pro-rata basis. No credit is available for withdrawals occurring
                            after the midpoint of the program block, as the substantial majority of committed costs have
                            by then been incurred.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">12.7  Genuine hardship</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            The Academy may, at its sole discretion, offer a cash refund or an enhanced credit where a
                            participant withdraws due to genuine hardship — such as a serious medical condition or
                            significant family emergency — supported by reasonable documentation. Any such arrangement
                            is made on an exceptional, case-by-case basis, is not an admission of any refund obligation,
                            and does not set a precedent.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">12.8  Your rights under the Australian Consumer Law</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            Nothing in this clause limits or excludes any rights you may have under the Australian
                            Consumer Law, including the consumer guarantees in Part 3-2, Division 1 of the ACL. If the
                            Academy fails to deliver the program in accordance with the consumer guarantees, you may be
                            entitled to remedies under the ACL independently of this clause, including a refund where
                            the failure amounts to a major failure.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">12.9  Requesting a withdrawal</h3>
                        <p className="text-rr-dark/80 leading-relaxed">
                            Withdrawal requests must be made in writing to <span className="font-semibold">eliteprogram@rramelbourne.com</span>.
                            The effective date of withdrawal is the date the written request is received by the Academy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">13. Governing Law</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of the
                            State of Victoria, Australia. Any disputes arising in connection with these Terms
                            shall be subject to the exclusive jurisdiction of the courts of Victoria.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">14. Amendments</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            We reserve the right to amend these Terms at any time. Updated Terms will be posted
                            on this page with a revised date. Continued use of the website or participation in
                            the application process and assessment RSVP following any changes constitutes acceptance of the revised Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">15. Contact Us</h2>
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
