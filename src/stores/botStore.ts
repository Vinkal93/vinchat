import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KnowledgeItem {
  id: string;
  name: string;
  type: 'document' | 'url' | 'manual';
  content: string;
  status: 'processing' | 'processed' | 'failed';
  chunks: number;
  createdAt: Date;
}

export interface Bot {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  welcomeMessage: string;
  status: 'active' | 'training' | 'paused';
  knowledgeIds: string[];
  messages: number;
  accuracy: number;
  lastActive: string;
  widgetConfig: {
    primaryColor: string;
    position: 'bottom-right' | 'bottom-left';
    avatarUrl?: string;
    headerTitle: string;
  };
  createdAt: Date;
}

interface BotStore {
  bots: Bot[];
  knowledge: KnowledgeItem[];
  addBot: (bot: Omit<Bot, 'id' | 'messages' | 'accuracy' | 'lastActive' | 'createdAt'>) => Bot;
  updateBot: (id: string, updates: Partial<Bot>) => void;
  deleteBot: (id: string) => void;
  addKnowledge: (item: Omit<KnowledgeItem, 'id' | 'chunks' | 'createdAt'>) => KnowledgeItem;
  updateKnowledge: (id: string, updates: Partial<KnowledgeItem>) => void;
  deleteKnowledge: (id: string) => void;
  getBotById: (id: string) => Bot | undefined;
}

export const useBotStore = create<BotStore>()(
  persist(
    (set, get) => ({
      bots: [
        {
          id: '1',
          name: 'Customer Support Bot',
          description: 'Handles customer inquiries and FAQs',
          systemPrompt: 'You are a helpful customer support assistant. Answer questions based on the provided knowledge base.',
          welcomeMessage: 'Hello! How can I help you today?',
          status: 'active',
          knowledgeIds: ['1', '2'],
          messages: 12340,
          accuracy: 96,
          lastActive: '2 min ago',
          widgetConfig: {
            primaryColor: '#6366f1',
            position: 'bottom-right',
            headerTitle: 'Customer Support',
          },
          createdAt: new Date(),
        },
      ],
      knowledge: [
        {
          id: '1',
          name: 'Product Documentation.pdf',
          type: 'document',
          content: 'Product features include: AI-powered chatbots, custom knowledge bases, analytics dashboard, and embeddable widgets.',
          status: 'processed',
          chunks: 124,
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'FAQ Database',
          type: 'manual',
          content: 'Q: How do I create a chatbot? A: Go to the Bots page and click Create New Bot.',
          status: 'processed',
          chunks: 89,
          createdAt: new Date(),
        },
      ],
      
      addBot: (botData) => {
        const newBot: Bot = {
          ...botData,
          id: Date.now().toString(),
          messages: 0,
          accuracy: 0,
          lastActive: 'Just now',
          createdAt: new Date(),
        };
        set((state) => ({ bots: [...state.bots, newBot] }));
        return newBot;
      },
      
      updateBot: (id, updates) => {
        set((state) => ({
          bots: state.bots.map((bot) =>
            bot.id === id ? { ...bot, ...updates } : bot
          ),
        }));
      },
      
      deleteBot: (id) => {
        set((state) => ({
          bots: state.bots.filter((bot) => bot.id !== id),
        }));
      },
      
      addKnowledge: (itemData) => {
        const newItem: KnowledgeItem = {
          ...itemData,
          id: Date.now().toString(),
          chunks: Math.floor(itemData.content.length / 100),
          createdAt: new Date(),
        };
        set((state) => ({ knowledge: [...state.knowledge, newItem] }));
        return newItem;
      },
      
      updateKnowledge: (id, updates) => {
        set((state) => ({
          knowledge: state.knowledge.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },
      
      deleteKnowledge: (id) => {
        set((state) => ({
          knowledge: state.knowledge.filter((item) => item.id !== id),
        }));
      },
      
      getBotById: (id) => {
        return get().bots.find((bot) => bot.id === id);
      },
    }),
    {
      name: 'chatbot-storage',
    }
  )
);
