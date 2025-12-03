import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, Building2, Shield, Users, Zap, CheckCircle2 } from 'lucide-react';

export const EnterprisePage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Building2 className="h-4 w-4" />
              Enterprise
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Expert support for
              <span className="text-primary block">your entire team</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Give your developers instant access to senior expertise. 
              Reduce blockers, accelerate onboarding, and ship faster.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact-sales">
                <Button size="lg">
                  Contact Sales
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold mb-12">Enterprise features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: 'Team accounts',
                description: 'Centralized billing and usage tracking for your entire organization.',
              },
              {
                icon: Shield,
                title: 'Enhanced security',
                description: 'SSO, SOC 2 compliance, and custom data retention policies.',
              },
              {
                icon: Zap,
                title: 'Priority matching',
                description: 'Skip the queue with dedicated consultant pools for your team.',
              },
              {
                icon: Building2,
                title: 'Custom contracts',
                description: 'Volume discounts, custom SLAs, and dedicated support.',
              },
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-2xl border border-border bg-card">
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-16">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground mb-8">Trusted by engineering teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {['Acme Corp', 'TechStart', 'DevCo', 'BuildIt'].map((company) => (
              <span key={company} className="text-xl font-bold">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to empower your team?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Talk to our sales team about enterprise pricing and custom solutions.
          </p>
          <Link to="/contact-sales">
            <Button size="lg">
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

