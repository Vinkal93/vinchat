import { motion } from "framer-motion";
import { ArrowRight, Play, Bot, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.5)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Powered by Google Gemini & OpenAI
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Build AI Chatbots from{" "}
            <span className="gradient-text">Your Data</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Transform your documents, websites, and databases into intelligent conversational AI. 
            Deploy custom chatbots in minutes, not months.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity px-8 h-12 text-base">
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border max-w-lg mx-auto"
          >
            {[
              { value: "10K+", label: "Bots Created" },
              { value: "50M+", label: "Messages Sent" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none h-40 bottom-0 top-auto" />
          
          <div className="glass rounded-2xl p-1 shadow-glow">
            <div className="bg-card rounded-xl overflow-hidden">
              {/* Mock Chat Interface */}
              <div className="bg-muted/50 p-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                </div>
                <span className="text-sm text-muted-foreground ml-2">QuantumAI Playground</span>
              </div>
              
              <div className="p-6 space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3 max-w-xs">
                    <p className="text-sm">How do I integrate the chatbot into my website?</p>
                  </div>
                </div>
                
                {/* Bot Response */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 max-w-md">
                    <p className="text-sm text-foreground">
                      Great question! You can integrate the chatbot in 3 ways:
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>1. Embed via JavaScript SDK</li>
                      <li>2. Use our iframe widget</li>
                      <li>3. Connect via REST API</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Feature Cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 top-1/4 glass rounded-xl p-4 hidden lg:flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Lightning Fast</p>
              <p className="text-xs text-muted-foreground">&lt;100ms response</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-4 top-1/3 glass rounded-xl p-4 hidden lg:flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Enterprise Secure</p>
              <p className="text-xs text-muted-foreground">SOC2 Compliant</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
