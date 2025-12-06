import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Settings, 
  Bot, 
  User, 
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Code,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useBots } from "@/hooks/useBots";
import { useKnowledge } from "@/hooks/useKnowledge";
import { useWorkspace } from "@/hooks/useWorkspace";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: Date;
}

export default function Playground() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const botIdParam = searchParams.get('bot');
  
  const { currentWorkspace, loading: workspaceLoading } = useWorkspace();
  const { bots, updateBot, loading: botsLoading } = useBots(currentWorkspace?.id);
  
  const [selectedBotId, setSelectedBotId] = useState(botIdParam || '');
  const { knowledge } = useKnowledge(selectedBotId);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedBot = bots.find(b => b.id === selectedBotId);
  
  // Bot settings state
  const [systemPrompt, setSystemPrompt] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [showSources, setShowSources] = useState(true);
  
  // Set default selected bot when bots load
  useEffect(() => {
    if (bots.length > 0 && !selectedBotId) {
      setSelectedBotId(bots[0].id);
    }
  }, [bots, selectedBotId]);

  useEffect(() => {
    if (selectedBot) {
      setSystemPrompt(selectedBot.system_prompt || '');
      setWelcomeMessage(selectedBot.welcome_message || '');
      setTemperature(parseFloat(String(selectedBot.temperature)) || 0.7);
    }
  }, [selectedBot]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real streaming AI response
  const streamResponse = async (userMessage: string) => {
    if (!selectedBotId) return;
    
    setIsLoading(true);
    
    // Add empty assistant message that we'll stream into
    const assistantMessageId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }]);

    try {
      const chatMessages = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      chatMessages.push({ role: 'user', content: userMessage });

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: chatMessages,
          botId: selectedBotId,
          sessionId,
          visitorInfo: { source: 'playground' },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullContent += content;
              setMessages(prev => prev.map(m => 
                m.id === assistantMessageId 
                  ? { ...m, content: fullContent }
                  : m
              ));
            }
          } catch {
            // Incomplete JSON, put back in buffer
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // Add sources if showing
      if (showSources && knowledge.length > 0) {
        const relevantSources = knowledge
          .filter(k => k.is_processed)
          .slice(0, 3)
          .map(k => k.title);
        
        setMessages(prev => prev.map(m => 
          m.id === assistantMessageId 
            ? { ...m, sources: relevantSources }
            : m
        ));
      }

    } catch (error) {
      console.error('Streaming error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
      
      setMessages(prev => prev.map(m => 
        m.id === assistantMessageId 
          ? { ...m, content: `Sorry, I encountered an error: ${errorMessage}. Please try again.` }
          : m
      ));
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSend = async () => {
    if (!inputValue.trim() || !selectedBot) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    
    await streamResponse(messageText);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const clearChat = () => {
    setMessages([]);
  };
  
  const saveSettings = async () => {
    if (!selectedBot) return;
    
    try {
      await updateBot(selectedBot.id, {
        system_prompt: systemPrompt,
        welcome_message: welcomeMessage,
        temperature: temperature,
      });
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };
  
  const getEmbedCode = () => {
    if (!selectedBot) return '';
    return `<script src="${window.location.origin}/embed.js" data-bot-id="${selectedBot.id}"></script>`;
  };
  
  const copyEmbedCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopied(true);
    toast.success('Embed code copied!');
    setTimeout(() => setCopied(false), 2000);
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

  if (bots.length === 0) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No Bots Yet</h3>
          <p className="text-muted-foreground text-sm max-w-md mb-4">
            Create your first chatbot to start testing in the playground.
          </p>
          <Button onClick={() => navigate('/dashboard/bots')}>
            Create a Bot
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Playground</h1>
            <Select value={selectedBotId} onValueChange={setSelectedBotId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a bot" />
              </SelectTrigger>
              <SelectContent>
                {bots.map(bot => (
                  <SelectItem key={bot.id} value={bot.id}>
                    {bot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearChat}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4 mr-2" />
              {showSettings ? 'Hide' : 'Show'} Settings
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-card rounded-xl border border-border overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Test Your Chatbot</h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    Send a message to test how your bot responds with real AI. Adjust settings on the right to fine-tune behavior.
                  </p>
                </div>
              )}
              
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[70%] ${message.role === 'user' ? 'order-1' : ''}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content || (
                            <span className="flex gap-1">
                              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                          )}
                        </p>
                      </div>
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="text-xs text-muted-foreground">Sources:</span>
                          {message.sources.map((source, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!selectedBot || isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!inputValue.trim() || !selectedBot || isLoading}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 360 }}
                exit={{ opacity: 0, width: 0 }}
                className="bg-card rounded-xl border border-border overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold">Bot Settings</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* System Prompt */}
                  <div className="space-y-2">
                    <Label>System Prompt</Label>
                    <Textarea
                      placeholder="Define your bot's personality and behavior..."
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  
                  {/* Welcome Message */}
                  <div className="space-y-2">
                    <Label>Welcome Message</Label>
                    <Input
                      placeholder="Hello! How can I help you?"
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                    />
                  </div>
                  
                  {/* Temperature */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Temperature</Label>
                      <span className="text-sm text-muted-foreground">{temperature.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[temperature]}
                      onValueChange={([val]) => setTemperature(val)}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower = more focused, Higher = more creative
                    </p>
                  </div>
                  
                  {/* Show Sources */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Sources</Label>
                      <p className="text-xs text-muted-foreground">
                        Display referenced documents
                      </p>
                    </div>
                    <Switch
                      checked={showSources}
                      onCheckedChange={setShowSources}
                    />
                  </div>
                  
                  {/* Knowledge Base */}
                  <div className="space-y-2">
                    <Label>Connected Knowledge ({knowledge.length})</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {knowledge.length > 0 ? (
                        knowledge.map(k => (
                          <div
                            key={k.id}
                            className="flex items-center gap-2 p-2 bg-muted rounded-lg text-sm"
                          >
                            <div className={`w-2 h-2 rounded-full ${k.is_processed ? 'bg-accent' : 'bg-muted-foreground'}`} />
                            <span className="truncate">{k.title}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No knowledge base connected
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button onClick={saveSettings} className="w-full">
                    Save Settings
                  </Button>
                  
                  {/* Embed Code */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-primary" />
                      <Label>Embed Code</Label>
                    </div>
                    <div className="relative">
                      <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                        <code>{getEmbedCode()}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={copyEmbedCode}
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-accent" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add this code to your website's head tag to embed the chatbot.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
