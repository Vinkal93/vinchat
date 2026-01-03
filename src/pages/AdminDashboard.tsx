import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  Bot, 
  MessageSquare, 
  TrendingUp,
  Search,
  MoreVertical,
  Loader2,
  Shield,
  Ban,
  Check,
  Trash2,
  Eye,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
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
import { format, subDays } from "date-fns";

interface UserData {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  avatar_url: string | null;
  is_blocked?: boolean;
}

interface WorkspaceData {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  bots_count?: number;
  messages_count?: number;
}

const COLORS = ['hsl(238, 84%, 67%)', 'hsl(174, 84%, 40%)', 'hsl(340, 75%, 55%)', 'hsl(45, 93%, 47%)'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([]);
  const [totalBots, setTotalBots] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalConversations, setTotalConversations] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [chartData, setChartData] = useState<{ date: string; messages: number; users: number }[]>([]);
  const [botDistribution, setBotDistribution] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      setUsers(profiles || []);

      // Fetch all workspaces with bot counts
      const { data: workspacesData, error: workspacesError } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false });

      if (workspacesError) throw workspacesError;
      setWorkspaces(workspacesData || []);

      // Fetch bots count
      const { count: botsCount } = await supabase
        .from('bots')
        .select('*', { count: 'exact', head: true });
      setTotalBots(botsCount || 0);

      // Fetch messages count
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });
      setTotalMessages(messagesCount || 0);

      // Fetch conversations count
      const { count: conversationsCount } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true });
      setTotalConversations(conversationsCount || 0);

      // Generate chart data (last 7 days)
      const chartDataArr = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        chartDataArr.push({
          date: format(date, 'MMM dd'),
          messages: Math.floor(Math.random() * 500) + 100,
          users: Math.floor(Math.random() * 20) + 5,
        });
      }
      setChartData(chartDataArr);

      // Bot distribution by status
      const { data: bots } = await supabase.from('bots').select('status');
      const statusCounts: Record<string, number> = { active: 0, inactive: 0, draft: 0 };
      bots?.forEach(bot => {
        if (bot.status) statusCounts[bot.status] = (statusCounts[bot.status] || 0) + 1;
      });
      setBotDistribution([
        { name: 'Active', value: statusCounts.active },
        { name: 'Inactive', value: statusCounts.inactive },
        { name: 'Draft', value: statusCounts.draft },
      ]);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    return (
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Admin Panel</span>
            </Link>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalBots}</p>
                <p className="text-sm text-muted-foreground">Total Bots</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMessages.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Messages</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalConversations}</p>
                <p className="text-sm text-muted-foreground">Conversations</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="font-semibold mb-4">Messages & Users (Last 7 Days)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="hsl(238, 84%, 67%)"
                    fill="hsl(238, 84%, 67%, 0.2)"
                    name="Messages"
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(174, 84%, 40%)"
                    fill="hsl(174, 84%, 40%, 0.2)"
                    name="New Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="font-semibold mb-4">Bot Status Distribution</h3>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={botDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {botDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-xl border border-border"
        >
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="font-semibold text-lg">All Users</h3>
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium">{user.full_name || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{user.email || 'N/A'}</td>
                    <td className="p-4 text-muted-foreground">
                      {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        user.is_blocked 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-accent/10 text-accent'
                      }`}>
                        {user.is_blocked ? (
                          <>
                            <Ban className="w-3 h-3" />
                            Blocked
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" />
                            Active
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {user.is_blocked ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Unblock User
                              </>
                            ) : (
                              <>
                                <Ban className="w-4 h-4 mr-2" />
                                Block User
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Workspaces */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-xl border border-border mt-6"
        >
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-lg">All Workspaces</h3>
          </div>
          <div className="divide-y divide-border">
            {workspaces.slice(0, 10).map((workspace) => (
              <div key={workspace.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{workspace.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Created {format(new Date(workspace.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* User Details Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.full_name || 'Anonymous'}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-xs break-all">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p>{selectedUser.created_at ? format(new Date(selectedUser.created_at), 'PPP') : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className={selectedUser.is_blocked ? 'text-destructive' : 'text-accent'}>
                    {selectedUser.is_blocked ? 'Blocked' : 'Active'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setUserDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  variant={selectedUser.is_blocked ? "default" : "destructive"}
                  className="flex-1"
                >
                  {selectedUser.is_blocked ? 'Unblock User' : 'Block User'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
