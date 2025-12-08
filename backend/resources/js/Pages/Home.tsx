import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Button } from '@/Components/ui/Button';
import { 
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Clock,
  Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Hero carousel slides
const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80',
    title: 'Stuck on a bug?',
    subtitle: 'Get unstuck in minutes with expert help',
    accent: 'from-orange-500 to-amber-500',
  },
  {
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80',
    title: 'Need code review?',
    subtitle: 'Senior developers ready to help',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80',
    title: 'Learning something new?',
    subtitle: 'Get hands-on guidance from experts',
    accent: 'from-violet-500 to-purple-500',
  },
];

// Case studies
const caseStudies = [
  {
    title: 'From 30-second queries to instant results',
    problem: 'E-commerce startup facing database timeouts during peak traffic',
    solution: 'PostgreSQL indexing strategy and query optimization',
    result: '30s → 0.3s query time',
    duration: '45 min session',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    tech: 'PostgreSQL',
  },
  {
    title: 'Debugging a memory leak in production',
    problem: 'Node.js service crashing every 4 hours with OOM errors',
    solution: 'Identified circular references in event listeners',
    result: '99.9% uptime restored',
    duration: '25 min session',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tech: 'Node.js',
  },
  {
    title: 'Shipping a feature 2 weeks early',
    problem: 'Team stuck on complex state management architecture',
    solution: 'Guided refactor to Redux Toolkit with RTK Query',
    result: 'Feature shipped 2 weeks ahead',
    duration: '1.5 hr session',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80',
    tech: 'React',
  },
];

// Consultant spotlights
const consultants = [
  {
    name: 'Alex Chen',
    title: 'Staff Engineer',
    company: 'Ex-Meta',
    specialty: 'React & System Design',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    rating: 4.9,
    sessions: 340,
  },
  {
    name: 'Sarah Mitchell',
    title: 'Principal Engineer',
    company: 'Ex-Stripe',
    specialty: 'Backend & Databases',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    rating: 5.0,
    sessions: 285,
  },
  {
    name: 'James Park',
    title: 'DevOps Lead',
    company: 'Ex-AWS',
    specialty: 'Cloud & Infrastructure',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    rating: 4.9,
    sessions: 420,
  },
  {
    name: 'Maria Garcia',
    title: 'Mobile Lead',
    company: 'Ex-Uber',
    specialty: 'iOS & Android',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    rating: 4.8,
    sessions: 195,
  },
];

// Brand logos
const brands = [
  { 
    name: 'Vercel', 
    svg: <svg viewBox="0 0 76 65" fill="currentColor" className="h-5 w-5"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg>
  },
  { 
    name: 'Stripe', 
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
  },
  { 
    name: 'Shopify', 
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104zm-2.613-17.39c-.077 0-.156.002-.232.007-.143-.396-.352-.85-.614-1.14-.812-.89-1.903-1.015-2.347-1.015-.068 0-.128.003-.178.007-.026-.034-.054-.065-.082-.097C8.549 3.445 7.575 3.26 6.763 3.26c-2.894.001-4.253 2.389-4.762 3.609-.666 1.599-1.119 3.88-1.119 3.88l4.123.883c.082-.414.437-2.199 1.183-3.333.492-.749 1.163-1.19 1.868-1.213.137-.005.264.01.383.044.337.096.576.352.765.683-.653.136-1.327.374-1.97.765-.957.582-1.64 1.478-1.965 2.549-.316 1.038-.239 2.188.134 3.002.487 1.064 1.403 1.643 2.495 1.643.159 0 .322-.012.488-.037 1.752-.263 2.894-1.452 3.338-3.396.027-.119.049-.238.066-.357l.074-1.676c.012-.122.028-.243.048-.361.056-.326.155-.637.305-.918.449-.84 1.195-1.303 2.061-1.303.283 0 .555.054.81.157l.364-2.217c-.257-.058-.524-.09-.798-.09zm-4.453 6.81c-.323.869-.966 1.393-1.76 1.512-.092.014-.182.021-.27.021-.588 0-1.034-.345-1.27-.927-.198-.488-.243-1.14-.053-1.768.225-.74.703-1.325 1.371-1.685.43-.232.889-.357 1.336-.392l-.014.31c-.035.795-.023 1.578.055 2.324.053.513.085 1.017.116 1.519.038-.047.072-.096.103-.147.158-.258.284-.53.386-.767z"/></svg>
  },
  { 
    name: 'Notion', 
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.54c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.934-.56.934-1.167V6.354c0-.606-.233-.933-.746-.886l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.746 0-.933-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.22.186c-.094-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.62c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM2.24 1.688l13.262-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.933.653.933 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.457.934c-.98.046-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.94c0-.84.374-1.54 1.495-1.634z"/></svg>
  },
  { 
    name: 'Linear', 
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M2.886 10.777a.527.527 0 0 0-.131.582l1.238 2.94a.527.527 0 0 0 .371.304l3.162.538a.527.527 0 0 1 .398.717l-1.057 2.485a.527.527 0 0 0 .223.635l2.585 1.57a.527.527 0 0 0 .67-.068l7.993-8.158a.527.527 0 0 0-.036-.772l-2.32-1.912a.527.527 0 0 1-.084-.73l1.852-2.352a.527.527 0 0 0-.128-.757l-2.493-1.618a.527.527 0 0 0-.653.06L3.31 13.887l-.424-3.11zm9.17-9.2a11.5 11.5 0 1 0 0 23 11.5 11.5 0 0 0 0-23z"/></svg>
  },
  { 
    name: 'Figma', 
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.098-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z"/></svg>
  },
];

const stats = [
  { value: '2.5k+', label: 'Problems Solved' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '<60s', label: 'Avg Match Time' },
  { value: '500+', label: 'Expert Consultants' },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section with Carousel */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background carousel */}
          <div className="absolute inset-0">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  'absolute inset-0 transition-opacity duration-1000',
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                )}
              >
                <img
                  src={slide.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {/* Stronger overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="container relative z-10 pt-20">
            <div className="max-w-3xl">
              {/* Animated badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 mb-8 animate-fade-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-white">500+ developers online now</span>
              </div>

              {/* Dynamic headline */}
              <div className="mb-6">
                {heroSlides.map((slide, index) => (
                  <h1
                    key={index}
                    className={cn(
                      'text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight transition-all duration-500',
                      index === currentSlide 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4 absolute'
                    )}
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
                  >
                    <span className="text-white">{slide.title}</span>
                    <span className={cn('block mt-2 bg-gradient-to-r bg-clip-text text-transparent', slide.accent)}>
                      {slide.subtitle}
                    </span>
                  </h1>
                ))}
              </div>

              <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed animate-fade-up delay-100" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
                Connect with senior developers for real-time video consultations. 
                Debug faster, learn better, ship sooner. No commitments, pay only for what you use.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-12 animate-fade-up delay-200">
                <Link href="/register">
                  <Button size="lg" className="text-base px-8 h-14 shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-shadow">
                    Start Free Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" size="lg" className="text-base px-8 h-14 border-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/70 animate-fade-up delay-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span>5 free tokens to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Carousel controls */}
            <div className="absolute bottom-8 right-8 flex items-center gap-3">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-colors text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentSlide(index);
                    }}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      index === currentSlide 
                        ? 'w-8 bg-primary' 
                        : 'w-2 bg-white/30 hover:bg-white/50'
                    )}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-colors text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-border bg-card/50">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-24">
          <div className="container">
            <div className="max-w-3xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Real problems, real solutions
              </h2>
              <p className="text-lg text-muted-foreground">
                See how developers like you have used Waddle to ship faster and solve their toughest challenges.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <article key={index} className="group">
                  {/* Image */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                    <img 
                      src={study.image} 
                      alt={study.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-white/90 text-slate-900 rounded-full">
                        {study.tech}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {study.title}
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Problem:</span> {study.problem}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Solution:</span> {study.solution}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-semibold">{study.result}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{study.duration}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Consultant Spotlights */}
        <section className="py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Learn from the best
              </h2>
              <p className="text-lg text-muted-foreground">
                Our consultants come from top tech companies and have decades of combined experience.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {consultants.map((consultant, index) => (
                <div 
                  key={index} 
                  className="group bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-all hover:shadow-lg"
                >
                  {/* Avatar */}
                  <div className="w-20 h-20 mx-auto mb-4">
                    <img 
                      src={consultant.image} 
                      alt={consultant.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{consultant.name}</h3>
                    <p className="text-sm text-muted-foreground">{consultant.title}</p>
                    <p className="text-sm text-primary font-medium">{consultant.company}</p>
                  </div>

                  {/* Specialty */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center mb-3">{consultant.specialty}</p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{consultant.rating}</span>
                      </div>
                      <div className="text-muted-foreground">
                        {consultant.sessions} sessions
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                From stuck to solved in minutes
              </h2>
              <p className="text-lg text-muted-foreground">
                Three steps. That's it.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="flex items-center gap-8 mb-12">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Tell us what's broken</h3>
                  <p className="text-muted-foreground">
                    Paste your error message, describe the bug, or explain what you're trying to build. 
                    The more context, the better the match.
                  </p>
                </div>
              </div>

              {/* Connector */}
              <div className="ml-8 w-0.5 h-8 bg-border mb-4" />

              {/* Step 2 */}
              <div className="flex items-center gap-8 mb-12">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Get matched in under 60 seconds</h3>
                  <p className="text-muted-foreground">
                    Our system analyzes your problem and finds an expert who's solved similar issues. 
                    You'll see their profile, specialties, and rating before you connect.
                  </p>
                </div>
              </div>

              {/* Connector */}
              <div className="ml-8 w-0.5 h-8 bg-border mb-4" />

              {/* Step 3 */}
              <div className="flex items-center gap-8">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Jump on a call and fix it together</h3>
                  <p className="text-muted-foreground">
                    Share your screen, walk through the code, and solve it in real-time. 
                    Most sessions are under 15 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Trusted by developers worldwide
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  quote: "Saved me 6 hours of debugging. The consultant spotted my circular dependency in 10 minutes flat.",
                  author: "Sarah Chen",
                  role: "Senior Engineer @ Stripe",
                  avatar: "SC",
                },
                {
                  quote: "As a bootcamp grad, having a senior dev explain things without judgment is invaluable. Worth every penny.",
                  author: "Marcus Johnson",
                  role: "Junior Developer",
                  avatar: "MJ",
                },
                {
                  quote: "2am production incident. Team asleep. Waddle consultant helped me roll back safely. Absolute lifesaver.",
                  author: "Emily Rodriguez",
                  role: "CTO @ Startup",
                  avatar: "ER",
                },
              ].map((testimonial, index) => (
                <div key={index} className="relative p-6 rounded-2xl border border-border bg-card">
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-muted-foreground/20" />
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed relative z-10">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-16 border-y border-border">
          <div className="container">
            <p className="text-center text-sm text-muted-foreground mb-8">
              Trusted by developers at leading companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {brands.map((brand, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  {brand.svg}
                  <span className="text-lg font-semibold">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24">
          <div className="container">
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')] bg-cover bg-center opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
              
              {/* Content */}
              <div className="relative px-8 py-20 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to get unstuck?
                </h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
                  Join thousands of developers who've solved their toughest problems with Waddle.
                  Get 5 free tokens to start. No credit card required.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/register">
                    <Button size="lg" className="text-base px-10 h-14 bg-white text-slate-900 hover:bg-slate-100 shadow-xl">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className="text-base px-10 h-14 border-2 border-slate-600 text-white hover:bg-slate-800">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
