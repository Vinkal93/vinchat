import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBotStore } from "@/stores/botStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateBotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBotDialog({ open, onOpenChange }: CreateBotDialogProps) {
  const navigate = useNavigate();
  const { addBot, knowledge } = useBotStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant. Answer questions based on the provided knowledge base.');
  const [welcomeMessage, setWelcomeMessage] = useState('Hello! How can I help you today?');
  const [selectedKnowledge, setSelectedKnowledge] = useState<string[]>([]);
  
  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Please enter a bot name');
      return;
    }
    
    const newBot = addBot({
      name,
      description,
      systemPrompt,
      welcomeMessage,
      status: 'active',
      knowledgeIds: selectedKnowledge,
      widgetConfig: {
        primaryColor: '#6366f1',
        position: 'bottom-right',
        headerTitle: name,
      },
    });
    
    toast.success('Bot created successfully!');
    onOpenChange(false);
    
    // Reset form
    setName('');
    setDescription('');
    setSystemPrompt('You are a helpful assistant. Answer questions based on the provided knowledge base.');
    setWelcomeMessage('Hello! How can I help you today?');
    setSelectedKnowledge([]);
    
    // Navigate to playground
    navigate(`/dashboard/playground?bot=${newBot.id}`);
  };
  
  const toggleKnowledge = (id: string) => {
    setSelectedKnowledge(prev => 
      prev.includes(id) 
        ? prev.filter(k => k !== id)
        : [...prev, id]
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            Create New Chatbot
          </DialogTitle>
          <DialogDescription>
            Build an AI assistant powered by your knowledge base.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bot Name *</Label>
            <Input
              id="name"
              placeholder="Customer Support Bot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Handles customer inquiries and FAQs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              placeholder="Define how your bot should behave..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Welcome Message</Label>
            <Input
              id="welcomeMessage"
              placeholder="Hello! How can I help you?"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Connect Knowledge Base</Label>
            {knowledge.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No knowledge items available. Add some first in the Knowledge page.
              </p>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {knowledge.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => toggleKnowledge(item.id)}
                  >
                    <Checkbox
                      checked={selectedKnowledge.includes(item.id)}
                      onCheckedChange={() => toggleKnowledge(item.id)}
                    />
                    <span className="text-sm flex-1">{item.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Bot className="w-4 h-4 mr-2" />
            Create Bot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
