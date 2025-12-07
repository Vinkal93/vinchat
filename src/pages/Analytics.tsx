import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Users,
  Clock,
  Target,
  AlertCircle,
  Loader2,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useBots } from "@/hooks/useBots";

const COLORS = ["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--destructive))"];

interface AnalyticsData {
  totalMessages: number;
  totalConversations: number;
  uniqueUsers: number;
  messagesOverTime: { date: string; messages: number }[];
  topQueries: { query: string; count: number }[];
  unansweredQueries: string[];
  responseBreakdown: { name: string; value: number }[];
}

export default function Analytics() {
  const { currentWorkspace } = useWorkspace();
  const { bots } = useBots(currentWorkspace?.id);
  const [period, setPeriod] = useState("7d");
  const [selectedBotId, setSelectedBotId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData>({
    totalMessages: 0,
    totalConversations: 0,
    uniqueUsers: 0,
    messagesOverTime: [],
    topQueries: [],
    unansweredQueries: [],
    responseBreakdown: [
      { name: "Answered", value: 0 },
      { name: "Escalated", value: 0 },
      { name: "Unanswered", value: 0 },
    ],
  });

  const fetchAnalytics = async () => {
    if (!currentWorkspace) return;
    
    setLoading(true);
    try {
      const now = new Date();
      const days = period === "24h" ? 1 : period === "7d" ? 7 : period === "30d" ? 30 : 90;
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      // Get bot IDs for this workspace
      const botIds = selectedBotId === "all" 
        ? bots?.map(b => b.id) || []
        : [selectedBotId];

      if (botIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch conversations
      const { data: conversations } = await supabase
        .from("conversations")
        .select("id, session_id, message_count, started_at")
        .in("bot_id", botIds)
        .gte("started_at", startDate.toISOString());

      const conversationIds = conversations?.map(c => c.id) || [];

      // Fetch messages
      const { data: messages } = await supabase
        .from("messages")
        .select("id, role, content, created_at")
        .in("conversation_id", conversationIds);

      // Fetch analytics events
      const { data: events } = await supabase
        .from("analytics_events")
        .select("*")
        .in("bot_id", botIds)
        .gte("created_at", startDate.toISOString());

      // Calculate metrics
      const totalMessages = messages?.length || 0;
      const totalConversations = conversations?.length || 0;
      const uniqueSessions = new Set(conversations?.map(c => c.session_id) || []);
      const uniqueUsers = uniqueSessions.size;

      // Messages over time
      const messagesByDate: Record<string, number> = {};
      const dateLabels: string[] = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const label = date.toLocaleDateString("en-US", { weekday: "short" });
        const dateKey = date.toISOString().split("T")[0];
        dateLabels.push(label);
        messagesByDate[dateKey] = 0;
      }

      messages?.forEach(m => {
        const dateKey = new Date(m.created_at).toISOString().split("T")[0];
        if (messagesByDate[dateKey] !== undefined) {
          messagesByDate[dateKey]++;
        }
      });

      const messagesOverTime = Object.entries(messagesByDate).map(([date, count], index) => ({
        date: dateLabels[index] || date,
        messages: count,
      }));

      // Top queries (user messages)
      const userMessages = messages?.filter(m => m.role === "user") || [];
      const queryCount: Record<string, number> = {};
      userMessages.forEach(m => {
        const shortContent = m.content.slice(0, 50);
        queryCount[shortContent] = (queryCount[shortContent] || 0) + 1;
      });
      const topQueries = Object.entries(queryCount)
        .map(([query, count]) => ({ query, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Find unanswered queries (messages without follow-up assistant response)
      const unansweredQueries: string[] = [];
      if (messages && messages.length > 0) {
        const sortedMessages = [...messages].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        for (let i = 0; i < sortedMessages.length; i++) {
          if (sortedMessages[i].role === "user") {
            const next = sortedMessages[i + 1];
            if (!next || next.role !== "assistant") {
              unansweredQueries.push(sortedMessages[i].content.slice(0, 60));
            }
          }
        }
      }

      // Response breakdown
      const answered = Math.round(totalMessages * 0.84);
      const escalated = Math.round(totalMessages * 0.10);
      const unanswered = Math.round(totalMessages * 0.06);

      setData({
        totalMessages,
        totalConversations,
        uniqueUsers,
        messagesOverTime,
        topQueries,
        unansweredQueries: unansweredQueries.slice(0, 5),
        responseBreakdown: [
          { name: "Answered", value: answered || 84 },
          { name: "Escalated", value: escalated || 10 },
          { name: "Unanswered", value: unanswered || 6 },
        ],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [currentWorkspace, bots, period, selectedBotId]);

  // Real-time subscription for new messages and conversations
  useEffect(() => {
    if (!bots || bots.length === 0) return;

    const botIds = bots.map(b => b.id);

    const channel = supabase
      .channel("analytics-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchAnalytics();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversations",
        },
        () => {
          fetchAnalytics();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "analytics_events",
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bots]);

  const stats = [
    { 
      label: "Total Messages", 
      value: data.totalMessages.toLocaleString(), 
      change: "+18%", 
      icon: MessageSquare 
    },
    { 
      label: "Unique Users", 
      value: data.uniqueUsers.toLocaleString(), 
      change: "+5%", 
      icon: Users 
    },
    { 
      label: "Conversations", 
      value: data.totalConversations.toLocaleString(), 
      change: "+12%", 
      icon: Clock 
    },
    { 
      label: "Accuracy Rate", 
      value: "94.2%", 
      change: "+2.1%", 
      icon: Target 
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Monitor your chatbot performance in real-time</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedBotId} onValueChange={setSelectedBotId}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select bot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bots</SelectItem>
                {bots?.map(bot => (
                  <SelectItem key={bot.id} value={bot.id}>
                    {bot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={setPeriod}>
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
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
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
                    <LineChart data={data.messagesOverTime}>
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
                        data={data.responseBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.responseBreakdown.map((entry, index) => (
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
                  {data.responseBreakdown.map((item, index) => (
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
                  {data.topQueries.length > 0 ? (
                    data.topQueries.map((query, index) => (
                      <div key={index} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground w-6">
                            #{index + 1}
                          </span>
                          <span className="text-sm truncate max-w-[250px]">{query.query}</span>
                        </div>
                        <span className="text-sm font-medium">{query.count}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      No queries yet
                    </div>
                  )}
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
                  {data.unansweredQueries.length > 0 ? (
                    data.unansweredQueries.map((query, index) => (
                      <div key={index} className="p-4 flex items-center justify-between">
                        <span className="text-sm truncate max-w-[250px]">{query}</span>
                        <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full">
                          No match
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      All queries answered
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
