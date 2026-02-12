import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Samuell Goldfinch collects, uses, and protects your personal data. GDPR-compliant privacy policy.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <article className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-12">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-400">Privacy Policy</span>
        </nav>

        <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-100 leading-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-zinc-500 mb-12">
          Last updated: February 2026
        </p>

        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:font-serif prose-headings:text-stone-100
          prose-p:text-zinc-400 prose-p:leading-relaxed
          prose-a:text-[#c8a96e] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-stone-200
          prose-li:text-zinc-400
        ">
          <h2>1. Who We Are</h2>
          <p>
            This website is operated by Samuell Goldfinch (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;),
            a Paris-based creative direction, film production, and event curation studio.
            Our brands include <strong>Blaze Production</strong> and <strong>Kolasi Agency</strong>.
          </p>
          <p>
            For any privacy-related questions, contact us at:{' '}
            <a href="mailto:contact@samuellgoldfinch.com">contact@samuellgoldfinch.com</a>
          </p>

          <h2>2. What Data We Collect</h2>
          <p>We collect data in the following ways:</p>
          <ul>
            <li>
              <strong>Contact &amp; quote forms:</strong> Name, email, phone number, event details,
              budget range, and any message you provide. This data is stored securely in our CMS
              and used solely to respond to your inquiry.
            </li>
            <li>
              <strong>Venue inquiry form:</strong> Venue name, address, contact details, goals,
              budget range, and decision-maker role. Used to assess partnership fit and prepare proposals.
            </li>
            <li>
              <strong>Analytics (with consent):</strong> Page views, session duration, referral source,
              device type, and conversion events via Google Analytics 4 and Meta Pixel.
              No personally identifiable information is collected through analytics.
            </li>
            <li>
              <strong>Cookies:</strong> We use essential cookies for site functionality and,
              with your consent, analytics cookies from Google and Meta for performance measurement.
            </li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <ul>
            <li>To respond to your inquiries and provide requested services</li>
            <li>To send confirmation emails after form submissions</li>
            <li>To improve our website performance and user experience (anonymized analytics)</li>
            <li>To measure the effectiveness of our marketing campaigns (with consent)</li>
          </ul>
          <p>
            We <strong>never</strong> sell, rent, or share your personal data with third parties
            for their marketing purposes.
          </p>

          <h2>4. Legal Basis for Processing (GDPR)</h2>
          <p>Under the EU General Data Protection Regulation (GDPR), we process your data based on:</p>
          <ul>
            <li><strong>Consent:</strong> For analytics cookies and marketing pixels (you can withdraw at any time)</li>
            <li><strong>Legitimate interest:</strong> For responding to inquiries submitted through our forms</li>
            <li><strong>Contractual necessity:</strong> When processing data to prepare or fulfil service agreements</li>
          </ul>

          <h2>5. Third-Party Services</h2>
          <p>We use the following third-party services that may process data:</p>
          <ul>
            <li><strong>Google Analytics 4</strong> &mdash; Website analytics (anonymized IP, no PII). <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
            <li><strong>Meta Pixel</strong> &mdash; Conversion tracking for advertising. <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Meta Privacy Policy</a></li>
            <li><strong>Calendly</strong> &mdash; Meeting scheduling. <a href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer">Calendly Privacy Policy</a></li>
            <li><strong>Resend</strong> &mdash; Transactional email delivery. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Resend Privacy Policy</a></li>
            <li><strong>Cloudinary</strong> &mdash; Image hosting and optimization. <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer">Cloudinary Privacy Policy</a></li>
            <li><strong>Mux</strong> &mdash; Video streaming. <a href="https://www.mux.com/privacy" target="_blank" rel="noopener noreferrer">Mux Privacy Policy</a></li>
          </ul>

          <h2>6. Cookies</h2>
          <p>Our website uses the following types of cookies:</p>
          <ul>
            <li><strong>Essential:</strong> Required for the website to function (theme preference, session). These cannot be disabled.</li>
            <li><strong>Analytics:</strong> Google Analytics cookies (_ga, _ga_*) to understand how visitors use our site. Loaded only with your consent.</li>
            <li><strong>Marketing:</strong> Meta Pixel cookies (_fbp) for measuring ad effectiveness. Loaded only with your consent.</li>
          </ul>
          <p>
            You can manage your cookie preferences at any time using the cookie settings
            option in the bottom-left corner of every page, or by clearing your browser cookies.
          </p>

          <h2>7. Data Retention</h2>
          <ul>
            <li><strong>Form submissions:</strong> Retained for 24 months, then archived or deleted</li>
            <li><strong>Analytics data:</strong> Retained per Google/Meta default retention policies (14 months for GA4)</li>
            <li><strong>Email communications:</strong> Retained for the duration of the business relationship</li>
          </ul>

          <h2>8. Your Rights (GDPR)</h2>
          <p>As an EU resident, you have the right to:</p>
          <ul>
            <li><strong>Access</strong> &mdash; Request a copy of all personal data we hold about you</li>
            <li><strong>Rectification</strong> &mdash; Request correction of inaccurate data</li>
            <li><strong>Erasure</strong> &mdash; Request deletion of your personal data (&ldquo;right to be forgotten&rdquo;)</li>
            <li><strong>Restriction</strong> &mdash; Request that we limit processing of your data</li>
            <li><strong>Portability</strong> &mdash; Request your data in a structured, machine-readable format</li>
            <li><strong>Objection</strong> &mdash; Object to processing based on legitimate interest</li>
            <li><strong>Withdraw consent</strong> &mdash; Withdraw consent for analytics/marketing at any time</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{' '}
            <a href="mailto:contact@samuellgoldfinch.com">contact@samuellgoldfinch.com</a>.
            We will respond within 30 days.
          </p>

          <h2>9. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your data,
            including encrypted connections (HTTPS/TLS), secure authentication for our CMS,
            and restricted access to personal data on a need-to-know basis.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. The &ldquo;last updated&rdquo; date
            at the top of this page indicates when the policy was last revised. Continued use of
            the website after changes constitutes acceptance of the updated policy.
          </p>
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <Link href="/" className="text-sm text-[#c8a96e] hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </article>
  );
}
