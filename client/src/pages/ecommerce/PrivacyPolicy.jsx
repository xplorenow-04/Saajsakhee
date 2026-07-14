import { useEffect } from "react";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";

export default function PrivacyPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-surface-900">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
                            Legal
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-luxury text-gradient-gold mt-2">
                            Privacy Policy
                        </h1>
                        <p className="text-text-muted text-sm mt-3">
                            Effective Date: [DD Month YYYY] | Website: www.saajsakhee.com
                        </p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert prose-gold max-w-none text-text-muted text-sm sm:text-base leading-relaxed space-y-6">
                        <p>
                            This Privacy Policy explains how SaajSakhee, operated by [Insert Legal Entity Name], having its registered office at [Insert Registered Address] ("SaajSakhee", "we", "us", "our"), collects, uses, stores, shares, and protects your personal information when you visit or make a purchase on www.saajsakhee.com ("Website"). By using the Website, you consent to the practices described in this Policy.
                        </p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">1. Information We Collect</h2>
                        
                        <h3 className="text-base sm:text-lg font-semibold text-text-primary mt-6 mb-3">a) Information you provide directly:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Name, email address, phone number, shipping/billing address</li>
                            <li>Account login credentials (email and password, if you register)</li>
                            <li>Order details, size/style preferences, wishlist items</li>
                            <li>Communications with our customer support (chat, email, WhatsApp, phone)</li>
                            <li>Reviews, ratings, or feedback you submit</li>
                        </ul>

                        <h3 className="text-base sm:text-lg font-semibold text-text-primary mt-6 mb-3">b) Information collected automatically:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>IP address, browser type, device type, operating system</li>
                            <li>Pages viewed, time spent, click patterns, referring URLs</li>
                            <li>Approximate location (based on IP or pin code entered at checkout)</li>
                            <li>Cookies and similar tracking technologies (see Clause 6)</li>
                        </ul>

                        <h3 className="text-base sm:text-lg font-semibold text-text-primary mt-6 mb-3">c) Information from third parties:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Delivery status updates from our logistics/courier partners</li>
                        </ul>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">2. Account Registration — No Email Verification</h2>
                        <p>SaajSakhee's registration process does not currently require email or phone verification (such as OTP or confirmation-link verification) before an account becomes active. As a result:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Any email address can be used to create an account, and we do not independently confirm that the registrant is the rightful owner of that email address.</li>
                            <li>You are solely responsible for the accuracy of the email address and contact details you provide, as Order confirmations, exchange updates, and account communications will be sent to the email/phone number entered at registration or checkout.</li>
                            <li>SaajSakhee is not liable for any loss, misdelivery, or unauthorized account access arising from an incorrect, mistyped, or fraudulently used email address at the time of registration.</li>
                            <li>If you believe an account has been created using your email address without your authorization, please contact us immediately at [Insert Support Email] so we can investigate and take appropriate action (including account deactivation).</li>
                            <li>We recommend using a strong, unique password and not sharing your login credentials with others.</li>
                        </ul>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">3. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Process, confirm, and deliver your Orders, including determining eligibility for free shipping once your cart meets the prevailing threshold set by Admin.</li>
                            <li>Manage exchanges, in line with our Exchange-only policy (no monetary refunds, except as required by law or for defective/incorrect items).</li>
                            <li>Communicate Order confirmations, shipping updates, exchange status, and customer support responses to the email/phone number provided.</li>
                            <li>Send promotional emails, SMS, or WhatsApp messages about new collections, offers, and sales — you may opt out at any time (see Clause 9).</li>
                            <li>Improve the Website's functionality and personalize product recommendations.</li>
                            <li>Detect and prevent misuse of the Website, including fraudulent or abusive account activity.</li>
                            <li>Comply with legal, tax, and regulatory obligations (e.g., GST invoicing, statutory record-keeping).</li>
                        </ul>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">4. Payments</h2>
                        <p>SaajSakhee's Website does not currently process payments through an integrated online payment gateway. Orders are confirmed and payment is coordinated through [Insert applicable method — e.g., Cash on Delivery, bank transfer/UPI details shared upon order confirmation, or payment collected via a third-party link/service outside the Website]. Accordingly:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>SaajSakhee does not collect, process, or store your card, net-banking, or UPI credentials through the Website itself.</li>
                            <li>Any payment made outside the Website (e.g., via bank transfer, UPI app, or a third-party payment link) is subject to the privacy and security practices of that respective bank, UPI provider, or payment service, and not this Policy.</li>
                            <li>Please verify official payment details (bank account, UPI ID) directly with SaajSakhee through our verified contact channels before making any payment, to avoid fraud.</li>
                        </ul>
                        <p className="italic text-xs">(Update this clause once payment gateway integration is added to the Website.)</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">5. Sharing of Information</h2>
                        <p>We do not sell your personal information. We share it only with:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Logistics and courier partners, to fulfil delivery and reverse-pickup (for exchanges).</li>
                            <li>IT service providers / hosting providers, who support Website operations, strictly under confidentiality obligations.</li>
                            <li>Marketing and analytics tools (e.g., Google Analytics, Meta Pixel), to understand Website usage — these tools may set their own cookies, governed by their respective privacy policies.</li>
                            <li>Government or regulatory authorities, where required by law, court order, or to protect our legal rights.</li>
                            <li>Business transferees, in the event of a merger, acquisition, or sale of business assets, subject to equivalent privacy protections.</li>
                        </ul>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">6. Cookies & Tracking Technologies</h2>
                        <p>We use cookies and similar technologies to keep you logged in and remember your cart/wishlist, understand browsing behavior, and show relevant ads on other platforms (retargeting). You can control or disable cookies through your browser settings; this may affect cart persistence or personalization features.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">7. Data Retention</h2>
                        <p>We retain your personal information for as long as necessary to fulfil the purposes in this Policy, including Order history (for exchange tracking), tax/accounting records (as mandated by law, typically [7-8] years), and misuse-prevention purposes. Marketing data is retained until you opt out or withdraw consent. Since accounts are not email-verified, we may deactivate or delete accounts that appear inactive, duplicate, or fraudulently created, at our discretion.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">8. Data Security</h2>
                        <p>We implement reasonable technical and organizational safeguards — including SSL encryption, restricted access controls, and secure servers — to protect your personal information. However, because account registration does not include email/identity verification, we are not able to independently confirm the identity of a registrant, and no method of internet transmission or storage is 100% secure. We encourage you to use a unique password and avoid reusing credentials from other sites.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">9. Your Rights & Choices</h2>
                        <p>Subject to applicable law, you have the right to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Access the personal data we hold about you</li>
                            <li>Correct inaccurate or incomplete information (via your account or by contacting us)</li>
                            <li>Withdraw consent for marketing communications at any time (unsubscribe link in emails, or reply "STOP" to SMS/WhatsApp)</li>
                            <li>Request deletion of your account and associated personal data, subject to our legal obligation to retain certain records (e.g., invoices, tax filings)</li>
                            <li>Report unauthorized account creation using your email address (see Clause 2)</li>
                            <li>Grievance redressal — raise concerns about how your data is handled (see Clause 12)</li>
                        </ul>
                        <p>To exercise these rights, contact us at [Insert Privacy/Support Email]. We will respond within [30] days, or as required by applicable law.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">10. Children's Privacy</h2>
                        <p>The Website is not intended for use by individuals under 18 years of age without parental/guardian supervision. Because registration is not identity-verified, we are unable to confirm a registrant's age; parents/guardians should supervise use by minors. If we become aware that a child's data has been collected inappropriately, we will delete it promptly upon notification.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">11. Third-Party Links</h2>
                        <p>The Website may contain links to third-party websites or social media platforms. This Privacy Policy does not apply to those external sites, and we are not responsible for their privacy practices.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">12. Grievance Officer</h2>
                        <p>In accordance with the Digital Personal Data Protection Act, 2023, and Information Technology Act, 2000 (and rules made thereunder), the Grievance Officer for SaajSakhee is:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Name:</strong> [Insert Name]</li>
                            <li><strong>Designation:</strong> Grievance Officer</li>
                            <li><strong>Email:</strong> [Insert Grievance Email]</li>
                            <li><strong>Address:</strong> [Insert Registered Address]</li>
                            <li><strong>Response Timeline:</strong> Complaints will be acknowledged within [24-48] hours and resolved within [30] days.</li>
                        </ul>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">13. Changes to This Policy</h2>
                        <p>SaajSakhee may update this Privacy Policy periodically to reflect changes in our practices, technology (including future addition of a payment gateway or email/OTP verification), or legal requirements. The revised Policy will be posted on this page with an updated "Effective Date." Continued use of the Website after such changes constitutes acceptance of the revised Policy.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">14. Contact Us</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Brand:</strong> SaajSakhee</li>
                            <li><strong>Registered Entity:</strong> [Insert Legal Entity Name]</li>
                            <li><strong>Email:</strong> [Insert Privacy/Support Email]</li>
                            <li><strong>Phone/WhatsApp:</strong> [Insert Phone Number]</li>
                            <li><strong>Address:</strong> [Insert Registered Address]</li>
                        </ul>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
