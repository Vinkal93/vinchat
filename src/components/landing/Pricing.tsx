import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out the platform",
    features: [
      "1 chatbot",
      "50K tokens knowledge base",
      "100 messages/month",
      "Basic analytics",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For small teams and startups",
    features: [
      "3 chatbots",
      "500K tokens knowledge base",
      "5,000 messages/month",
      "Advanced analytics",
      "Custom branding",
      "Email support",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For growing businesses",
    features: [
      "Unlimited chatbots",
      "5M tokens knowledge base",
      "50,000 messages/month",
      "Full analytics suite",
      "Custom branding",
      "Priority support",
      "API access",
      "Team collaboration",
      "Slack & Teams integration",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Unlimited messages",
      "Custom integrations",
      "SSO / SAML",
      "Dedicated account manager",
      "SLA guarantee",
      "On-premise option",
      "Custom AI models",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-medium text-primary mb-4 block">PRICING</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start for free, scale as you grow. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`h-full flex flex-col rounded-2xl p-6 ${
                plan.popular 
                  ? "bg-gradient-to-b from-primary/10 to-card border-2 border-primary/20 shadow-glow" 
                  : "glass"
              }`}>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/dashboard">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? "bg-gradient-to-r from-primary to-accent hover:opacity-90" 
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            Have questions?{" "}
            <a href="#" className="text-primary hover:underline">
              Check our FAQ
            </a>{" "}
            or{" "}
            <a href="#" className="text-primary hover:underline">
              contact sales
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
