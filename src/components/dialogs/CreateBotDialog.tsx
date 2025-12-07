import { useState } from "react";
import { Bot, Sparkles, Loader2 } from "lucide-react";
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
import { useBots } from "@/hooks/useBots";
import { useWorkspace } from "@/hooks/useWorkspace";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CreateBotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBotDialog({ open, onOpenChange }: CreateBotDialogProps) {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const { createBot } = useBots(currentWorkspace?.id);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant. Answer questions based on the provided knowledge base.');
  const [welcomeMessage, setWelcomeMessage] = useState('Hello! How can I help you today?');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a bot name');
      return;
    }

    if (!currentWorkspace?.id) {
      toast.error('No workspace selected');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newBot = await createBot({
        name,
        description: description || null,
        system_prompt: systemPrompt,
        welcome_message: welcomeMessage,
        status: 'active',
        widget_color: '#6366f1',
        widget_position: 'bottom-right',
        widget_title: name,
      });
      
      if (newBot) {
        toast.success('Bot created successfully!');
        onOpenChange(false);
        
        // Reset form
        setName('');
        setDescription('');
        setSystemPrompt('You are a helpful assistant. Answer questions based on the provided knowledge base.');
        setWelcomeMessage('Hello! How can I help you today?');
        
        // Navigate to playground
        navigate(`/dashboard/playground?bot=${newBot.id}`);
      }
    } catch (error) {
      console.error('Error creating bot:', error);
      toast.error('Failed to create bot');
    } finally {
      setIsSubmitting(false);
    }
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Bot className="w-4 h-4 mr-2" />
            Create Bot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
