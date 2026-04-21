export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing API Key" });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(req.body.cvData) }] }]
      }),
    });

    const data = await response.json();
    
    if (data.error) {
       return res.status(500).json({ error: data.error.message });
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanJson = content.replace(/```json|```/g, "").trim();
    return res.status(200).json(JSON.parse(cleanJson));

  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

function buildPrompt(cv) {
  return `Analyze this CV and return a JSON object with this schema: {"overallScore": 85, "job_title": "Title", "titleReason": "...", "summary": "...", "summaryReason": "...", "skills": [], "tips": []}. CV: ${JSON.stringify(cv)}`;
}