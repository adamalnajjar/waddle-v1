import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Button } from '@/Components/ui/Button.tsx';
import { ArrowRight, Check, Minus, Coins, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import type { PageProps } from '@/types';

const faqs = [
  {
    q: "What is a token?",
    a: "A token is our unit of credit. 1 token = 1 minute of consultation time. When you're in a session with a consultant, tokens are deducted from your balance each minute."
  },
  {
    q: "Do tokens expire?",
    a: "No. Tokens never expire. Buy them whenever there's a good deal and use them whenever you need help."
  },
  {
    q: "What if I run out of tokens mid-session?",
    a: "You'll get a warning when you're running low. You can end the session anytime, or quickly purchase more tokens to continue without interruption."
  },
  {
    q: "Can I get a refund on unused tokens?",
    a: "Yes, unused tokens can be refunded within 30 days of purchase. Once tokens are used in a session, they cannot be refunded."
  },
  {
    q: "What if the consultant can't help me?",
    a: "You can shuffle to a different consultant within the first 5 minutes at no extra token cost. If you're still not satisfied, contact support."
  },
  {
    q: "Are there subscriptions?",
    a: "We offer optional subscriptions that give you discounted token rates and priority matching. But they're not required — most users do fine with pay-as-you-go token purchases."
  },
];

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-semibold text-foreground pr-4 group-hover:text-primary transition-colors">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-5 -mt-1">
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

const tokenPackages = [
  { tokens: 25, price: 40, perToken: 1.60, popular: false },
  { tokens: 50, price: 72, perToken: 1.44, popular: false },
  { tokens: 100, price: 128, perToken: 1.28, popular: true },
  { tokens: 250, price: 280, perToken: 1.12, popular: false },
  { tokens: 500, price: 480, perToken: 0.96, popular: false },
];

export default function Pricing() {
  const { auth } = usePage<PageProps>().props;
  const [selectedPackage, setSelectedPackage] = useState(2); // Default to 100 tokens (popular)

  const handleGetStarted = () => {
    router.visit(auth.user ? '/tokens' : '/register');
  };

  const selected = tokenPackages[selectedPackage];
  const basePrice = selected.tokens * 1.60; // Base price at £1.60/token
  const savings = basePrice - selected.price;

  return (
    <Layout>
      <div className="min-h-screen pt-24">
        {/* Hero */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
                Buy tokens.
                <span className="text-muted-foreground block">Use them whenever.</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                1 token = 1 minute of expert help. No subscriptions, no expiry dates.
                Your first 5 tokens are free.
              </p>
            </div>
          </div>
        </section>

        {/* How tokens work */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="grid sm:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">1</div>
                  <div className="font-medium mb-1 text-foreground">Buy tokens</div>
                  <div className="text-sm text-muted-foreground">Purchase a token package</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">2</div>
                  <div className="font-medium mb-1 text-foreground">Start a session</div>
                  <div className="text-sm text-muted-foreground">Get matched with an expert</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">3</div>
                  <div className="font-medium mb-1 text-foreground">Tokens deduct</div>
                  <div className="text-sm text-muted-foreground">1 token per minute used</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Token Packages */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 text-center text-foreground">Choose your package</h2>
              <p className="text-center text-muted-foreground mb-10">
                Larger packages = better value per token
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {tokenPackages.map((pkg, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPackage(index)}
                    className={cn(
                      "relative p-6 rounded-2xl border-2 text-left transition-all bg-card",
                      selectedPackage === index
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        Popular
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <Coins className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-foreground">{pkg.tokens}</span>
                    </div>
                  <div className="text-xl font-semibold mb-1 text-foreground">£{pkg.price}</div>
                  <div className="text-sm text-muted-foreground">
                    £{pkg.perToken.toFixed(2)}/token
                  </div>
                  </button>
                ))}
              </div>

              {/* Selected package summary */}
              <div className="mt-10 p-8 bg-card border border-border rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Coins className="h-6 w-6 text-primary" />
                      <span className="text-3xl font-bold text-foreground">{selected.tokens} tokens</span>
                    </div>
                    <div className="text-muted-foreground">
                      = {selected.tokens} minutes of consultation
                    </div>
                    {savings > 0 && (
                      <div className="text-green-600 dark:text-green-400 text-sm font-medium mt-2">
                        Save £{savings.toFixed(0)} compared to base rate
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-foreground">£{selected.price}</div>
                    <Button size="lg" className="mt-4" onClick={handleGetStarted}>
                      Get Tokens
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Token value examples */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center text-foreground">What can you do with tokens?</h2>

              <div className="space-y-4">
                {[
                  { tokens: 10, example: 'Quick debugging session — fix a specific error' },
                  { tokens: 25, example: 'Code review for a feature or pull request' },
                  { tokens: 45, example: 'Architecture discussion for a new project' },
                  { tokens: 60, example: 'In-depth pair programming session' },
                  { tokens: 90, example: 'Full system design review with recommendations' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-2 w-24 flex-shrink-0">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-foreground">{item.tokens}</span>
                    </div>
                    <div className="text-muted-foreground">{item.example}</div>
                  </div>
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Average session uses 12 tokens (12 minutes)
              </p>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-center text-foreground">
                Compare the value
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                Waddle vs traditional options
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Waddle */}
                <div className="bg-card border-2 border-primary rounded-2xl p-6">
                  <div className="text-sm font-medium text-primary mb-2">Waddle</div>
                  <div className="text-3xl font-bold mb-1 text-foreground">12–30 tokens</div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Typical session cost
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Instant availability</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Pay only for time used</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Tokens never expire</span>
                    </li>
                  </ul>
                </div>

                {/* Freelancer */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Freelancer</div>
                  <div className="text-3xl font-bold mb-1 text-foreground">£80–240</div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Minimum project fee
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Minus className="h-4 w-4 flex-shrink-0" />
                      <span>Days to find right person</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Minus className="h-4 w-4 flex-shrink-0" />
                      <span>Minimum hours required</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Minus className="h-4 w-4 flex-shrink-0" />
                      <span>Back-and-forth scheduling</span>
                    </li>
                  </ul>
                </div>

                {/* Agency */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Agency</div>
                  <div className="text-3xl font-bold mb-1 text-foreground">£400+</div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Minimum engagement
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Minus className="h-4 w-4 flex-shrink-0" />
                      <span>Weeks of lead time</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Minus className="h-4 w-4 flex-shrink-0" />
                      <span>Long contracts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Minus className="h-4 w-4 flex-shrink-0" />
                      <span>Overkill for quick help</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center text-foreground">Common questions</h2>

              <div className="bg-card rounded-2xl border border-border px-6">
                {faqs.map((faq, index) => (
                  <FaqItem key={index} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Ready to try it?</h2>
            <p className="text-muted-foreground mb-8">
              Get 5 free tokens when you sign up. No credit card required.
            </p>
            <Button size="lg" onClick={handleGetStarted}>
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
