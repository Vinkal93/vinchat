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
  ChevronDown,
  Code,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useBotStore } from "@/stores/botStore";
import { useSearchParams } from "react-router-dom";
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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: Date;
}

export default function Playground() {
  const [searchParams] = useSearchParams();
  const botIdParam = searchParams.get('bot');
  
  const { bots, knowledge, getBotById, updateBot } = useBotStore();
  const [selectedBotId, setSelectedBotId] = useState(botIdParam || bots[0]?.id || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedBot = getBotById(selectedBotId);
  
  // Bot settings state
  const [systemPrompt, setSystemPrompt] = useState(selectedBot?.systemPrompt || '');
  const [welcomeMessage, setWelcomeMessage] = useState(selectedBot?.welcomeMessage || '');
  const [temperature, setTemperature] = useState(0.7);
  const [showSources, setShowSources] = useState(true);
  
  useEffect(() => {
    if (selectedBot) {
      setSystemPrompt(selectedBot.systemPrompt);
      setWelcomeMessage(selectedBot.welcomeMessage);
    }
  }, [selectedBot]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const simulateResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Get relevant knowledge
    const botKnowledge = knowledge.filter(k => 
      selectedBot?.knowledgeIds.includes(k.id)
    );
    
    // Simple keyword matching for demo
    const relevantSources = botKnowledge
      .filter(k => {
        const keywords = userMessage.toLowerCase().split(' ');
        return keywords.some(kw => k.content.toLowerCase().includes(kw));
      })
      .map(k => k.name);
    
    // Generate response based on system prompt and knowledge
    let response = '';
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      response = welcomeMessage || "Hello! How can I assist you today?";
    } else if (relevantSources.length > 0) {
      const matchedKnowledge = botKnowledge.find(k => relevantSources.includes(k.name));
      response = `Based on our knowledge base: ${matchedKnowledge?.content || 'I found relevant information for your query.'}`;
    } else {
      response = "I'll do my best to help you with that. Could you provide more details about what you're looking for?";
    }
    
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      sources: showSources ? relevantSources : undefined,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
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
    setInputValue('');
    
    await simulateResponse(inputValue);
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
  
  const saveSettings = () => {
    if (selectedBot) {
      updateBot(selectedBot.id, {
        systemPrompt,
        welcomeMessage,
      });
      toast.success('Settings saved successfully!');
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
                    Send a message to test how your bot responds. Adjust settings on the right to fine-tune behavior.
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
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
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
                  <Send className="w-4 h-4" />
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
                      <span className="text-sm text-muted-foreground">{temperature}</span>
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
                    <Label>Connected Knowledge</Label>
                    <div className="space-y-2">
                      {knowledge
                        .filter(k => selectedBot?.knowledgeIds.includes(k.id))
                        .map(k => (
                          <div
                            key={k.id}
                            className="flex items-center gap-2 p-2 bg-muted rounded-lg text-sm"
                          >
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            {k.name}
                          </div>
                        ))}
                      {selectedBot?.knowledgeIds.length === 0 && (
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
