-- Fix security vulnerability: Remove api_keys table and update call_perplexity_api function
-- The api_keys table currently allows any authenticated user to access all API keys
-- This is a critical security risk. We'll use Supabase secrets instead.

-- First, update the call_perplexity_api function to use Supabase secrets
CREATE OR REPLACE FUNCTION public.call_perplexity_api(query text)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$ 
DECLARE 
    http_response http_response;
BEGIN 
    -- Make HTTP request using http extension with API key from secrets
    -- The PERPLEXITY_API_KEY is securely stored in Supabase secrets
    SELECT * INTO http_response FROM http((
        'POST',
        'https://api.perplexity.ai/chat/completions',
        ARRAY[
            http_header('Authorization', 'Bearer ' || current_setting('app.settings.perplexity_api_key', true)),
            http_header('Content-Type', 'application/json')
        ],
        'application/json',
        json_build_object(
            'model', 'llama-3.1-sonar-small-128k-online',
            'messages', json_build_array(
                json_build_object('role', 'user', 'content', query)
            ),
            'temperature', 0.2,
            'top_p', 0.9,
            'max_tokens', 1000,
            'return_images', false,
            'return_related_questions', false,
            'search_recency_filter', 'month'
        )::text
    )::http_request);
    
    RETURN http_response.content::jsonb;
END; 
$function$;

-- Now safely drop the vulnerable api_keys table
-- This removes the security vulnerability entirely
DROP TABLE IF EXISTS public.api_keys;