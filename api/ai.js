export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Analyze this CV and return ONLY a JSON object: {"overallScore": 85, "job_title": "Title", "tips": ["tip1"]}. CV DATA: ${JSON.stringify(req.body.cvData)}` }]
        }]
      }),
    });

    const data = await response.json();
    
    // لو فيه خطأ من جوجل نفسه هيظهر هنا
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanJson = content.replace(/```json|```/g, "").trim();
    return res.status(200).json(JSON.parse(cleanJson));

  } catch (err) {
    return res.status(500).json({ error: "الذكاء الاصطناعي مهنج شوية، جرب كمان مرة" });
  }
}