export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API Key Missing" });

  try {
    // ده الرابط الوحيد اللي شغال 100% دلوقتي لكل الناس
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this CV and return ONLY a valid JSON: {"overallScore": 80, "job_title": "Developer", "tips": ["Great job"]}. CV DATA: ${JSON.stringify(req.body.cvData)}`
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) return res.status(500).json({ error: "No response from AI" });

    // تنظيف الـ JSON من أي علامات Markdown
    const cleanJson = content.replace(/```json|```/g, "").trim();
    return res.status(200).json(JSON.parse(cleanJson));

  } catch (err) {
    return res.status(500).json({ error: "Internal Error" });
  }
}