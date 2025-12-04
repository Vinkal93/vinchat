import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Plus, Search, MoreVertical, Play, Settings, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const chatbots = [
  {
    id: 1,
    name: "Customer Support Bot",
    description: "Handles customer inquiries and FAQs",
    status: "active",
    messages: 12340,
    accuracy: 96,
    lastActive: "2 min ago",
  },
  {
    id: 2,
    name: "Sales Assistant",
    description: "Helps with product recommendations and pricing",
    status: "active",
    messages: 8560,
    accuracy: 92,
    lastActive: "5 min ago",
  },
  {
    id: 3,
    name: "HR Helper",
    description: "Employee onboarding and policy questions",
    status: "training",
    messages: 0,
    accuracy: 0,
    lastActive: "Training...",
  },
  {
    id: 4,
    name: "Product Guide",
    description: "Technical specifications and documentation",
    status: "active",
    messages: 4320,
    accuracy: 89,
    lastActive: "18 min ago",
  },
  {
    id: 5,
    name: "Internal Wiki Bot",
    description: "Company knowledge base assistant",
    status: "paused",
    messages: 2100,
    accuracy: 85,
    lastActive: "2 days ago",
  },
];

export default function Bots() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBots = chatbots.filter((bot) =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Chatbots</h1>
            <p className="text-muted-foreground">Manage and configure your AI chatbots</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Create New Bot
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search chatbots..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Bots Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBots.map((bot, index) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{bot.name}</h3>
                    <span
                      className={`inline-flex items-center gap-1 text-xs ${
                        bot.status === "active"
                          ? "text-accent"
                          : bot.status === "training"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          bot.status === "active"
                            ? "bg-accent"
                            : bot.status === "training"
                            ? "bg-primary animate-pulse"
                            : "bg-muted-foreground"
                        }`}
                      />
                      {bot.status}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Play className="w-4 h-4 mr-2" />
                      Open Playground
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {bot.description}
              </p>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
                <div>
                  <p className="text-lg font-semibold">{bot.messages.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Messages</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{bot.accuracy}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{bot.lastActive}</p>
                  <p className="text-xs text-muted-foreground">Last active</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="w-4 h-4 mr-1" />
                  Test
                </Button>
                <Button size="sm" className="flex-1">
                  Configure
                </Button>
              </div>
            </motion.div>
          ))}

          {/* Create New Bot Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: filteredBots.length * 0.1 }}
            className="bg-card rounded-xl border-2 border-dashed border-border p-6 flex flex-col items-center justify-center min-h-[280px] hover:border-primary/50 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Create New Chatbot</h3>
            <p className="text-sm text-muted-foreground text-center">
              Build an AI assistant from your data
            </p>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
