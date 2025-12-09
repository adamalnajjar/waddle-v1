import React from 'react';
import { MapPin, Clock, ArrowRight, Heart, Zap, Users, Globe } from 'lucide-react';

const jobs = [
  {
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Senior Backend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Developer Advocate',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
  },
];

const perks = [
  { icon: Globe, title: 'Remote-first', description: 'Work from anywhere in the world' },
  { icon: Clock, title: 'Flexible hours', description: 'We trust you to manage your time' },
  { icon: Heart, title: 'Health benefits', description: 'Comprehensive health, dental, and vision' },
  { icon: Zap, title: 'Learning budget', description: '£1,600/year for courses and conferences' },
];

export const CareersPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Help developers ship faster.
              <span className="text-primary block">Join our team.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're building the future of developer support. If you're passionate about 
              helping others and solving hard problems, we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Why work at Waddle?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <perk.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{perk.title}</h3>
                  <p className="text-sm text-muted-foreground">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <a 
                key={index} 
                href="#"
                className="block p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{job.department}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* No fit? */}
      <section className="py-16 bg-muted/30">
        <div className="container text-center">
          <Users className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Don't see a fit?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We're always interested in meeting talented people. Send us your resume and tell us what you'd like to work on.
          </p>
          <a 
            href="mailto:careers@waddle.dev"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Get in touch
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

