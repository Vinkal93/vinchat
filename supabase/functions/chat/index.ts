import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, botId, sessionId, visitorInfo } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get bot configuration
    const { data: bot, error: botError } = await supabase
      .from("bots")
      .select("*")
      .eq("id", botId)
      .single();

    if (botError || !bot) {
      console.error("Bot not found:", botError);
      return new Response(JSON.stringify({ error: "Bot not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get knowledge base content
    const { data: knowledge } = await supabase
      .from("knowledge_base")
      .select("title, content")
      .eq("bot_id", botId)
      .eq("is_processed", true);

    const knowledgeContext = knowledge?.map(k => `${k.title}: ${k.content}`).join("\n\n") || "";

    // Build system prompt with knowledge and filters
    let systemPrompt = bot.system_prompt || "You are a helpful AI assistant.";
    
    if (knowledgeContext) {
      systemPrompt += `\n\nUse the following knowledge base to answer questions:\n${knowledgeContext}`;
    }

    if (bot.business_only) {
      systemPrompt += "\n\nIMPORTANT: Only respond to questions related to business topics. Politely decline to answer personal, off-topic, or inappropriate questions.";
    }

    if (bot.allowed_topics?.length > 0) {
      systemPrompt += `\n\nOnly discuss these topics: ${bot.allowed_topics.join(", ")}. For other topics, politely redirect the conversation.`;
    }

    if (bot.blocked_keywords?.length > 0) {
      systemPrompt += `\n\nDo not discuss or mention anything related to: ${bot.blocked_keywords.join(", ")}.`;
    }

    // Get or create conversation
    let conversationId = null;
    if (sessionId) {
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id")
        .eq("bot_id", botId)
        .eq("session_id", sessionId)
        .maybeSingle();

      if (existingConv) {
        conversationId = existingConv.id;
      } else {
        const { data: newConv } = await supabase
          .from("conversations")
          .insert({ bot_id: botId, session_id: sessionId, visitor_info: visitorInfo || {} })
          .select("id")
          .single();
        conversationId = newConv?.id;
      }
    }

    // Save user message
    if (conversationId && messages.length > 0) {
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage.role === "user") {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "user",
          content: lastUserMessage.content,
        });
      }
    }

    // Log analytics event
    await supabase.from("analytics_events").insert({
      bot_id: botId,
      event_type: "message_sent",
      session_id: sessionId,
      visitor_info: visitorInfo || {},
    });

    // Call Lovable AI Gateway with streaming
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: bot.model || "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: parseFloat(bot.temperature) || 0.7,
        max_tokens: bot.max_tokens || 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
