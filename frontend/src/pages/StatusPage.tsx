import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const services = [
  { name: 'Web Application', status: 'operational' },
  { name: 'API', status: 'operational' },
  { name: 'Video Calls', status: 'operational' },
  { name: 'Authentication', status: 'operational' },
  { name: 'Payments', status: 'operational' },
  { name: 'Notifications', status: 'operational' },
];

const incidents = [
  {
    date: 'Nov 15, 2025',
    title: 'Elevated API response times',
    status: 'resolved',
    description: 'We experienced elevated response times for approximately 15 minutes. The issue has been resolved.',
  },
  {
    date: 'Nov 8, 2025',
    title: 'Scheduled maintenance',
    status: 'completed',
    description: 'Planned database maintenance was completed successfully with no impact to users.',
  },
];

export const StatusPage: React.FC = () => {
  const allOperational = services.every(s => s.status === 'operational');

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">System Status</h1>
          
          {/* Overall status */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl ${
            allOperational 
              ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
              : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
          }`}>
            {allOperational ? (
              <>
                <CheckCircle2 className="h-6 w-6" />
                <span className="font-semibold">All Systems Operational</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-6 w-6" />
                <span className="font-semibold">Partial Outage</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-8">
        <div className="container">
          <h2 className="text-lg font-semibold mb-6">Services</h2>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                <span className="font-medium">{service.name}</span>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm">Operational</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime */}
      <section className="py-8">
        <div className="container">
          <h2 className="text-lg font-semibold mb-6">90-Day Uptime</h2>
          <div className="flex gap-0.5">
            {Array.from({ length: 90 }).map((_, i) => (
              <div 
                key={i} 
                className="flex-1 h-8 bg-green-500 rounded-sm first:rounded-l-lg last:rounded-r-lg"
                title={`Day ${90 - i}: 100% uptime`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
          <p className="text-center mt-4 text-2xl font-bold text-green-600 dark:text-green-400">
            99.98% uptime
          </p>
        </div>
      </section>

      {/* Incidents */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-lg font-semibold mb-6">Past Incidents</h2>
          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <div key={index} className="p-6 rounded-xl border border-border bg-card">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{incident.title}</h3>
                  <span className="text-sm text-muted-foreground">{incident.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-medium capitalize">{incident.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-16 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to updates</h2>
          <p className="text-muted-foreground mb-8">
            Get notified when there's a service disruption.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input 
              type="email" 
              placeholder="your@email.com"
              className="flex-1 h-12 px-4 rounded-xl border border-border bg-card"
            />
            <button className="px-6 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

