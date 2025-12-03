import React from 'react';
import { Book, Code2, Webhook, Key, Terminal, ArrowRight } from 'lucide-react';

export const DocsPage: React.FC = () => {
  const sections = [
    {
      icon: Book,
      title: 'Introduction',
      description: 'Get started with the Waddle API',
      links: ['Overview', 'Authentication', 'Rate limits'],
    },
    {
      icon: Key,
      title: 'Authentication',
      description: 'Secure your API requests',
      links: ['API keys', 'OAuth 2.0', 'Scopes'],
    },
    {
      icon: Terminal,
      title: 'REST API',
      description: 'Core API endpoints',
      links: ['Users', 'Consultations', 'Tokens', 'Webhooks'],
    },
    {
      icon: Webhook,
      title: 'Webhooks',
      description: 'Real-time event notifications',
      links: ['Setup', 'Events', 'Signatures'],
    },
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">API Documentation</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Everything you need to integrate Waddle into your application.
          </p>
        </div>
      </section>

      {/* Quick start */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
          <div className="bg-slate-900 text-slate-100 rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <div className="text-slate-500"># Install the Waddle SDK</div>
            <div className="mt-2">npm install @waddle/sdk</div>
            <div className="mt-4 text-slate-500"># Initialize the client</div>
            <div className="mt-2 text-green-400">import {'{ Waddle }'} from '@waddle/sdk';</div>
            <div className="mt-1">const waddle = new Waddle({'{ apiKey: process.env.WADDLE_API_KEY }'});</div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <div key={index} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <ul className="space-y-2 ml-16">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-sm text-primary hover:underline flex items-center gap-1">
                        {link}
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">Need help with integration?</h2>
          <p className="text-muted-foreground mb-8">
            Our developer support team is ready to assist.
          </p>
          <a href="mailto:developers@waddle.dev" className="text-primary hover:underline font-medium">
            developers@waddle.dev
          </a>
        </div>
      </section>
    </div>
  );
};

