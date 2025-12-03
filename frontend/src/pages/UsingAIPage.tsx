import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Bot, 
  Brain, 
  Rocket, 
  Zap, 
  ArrowRight,
  MessageSquare,
  Code2,
  AlertTriangle,
  Users,
  Clock
} from 'lucide-react';

/**
 * This page is intentionally designed to look like generic AI-generated UI
 * as a tongue-in-cheek commentary, while genuinely helping people stuck with AI tools.
 * Now supports both light and dark themes.
 */

export const UsingAIPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-500/5 to-blue-500/5">
      {/* Hero - Very AI */}
      <section className="py-12 sm:py-16 md:py-24 text-center relative overflow-hidden px-4">
        {/* Floating shapes - very AI */}
        <div className="absolute top-20 left-10 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-pink-500/10 rounded-full blur-2xl hidden sm:block" />
        
        <div className="container relative z-10 max-w-4xl mx-auto">
          {/* Sparkle badge - extremely AI */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-medium mb-6 sm:mb-8 border border-purple-500/20">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            AI-Powered Solutions ✨
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Stuck with AI? 🤖
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3 sm:mb-4 leading-relaxed px-4">
            Leverage the power of human expertise to unlock your AI-assisted development journey 
            and supercharge your productivity with our innovative solutions! 🚀
          </p>

          <p className="text-xs sm:text-sm text-muted-foreground/60 italic mb-6 sm:mb-8 px-4">
            (Yes, we know this page looks like AI designed it. That's the point.)
          </p>

          {/* Very AI button */}
          <Link to="/register">
            <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-base sm:text-lg shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/30 transition-all hover:scale-105 active:scale-95">
              Get Human Help Now ✨
              <ArrowRight className="inline ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* The Problem - Still AI looking but real content */}
      <section className="py-12 sm:py-16 md:py-20 bg-card/50 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4 border border-amber-500/20">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
              Sound Familiar?
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              The AI Coding Wall 🧱
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
              You've built something amazing with Cursor, Lovable, v0, or Bolt... 
              but now you're stuck and the AI keeps going in circles.
            </p>
          </div>

          {/* Very AI card grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Bot,
                title: 'AI Keeps Repeating Itself',
                description: 'You\'ve asked 47 times. It keeps suggesting the same broken solution. The context window is full of failed attempts.',
                emoji: '🔄'
              },
              {
                icon: Code2,
                title: 'Error Message Nightmare',
                description: '"Cannot read property of undefined." You paste it into the AI. It makes it worse. Rinse and repeat.',
                emoji: '🐛'
              },
              {
                icon: Brain,
                title: 'Lost in the Codebase',
                description: 'The AI generated 50 files. You don\'t know what half of them do. Something broke and you can\'t find it.',
                emoji: '🌀'
              },
              {
                icon: Zap,
                title: 'It Worked... Then Didn\'t',
                description: 'You made one small change. Now nothing works. The AI suggests undoing everything you just built.',
                emoji: '💥'
              },
              {
                icon: MessageSquare,
                title: 'Explaining is Exhausting',
                description: 'You\'ve written a novel trying to explain the bug. The AI still doesn\'t get it. You\'re out of words.',
                emoji: '😮‍💨'
              },
              {
                icon: Clock,
                title: 'Hours Become Days',
                description: 'What was supposed to be a quick fix has consumed your entire weekend. The deadline is tomorrow.',
                emoji: '⏰'
              },
            ].map((item, index) => (
              <div 
                key={index}
                className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5 transition-all"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
                  {item.title} {item.emoji}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-purple-500/5 to-blue-500/5">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4 border border-green-500/20">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              The Human Solution
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              A Real Human. On a Call. Right Now. 🙋
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
              No more copy-pasting error messages into a void. 
              Share your screen with a senior developer who can actually see what's happening.
            </p>
          </div>

          {/* Comparison - AI style */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* AI Approach */}
            <div className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Asking AI Again</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">The loop continues...</p>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                {[
                  'Paste error → Get wrong fix',
                  'Explain more → AI hallucinates',
                  'Try suggestion → New error',
                  'Paste new error → Undo everything',
                  '3 hours later: same place',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-red-500">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Human Approach */}
            <div className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Waddle Expert</h3>
                  <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">Real human, real help</p>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                {[
                  'Share screen → They see everything',
                  'Explain once → They actually understand',
                  'They spot the issue → Explain why',
                  'Fix it together → Learn for next time',
                  '15 minutes later: shipped ✓',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground">
                    <span className="text-green-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools We Help With */}
      <section className="py-12 sm:py-16 md:py-20 bg-card/50 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              We Help With All AI Coding Tools ✨
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">Stuck with any of these? We've got you.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
            {[
              'Cursor',
              'Lovable',
              'v0',
              'Bolt',
              'Replit AI',
              'GitHub Copilot',
              'Claude',
              'ChatGPT',
              'Windsurf',
              'Codeium',
            ].map((tool, index) => (
              <div 
                key={index}
                className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-foreground font-medium text-xs sm:text-sm hover:border-purple-500/40 hover:bg-purple-500/15 transition-all cursor-default"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Very AI numbered steps */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-purple-500/5 to-transparent">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              How It Works 🎯
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { step: '1', title: 'Describe Your Stuck Point', desc: 'Tell us what you\'re building and where the AI got stuck', icon: MessageSquare },
              { step: '2', title: 'Match with Expert', desc: 'We find a human who knows your stack', icon: Users },
              { step: '3', title: 'Share Your Screen', desc: 'Show them exactly what\'s happening', icon: Code2 },
              { step: '4', title: 'Ship Your Project', desc: 'Fix the issue and learn for next time', icon: Rocket },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl font-bold text-white bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof - AI style testimonials */}
      <section className="py-12 sm:py-16 md:py-20 bg-card/50 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              From AI Loop to Launch 🚀
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              {
                quote: "I spent 8 hours asking Cursor to fix a Next.js routing issue. The Waddle consultant fixed it in 12 minutes and showed me what I was missing.",
                author: "Jake M.",
                role: "Indie Hacker",
                avatar: "JM"
              },
              {
                quote: "Lovable generated beautiful UI but the backend was broken. I didn't understand the code well enough to debug it. A real human saved my launch.",
                author: "Sara T.",
                role: "Startup Founder",
                avatar: "ST"
              },
              {
                quote: "ChatGPT kept hallucinating solutions that didn't exist. Having someone actually look at my screen and explain what was wrong was incredible.",
                author: "Mike R.",
                role: "Career Switcher",
                avatar: "MR"
              },
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-purple-500/30 transition-all"
              >
                <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-amber-400 text-sm sm:text-base">★</span>
                  ))}
                </div>
                <p className="text-foreground mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold bg-gradient-to-br from-purple-600 to-blue-600">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-xs sm:text-sm">{testimonial.author}</p>
                    <p className="text-muted-foreground text-[10px] sm:text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Maximum AI */}
      <section className="py-16 sm:py-20 md:py-24 text-center relative overflow-hidden px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
        {/* Floating elements - hidden on mobile for cleaner look */}
        <div className="absolute top-10 left-20 text-4xl sm:text-5xl md:text-6xl opacity-20 hidden sm:block">✨</div>
        <div className="absolute bottom-20 right-20 text-4xl sm:text-5xl md:text-6xl opacity-20 hidden sm:block">🚀</div>
        <div className="absolute top-1/2 left-10 text-3xl sm:text-4xl opacity-20 hidden md:block">💡</div>
        
        <div className="container relative z-10 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Stop Spinning. Start Shipping. 🎯
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Your AI got you 80% there. Let a human help you cross the finish line.
            First 5 tokens free. No credit card required. ✨
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white text-purple-700 font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95">
                Get Unstuck Now 🙋
                <ArrowRight className="inline ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </Link>
            <Link to="/how-it-works" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white/10 text-white font-semibold text-base sm:text-lg border-2 border-white/30 hover:bg-white/20 transition-all">
                How It Works
              </button>
            </Link>
          </div>

          <p className="text-white/60 text-xs sm:text-sm mt-6 sm:mt-8 italic px-4">
            This page was designed by a human to look like AI designed it. 
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>The irony is intentional. The help is real.
          </p>
        </div>
      </section>
    </div>
  );
};
