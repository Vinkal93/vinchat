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

const documents = [
  {
    id: 1,
    name: "Product Documentation.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "processed",
    chunks: 124,
    uploadedAt: "2 days ago",
  },
  {
    id: 2,
    name: "FAQ Database.xlsx",
    type: "CSV",
    size: "856 KB",
    status: "processed",
    chunks: 89,
    uploadedAt: "3 days ago",
  },
  {
    id: 3,
    name: "User Manual.docx",
    type: "DOCX",
    size: "1.2 MB",
    status: "processing",
    chunks: 0,
    uploadedAt: "Just now",
  },
  {
    id: 4,
    name: "Company Policies.pdf",
    type: "PDF",
    size: "4.1 MB",
    status: "processed",
    chunks: 256,
    uploadedAt: "1 week ago",
  },
  {
    id: 5,
    name: "Training Materials.pdf",
    type: "PDF",
    size: "8.2 MB",
    status: "failed",
    chunks: 0,
    uploadedAt: "5 days ago",
  },
];

const urls = [
  {
    id: 1,
    url: "https://docs.example.com",
    pages: 45,
    status: "processed",
    lastCrawled: "1 hour ago",
  },
  {
    id: 2,
    url: "https://help.example.com",
    pages: 128,
    status: "processed",
    lastCrawled: "2 hours ago",
  },
  {
    id: 3,
    url: "https://blog.example.com",
    pages: 0,
    status: "crawling",
    lastCrawled: "In progress...",
  },
];

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

export default function Knowledge() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground">Manage your chatbot's training data</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label: "Total Documents", value: "24" },
            { label: "Total Chunks", value: "1,847" },
            { label: "URLs Crawled", value: "3" },
            { label: "Token Usage", value: "450K / 500K" },
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
        <Tabs defaultValue="documents" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="urls">URLs</TabsTrigger>
              <TabsTrigger value="manual">Manual Entries</TabsTrigger>
            </TabsList>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
          </div>

          <TabsContent value="documents" className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Drop files here or click to upload</h3>
              <p className="text-sm text-muted-foreground">
                Supports PDF, DOCX, TXT, CSV, and images (with OCR)
              </p>
            </div>

            {/* Documents List */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Size</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Chunks</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Uploaded</th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{doc.type}</td>
                        <td className="p-4 text-sm text-muted-foreground">{doc.size}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(doc.status)}
                            <span className="text-sm capitalize">{doc.status}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{doc.chunks}</td>
                        <td className="p-4 text-sm text-muted-foreground">{doc.uploadedAt}</td>
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
                              <DropdownMenuItem className="text-destructive">
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
          </TabsContent>

          <TabsContent value="urls" className="space-y-4">
            {/* Add URL */}
            <div className="flex gap-2">
              <Input placeholder="Enter URL to crawl..." className="flex-1" />
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add URL
              </Button>
            </div>

            {/* URLs List */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">URL</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pages</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Crawled</th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {urls.map((url) => (
                      <tr key={url.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                              <LinkIcon className="w-5 h-5 text-accent" />
                            </div>
                            <span className="font-medium">{url.url}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{url.pages}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(url.status)}
                            <span className="text-sm capitalize">{url.status}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{url.lastCrawled}</td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Recrawl
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
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
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Add Manual Q&A Entries</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create custom question-answer pairs for your chatbot
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
