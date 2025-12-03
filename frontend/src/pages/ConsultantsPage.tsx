import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, DollarSign, Clock, Users, CheckCircle2 } from 'lucide-react';

export const ConsultantsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Share your expertise.
              <span className="text-primary block">Get paid to help.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join our network of senior developers and help others solve their toughest technical challenges. 
              Work on your own schedule, from anywhere.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register?type=consultant">
                <Button size="lg">
                  Apply to Become a Consultant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold mb-12">Why consult on Waddle?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Competitive rates',
                description: 'Set your own hourly rate. Top consultants earn $150-300/hour.',
              },
              {
                icon: Clock,
                title: 'Flexible schedule',
                description: 'Work when you want. Accept sessions that fit your availability.',
              },
              {
                icon: Users,
                title: 'Meaningful work',
                description: 'Help developers grow and solve real problems. Make a difference.',
              },
            ].map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Requirements</h2>
          <div className="max-w-2xl space-y-4">
            {[
              '5+ years of professional development experience',
              'Strong communication skills in English',
              'Expertise in at least one major technology area',
              'Reliable internet connection and quiet workspace',
              'Pass our technical interview process',
            ].map((req, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start consulting?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Applications are reviewed within 48 hours. Join hundreds of consultants already helping developers worldwide.
          </p>
          <Link to="/register?type=consultant">
            <Button size="lg">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

