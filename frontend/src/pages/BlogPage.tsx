import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const posts = [
  {
    title: 'How to Debug Like a Senior Developer',
    excerpt: 'Learn the systematic approach that experienced developers use to find and fix bugs faster.',
    category: 'Engineering',
    date: 'Dec 1, 2025',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  },
  {
    title: 'The True Cost of Context Switching',
    excerpt: 'Why interruptions hurt your productivity more than you think, and what to do about it.',
    category: 'Productivity',
    date: 'Nov 28, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
  },
  {
    title: 'Building a Culture of Code Review',
    excerpt: 'How to make code reviews less painful and more productive for your entire team.',
    category: 'Teams',
    date: 'Nov 25, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },
  {
    title: 'React Performance: A Practical Guide',
    excerpt: 'Common performance pitfalls in React applications and how to avoid them.',
    category: 'Engineering',
    date: 'Nov 20, 2025',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  },
];

export const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Insights, tutorials, and stories from the Waddle team and our community of developers.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <article key={index} className="group">
                <Link to="#" className="block">
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                    <span className="text-primary font-medium">{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </Link>
              </article>
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors">
              Load more posts
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

