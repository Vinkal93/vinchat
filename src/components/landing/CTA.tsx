import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">No credit card required</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Build Your{" "}
            <span className="gradient-text">AI Chatbot?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of companies using QuantumAI to automate support, 
            enhance knowledge sharing, and delight their customers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity px-8 h-12 text-base">
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              Schedule Demo
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-6">Trusted by innovative teams worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
              {["Google", "Microsoft", "Amazon", "Meta", "Apple"].map((company) => (
                <div key={company} className="text-xl font-bold text-muted-foreground">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
