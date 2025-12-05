import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Bot {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  system_prompt: string;
  welcome_message: string;
  status: 'active' | 'inactive' | 'draft';
  model: string;
  temperature: number;
  max_tokens: number;
  widget_color: string;
  widget_position: string;
  widget_avatar_url: string | null;
  widget_title: string;
  business_only: boolean;
  allowed_topics: string[] | null;
  blocked_keywords: string[] | null;
  total_conversations: number;
  total_messages: number;
  created_at: string;
  updated_at: string;
}

export interface BotTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string | null;
  system_prompt: string;
  welcome_message: string | null;
  suggested_questions: string[] | null;
  default_settings: Record<string, unknown> | null;
  is_featured: boolean;
}

export function useBots(workspaceId: string | undefined) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [templates, setTemplates] = useState<BotTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workspaceId) {
      fetchBots();
    }
    fetchTemplates();
  }, [workspaceId]);

  const fetchBots = async () => {
    if (!workspaceId) return;

    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBots((data || []) as unknown as Bot[]);
    } catch (error) {
      console.error('Error fetching bots:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('bot_templates')
        .select('*')
        .order('is_featured', { ascending: false });

      if (error) throw error;
      setTemplates((data || []) as unknown as BotTemplate[]);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const createBot = async (botData: Partial<Bot>) => {
    if (!workspaceId) return null;

    try {
      const { data, error } = await supabase
        .from('bots')
        .insert({ 
          name: botData.name || 'New Bot',
          workspace_id: workspaceId,
          description: botData.description,
          system_prompt: botData.system_prompt,
          welcome_message: botData.welcome_message,
          status: botData.status || 'draft',
          model: botData.model,
          temperature: botData.temperature,
          max_tokens: botData.max_tokens,
          widget_color: botData.widget_color,
          widget_position: botData.widget_position,
          widget_title: botData.widget_title,
          business_only: botData.business_only,
          allowed_topics: botData.allowed_topics,
          blocked_keywords: botData.blocked_keywords,
        })
        .select()
        .single();

      if (error) throw error;

      const typedData = data as unknown as Bot;
      setBots(prev => [typedData, ...prev]);
      toast.success('Bot created successfully!');
      return typedData;
    } catch (error) {
      console.error('Error creating bot:', error);
      toast.error('Failed to create bot');
      return null;
    }
  };

  const createBotFromTemplate = async (template: BotTemplate) => {
    return createBot({
      name: template.name,
      description: template.description,
      system_prompt: template.system_prompt,
      welcome_message: template.welcome_message || 'Hello! How can I help you today?',
      status: 'draft',
    });
  };

  const updateBot = async (id: string, updates: Partial<Bot>) => {
    try {
      const { data, error } = await supabase
        .from('bots')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const typedData = data as unknown as Bot;
      setBots(prev => prev.map(b => b.id === id ? typedData : b));
      toast.success('Bot updated successfully!');
      return typedData;
    } catch (error) {
      console.error('Error updating bot:', error);
      toast.error('Failed to update bot');
      return null;
    }
  };

  const deleteBot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bots')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBots(prev => prev.filter(b => b.id !== id));
      toast.success('Bot deleted successfully!');
    } catch (error) {
      console.error('Error deleting bot:', error);
      toast.error('Failed to delete bot');
    }
  };

  return {
    bots,
    templates,
    loading,
    createBot,
    createBotFromTemplate,
    updateBot,
    deleteBot,
    refetch: fetchBots,
  };
}
