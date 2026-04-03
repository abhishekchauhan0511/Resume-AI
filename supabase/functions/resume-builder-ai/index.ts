import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const prompts: Record<string, string> = {
  summary: `Write a compelling 2-3 sentence professional summary for a resume. Use the candidate's skills, experience, and education to craft it. Return ONLY the summary text, no labels or formatting.`,
  experience: `Improve the following job experience description for a resume. Make it more impactful with action verbs, quantified achievements, and clear outcomes. Use bullet points starting with •. Return ONLY the improved description text.`,
  skills: `Based on the candidate's experience and education, suggest 10-15 relevant technical and soft skills they should add to their resume. Return ONLY a comma-separated list of skills.`,
  project: `Improve the following project description for a resume. Make it more impressive with specific technical details, impact metrics, and clear value. Use bullet points starting with •. Return ONLY the improved description text.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, resumeData, context } = await req.json();
    
    if (!type || !prompts[type]) {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const contextStr = context ? `\nContext: ${JSON.stringify(context)}` : '';
    const resumeStr = `\nCandidate Info:\nName: ${resumeData.personalInfo?.fullName || 'Not provided'}\nSkills: ${resumeData.skills?.join(', ') || 'Not provided'}\nExperience count: ${resumeData.experience?.length || 0}\nEducation count: ${resumeData.education?.length || 0}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: prompts[type] },
          { role: "user", content: `${resumeStr}${contextStr}` },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("resume-builder-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
