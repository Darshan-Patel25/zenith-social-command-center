import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentRequest {
  prompt: string;
  platform?: string;
  tone?: string;
  contentType?: string;
  length?: 'short' | 'medium' | 'long';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { prompt, platform = 'general', tone = 'professional', contentType = 'post', length = 'medium' }: ContentRequest = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Build enhanced system prompt based on parameters
    let systemPrompt = `You are a professional social media content creator. Create engaging ${contentType} content`;
    
    if (platform !== 'general') {
      systemPrompt += ` specifically for ${platform}`;
    }
    
    systemPrompt += ` with a ${tone} tone.`;

    // Add length guidelines
    const lengthGuidelines = {
      short: 'Keep it concise (50-100 characters, ideal for Twitter)',
      medium: 'Use moderate length (100-280 characters, good for most platforms)',
      long: 'Create detailed content (280+ characters, suitable for LinkedIn or Facebook)'
    };
    
    systemPrompt += ` ${lengthGuidelines[length]}`;

    // Add platform-specific guidelines
    const platformGuidelines: Record<string, string> = {
      twitter: 'Use relevant hashtags, mentions, and keep it under 280 characters. Make it engaging and shareable.',
      linkedin: 'Professional tone, industry insights, use relevant hashtags. Encourage engagement with questions.',
      facebook: 'Conversational tone, encourage comments and shares. Use emojis sparingly.',
      instagram: 'Visual storytelling, use relevant hashtags (5-10), engaging captions, call-to-action.',
      tiktok: 'Trendy, casual, use trending hashtags, encourage participation.',
      youtube: 'Descriptive, SEO-friendly, include key points and timestamps if applicable.'
    };

    if (platformGuidelines[platform]) {
      systemPrompt += ` Platform-specific guidelines: ${platformGuidelines[platform]}`;
    }

    systemPrompt += ' Always include relevant hashtags and make the content engaging and authentic.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate content');
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      content: generatedContent,
      platform,
      tone,
      contentType,
      length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});