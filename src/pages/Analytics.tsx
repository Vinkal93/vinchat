import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Users,
  Clock,
  Target,
  AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const messagesData = [
  { date: "Mon", messages: 320 },
  { date: "Tue", messages: 450 },
  { date: "Wed", messages: 380 },
  { date: "Thu", messages: 520 },
  { date: "Fri", messages: 480 },
  { date: "Sat", messages: 220 },
  { date: "Sun", messages: 180 },
];

const accuracyData = [
  { name: "Answered", value: 84 },
  { name: "Escalated", value: 10 },
  { name: "Unanswered", value: 6 },
];

const topQueries = [
  { query: "How to reset password?", count: 234 },
  { query: "Pricing plans", count: 189 },
  { query: "Integration guide", count: 156 },
  { query: "Contact support", count: 134 },
  { query: "Refund policy", count: 98 },
];

const COLORS = ["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--destructive))"];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Monitor your chatbot performance</p>
          </div>
          <Select defaultValue="7d">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Messages", value: "2,847", change: "+18%", icon: MessageSquare },
            { label: "Unique Users", value: "1,234", change: "+5%", icon: Users },
            { label: "Avg Response Time", value: "1.2s", change: "-12%", icon: Clock },
            { label: "Accuracy Rate", value: "94.2%", change: "+2.1%", icon: Target },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-accent">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="lg:col-span-2 bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Messages Over Time</h3>
                <p className="text-sm text-muted-foreground">Daily message volume</p>
              </div>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={messagesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="messages"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Accuracy Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Response Breakdown</h3>
                <p className="text-sm text-muted-foreground">Query handling</p>
              </div>
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accuracyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {accuracyData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Queries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-card rounded-xl border border-border"
          >
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold">Top Queries</h3>
              <p className="text-sm text-muted-foreground">Most frequently asked questions</p>
            </div>
            <div className="divide-y divide-border">
              {topQueries.map((query, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm">{query.query}</span>
                  </div>
                  <span className="text-sm font-medium">{query.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Unanswered Queries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="bg-card rounded-xl border border-border"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Unanswered Queries</h3>
                <p className="text-sm text-muted-foreground">Improve your knowledge base</p>
              </div>
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div className="divide-y divide-border">
              {[
                "How to integrate with Salesforce?",
                "Custom pricing for enterprise?",
                "On-premise deployment options?",
                "HIPAA compliance details?",
                "Multi-language support?",
              ].map((query, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <span className="text-sm">{query}</span>
                  <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full">
                    No match
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
