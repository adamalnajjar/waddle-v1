import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Book, MessageCircle, CreditCard, Video, Shield, ArrowRight } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const categories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'New to Waddle? Start here.',
      articles: ['How Waddle works', 'Creating your account', 'Your first consultation'],
    },
    {
      icon: Video,
      title: 'Consultations',
      description: 'Everything about sessions.',
      articles: ['Joining a video call', 'Screen sharing tips', 'Session recording'],
    },
    {
      icon: CreditCard,
      title: 'Billing & Tokens',
      description: 'Payments and pricing.',
      articles: ['How tokens work', 'Payment methods', 'Refund policy'],
    },
    {
      icon: Shield,
      title: 'Account & Security',
      description: 'Manage your account.',
      articles: ['Password reset', 'Two-factor auth', 'Deleting your account'],
    },
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="py-16 text-center">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Search our knowledge base or browse by topic
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full h-14 pl-12 pr-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{category.title}</h2>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <ul className="space-y-2 ml-16">
                  {category.articles.map((article, i) => (
                    <li key={i}>
                      <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-muted/30">
        <div className="container text-center">
          <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link to="/contact">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
              Contact Support
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

