var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });


var src_default = {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    let body;
    try {
      body = await request.text();
    } catch (e) {
      return new Response("Invalid JSON in request body", {
        status: 400,
        headers: corsHeaders,
      });
    }

    try {
      const samplePromp = `# Mental Health Assessment Report Generator

      Generate a JSON report from mental health questionnaire responses for a visual report dashboard.
      IMPORTANT: Your response MUST be ONLY the JSON object with no additional text, explanations, or commentary before or after. Return ONLY valid JSON.
      DONOT ADD anything extra, return the JSON as PLAIN TEXT NO FORMATING NO NEWLINE CHARACTERS ETC
      ## Questions & Answer Format
      1. Current mood? (1-10)
      2. Feelings this week? (anxious, sad, happy, stressed)
      3. Frequency of feeling overwhelmed? (never, rarely, sometimes, often)
      4. Describe feelings in your own words:
      5. Hours of sleep last night? (number)
      6. Appetite changes? (no_change, increased, decreased)
      7. Enough social support? (yes, somewhat, no)
      8. Frequency of enjoyable activities? (daily, several_times, once_week, rarely)
      9. Exercise frequency? (daily, several_times, once_week, rarely, never)
      10. Concentration changes? (no_change, somewhat_slower, significantly_slower, improved)
      11. Feel safe in environment? (yes, sometimes, no)
      12. Current stress level? (low, moderate, high, very_high)
      13. Frequency of hopelessness? (never, rarely, sometimes, often, always)
      14. Mental health diagnoses? (depression, anxiety, bipolar, ptsd, other)
      15. Coping strategies when stressed:
      
      ## Output JSON Structure
      {
        "overallScore": 60, // 0-100 score
        "scoreCategory": "Coping", // "Struggling" (20-39), "Struggling somewhat" (40-54), "Coping" (55-74), "Coping well" (75-89), "Flourishing" (90-100)
        "dimensionScores": {
          "emotional": 65, // 0-100
          "social": 70,
          "physical": 55,
          "mental": 60,
          "spiritual": 50
        },
        "keyStruggles": [
          {
            "challenge": "Managing anxiety",
            "description": "Your responses indicate significant anxiety in social situations.",
            "severity": 70 // 0-100
          }
        ],
        "insights": [
          {
            "title": "Sleep and Mood Connection",
            "description": "Your mood rating correlates with your reported sleep hours."
          }
        ],
        "recommendedActions": [
          {
            "title": "Daily Mindfulness Practice",
            "description": "Start with just 5 minutes each morning to center yourself.",
            "difficulty": "Easy" // Easy, Medium, Hard
          }
        ],
        "resources": [
          {
            "title": "Anxiety Management Guide",
            "type": "Article", // Article, Video, Community, Tool, Workshop, Template
            "description": "Learn techniques to manage anxiety in daily situations."
          }
        ],
        "strengths": ["Resilience", "Self-awareness", "Adaptability"]
      }
      
      ## Scoring Guidelines
      - Calculate overall score based on all responses
      - Emotional score: Based on questions 1, 2, 3, 4, 13
      - Social score: Based on questions 7, 8, 11
      - Physical score: Based on questions 5, 6, 9
      - Mental score: Based on questions 10, 12, 14
      - Spiritual score: Inferred from questions 4, 13, 15`
      const apiKey = "api";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      // Convert the request body into the correct format
      const formattedRequest = {
        contents: [
          {
            parts: [{ text: `${samplePromp} ${JSON.stringify(body)}` }],
          },
        ],
      };

      const apiResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedRequest),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        return new Response(JSON.stringify(data), {
          status: apiResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Extract the text response from the API's response
      const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

      return new Response(JSON.stringify({ response: textResponse }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (error) {
      return new Response("Internal Server Error", {
        status: 500,
        headers: corsHeaders,
      });
    }
  }
};
export {
  src_default as default
};

