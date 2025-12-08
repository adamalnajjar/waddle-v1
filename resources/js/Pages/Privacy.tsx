import React from 'react';
import { Layout } from '@/Components/layout';

export default function Privacy() {
  return (
    <Layout>
      <div className="min-h-screen pt-24">
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground mb-8">Last updated: December 1, 2025</p>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  At Waddle, we take your privacy seriously. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our platform.
                </p>

                <h2 className="text-2xl font-semibold mt-12 mb-4">Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, or contact us for support.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Account information (name, email, password)</li>
                  <li>Profile information (bio, skills, profile picture)</li>
                  <li>Payment information (processed securely by Stripe)</li>
                  <li>Communications (support tickets, feedback)</li>
                  <li>Usage data (how you interact with our platform)</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-12 mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Match you with appropriate consultants</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Detect and prevent fraud and abuse</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-12 mb-4">Information Sharing</h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>With consultants you choose to connect with (limited to necessary info)</li>
                  <li>With service providers who assist in operating our platform</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-12 mb-4">Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational security measures to protect 
                  your personal information. All data is encrypted in transit and at rest. 
                  However, no method of transmission over the Internet is 100% secure.
                </p>

                <h2 className="text-2xl font-semibold mt-12 mb-4">Your Rights</h2>
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt-out of marketing communications</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-12 mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@waddle.dev" className="text-primary hover:underline">
                    privacy@waddle.dev
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
