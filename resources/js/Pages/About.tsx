import React from 'react';
import { Link } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Heart, Target, Users } from 'lucide-react';

const team = [
  {
    name: 'Alex Thompson',
    role: 'CEO & Co-founder',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
  {
    name: 'Sarah Kim',
    role: 'CTO & Co-founder',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
  {
    name: 'Marcus Johnson',
    role: 'Head of Product',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name: 'Emily Chen',
    role: 'Head of Engineering',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  },
];

export default function About() {
  return (
    <Layout>
      <div className="min-h-screen pt-24">
        {/* Hero */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                We believe every developer deserves access to expert help.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Waddle was founded on a simple idea: what if you could get unstuck in minutes instead of hours? 
                What if expert knowledge was accessible to everyone, not just those at big tech companies?
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: 'Our Mission',
                  description: 'To democratize access to senior engineering expertise and help developers ship better software, faster.',
                },
                {
                  icon: Heart,
                  title: 'Our Values',
                  description: 'We believe in transparency, continuous learning, and building genuine connections between developers.',
                },
                {
                  icon: Users,
                  title: 'Our Community',
                  description: 'Thousands of developers and hundreds of expert consultants, working together to solve problems.',
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Our Story</h2>
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-muted-foreground mb-4">
                  Waddle started in 2024 when our founders, both senior engineers, noticed a pattern: 
                  developers were spending hours stuck on problems that an experienced colleague could solve in minutes.
                </p>
                <p className="text-muted-foreground mb-4">
                  But not everyone has access to senior engineers. Junior developers, solo founders, 
                  and teams at smaller companies often struggle alone, wasting time and building frustration.
                </p>
                <p className="text-muted-foreground">
                  We built Waddle to change that. Now, anyone can get expert help in minutes, 
                  paying only for the time they need. It's like having a brilliant colleague on speed dial.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold mb-12 text-center">Our Team</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">Want to join us?</h2>
            <p className="text-muted-foreground mb-8">
              We're always looking for talented people to help us build the future of developer support.
            </p>
            <Link href="/careers" className="text-primary hover:underline font-semibold">
              View open positions →
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
