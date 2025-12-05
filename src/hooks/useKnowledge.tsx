import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface KnowledgeItem {
  id: string;
  bot_id: string;
  source_type: 'file' | 'url' | 'text' | 'api';
  title: string;
  content: string | null;
  url: string | null;
  file_path: string | null;
  file_size: number | null;
  metadata: Record<string, unknown> | null;
  chunks_count: number;
  is_processed: boolean;
  created_at: string;
  updated_at: string;
}

export function useKnowledge(botId: string | undefined) {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (botId) {
      fetchKnowledge();
    }
  }, [botId]);

  const fetchKnowledge = async () => {
    if (!botId) return;

    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('bot_id', botId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKnowledge((data || []) as unknown as KnowledgeItem[]);
    } catch (error) {
      console.error('Error fetching knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTextKnowledge = async (title: string, content: string) => {
    if (!botId) return null;

    try {
      const chunksCount = Math.ceil(content.length / 500);
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          bot_id: botId,
          source_type: 'text' as const,
          title,
          content,
          chunks_count: chunksCount,
          is_processed: true,
          metadata: { status: 'processed' },
        })
        .select()
        .single();

      if (error) throw error;

      const typedData = data as unknown as KnowledgeItem;
      setKnowledge(prev => [typedData, ...prev]);
      toast.success('Knowledge added successfully!');
      return typedData;
    } catch (error) {
      console.error('Error adding knowledge:', error);
      toast.error('Failed to add knowledge');
      return null;
    }
  };

  const addUrlKnowledge = async (url: string) => {
    if (!botId) return null;

    try {
      // First create the entry
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          bot_id: botId,
          source_type: 'url' as const,
          title: url,
          url,
          is_processed: false,
          metadata: { status: 'pending' },
        })
        .select()
        .single();

      if (error) throw error;

      const typedData = data as unknown as KnowledgeItem;
      setKnowledge(prev => [typedData, ...prev]);
      toast.success('URL added! Crawling in progress...');

      // Trigger crawling
      const { error: crawlError } = await supabase.functions.invoke('crawl-url', {
        body: { url, botId, knowledgeId: typedData.id },
      });

      if (crawlError) {
        console.error('Crawl error:', crawlError);
        toast.error('Failed to crawl URL');
      } else {
        // Refresh to get updated data
        setTimeout(fetchKnowledge, 3000);
      }

      return typedData;
    } catch (error) {
      console.error('Error adding URL:', error);
      toast.error('Failed to add URL');
      return null;
    }
  };

  const deleteKnowledge = async (id: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setKnowledge(prev => prev.filter(k => k.id !== id));
      toast.success('Knowledge deleted!');
    } catch (error) {
      console.error('Error deleting knowledge:', error);
      toast.error('Failed to delete knowledge');
    }
  };

  const reprocessKnowledge = async (item: KnowledgeItem) => {
    if (item.source_type === 'url' && item.url) {
      await supabase
        .from('knowledge_base')
        .update({ is_processed: false, metadata: { status: 'pending' } })
        .eq('id', item.id);

      await supabase.functions.invoke('crawl-url', {
        body: { url: item.url, botId: item.bot_id, knowledgeId: item.id },
      });

      toast.success('Reprocessing started...');
      setTimeout(fetchKnowledge, 3000);
    }
  };

  return {
    knowledge,
    loading,
    addTextKnowledge,
    addUrlKnowledge,
    deleteKnowledge,
    reprocessKnowledge,
    refetch: fetchKnowledge,
  };
}
