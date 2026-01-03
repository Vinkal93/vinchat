import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "How AI Chatbots Are Revolutionizing Customer Support",
    excerpt: "Discover how businesses are using AI-powered chatbots to provide 24/7 customer support, reduce response times, and improve customer satisfaction.",
    author: "Vinkal Prajapati",
    date: "2025-01-02",
    readTime: "5 min read",
    category: "AI & Technology",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80",
  },
  {
    id: 2,
    title: "Building Your First Knowledge Base: A Complete Guide",
    excerpt: "Learn how to create an effective knowledge base that powers your AI chatbot with accurate, relevant information from your business documents.",
    author: "Vinkal Prajapati",
    date: "2024-12-28",
    readTime: "8 min read",
    category: "Tutorials",
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80",
  },
  {
    id: 3,
    title: "The Future of Conversational AI in 2025",
    excerpt: "Explore the latest trends and predictions for conversational AI, including multimodal capabilities, personalization, and industry-specific applications.",
    author: "Vinkal Prajapati",
    date: "2024-12-20",
    readTime: "6 min read",
    category: "Industry Insights",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  },
  {
    id: 4,
    title: "Best Practices for Training Your AI Chatbot",
    excerpt: "Tips and strategies for training your chatbot to provide accurate, helpful responses while maintaining your brand voice and tone.",
    author: "Vinkal Prajapati",
    date: "2024-12-15",
    readTime: "7 min read",
    category: "Tutorials",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
  },
  {
    id: 5,
    title: "Measuring Chatbot Success: Key Metrics to Track",
    excerpt: "Understanding the important metrics that help you evaluate your chatbot's performance and identify areas for improvement.",
    author: "Vinkal Prajapati",
    date: "2024-12-10",
    readTime: "4 min read",
    category: "Analytics",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    id: 6,
    title: "Integrating Chatbots with Your Existing Tech Stack",
    excerpt: "A comprehensive guide to connecting your AI chatbot with CRM systems, helpdesks, and other business tools for seamless operations.",
    author: "Vinkal Prajapati",
    date: "2024-12-05",
    readTime: "9 min read",
    category: "Integration",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  },
];

const categories = ["All", "AI & Technology", "Tutorials", "Industry Insights", "Analytics", "Integration"];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                QuantumAI <span className="gradient-text">Blog</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Insights, tutorials, and best practices for building intelligent AI chatbots
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                  className={category === "All" ? "bg-gradient-to-r from-primary to-accent" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-colors group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" className="w-full mt-4 group-hover:text-primary">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-muted-foreground mb-6">
                Get the latest AI chatbot tips, tutorials, and industry insights delivered to your inbox.
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button className="bg-gradient-to-r from-primary to-accent">
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
