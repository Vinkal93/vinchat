
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for bot status
CREATE TYPE public.bot_status AS ENUM ('active', 'inactive', 'draft');

-- Create enum for knowledge source type
CREATE TYPE public.knowledge_source_type AS ENUM ('file', 'url', 'text', 'api');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create workspaces table
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bots table
CREATE TABLE public.bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT DEFAULT 'You are a helpful AI assistant.',
  welcome_message TEXT DEFAULT 'Hello! How can I help you today?',
  status bot_status DEFAULT 'draft',
  model TEXT DEFAULT 'google/gemini-2.5-flash',
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1024,
  -- Widget customization
  widget_color TEXT DEFAULT '#6366f1',
  widget_position TEXT DEFAULT 'bottom-right',
  widget_avatar_url TEXT,
  widget_title TEXT DEFAULT 'Chat with us',
  -- Filters
  business_only BOOLEAN DEFAULT false,
  allowed_topics TEXT[],
  blocked_keywords TEXT[],
  -- Analytics
  total_conversations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create knowledge_base table
CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE NOT NULL,
  source_type knowledge_source_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  url TEXT,
  file_path TEXT,
  file_size INTEGER,
  metadata JSONB DEFAULT '{}',
  chunks_count INTEGER DEFAULT 0,
  is_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  visitor_info JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  message_count INTEGER DEFAULT 0
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics_events table
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  visitor_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bot_templates table for premade chatbots
CREATE TABLE public.bot_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT,
  system_prompt TEXT NOT NULL,
  welcome_message TEXT,
  suggested_questions TEXT[],
  default_settings JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create api_keys table for user custom API keys
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User roles: users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Workspaces: users can CRUD their own workspaces
CREATE POLICY "Users can view own workspaces" ON public.workspaces FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can create workspaces" ON public.workspaces FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own workspaces" ON public.workspaces FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own workspaces" ON public.workspaces FOR DELETE USING (auth.uid() = owner_id);

-- Bots: users can CRUD bots in their workspaces
CREATE POLICY "Users can view own bots" ON public.bots FOR SELECT USING (
  workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid())
);
CREATE POLICY "Users can create bots" ON public.bots FOR INSERT WITH CHECK (
  workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid())
);
CREATE POLICY "Users can update own bots" ON public.bots FOR UPDATE USING (
  workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid())
);
CREATE POLICY "Users can delete own bots" ON public.bots FOR DELETE USING (
  workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid())
);

-- Knowledge base: users can CRUD knowledge for their bots
CREATE POLICY "Users can view own knowledge" ON public.knowledge_base FOR SELECT USING (
  bot_id IN (SELECT id FROM public.bots WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid()))
);
CREATE POLICY "Users can create knowledge" ON public.knowledge_base FOR INSERT WITH CHECK (
  bot_id IN (SELECT id FROM public.bots WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid()))
);
CREATE POLICY "Users can update own knowledge" ON public.knowledge_base FOR UPDATE USING (
  bot_id IN (SELECT id FROM public.bots WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid()))
);
CREATE POLICY "Users can delete own knowledge" ON public.knowledge_base FOR DELETE USING (
  bot_id IN (SELECT id FROM public.bots WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid()))
);

-- Conversations: users can view conversations for their bots
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (
  bot_id IN (SELECT id FROM public.bots WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid()))
);
-- Public can create conversations (for widget users)
CREATE POLICY "Anyone can create conversations" ON public.conversations FOR INSERT WITH CHECK (true);

-- Messages: users can view messages for their bots
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
  conversation_id IN (SELECT id FROM public.conversations WHERE bot_id IN (SELECT id FROM public.bots WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid())))
);
-- Public can create messages (for widget users)
CREATE POLICY "Anyone can create messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Analytics: users can view analytics for their bots
CREATE POLICY "Users can view own analytics" ON public.analytics_events FOR SELECT USING (
  bot_id IN (SELECT id FROM public.bots WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid()))
);
-- Public can create analytics events
CREATE POLICY "Anyone can create analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Bot templates: everyone can view templates
CREATE POLICY "Anyone can view templates" ON public.bot_templates FOR SELECT USING (true);

-- API keys: users can CRUD their own API keys
CREATE POLICY "Users can view own api_keys" ON public.api_keys FOR SELECT USING (
  workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid())
);
CREATE POLICY "Users can create api_keys" ON public.api_keys FOR INSERT WITH CHECK (
  workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid())
);
CREATE POLICY "Users can delete api_keys" ON public.api_keys FOR DELETE USING (
  workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid())
);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Create default workspace
  INSERT INTO public.workspaces (name, owner_id)
  VALUES ('My Workspace', NEW.id);
  
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_bots_updated_at BEFORE UPDATE ON public.bots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON public.knowledge_base FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Insert premade bot templates
INSERT INTO public.bot_templates (name, description, category, icon, system_prompt, welcome_message, suggested_questions, is_featured) VALUES
('Customer Support', 'Professional customer service bot that handles inquiries and resolves issues', 'Support', '🎧', 'You are a professional customer support agent. Be helpful, empathetic, and solution-oriented. Always maintain a friendly tone while efficiently addressing customer concerns.', 'Hi! I''m here to help you with any questions or issues. How can I assist you today?', ARRAY['What are your business hours?', 'How can I track my order?', 'I need help with a refund'], true),
('Sales Assistant', 'Engaging sales bot that helps convert visitors into customers', 'Sales', '💼', 'You are a knowledgeable sales assistant. Help customers understand products/services, answer questions about pricing and features, and guide them towards making informed purchasing decisions. Be persuasive but not pushy.', 'Welcome! I''m here to help you find exactly what you''re looking for. What brings you here today?', ARRAY['Tell me about your products', 'What are your pricing plans?', 'Do you offer discounts?'], true),
('FAQ Bot', 'Quick answers to frequently asked questions', 'General', '❓', 'You are a helpful FAQ assistant. Provide clear, concise answers to common questions. If you don''t know the answer, politely let the user know and suggest they contact support.', 'Hello! I can help answer your questions. What would you like to know?', ARRAY['What services do you offer?', 'How do I get started?', 'Contact information'], true),
('Lead Generation', 'Capture leads and qualify prospects', 'Marketing', '🎯', 'You are a lead generation assistant. Your goal is to engage visitors, understand their needs, and collect their contact information for follow-up. Be conversational and helpful while gathering relevant information.', 'Hi there! I''d love to learn more about your needs. What project are you working on?', ARRAY['Tell me about your services', 'I need a quote', 'Schedule a demo'], true),
('Technical Support', 'Expert tech support for product issues', 'Support', '🔧', 'You are a technical support specialist. Help users troubleshoot issues step by step. Ask clarifying questions to understand the problem, provide clear solutions, and escalate to human support when necessary.', 'Hello! I''m here to help with any technical issues. Can you describe what problem you''re experiencing?', ARRAY['My product isn''t working', 'How do I set up...', 'I''m getting an error'], false),
('Appointment Scheduler', 'Book appointments and manage schedules', 'Business', '📅', 'You are an appointment scheduling assistant. Help users book appointments, check availability, and manage their schedules. Be efficient and confirm all details clearly.', 'Welcome! I can help you schedule an appointment. When would you like to book?', ARRAY['Book an appointment', 'Check availability', 'Reschedule my booking'], false),
('E-commerce Helper', 'Product recommendations and shopping assistance', 'E-commerce', '🛒', 'You are a shopping assistant for an online store. Help customers find products, compare options, check stock availability, and assist with the checkout process. Be knowledgeable about the product catalog.', 'Hello, welcome to our store! Looking for something specific or just browsing?', ARRAY['Show me popular items', 'Help me find...', 'What''s on sale?'], true),
('HR Assistant', 'Answer employee questions and HR inquiries', 'Business', '👥', 'You are an HR assistant. Help employees with questions about policies, benefits, leave requests, and other HR-related matters. Be professional and maintain confidentiality.', 'Hi! I''m here to help with any HR-related questions. What can I assist you with?', ARRAY['Leave policy', 'Benefits information', 'Company holidays'], false);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
