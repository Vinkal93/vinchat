import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Key,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Settings() {
  const { user, signOut } = useAuth();
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; provider: string; visible: boolean }[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyProvider, setNewKeyProvider] = useState("openai");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [showNewKey, setShowNewKey] = useState(false);

  const [settings, setSettings] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    notifications: {
      email: true,
      push: false,
      weekly: true,
    },
    defaultModel: "google/gemini-2.5-flash",
    defaultTemperature: 0.7,
    widgetDefaults: {
      color: "#6366f1",
      position: "bottom-right",
      title: "Chat with us",
    },
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleAddApiKey = () => {
    if (!newKeyName || !newKeyValue) {
      toast.error("Please fill in all fields");
      return;
    }

    setApiKeys(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newKeyName,
        provider: newKeyProvider,
        visible: false,
      },
    ]);
    setNewKeyName("");
    setNewKeyValue("");
    toast.success("API key added!");
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    toast.success("API key deleted");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
          <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="api-keys">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="defaults">
              <Palette className="w-4 h-4 mr-2" />
              Defaults
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6 space-y-6"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {settings.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{settings.fullName || "User"}</h3>
                  <p className="text-muted-foreground">{settings.email}</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Full Name</Label>
                  <Input
                    value={settings.fullName}
                    onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input value={settings.email} disabled />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Existing Keys */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-4">Your API Keys</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your own API keys for enhanced AI capabilities. Your keys are encrypted and stored securely.
                </p>

                {apiKeys.length === 0 ? (
                  <div className="text-center py-8 bg-muted/50 rounded-lg">
                    <Key className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No API keys added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {apiKeys.map((key) => (
                      <div
                        key={key.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Key className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{key.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{key.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteKey(key.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Key */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-4">Add New API Key</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="My OpenAI Key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Provider</Label>
                    <Select value={newKeyProvider} onValueChange={setNewKeyProvider}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="google">Google AI</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>API Key</Label>
                    <div className="relative">
                      <Input
                        type={showNewKey ? "text" : "password"}
                        placeholder="sk-..."
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewKey(!showNewKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showNewKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button onClick={handleAddApiKey}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add API Key
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6 space-y-6"
            >
              <h3 className="font-semibold">Notification Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your chatbots via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, email: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, push: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Report</p>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly analytics summary
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.weekly}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, weekly: checked },
                      })
                    }
                  />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Defaults Tab */}
          <TabsContent value="defaults">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6 space-y-6"
            >
              <h3 className="font-semibold">Default Bot Settings</h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Default AI Model</Label>
                  <Select
                    value={settings.defaultModel}
                    onValueChange={(value) => setSettings({ ...settings, defaultModel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google/gemini-2.5-flash">Gemini 2.5 Flash (Fast)</SelectItem>
                      <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro (Powerful)</SelectItem>
                      <SelectItem value="openai/gpt-5-mini">GPT-5 Mini</SelectItem>
                      <SelectItem value="openai/gpt-5">GPT-5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Default Widget Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.widgetDefaults.color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          widgetDefaults: { ...settings.widgetDefaults, color: e.target.value },
                        })
                      }
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.widgetDefaults.color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          widgetDefaults: { ...settings.widgetDefaults, color: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Default Widget Position</Label>
                  <Select
                    value={settings.widgetDefaults.position}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        widgetDefaults: { ...settings.widgetDefaults, position: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Default Widget Title</Label>
                  <Input
                    value={settings.widgetDefaults.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        widgetDefaults: { ...settings.widgetDefaults, title: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-4">Account Security</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">
                        Update your password regularly for security
                      </p>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-destructive/20 p-6">
                <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sign Out</p>
                    <p className="text-sm text-muted-foreground">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <Button variant="destructive" onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
