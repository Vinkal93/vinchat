import { motion } from "framer-motion";
import { 
  FileText, 
  Globe, 
  Database, 
  Zap, 
  BarChart3, 
  Shield,
  MessageSquare,
  Plug,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Universal Data Ingestion",
    description: "Upload PDFs, DOCX, TXT, CSV, images with OCR, or connect URLs, Notion, Google Docs, and Confluence.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Sparkles,
    title: "Smart AI Training",
    description: "Automatic chunking, embedding, and indexing. Your bot learns from your data in minutes.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Custom Chat Widget",
    description: "Fully customizable chat interface. Match your brand with colors, avatars, and greeting messages.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Plug,
    title: "Multi-Channel Deploy",
    description: "Deploy to web, Slack, Teams, WhatsApp. API endpoints for custom integrations.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track queries, response accuracy, user engagement, and identify knowledge gaps.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC2 compliant, data encryption, RBAC, audit logs, and GDPR-friendly data handling.",
    gradient: "from-teal-500 to-cyan-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-medium text-primary mb-4 block">FEATURES</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to Build{" "}
            <span className="gradient-text">Intelligent Bots</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From data ingestion to deployment, we provide all the tools to create, 
            train, and scale your AI chatbots.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
                style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              />
              <div className="h-full glass rounded-2xl p-6 hover:border-primary/20 transition-colors">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 glass rounded-full py-2 px-4">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">2,000+</span> companies
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
