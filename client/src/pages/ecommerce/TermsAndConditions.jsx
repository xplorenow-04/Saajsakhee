import { useEffect } from "react";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";

export default function TermsAndConditions() {
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
                            Terms & Conditions
                        </h1>
                        <p className="text-text-muted text-sm mt-3">
                            Effective Date: [DD Month YYYY] | Website: www.saajsakhee.com
                        </p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert prose-gold max-w-none text-text-muted text-sm sm:text-base leading-relaxed space-y-6">
                        <p>
                            These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("User", "Customer", "you") and SaajSakhee, operated by [Insert Legal Entity Name], having its registered office at [Insert Registered Address] ("SaajSakhee", "we", "us", "our"), governing your access to and use of the website www.saajsakhee.com, including any content, functionality, and services offered on or through it (the "Website").
                        </p>
                        <p>
                            By accessing, browsing, registering on, or placing an order through the Website, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please discontinue use of the Website immediately.
                        </p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">1. Definitions</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>"Products"</strong> means the clothing, apparel, accessories, and related items listed for sale on the Website.</li>
                            <li><strong>"Order"</strong> means a request placed by the Customer to purchase Product(s) through the Website.</li>
                            <li><strong>"Admin"</strong> means the authorized personnel of SaajSakhee responsible for managing Website operations, pricing, and policy configurations, including the free shipping threshold referred to in Clause 6.</li>
                            <li><strong>"Exchange"</strong> means the process by which a Product delivered to a Customer is replaced with an alternate size, colour, or item of equal value, subject to these Terms.</li>
                        </ul>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">2. Eligibility to Use the Website</h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>You must be at least 18 years of age to place an Order on the Website. If you are under 18, you may use the Website only under the supervision of a parent or legal guardian who agrees to be bound by these Terms.</li>
                            <li>By placing an Order, you represent and warrant that all information you provide (name, shipping address, contact number, email, and payment details) is true, accurate, current, and complete.</li>
                            <li>SaajSakhee reserves the right to refuse service, suspend accounts, or cancel Orders at its sole discretion where fraudulent, abusive, or suspicious activity is suspected.</li>
                        </ol>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">3. Products, Pricing & Availability</h2>
                        <ol className="list-decimal pl-5 space-y-2" start="4">
                            <li>All Products displayed on the Website are subject to availability. SaajSakhee does not guarantee that any Product will remain in stock at the time of order confirmation.</li>
                            <li>Product images are for illustrative purposes. Actual colour, texture, and finish may vary slightly due to photographic lighting, screen resolution/calibration of your device, and dye-lot variations inherent to fabric manufacturing.</li>
                            <li>All prices listed on the Website are in Indian Rupees (₹) and are inclusive of applicable Goods and Services Tax (GST) unless stated otherwise. Prices are subject to change without prior notice; however, the price applicable to a confirmed Order will not change after payment is completed.</li>
                            <li>In the event a Product is mispriced due to a technical, typographical, or clerical error, SaajSakhee reserves the right to cancel the Order and issue a full refund of the amount paid, even after Order confirmation.</li>
                        </ol>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">4. Order Placement, Confirmation & Cancellation</h2>
                        <ol className="list-decimal pl-5 space-y-2" start="8">
                            <li>An Order is considered placed once you complete the checkout process and make payment (or select Cash on Delivery, where available).</li>
                            <li>An Order confirmation sent via email/SMS/WhatsApp acknowledges receipt of your Order and does not constitute acceptance. SaajSakhee reserves the right to accept or decline any Order, in whole or in part, for reasons including but not limited to Product unavailability, pricing errors, suspected fraud, or inability to verify delivery details.</li>
                            <li>Customer-initiated cancellations are permitted only before the Order has been shipped/dispatched. Once an Order is dispatched, it cannot be cancelled and will be governed by the Exchange Policy in Clause 7.</li>
                            <li>To request cancellation, Customers must contact SaajSakhee at [Insert Support Email/Phone] quoting the Order ID, prior to dispatch.</li>
                        </ol>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">5. Payment Terms</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>SaajSakhee accepts payments via credit/debit cards, net banking, UPI, and other methods made available through our third-party payment gateway partners, as well as Cash on Delivery (COD) where offered.</li>
                            <li>All payment transactions are processed through secure, PCI-DSS compliant payment gateways. SaajSakhee does not store your card or banking credentials on its servers.</li>
                            <li>In case of payment failure after debit from your account, any amount deducted will be automatically reversed by the payment gateway/bank within their standard reversal timelines (typically 5–7 business days). SaajSakhee is not liable for delays caused by banks or payment intermediaries.</li>
                            <li>Where COD is offered, SaajSakhee reserves the right to withdraw COD as a payment option for specific pin codes, Customers, or Order values at its discretion.</li>
                        </ul>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">6. Shipping & Delivery</h2>
                        <ol className="list-decimal pl-5 space-y-2" start="12">
                            <li>SaajSakhee ships Orders across serviceable pin codes within India through its logistics partners. Estimated delivery timelines will be indicated at checkout and are approximate, not guaranteed.</li>
                            <li>Standard shipping charges, where applicable, will be displayed at checkout prior to payment.
                            <br/><br/>
                            <strong>Free Shipping Threshold:</strong> Orders with a total cart value equal to or exceeding ₹[X] ("Free Shipping Threshold") qualify for free standard shipping. The Free Shipping Threshold is set and may be revised, increased, decreased, or temporarily waived (e.g., during sales/promotions) at the sole discretion of the Admin, without prior notice. The threshold value applicable at the time of checkout, as displayed on the Website, shall govern the Order.</li>
                            <li>Orders below the prevailing Free Shipping Threshold will attract a shipping fee, as displayed at checkout.</li>
                            <li>Risk in the Products passes to the Customer upon delivery to the shipping address provided at the time of Order placement. SaajSakhee is not responsible for non-delivery or delay caused by incorrect/incomplete address details furnished by the Customer.</li>
                            <li>In the event of delivery delays due to circumstances beyond SaajSakhee's reasonable control (see Clause 13 — Force Majeure), SaajSakhee will make reasonable efforts to keep the Customer informed but shall not be liable for such delays.</li>
                        </ol>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">7. Returns, Refunds & Exchange Policy</h2>
                        <p className="italic">Please read this section carefully before placing an Order. By completing a purchase, you acknowledge and accept this policy.</p>
                        
                        <h3 className="text-base sm:text-lg font-semibold text-text-primary mt-6 mb-3">7.1 No Refund Policy</h3>
                        <p>SaajSakhee operates a strict no-refund policy. We do not offer monetary refunds to the original payment method or source account under any circumstances, including but not limited to change of mind, incorrect size selection, or delayed delivery, except where expressly stated in Clause 7.4 (Exceptions) or where mandated by applicable law.</p>

                        <h3 className="text-base sm:text-lg font-semibold text-text-primary mt-6 mb-3">7.2 Exchange-Only Policy</h3>
                        <p>In place of refunds, SaajSakhee offers an Exchange-only policy. Eligible Products may be exchanged for a different size, colour, or an alternate Product of equal or higher value (with the Customer paying the price difference, where applicable), subject to the conditions below.</p>

                        <h3 className="text-base sm:text-lg font-semibold text-text-primary mt-6 mb-3">7.3 Exchange Eligibility & Conditions</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Exchange requests must be raised within [7/10] days of the delivery date, through the Website's "My Orders" section, WhatsApp support, or by emailing [Insert Support Email] with the Order ID and reason for exchange.</li>
                            <li>The Product must be unused, unwashed, unaltered, and in its original condition, with all original tags, labels, packaging, and invoice intact.</li>
                            <li>Products marked as "Final Sale," "Non-Exchangeable," innerwear, lingerie, and customized/made-to-order items are not eligible for exchange, for hygiene and customization reasons, and this will be clearly indicated on the Product page at the time of purchase.</li>
                            <li>Exchange is subject to availability of the requested size/colour/Product. If the requested alternative is unavailable, SaajSakhee will offer store credit (valid for [X] months) redeemable on a future purchase, in lieu of a refund.</li>
                            <li>The first exchange per Order is processed free of reverse-pickup charges, where reverse pickup is available in the Customer's pin code. Where reverse pickup is unavailable, the Customer will be required to self-ship the Product to SaajSakhee's designated address, and shipping costs for such self-return shall be borne by the Customer unless the exchange is due to a SaajSakhee error (see Clause 7.4).</li>
                            <li>SaajSakhee reserves the right to refuse an exchange request if the Product does not meet the conditions above upon quality check at our fulfilment centre.</li>
                        </ul>

                        <h3 className="text-base sm:text-lg font-semibold text-text-primary mt-6 mb-3">7.4 Exceptions — Defective, Damaged, or Incorrect Items</h3>
                        <p>Where a Product is delivered damaged, defective, or materially different from what was ordered (wrong item/size dispatched due to SaajSakhee's error), the Customer must report the issue within [48/72] hours of delivery, along with unboxing photographs/video evidence, to [Insert Support Email]. In such verified cases, SaajSakhee will, at its discretion, either arrange a free replacement/exchange or, where an exchange is not feasible, process a refund to the original payment method as an exception to Clause 7.1.</p>

                        <h3 className="text-base sm:text-lg font-semibold text-text-primary mt-6 mb-3">7.5 Statutory Rights</h3>
                        <p>Nothing in this Clause 7 limits any non-waivable rights available to Customers under the Consumer Protection Act, 2019, and the Consumer Protection (E-Commerce) Rules, 2020, or other applicable law. Where mandatory law requires a refund in specific circumstances, SaajSakhee will comply accordingly.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">8. Intellectual Property</h2>
                        <p>All content on the Website, including the SaajSakhee name, logo, trademarks, Product designs, photographs, graphics, text, and layout, is the exclusive property of SaajSakhee or its licensors and is protected under applicable intellectual property laws. No content may be copied, reproduced, republished, or used commercially without SaajSakhee's prior written consent.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">9. User Accounts & Acceptable Use</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You are responsible for maintaining the confidentiality of your account login credentials and for all activities conducted under your account.</li>
                            <li>You agree not to use the Website for any unlawful purpose, to post false reviews, to engage in fraudulent transactions, or to interfere with the Website's security or functionality.</li>
                            <li>SaajSakhee reserves the right to suspend or terminate accounts found in violation of these Terms.</li>
                        </ul>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">10. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by applicable law, SaajSakhee's aggregate liability arising out of or relating to any Order shall not exceed the amount paid by the Customer for that Order. SaajSakhee shall not be liable for any indirect, incidental, consequential, or punitive damages, including loss of profit or data, arising from the use of, or inability to use, the Website or Products, except in cases of proven gross negligence or wilful misconduct on the part of SaajSakhee.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">11. Indemnification</h2>
                        <p>You agree to indemnify and hold harmless SaajSakhee, its directors, employees, and affiliates from any claims, losses, liabilities, and expenses (including legal fees) arising out of your breach of these Terms, misuse of the Website, or violation of any applicable law or third-party right.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">12. Privacy</h2>
                        <p>Your use of the Website is also governed by our Privacy Policy, available at [Insert Privacy Policy URL], which describes how we collect, use, and safeguard your personal information. By using the Website, you consent to the data practices described therein.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">13. Force Majeure</h2>
                        <p>SaajSakhee shall not be held responsible for any delay or failure in performance resulting from causes beyond its reasonable control, including but not limited to natural disasters, strikes, courier/logistics disruptions, government restrictions, pandemics, or internet/telecommunication failures.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">14. Amendments to These Terms</h2>
                        <p>SaajSakhee reserves the right to modify, update, or replace these Terms, including the Free Shipping Threshold and Exchange Policy timelines, at any time at its sole discretion. Changes take effect immediately upon posting to the Website. Continued use of the Website following any changes constitutes acceptance of the revised Terms. Customers are encouraged to review this page periodically.</p>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">15. Governing Law & Dispute Resolution</h2>
                        <ol className="list-decimal pl-5 space-y-2" start="17">
                            <li>These Terms shall be governed by and construed in accordance with the laws of India.</li>
                            <li>Any dispute arising out of or in connection with these Terms shall first be attempted to be resolved amicably through good-faith negotiation between the parties.</li>
                            <li>Failing amicable resolution within [30] days, the dispute shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, conducted by a sole arbitrator appointed mutually by the parties, seated at [Insert City], India, with proceedings conducted in English.</li>
                            <li>Subject to the above, the courts at [Insert City], India shall have exclusive jurisdiction over all matters arising from these Terms.</li>
                        </ol>

                        <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-8 mb-4">16. Contact Us</h2>
                        <p>For any questions, order support, or exchange requests, please reach out to us:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Brand:</strong> SaajSakhee</li>
                            <li><strong>Registered Entity:</strong> [Insert Legal Entity Name]</li>
                            <li><strong>Registered Address:</strong> [Insert Registered Address]</li>
                            <li><strong>Customer Support Email:</strong> [Insert Support Email]</li>
                            <li><strong>Customer Support Phone/WhatsApp:</strong> [Insert Phone Number]</li>
                            <li><strong>Support Hours:</strong> [Insert Days & Hours]</li>
                            <li><strong>GSTIN:</strong> [Insert GSTIN]</li>
                        </ul>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
