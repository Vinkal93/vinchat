import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Plus, Search, MoreVertical, Play, Settings, Trash2, Code, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { CreateBotDialog } from "@/components/dialogs/CreateBotDialog";
import { toast } from "sonner";
import { useBots } from "@/hooks/useBots";
import { useWorkspace } from "@/hooks/useWorkspace";

export default function Bots() {
  const navigate = useNavigate();
  const { currentWorkspace, loading: workspaceLoading } = useWorkspace();
  const { bots, deleteBot, loading: botsLoading } = useBots(currentWorkspace?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredBots = bots.filter((bot) =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await deleteBot(id);
  };

  const copyEmbedCode = (botId: string, botName: string) => {
    const code = `<script src="${window.location.origin}/embed.js" data-bot-id="${botId}"></script>`;
    navigator.clipboard.writeText(code);
    toast.success(`Embed code for "${botName}" copied!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-accent';
      case 'inactive': return 'text-muted-foreground';
      case 'draft': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active': return 'bg-accent';
      case 'inactive': return 'bg-muted-foreground';
      case 'draft': return 'bg-primary animate-pulse';
      default: return 'bg-muted-foreground';
    }
  };

  if (workspaceLoading || botsLoading) {
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
            <h1 className="text-2xl font-bold">Chatbots</h1>
            <p className="text-muted-foreground">Manage and configure your AI chatbots</p>
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Bot
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search chatbots..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Bots Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBots.map((bot, index) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{bot.name}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs ${getStatusColor(bot.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(bot.status)}`} />
                      {bot.status}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/dashboard/playground?bot=${bot.id}`)}>
                      <Play className="w-4 h-4 mr-2" />
                      Open Playground
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyEmbedCode(bot.id, bot.name)}>
                      <Code className="w-4 h-4 mr-2" />
                      Copy Embed Code
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/dashboard/playground?bot=${bot.id}`)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(bot.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {bot.description || 'No description'}
              </p>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
                <div>
                  <p className="text-lg font-semibold">{bot.total_messages.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Messages</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{bot.total_conversations}</p>
                  <p className="text-xs text-muted-foreground">Chats</p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {new Date(bot.updated_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Updated</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/dashboard/playground?bot=${bot.id}`)}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Test
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/dashboard/playground?bot=${bot.id}`)}
                >
                  Configure
                </Button>
              </div>
            </motion.div>
          ))}

          {/* Create New Bot Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: filteredBots.length * 0.1 }}
            onClick={() => setCreateDialogOpen(true)}
            className="bg-card rounded-xl border-2 border-dashed border-border p-6 flex flex-col items-center justify-center min-h-[280px] hover:border-primary/50 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Create New Chatbot</h3>
            <p className="text-sm text-muted-foreground text-center">
              Build an AI assistant from your data
            </p>
          </motion.div>
        </div>

        {filteredBots.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bots found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
      
      <CreateBotDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </DashboardLayout>
  );
}
