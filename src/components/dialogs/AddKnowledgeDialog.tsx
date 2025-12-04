import { useState } from "react";
import { FileText, Link as LinkIcon, MessageSquare, Upload } from "lucide-react";
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
import { useBotStore, KnowledgeItem } from "@/stores/botStore";
import { toast } from "sonner";

interface AddKnowledgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddKnowledgeDialog({ open, onOpenChange }: AddKnowledgeDialogProps) {
  const { addKnowledge } = useBotStore();
  
  const [activeTab, setActiveTab] = useState<'document' | 'url' | 'manual'>('document');
  
  // Document state
  const [documentName, setDocumentName] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  
  // URL state
  const [url, setUrl] = useState('');
  
  // Manual state
  const [manualName, setManualName] = useState('');
  const [manualContent, setManualContent] = useState('');
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setDocumentContent(text);
      };
      reader.readAsText(file);
    }
  };
  
  const handleAdd = () => {
    let newItem: Omit<KnowledgeItem, 'id' | 'chunks' | 'createdAt'>;
    
    if (activeTab === 'document') {
      if (!documentName || !documentContent) {
        toast.error('Please upload a document');
        return;
      }
      newItem = {
        name: documentName,
        type: 'document',
        content: documentContent,
        status: 'processed',
      };
    } else if (activeTab === 'url') {
      if (!url) {
        toast.error('Please enter a URL');
        return;
      }
      newItem = {
        name: url,
        type: 'url',
        content: `Content crawled from ${url}`,
        status: 'processing',
      };
      // Simulate processing
      setTimeout(() => {
        // In a real app, this would be handled by backend
      }, 2000);
    } else {
      if (!manualName || !manualContent) {
        toast.error('Please fill in all fields');
        return;
      }
      newItem = {
        name: manualName,
        type: 'manual',
        content: manualContent,
        status: 'processed',
      };
    }
    
    addKnowledge(newItem);
    toast.success('Knowledge added successfully!');
    onOpenChange(false);
    
    // Reset form
    setDocumentName('');
    setDocumentContent('');
    setUrl('');
    setManualName('');
    setManualContent('');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Knowledge</DialogTitle>
          <DialogDescription>
            Add documents, URLs, or manual entries to your knowledge base.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="document" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Document
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Manual
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="document" className="space-y-4 pt-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".txt,.pdf,.docx,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">
                  {documentName || 'Click to upload'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Supports TXT, PDF, DOCX, CSV
                </p>
              </label>
            </div>
            {documentContent && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="bg-muted p-3 rounded-lg max-h-32 overflow-y-auto">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {documentContent.substring(0, 500)}
                    {documentContent.length > 500 && '...'}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAdd}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Add Knowledge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
