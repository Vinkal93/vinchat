import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export function useWorkspace() {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWorkspaces();
    }
  }, [user]);

  const fetchWorkspaces = async () => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = (data || []) as unknown as Workspace[];
      setWorkspaces(typedData);
      if (typedData.length > 0 && !currentWorkspace) {
        setCurrentWorkspace(typedData[0]);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (name: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({ name, owner_id: user.id })
        .select()
        .single();

      if (error) throw error;

      const typedData = data as unknown as Workspace;
      setWorkspaces(prev => [typedData, ...prev]);
      return typedData;
    } catch (error) {
      console.error('Error creating workspace:', error);
      return null;
    }
  };

  return {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    loading,
    createWorkspace,
    refetch: fetchWorkspaces,
  };
}
