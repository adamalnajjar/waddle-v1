import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Button } from '@/Components/ui/Button';
import { ArrowRight, Play, Clock, CheckCircle2 } from 'lucide-react';
import type { PageProps } from '@/types';

export default function HowItWorks() {
  const { auth } = usePage<PageProps>().props;

  const handleGetStarted = () => {
    router.visit(auth.user ? '/consultations/new' : '/register');
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24">
        {/* Hero */}
        <section className="py-16">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
                  From stuck to solved
                  <span className="text-primary block">in under 15 minutes</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Describe your problem. Get matched with an expert. 
                  Jump on a call and fix it together. That's it.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" onClick={handleGetStarted}>
                    Try It Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline">
                    <Play className="mr-2 h-5 w-5" />
                    Watch a Demo
                  </Button>
                </div>
              </div>
              
              {/* Video placeholder */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80" 
                  alt="Developer on a video call"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-xl">
                    <Play className="h-8 w-8 text-slate-900 ml-1" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Average session: 12 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Process - Narrative Style */}
        <section className="py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-16 text-center text-foreground">Here's how it works</h2>

              {/* Step 1 */}
              <div className="mb-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">Tell us what you're stuck on</h3>
                </div>
                <div className="ml-14">
                  <p className="text-lg text-muted-foreground mb-6">
                    Paste your error message, describe the bug, or explain what you're trying to build. 
                    The more context you give, the better we can match you.
                  </p>
                  
                  {/* Example input mockup */}
                  <div className="bg-card border border-border rounded-xl p-6 font-mono text-sm">
                    <div className="text-muted-foreground mb-2">Example:</div>
                    <p className="text-foreground">
                      "My React app keeps re-rendering infinitely when I add a useEffect hook. 
                      I'm trying to fetch data on mount but it triggers an infinite loop. 
                      Using React 18, TypeScript, and RTK Query."
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="mb-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">We find your expert</h3>
                </div>
                <div className="ml-14">
                  <p className="text-lg text-muted-foreground mb-6">
                    Our system analyzes your problem and matches you with a consultant who has 
                    solved similar issues. You'll see their profile before connecting.
                  </p>
                  
                  {/* Match preview mockup */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" 
                        alt="Consultant"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-foreground">Alex Chen</div>
                        <div className="text-sm text-muted-foreground">Staff Engineer, Ex-Meta</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-amber-600 dark:text-amber-500">★ 4.9</span>
                          <span className="text-sm text-muted-foreground">• 340 sessions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">React</span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">TypeScript</span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">Redux</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    Not the right fit? You can shuffle to someone else within the first 5 minutes.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">Solve it together</h3>
                </div>
                <div className="ml-14">
                  <p className="text-lg text-muted-foreground mb-6">
                    Jump on a video call, share your screen, and debug in real-time. 
                    Most sessions are under 15 minutes.
                  </p>
                  
                  {/* Session preview */}
                  <div className="bg-slate-900 rounded-xl p-4 aspect-video relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" 
                      alt="Code on screen"
                      className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                    <div className="relative z-10 h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-auto">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs">
                            You
                          </div>
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-white text-sm">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span>Screen sharing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What you can get help with */}
        <section className="py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
                What can you get help with?
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                Pretty much anything code-related
              </p>

              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  'Debugging tricky bugs',
                  'Code review & best practices',
                  'Architecture decisions',
                  'Performance optimization',
                  'Learning new frameworks',
                  'DevOps & deployment',
                  'Database design & queries',
                  'Security vulnerabilities',
                  'Interview prep',
                  'Refactoring legacy code',
                  'API design',
                  'Testing strategies',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 py-3 border-b border-border">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Before/After */}
        <section className="py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
                The old way vs. The Waddle way
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Before */}
                <div className="bg-card border border-border rounded-2xl p-8">
                  <div className="text-sm font-medium text-red-600 dark:text-red-500 mb-4">Without Waddle</div>
                  <ul className="space-y-4">
                    {[
                      'Google the error message',
                      'Scroll through 10 Stack Overflow answers',
                      'Try random solutions for 2 hours',
                      'Ask in Discord, wait for replies',
                      'Give up and work around the issue',
                      'Come back to it next week',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <span className="text-red-600 dark:text-red-500">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="text-sm text-muted-foreground">Time wasted</div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-500">2–6 hours</div>
                  </div>
                </div>

                {/* After */}
                <div className="bg-card border-2 border-primary rounded-2xl p-8">
                  <div className="text-sm font-medium text-green-600 dark:text-green-500 mb-4">With Waddle</div>
                  <ul className="space-y-4">
                    {[
                      'Describe the problem',
                      'Get matched with an expert',
                      'Share your screen',
                      'Expert spots the issue',
                      'Fix it together',
                      'Back to shipping',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-green-600 dark:text-green-500">✓</span>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="text-sm text-muted-foreground">Average time</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-500">12 minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <blockquote className="text-2xl sm:text-3xl font-medium mb-8 leading-relaxed text-foreground">
                "I was stuck on a CORS issue for half a day. The Waddle consultant 
                fixed it in 8 minutes and explained exactly what was wrong. 
                Game changer."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" 
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="font-semibold text-foreground">David Park</div>
                  <div className="text-sm text-muted-foreground">Engineering Lead at Startup</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to try it?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get 5 free tokens when you sign up. No credit card required.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-8 text-lg" onClick={handleGetStarted}>
                  Start Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
