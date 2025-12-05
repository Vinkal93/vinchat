import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function extractTextContent(html: string): { title: string; content: string } {
  // Simple HTML text extraction without DOM parser
  let title = "";
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // Remove script and style tags
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up whitespace
  text = text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .trim();

  return { title, content: text };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

  let knowledgeId: string | undefined;

  try {
    const body = await req.json();
    const url = body.url;
    knowledgeId = body.knowledgeId;
    
    console.log(`Crawling URL: ${url}`);

    // Update status to crawling
    await supabase
      .from("knowledge_base")
      .update({ metadata: { status: "crawling" } })
      .eq("id", knowledgeId);

    // Fetch the URL
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ChatbotCrawler/1.0)",
        "Accept": "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    const { title, content } = extractTextContent(html);
    
    const finalTitle = title || new URL(url).hostname;
    const cleanedContent = content.slice(0, 50000); // Limit content size
    const chunksCount = Math.ceil(cleanedContent.length / 500);

    // Update knowledge base entry
    const { error } = await supabase
      .from("knowledge_base")
      .update({
        title: finalTitle,
        content: cleanedContent,
        chunks_count: chunksCount,
        is_processed: true,
        metadata: { 
          status: "processed",
          crawled_at: new Date().toISOString(),
          content_length: cleanedContent.length,
        },
      })
      .eq("id", knowledgeId);

    if (error) {
      console.error("Database update error:", error);
      throw error;
    }

    console.log(`Successfully crawled ${url}, extracted ${cleanedContent.length} chars`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        title: finalTitle,
        contentLength: cleanedContent.length,
        chunks: chunksCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Crawl error:", error);
    
    // Update status to failed
    if (knowledgeId) {
      await supabase
        .from("knowledge_base")
        .update({ 
          metadata: { 
            status: "failed", 
            error: error instanceof Error ? error.message : "Unknown error" 
          } 
        })
        .eq("id", knowledgeId);
    }

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Crawl failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
