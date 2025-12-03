import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 1, 2025</p>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Welcome to Waddle. By accessing or using our platform, you agree to be bound by these 
                Terms of Service. Please read them carefully.
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By creating an account or using Waddle, you agree to these Terms of Service and our 
                Privacy Policy. If you do not agree, please do not use our services.
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground">
                Waddle is a platform that connects developers seeking technical assistance with 
                experienced consultants. We facilitate video consultations and provide tools for 
                screen sharing and collaboration.
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground mb-4">
                To use Waddle, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-12 mb-4">4. Payments and Tokens</h2>
              <p className="text-muted-foreground mb-4">
                Our platform uses a token-based payment system:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Tokens are purchased in advance and deducted during consultations</li>
                <li>Token prices are displayed at the time of purchase</li>
                <li>Unused tokens do not expire</li>
                <li>Refunds are available within 30 days for unused tokens</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-12 mb-4">5. Consultant Relationship</h2>
              <p className="text-muted-foreground">
                Consultants on Waddle are independent contractors, not employees. Waddle does not 
                guarantee the quality of advice provided. Users should exercise their own judgment 
                when implementing solutions suggested during consultations.
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">6. Acceptable Use</h2>
              <p className="text-muted-foreground mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use the platform for any illegal purpose</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Share malicious code or attempt to breach security</li>
                <li>Misrepresent your identity or qualifications</li>
                <li>Circumvent or manipulate our payment systems</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-12 mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                Code and solutions discussed during consultations remain the intellectual property 
                of their respective creators. Waddle does not claim ownership of any code shared 
                during sessions.
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Waddle is provided "as is" without warranties of any kind. We are not liable for 
                any damages arising from your use of the platform, including but not limited to 
                direct, indirect, incidental, or consequential damages.
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">9. Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your account at our discretion if you violate these 
                Terms. You may also delete your account at any time through your account settings.
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms from time to time. We will notify you of significant 
                changes via email or through the platform. Continued use after changes constitutes 
                acceptance of the new Terms.
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">Contact</h2>
              <p className="text-muted-foreground">
                Questions about these Terms? Contact us at{' '}
                <a href="mailto:legal@waddle.dev" className="text-primary hover:underline">
                  legal@waddle.dev
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

