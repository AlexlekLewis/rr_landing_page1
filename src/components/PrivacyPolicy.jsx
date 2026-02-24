import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wide">Privacy Policy</h1>
                    <p className="text-white/70 mt-4 text-sm">Last updated: February 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-16 max-w-3xl">
                <div className="prose prose-lg max-w-none space-y-10">

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">1. Introduction</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            Rajasthan Royals Academy Melbourne ("we", "our", "us") is committed to protecting
                            and respecting your privacy. This Privacy Policy explains how we collect, use, store,
                            and protect personal information provided to us through our website, application forms,
                            and related services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">2. Information We Collect &amp; Voluntary Provision</h2>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            By filling out our Application (Phase 1) or Assessment RSVP forms (Phase 2), you voluntarily provide and consent to the collection of your personal data. We may collect and process the following personal data:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-rr-dark/80">
                            <li><strong>Personal Identifiers:</strong> Full name, date of birth, nationality, and gender.</li>
                            <li><strong>Contact Information:</strong> Email address, phone number, and residential address.</li>
                            <li><strong>Cricket Profile:</strong> Playing role, batting and bowling style, domestic team affiliation, career statistics, and competition history.</li>
                            <li><strong>Media &amp; Content:</strong> Photographs, video submissions, performance highlight reels, and any other media you provide as part of your application.</li>
                            <li><strong>Health &amp; Fitness Data:</strong> Physical fitness information, injury history, and medical clearances where required for participation.</li>
                            <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies when you access our website.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">3. Underage Applicants (Under 18)</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            For any applicant under the age of 18, all applications, RSVPs, and associated forms <strong>must</strong> be completed and submitted by a parent or legal guardian. We do not directly collect email addresses or phone numbers from applicants under 18; instead, we collect the contact details of their parent/guardian. By submitting an application or RSVP on behalf of a minor, the parent/guardian explicitly consents to the collection, use, and processing of the minor's data as described in this policy, and acknowledges that they are voluntarily providing this information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">4. Data Ownership</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            All personal data submitted by applicants remains the property of the Rajasthan Royals
                            Academy Melbourne. By submitting your application, you acknowledge that the Rajasthan Royals Academy Melbourne
                            and its affiliated academies hold custodianship over the data you provide for the
                            purposes outlined in this policy. You retain the right to request access to, correction of,
                            or deletion of your personal data at any time, subject to our legal obligations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">5. How We Use Your Information</h2>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">We use the information we collect for the following purposes:</p>
                        <ul className="list-disc pl-6 space-y-2 text-rr-dark/80">
                            <li>To process and evaluate your application to the Academy program.</li>
                            <li>To communicate with you about your application status, upcoming trials, and Academy events.</li>
                            <li>To facilitate talent identification and scouting within the Rajasthan Royals Academy Melbourne network.</li>
                            <li>To administer the Academy program, including scheduling, logistics, and participant management.</li>
                            <li>To comply with legal and regulatory requirements.</li>
                            <li>To improve our services, website functionality, and user experience.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">6. Data Sharing &amp; Third Parties</h2>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">
                            We will never sell, rent, or trade your personal information to third parties for
                            marketing purposes. Your data may be shared only in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-rr-dark/80">
                            <li><strong>Rajasthan Royals Academy Melbourne:</strong> Your data may be shared with affiliated entities within the Rajasthan Royals Academy Melbourne (including franchise teams and partner academies) solely for talent identification and development purposes.</li>
                            <li><strong>Service Providers:</strong> We may engage trusted third-party service providers (e.g., hosting providers, email platforms) who process data on our behalf under strict confidentiality agreements.</li>
                            <li><strong>Legal Obligations:</strong> We may disclose your information if required by law, court order, or governmental regulation.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">7. Data Security</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            We implement appropriate technical and organisational measures to safeguard your
                            personal data against unauthorised access, alteration, disclosure, or destruction.
                            These measures include encryption, access controls, and regular security assessments.
                            However, no method of transmission over the internet is 100% secure, and we cannot
                            guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">8. Data Retention</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            We retain your personal data for as long as necessary to fulfil the purposes for
                            which it was collected, including to satisfy any legal, accounting, or reporting
                            requirements. Application data for unsuccessful applicants will be retained for up
                            to 24 months to allow for consideration in future intake periods, after which it
                            will be securely deleted unless you request earlier removal.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">9. Your Rights</h2>
                        <p className="text-rr-dark/80 leading-relaxed mb-4">Under applicable data protection laws, you have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-rr-dark/80">
                            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                            <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
                            <li><strong>Erasure:</strong> Request deletion of your personal data, subject to legal retention requirements.</li>
                            <li><strong>Restriction:</strong> Request that we limit the processing of your data in certain circumstances.</li>
                            <li><strong>Portability:</strong> Request transfer of your data in a structured, machine-readable format.</li>
                            <li><strong>Objection:</strong> Object to processing based on legitimate interests.</li>
                        </ul>
                        <p className="text-rr-dark/80 leading-relaxed mt-4">
                            To exercise any of these rights, please contact us at the details provided below.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">10. Cookies</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            Our website uses cookies and similar technologies to enhance your browsing experience,
                            analyse site traffic, and understand user behaviour. You can manage your cookie
                            preferences through your browser settings. Disabling cookies may affect certain
                            features of the website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">11. Changes to This Policy</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            We may update this Privacy Policy from time to time to reflect changes in our
                            practices or applicable laws. Any updates will be posted on this page with a revised
                            "last updated" date. We encourage you to review this policy periodically.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-rr-navy mb-4">12. Contact Us</h2>
                        <p className="text-rr-dark/80 leading-relaxed">
                            If you have any questions or concerns about this Privacy Policy or our data practices,
                            please contact us at:
                        </p>
                        <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="font-bold text-rr-navy">Rajasthan Royals Academy Melbourne</p>
                            <p className="text-rr-dark/70 mt-1">Email: Admin@rramelbourne.com</p>
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

export default PrivacyPolicy;
