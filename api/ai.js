export default async function handler(req, res) {
  // ── CORS ──
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is missing in Vercel' })

  const { cvData } = req.body

  try {
    // 1. استخدمنا v1beta/models/gemini-pro لأنه الأضمن حالياً في معظم الحسابات
    // 2. شلنا كل الإعدادات المعقدة اللي كانت بتعمل Error
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this CV and return ONLY a JSON object: 
            {"overallScore": 85, "job_title": "Professional", "tips": ["Improve summary"]}. 
            CV DATA: ${JSON.stringify(cvData)}`
          }]
        }]
      })
    })

    const data = await response.json()

    // لو فيه مشكلة في الـ API نفسه هتظهر هنا بوضوح
    if (data.error) {
      return res.status(500).json({ error: data.error.message })
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!content) return res.status(500).json({ error: 'No response from AI' })

    // تنظيف الـ JSON عشان يتقري صح
    const cleanJson = content.replace(/```json|```/g, "").trim()
    return res.status(200).json(JSON.parse(cleanJson))

  } catch (err) {
    return res.status(500).json({ error: "الذكاء الاصطناعي مهنج، حاول تاني" })
  }
}