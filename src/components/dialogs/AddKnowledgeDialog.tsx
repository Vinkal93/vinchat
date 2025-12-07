import { useState } from "react";
import { Link as LinkIcon, MessageSquare, Loader2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKnowledge } from "@/hooks/useKnowledge";
import { toast } from "sonner";

interface AddKnowledgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  botId: string;
}

export function AddKnowledgeDialog({ open, onOpenChange, botId }: AddKnowledgeDialogProps) {
  const { addTextKnowledge, addUrlKnowledge } = useKnowledge(botId);
  
  const [activeTab, setActiveTab] = useState<'url' | 'manual'>('url');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // URL state
  const [url, setUrl] = useState('');
  
  // Manual state
  const [manualName, setManualName] = useState('');
  const [manualContent, setManualContent] = useState('');
  
  const handleAdd = async () => {
    if (!botId) {
      toast.error('Please select a bot first');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (activeTab === 'url') {
        if (!url) {
          toast.error('Please enter a URL');
          setIsSubmitting(false);
          return;
        }
        await addUrlKnowledge(url);
        toast.success('URL added! It will be crawled shortly.');
        setUrl('');
      } else {
        if (!manualName || !manualContent) {
          toast.error('Please fill in all fields');
          setIsSubmitting(false);
          return;
        }
        await addTextKnowledge(manualName, manualContent);
        toast.success('Knowledge added successfully!');
        setManualName('');
        setManualContent('');
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding knowledge:', error);
      toast.error('Failed to add knowledge');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Knowledge</DialogTitle>
          <DialogDescription>
            Add URLs or manual entries to your knowledge base.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Manual
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                placeholder="https://docs.example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll crawl and extract content from this URL
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="manualName">Entry Name</Label>
              <Input
                id="manualName"
                placeholder="FAQ: How to reset password"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manualContent">Content</Label>
              <Textarea
                id="manualContent"
                placeholder="Q: How do I reset my password?&#10;A: Go to Settings > Security > Reset Password..."
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
                rows={5}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleAdd}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Add Knowledge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
