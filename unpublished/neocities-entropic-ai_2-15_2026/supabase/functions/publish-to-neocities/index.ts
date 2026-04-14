import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const NEOCITIES_API_TOKEN = Deno.env.get('NEOCITIES_API_TOKEN') || '';
const ALLOWED_PATHS = (Deno.env.get('ALLOWED_PATHS') || '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean);

function normalizePath(path: string): string {
  return path.replace(/^\/+/, '').trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !NEOCITIES_API_TOKEN) {
      return new Response(JSON.stringify({ error: 'Function secrets are missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing auth token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Invalid auth token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userId = userData.user.id;

    const { data: adminRow, error: adminError } = await admin
      .from('admin_users')
      .select('user_id,is_active')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle();

    if (adminError || !adminRow) {
      return new Response(JSON.stringify({ error: 'Not authorized for publishing' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const body = await req.json();
    const path = normalizePath(String(body.path || ''));
    const html = String(body.html || '');
    const title = body.title ? String(body.title) : null;
    const description = body.description ? String(body.description) : null;

    if (!path || !html.trim()) {
      return new Response(JSON.stringify({ error: 'path and html are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (ALLOWED_PATHS.length > 0 && !ALLOWED_PATHS.includes(path)) {
      return new Response(JSON.stringify({ error: `Path not allowed: ${path}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const form = new FormData();
    form.append(path, new Blob([html], { type: 'text/html; charset=utf-8' }), path);

    const neocitiesResp = await fetch('https://neocities.org/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${NEOCITIES_API_TOKEN}` },
      body: form
    });

    const neocitiesJson = await neocitiesResp.json().catch(() => ({}));

    if (!neocitiesResp.ok || neocitiesJson.result === 'error') {
      return new Response(
        JSON.stringify({
          error: neocitiesJson.message || 'Neocities upload failed',
          details: neocitiesJson
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    await admin.from('page_publish_logs').insert([
      {
        path,
        title,
        meta_description: description,
        published_by: userId
      }
    ]);

    return new Response(JSON.stringify({ ok: true, path, neocities: neocitiesJson }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
