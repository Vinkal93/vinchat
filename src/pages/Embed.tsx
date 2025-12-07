import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Copy, Check, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useBots } from "@/hooks/useBots";
import { useWorkspace } from "@/hooks/useWorkspace";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Embed() {
  const { currentWorkspace, loading: workspaceLoading } = useWorkspace();
  const { bots, loading: botsLoading } = useBots(currentWorkspace?.id);
  const [selectedBotId, setSelectedBotId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Set default bot when bots load
  if (bots.length > 0 && !selectedBotId) {
    setSelectedBotId(bots[0].id);
  }

  const selectedBot = bots.find(b => b.id === selectedBotId);

  const embedCode = selectedBot 
    ? `<!-- Add this script to your website's <head> or before </body> -->
<script 
  src="${window.location.origin}/embed.js" 
  data-bot-id="${selectedBot.id}"
  data-position="bottom-right"
  data-color="${selectedBot.widget_color || '#6366f1'}"
></script>`
    : '';

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success('Embed code copied to clipboard!');
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
          <h3 className="font-semibold text-lg mb-2">Create a Bot First</h3>
          <p className="text-muted-foreground text-sm max-w-md mb-4">
            You need to create a chatbot before you can embed it on your website.
          </p>
          <Button onClick={() => window.location.href = '/dashboard/bots'}>
            Create a Bot
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Embed Chatbot</h1>
          <p className="text-muted-foreground">Add your chatbot to any website with a simple script tag</p>
        </div>

        {/* Bot Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h2 className="font-semibold mb-4">Select a Chatbot</h2>
          <Select value={selectedBotId} onValueChange={setSelectedBotId}>
            <SelectTrigger className="w-full max-w-xs">
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
        </motion.div>

        {/* Embed Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Embed Code
            </h2>
            <Button onClick={copyCode} variant="outline" size="sm">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-accent" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
          
          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-foreground">
              <code>{embedCode}</code>
            </pre>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h2 className="font-semibold mb-4">Installation Instructions</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <div>
                <h3 className="font-medium">Copy the embed code</h3>
                <p className="text-sm text-muted-foreground">
                  Click the "Copy Code" button above to copy the embed script to your clipboard.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <div>
                <h3 className="font-medium">Paste in your website</h3>
                <p className="text-sm text-muted-foreground">
                  Add the script tag to your website's HTML, preferably just before the closing <code className="bg-muted px-1 rounded">&lt;/body&gt;</code> tag.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <div>
                <h3 className="font-medium">Start chatting</h3>
                <p className="text-sm text-muted-foreground">
                  The chat widget will appear on your website. Visitors can click it to start a conversation with your AI chatbot.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Customization Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h2 className="font-semibold mb-4">Customization Options</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-medium">Attribute</th>
                  <th className="text-left py-2 pr-4 font-medium">Description</th>
                  <th className="text-left py-2 font-medium">Default</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded">data-bot-id</code></td>
                  <td className="py-2 pr-4 text-muted-foreground">Your chatbot's unique identifier (required)</td>
                  <td className="py-2">-</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded">data-position</code></td>
                  <td className="py-2 pr-4 text-muted-foreground">Widget position on screen</td>
                  <td className="py-2">bottom-right</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded">data-color</code></td>
                  <td className="py-2 pr-4 text-muted-foreground">Primary color (hex code)</td>
                  <td className="py-2">#6366f1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
