import { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import { useBots } from "@/hooks/useBots";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CreateBotDialog } from "@/components/dialogs/CreateBotDialog";

interface DashboardStats {
  totalBots: number;
  totalMessages: number;
  totalConversations: number;
  responseRate: number;
}

interface RecentQuery {
  query: string;
  bot: string;
  time: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentWorkspace, loading: workspaceLoading } = useWorkspace();
  const { bots, loading: botsLoading } = useBots(currentWorkspace?.id);
  const [stats, setStats] = useState<DashboardStats>({
    totalBots: 0,
    totalMessages: 0,
    totalConversations: 0,
    responseRate: 0,
  });
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [createBotOpen, setCreateBotOpen] = useState(false);

  useEffect(() => {
    if (currentWorkspace?.id && bots.length >= 0) {
      fetchDashboardData();
    }
  }, [currentWorkspace?.id, bots]);

  const fetchDashboardData = async () => {
    try {
      // Calculate stats from bots
      const totalMessages = bots.reduce((acc, bot) => acc + (bot.total_messages || 0), 0);
      const totalConversations = bots.reduce((acc, bot) => acc + (bot.total_conversations || 0), 0);
      
      setStats({
        totalBots: bots.length,
        totalMessages,
        totalConversations,
        responseRate: totalMessages > 0 ? 94.2 : 0,
      });

      // Fetch recent messages
      if (bots.length > 0) {
        const botIds = bots.map(b => b.id);
        const { data: conversations } = await supabase
          .from('conversations')
          .select('id, bot_id')
          .in('bot_id', botIds)
          .order('started_at', { ascending: false })
          .limit(10);

        if (conversations && conversations.length > 0) {
          const conversationIds = conversations.map(c => c.id);
          const { data: messages } = await supabase
            .from('messages')
            .select('content, conversation_id, created_at')
            .in('conversation_id', conversationIds)
            .eq('role', 'user')
            .order('created_at', { ascending: false })
            .limit(5);

          if (messages) {
            const queries = messages.map(msg => {
              const conv = conversations.find(c => c.id === msg.conversation_id);
              const bot = bots.find(b => b.id === conv?.bot_id);
              const timeAgo = getTimeAgo(new Date(msg.created_at || ''));
              return {
                query: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : ''),
                bot: bot?.name || 'Unknown Bot',
                time: timeAgo,
              };
            });
            setRecentQueries(queries);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const statsData = [
    {
      name: "Total Chatbots",
      value: stats.totalBots.toString(),
      change: "+2",
      changeType: "positive" as const,
      icon: Bot,
    },
    {
      name: "Total Messages",
      value: stats.totalMessages.toLocaleString(),
      change: "+18%",
      changeType: "positive" as const,
      icon: MessageSquare,
    },
    {
      name: "Conversations",
      value: stats.totalConversations.toLocaleString(),
      change: "+5%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      name: "Response Rate",
      value: `${stats.responseRate}%`,
      change: stats.responseRate > 0 ? "+0.5%" : "0%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ];

  if (workspaceLoading || botsLoading || loading) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
          </div>
          <Button 
            onClick={() => setCreateBotOpen(true)}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Chatbot
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
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
            {bots.length > 0 ? (
              <div className="divide-y divide-border">
                {bots.slice(0, 4).map((bot) => (
                  <div key={bot.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
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
                        <p className="font-medium">{(bot.total_messages || 0).toLocaleString()}</p>
                        <p className="text-muted-foreground text-xs">messages</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/dashboard/playground?bot=${bot.id}`)}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">No chatbots yet</h3>
                <p className="text-muted-foreground text-sm mb-4">Create your first chatbot to get started</p>
                <Button onClick={() => setCreateBotOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Chatbot
                </Button>
              </div>
            )}
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
            {recentQueries.length > 0 ? (
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
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground text-sm">No queries yet</p>
              </div>
            )}
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

          <Link to="/dashboard/playground" className="group">
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

      <CreateBotDialog open={createBotOpen} onOpenChange={setCreateBotOpen} />
    </DashboardLayout>
  );
}
