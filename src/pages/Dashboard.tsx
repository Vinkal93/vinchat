import { motion } from "framer-motion";
import {
  Bot,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Zap,
  FileText,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";

const stats = [
  {
    name: "Total Chatbots",
    value: "12",
    change: "+2",
    changeType: "positive",
    icon: Bot,
  },
  {
    name: "Messages Today",
    value: "2,847",
    change: "+18%",
    changeType: "positive",
    icon: MessageSquare,
  },
  {
    name: "Active Users",
    value: "1,234",
    change: "+5%",
    changeType: "positive",
    icon: Users,
  },
  {
    name: "Response Rate",
    value: "94.2%",
    change: "-0.5%",
    changeType: "negative",
    icon: TrendingUp,
  },
];

const recentBots = [
  { name: "Customer Support", status: "active", messages: 1234, accuracy: 96 },
  { name: "Sales Assistant", status: "active", messages: 856, accuracy: 92 },
  { name: "HR Helper", status: "training", messages: 0, accuracy: 0 },
  { name: "Product Guide", status: "active", messages: 432, accuracy: 89 },
];

const recentQueries = [
  { query: "How do I reset my password?", bot: "Customer Support", time: "2m ago" },
  { query: "What are your pricing plans?", bot: "Sales Assistant", time: "5m ago" },
  { query: "How to submit leave request?", bot: "HR Helper", time: "12m ago" },
  { query: "Product specifications for Model X", bot: "Product Guide", time: "18m ago" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Vinkal! Here's what's happening.</p>
          </div>
          <Link to="/dashboard/bots/new">
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Create Chatbot
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span
                  className={`flex items-center text-sm font-medium ${
                    stat.changeType === "positive" ? "text-accent" : "text-destructive"
                  }`}
                >
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chatbots List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="lg:col-span-2 bg-card rounded-xl border border-border"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold">Your Chatbots</h2>
              <Link to="/dashboard/bots">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentBots.map((bot) => (
                <div key={bot.name} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{bot.name}</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 text-xs ${
                            bot.status === "active"
                              ? "text-accent"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            bot.status === "active" ? "bg-accent" : "bg-muted-foreground"
                          }`} />
                          {bot.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right hidden sm:block">
                      <p className="font-medium">{bot.messages.toLocaleString()}</p>
                      <p className="text-muted-foreground text-xs">messages</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="font-medium">{bot.accuracy}%</p>
                      <p className="text-muted-foreground text-xs">accuracy</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Queries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-card rounded-xl border border-border"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold">Recent Queries</h2>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="divide-y divide-border">
              {recentQueries.map((query, index) => (
                <div key={index} className="p-4">
                  <p className="text-sm font-medium line-clamp-1">{query.query}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{query.bot}</span>
                    <span className="text-xs text-muted-foreground">{query.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="grid sm:grid-cols-3 gap-4"
        >
          <Link to="/dashboard/knowledge" className="group">
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-primary transition-colors">Upload Documents</p>
                  <p className="text-sm text-muted-foreground">Add new knowledge</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/dashboard/bots" className="group">
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-primary transition-colors">Test Playground</p>
                  <p className="text-sm text-muted-foreground">Try your bots</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/dashboard/analytics" className="group">
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-primary transition-colors">View Analytics</p>
                  <p className="text-sm text-muted-foreground">Track performance</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
