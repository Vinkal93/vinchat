import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Link as LinkIcon,
  Upload,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBotStore } from "@/stores/botStore";
import { AddKnowledgeDialog } from "@/components/dialogs/AddKnowledgeDialog";
import { toast } from "sonner";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "processed":
      return <CheckCircle className="w-4 h-4 text-accent" />;
    case "processing":
    case "crawling":
      return <Clock className="w-4 h-4 text-primary animate-pulse" />;
    case "failed":
      return <XCircle className="w-4 h-4 text-destructive" />;
    default:
      return null;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'document':
      return <FileText className="w-5 h-5 text-primary" />;
    case 'url':
      return <LinkIcon className="w-5 h-5 text-accent" />;
    case 'manual':
      return <MessageSquare className="w-5 h-5 text-primary" />;
    default:
      return <FileText className="w-5 h-5 text-primary" />;
  }
};

export default function Knowledge() {
  const { knowledge, deleteKnowledge } = useBotStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const filteredKnowledge = knowledge.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const documents = filteredKnowledge.filter(k => k.type === 'document');
  const urls = filteredKnowledge.filter(k => k.type === 'url');
  const manualEntries = filteredKnowledge.filter(k => k.type === 'manual');

  const totalChunks = knowledge.reduce((acc, k) => acc + k.chunks, 0);

  const handleDelete = (id: string) => {
    deleteKnowledge(id);
    toast.success('Knowledge item deleted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground">Manage your chatbot's training data</p>
          </div>
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Upload className="w-4 h-4 mr-2" />
            Add Knowledge
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label: "Total Items", value: knowledge.length.toString() },
            { label: "Total Chunks", value: totalChunks.toLocaleString() },
            { label: "Documents", value: documents.length.toString() },
            { label: "Manual Entries", value: manualEntries.length.toString() },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all">All ({filteredKnowledge.length})</TabsTrigger>
              <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
              <TabsTrigger value="urls">URLs ({urls.length})</TabsTrigger>
              <TabsTrigger value="manual">Manual ({manualEntries.length})</TabsTrigger>
            </TabsList>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* All Tab */}
          <TabsContent value="all" className="space-y-4">
            {/* Upload Area */}
            <div 
              onClick={() => setAddDialogOpen(true)}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Add Knowledge</h3>
              <p className="text-sm text-muted-foreground">
                Upload documents, add URLs, or create manual entries
              </p>
            </div>

            {/* Knowledge List */}
            {filteredKnowledge.length > 0 ? (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Chunks</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredKnowledge.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                {getTypeIcon(item.type)}
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground capitalize">{item.type}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              <span className="text-sm capitalize">{item.status}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{item.chunks}</td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Reprocess
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground">No knowledge items yet. Add some to get started!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            {documents.length > 0 ? (
              <div className="grid gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.chunks} chunks</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground">No documents uploaded yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="urls" className="space-y-4">
            {urls.length > 0 ? (
              <div className="grid gap-4">
                {urls.map((url) => (
                  <div key={url.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <LinkIcon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{url.name}</p>
                        <p className="text-sm text-muted-foreground">{url.chunks} chunks</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(url.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground">No URLs added yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            {manualEntries.length > 0 ? (
              <div className="grid gap-4">
                {manualEntries.map((entry) => (
                  <div key={entry.id} className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <p className="font-medium">{entry.name}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground pl-13 line-clamp-2">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Add Manual Q&A Entries</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create custom question-answer pairs for your chatbot
                </p>
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <AddKnowledgeDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </DashboardLayout>
  );
}
