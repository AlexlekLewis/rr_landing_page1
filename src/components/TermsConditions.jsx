import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

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
                    <p className="text-white/70 mt-4 text-sm">Last updated: July 2026</p>
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
                            <li><strong>Risk Acknowledgement:</strong> Cricket is an active sport with inherent risks. By participating in any Academy assessment session, training, camp, clinic, or program, you acknowledge and accept all risks of physical injury, and agree that the Academy and its coaching staff are not liable for injuries sustained during standard training activities.</li>
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
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">11. Session Times, Session Allocation &amp; Program Changes</h2>

                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            This clause explains two things every family should understand before they enrol:
                            (a) the session day and time shown when you book is our planned schedule, not a fixed
                            guarantee for the length of the program; and (b) the Academy may ask a player to move
                            to a different session, and the reasons we would do that. It applies to every Academy
                            Program, including the Junior Royals programs and the Elite Royals / Power Game
                            programs.
                        </p>

                        <div className="my-6 p-5 border-l-4 border-rr-pink bg-rr-navy/5 rounded-r-lg">
                            <p className="font-bold uppercase tracking-wide text-rr-navy mb-2">Our position in plain terms</p>
                            <p className="text-rr-dark/90 leading-relaxed">
                                Enrolling secures a player a <strong>place in the program</strong> — it does not
                                permanently reserve one specific day, time, squad, coach, or venue. Session times can
                                change, and from time to time the coaching team will ask a player to move to an
                                earlier or later session. We do this to keep every group a <strong>safe, enjoyable
                                learning environment where a player can confidently grow</strong> — the Royals Way.
                                We will <strong>always speak with the player and their parent/guardian before any
                                move</strong> and work with the family to land on a session that works.
                            </p>
                        </div>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">11.1  Session times and venues are indicative</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            The session day, time, start date, duration and venue displayed at the point of booking,
                            on the website, or in any marketing material are the Academy's planned schedule as at
                            the time of publication. They are <strong>indicative and subject to change</strong>.
                            Changes may be required for reasons including, without limitation: venue or facility
                            availability, coach availability, group sizes and coach-to-player ratios, weather,
                            public holidays or school-holiday scheduling, safety requirements, or the number of
                            players who enrol in a given age group. Where a session day, time, start date or venue
                            changes, the Academy will notify affected families in writing (by email and/or SMS) as
                            early as reasonably practicable before the change takes effect.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">11.2  Selecting a session at booking is a preference, not a guarantee</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            Where the enrolment form allows a family to select a session day and time, that selection
                            records the family's preference and reserves a place in the program at that centre. It
                            does not constitute a guarantee that the player will train in that specific session, with
                            that specific group, or under a specific coach, for the whole of the program. Final squad
                            and session allocation is made by the Academy's coaching team, and squads may be
                            reviewed and adjusted at any point during a program.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">11.3  Moving a player to a different session</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            The Academy may, at its discretion, request that a player move to an earlier or later
                            session, to a different squad or group, or (where more than one is operating) to a
                            different venue. The Academy will do so only where, in the reasonable opinion of the
                            coaching team, the move is warranted on one or more of the following grounds:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-rr-dark/80 mb-4">
                            <li><strong>Safety of the player or of others.</strong> For example, where a player's age, physical size, or stage of development means the intensity or pace of a session presents a risk to them or to other participants, or where a safer coach-to-player ratio is required.</li>
                            <li><strong>The benefit and development of the player.</strong> For example, where a different session better matches a player's current skill level, confidence, or learning needs, so they are challenged appropriately rather than overwhelmed or under-stretched.</li>
                            <li><strong>The balance of each squad.</strong> For example, to keep group sizes, age spread, and ability range workable across all sessions at a centre, so that every group can be coached properly and every player gets meaningful time, feedback, and repetitions.</li>
                        </ul>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            These grounds reflect the Academy's coaching philosophy — the Royals Way — that players
                            develop best in a safe, enjoyable environment matched to their stage, where they can
                            train with confidence. A request to move a session is a coaching and safety decision.
                            It is <strong>not</strong> a disciplinary measure, a demotion, or a statement about a
                            player's worth, and it does not of itself indicate any fault on the part of the player.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">11.4  Consultation with families</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            Before any session change under clause 11.3 takes effect, the Academy will contact the
                            player and, where the player is under 18, their parent or guardian. The Academy will
                            explain the reason for the proposed move, set out the alternative session or sessions
                            available, and work with the family to agree an arrangement that suits them. Where the
                            alternatives offered do not suit a family's circumstances, the Academy will make
                            reasonable efforts to find another workable option — which may include a different day,
                            a different time, or (where available) another Academy centre or program.
                        </p>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            Where, after that consultation, no alternative can be agreed, the final decision on
                            session and squad allocation rests with the Academy. In that event the Academy may, at
                            its discretion, issue a credit in accordance with clauses 12.5 and 12.6. A change of
                            session made in accordance with this clause 11 does not, of itself, constitute a failure
                            to supply the program or a failure of a consumer guarantee, and does not of itself give
                            rise to an entitlement to a refund. Nothing in this clause limits your rights under the
                            Australian Consumer Law (see clause 12.8).
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">11.5  Make-up and missed sessions</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            Where a player is unable to attend their allocated session, any make-up or catch-up
                            session is offered at the Academy's discretion, subject to capacity, coach availability,
                            and the age-appropriateness of the alternative session. Attending a make-up session in
                            another group does not change a player's ongoing session allocation.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">11.6  Program changes and cancellation</h3>
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
                            This clause applies once a player has been offered and has accepted a place in any
                            Rajasthan Royals Academy Melbourne program — including, without limitation, the Elite
                            Program, the Holiday Programs, the Junior Royals camps, the Female Cricket Introduction
                            and Female Empowerment programs, the Little Crickets program, and any other paid program,
                            camp, or clinic operated by the Academy (each, an "<strong>Academy Program</strong>") —
                            and fees have been paid or become payable. It governs withdrawals initiated by the
                            participant or their family, and is separate from Clause 11, which governs session
                            times, session and squad allocation, and changes or cancellation initiated by the
                            Academy.
                        </p>

                        <div className="my-6 p-5 border-l-4 border-rr-pink bg-rr-navy/5 rounded-r-lg">
                            <p className="font-bold uppercase tracking-wide text-rr-navy mb-2">Our position in plain terms</p>
                            <p className="text-rr-dark/90 leading-relaxed">
                                Program fees are <strong>non-refundable</strong> once a place in any Academy Program has been accepted.
                                The Academy does not provide cash refunds where a participant or their family chooses to withdraw
                                from an Academy Program. Where a participant withdraws, the Academy may — at its sole discretion
                                and subject to the provisions below — offer a <strong>credit</strong> toward a future Academy Program
                                or for transfer to a sibling. This reflects costs the Academy commits to and cannot recover, and,
                                where relevant, the loss of a squad or camp position another applicant could otherwise have taken.
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
                            When a place in any Academy Program is confirmed, the Academy commits in advance to costs that
                            cannot be recovered if a player later withdraws. These typically include coaching allocation,
                            facility and lane bookings, equipment, kit, player resources, and administration. Where the
                            Academy Program has a limited squad or camp capacity, a confirmed place also removes that
                            position from the cohort, meaning another applicant who could have taken it is turned away.
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
                            If a participant withdraws before the first scheduled session of the Academy Program, the
                            Academy may issue, at its discretion, a credit equal to the program fee less the Enrolment
                            Component. The credit may be applied to a future Academy Program or transferred to a sibling,
                            and is subject to such reasonable conditions (including expiry) as the Academy specifies at
                            the time of issue.
                        </p>

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">12.6  Discretionary credit — after the program commences</h3>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            If a participant withdraws after the Academy Program has commenced, the Academy may issue,
                            at its discretion, a credit for the portion of the Academy Program not yet delivered, less
                            the Enrolment Component, calculated on a pro-rata basis. No credit is available for
                            withdrawals occurring after the midpoint of the Academy Program (or, for short-form programs
                            such as single-day camps or clinics, after the program has commenced), as the substantial
                            majority of committed costs have by then been incurred.
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

                        <h3 className="font-bold uppercase tracking-wide text-rr-navy text-sm mt-6 mb-2">12.10  Players who do not meet the playing standard</h3>
                        <p className="text-rr-dark/80 leading-relaxed">
                            The Power Game Program is built for representative-standard cricketers (VMCU representative
                            level or higher). A place may be secured by any eligible player, including a player who has
                            not yet played representative cricket. If, after a place is secured, the coaching team assesses
                            that a player does not meet the program's minimum playing standard, the Academy will first offer
                            to move the player to a more suitable session within the program, or recommend another Academy
                            program better matched to their development. If the player (or their parent/guardian) would prefer
                            not to continue on that basis, then <strong>notwithstanding clauses 12.3 and 12.4</strong> they may
                            request a refund of the program fee <strong>less a $50 administration fee</strong> (which covers
                            payment processing and administration). This goodwill remedy applies only to genuine
                            playing-standard mismatches and does not otherwise vary this clause 12.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">13. Referral Program</h2>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            From time to time the Academy may operate a referral program under which an existing
                            participant (the referring member) may receive a benefit when a person they refer applies,
                            is accepted, and pays in full for a program. Participation in the referral program is subject
                            to the following terms:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-rr-dark/80">
                            <li>To be eligible, the referred applicant must enter the current referral code together with the name of the referring member at the time of application, and must be confirmed by the Academy and pay their program fee in full.</li>
                            <li>Any referral benefit is issued to the referring member as a <strong>credit toward a future Academy program only</strong>. It has no cash value, is not transferable, and is not redeemable for cash.</li>
                            <li><strong>Payments already made</strong> for a current or past program are <strong>not eligible</strong> for the referral benefit, and the benefit cannot be applied retrospectively to fees that have already been paid.</li>
                            <li>The referral benefit does not give rise to any <strong>refund or return of money of any kind</strong>.</li>
                            <li>The Academy <strong>reserves the right to refuse, vary, withhold or withdraw</strong> any referral, code, or benefit, and to amend or discontinue the referral program, at its sole discretion and at any time.</li>
                            <li>Each referral is confirmed by the Academy before any benefit is applied. A benefit will not be applied where, in the reasonable opinion of the Academy, the program has been misused or the information provided is inaccurate.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">14. Governing Law</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of the
                            State of Victoria, Australia. Any disputes arising in connection with these Terms
                            shall be subject to the exclusive jurisdiction of the courts of Victoria.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">15. Amendments</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            We reserve the right to amend these Terms at any time. Updated Terms will be posted
                            on this page with a revised date. Continued use of the website or participation in
                            the application process and assessment RSVP following any changes constitutes acceptance of the revised Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">16. Contact Us</h2>
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
            <Footer />
        </div>
    );
};

export default TermsConditions;
