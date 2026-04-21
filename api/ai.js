export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.GEMINI_API_KEY;
  const { cvData } = req.body;

  try {
    // استخدمنا مسار v1beta مع موديل gemini-1.5-flash-latest لأنه الأكتر مرونة
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Return ONLY a JSON object with this schema: {"overallScore": 85, "job_title": "Developer", "tips": ["Success"]}. Analysis for this CV: ${JSON.stringify(cvData)}`
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanJson = content.replace(/```json|```/g, "").trim();
    
    return res.status(200).json(JSON.parse(cleanJson));

  } catch (err) {
    return res.status(500).json({ error: "الذكاء الاصطناعي واخد استراحة، جرب كمان دقيقة" });
  }
}