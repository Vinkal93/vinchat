import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Search, 
  Calendar,
  User,
  Bot,
  ChevronRight,
  Loader2,
  Clock,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBots } from "@/hooks/useBots";
import { useWorkspace } from "@/hooks/useWorkspace";
import { supabase } from "@/integrations/supabase/client";
import { MarkdownMessage } from "@/components/chat/MarkdownMessage";
import { format } from "date-fns";

interface Conversation {
  id: string;
  bot_id: string;
  session_id: string;
  visitor_info: unknown;
  started_at: string;
  ended_at: string | null;
  message_count: number | null;
}

interface Message {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
}

export default function Conversations() {
  const { currentWorkspace, loading: workspaceLoading } = useWorkspace();
  const { bots, loading: botsLoading } = useBots(currentWorkspace?.id);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBotId, setSelectedBotId] = useState<string>("all");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (bots.length > 0) {
      fetchConversations();
    }
  }, [bots, selectedBotId]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('conversations')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(100);

      if (selectedBotId !== "all") {
        query = query.eq('bot_id', selectedBotId);
      } else {
        const botIds = bots.map(b => b.id);
        query = query.in('bot_id', botIds);
      }

      const { data, error } = await query;
      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleConversationClick = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setDialogOpen(true);
    await fetchMessages(conversation.id);
  };

  const getBotName = (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    return bot?.name || 'Unknown Bot';
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const botName = getBotName(conv.bot_id).toLowerCase();
    const sessionId = conv.session_id.toLowerCase();
    return botName.includes(searchQuery.toLowerCase()) || 
           sessionId.includes(searchQuery.toLowerCase());
  });

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
            <h1 className="text-2xl font-bold">Conversation History</h1>
            <p className="text-muted-foreground">View all chatbot conversations and messages</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedBotId} onValueChange={setSelectedBotId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Bots" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bots</SelectItem>
              {bots.map(bot => (
                <SelectItem key={bot.id} value={bot.id}>
                  {bot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Conversations List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Conversations Yet</h3>
            <p className="text-muted-foreground text-sm">
              Conversations will appear here when users interact with your chatbots.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                onClick={() => handleConversationClick(conversation)}
                className="bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{getBotName(conversation.bot_id)}</h3>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                          {conversation.message_count || 0} messages
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(conversation.started_at), 'MMM d, yyyy HH:mm')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {conversation.session_id.slice(0, 8)}...
                        </span>
                        {conversation.visitor_info && typeof conversation.visitor_info === 'object' && (
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {(conversation.visitor_info as Record<string, unknown>)?.source as string || 'Widget'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Conversation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversation Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedConversation && (
            <div className="space-y-4">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg text-sm">
                <div>
                  <span className="text-muted-foreground">Bot:</span>
                  <p className="font-medium">{getBotName(selectedConversation.bot_id)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Started:</span>
                  <p className="font-medium">
                    {format(new Date(selectedConversation.started_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Messages:</span>
                  <p className="font-medium">{selectedConversation.message_count || 0}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Session ID:</span>
                  <p className="font-medium font-mono text-xs">{selectedConversation.session_id}</p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="h-[400px] pr-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {message.role === 'assistant' ? (
                              <MarkdownMessage content={message.content} />
                            ) : (
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 px-2">
                            {format(new Date(message.created_at), 'HH:mm')}
                          </p>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
