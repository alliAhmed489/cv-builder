export default async function handler(req, res) {
  // ── CORS ──
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // التأكد من وجود مفتاح Gemini (سيقرأ من إعدادات Vercel)
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in Vercel' })

  const { cvData } = req.body
  if (!cvData) return res.status(400).json({ error: 'CV data is required' })

  try {
    // ── إرسال الطلب لـ Google Gemini ──
    // استخدمنا v1 النسخة المستقرة و gemini-pro لضمان أعلى توافق
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: buildPrompt(cvData)
          }]
        }],
        // شلنا responseMimeType لأنها كانت بتعمل Error في بعض النسخ
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        error: err.error?.message || `Gemini API error: ${response.status}`,
      })
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) return res.status(500).json({ error: 'Empty response from Gemini' })

    // تنظيف النص من أي علامات Markdown (مثل ```json) قد يضيفها الموديل يدوياً
    const cleanJson = content.replace(/```json|```/g, "").trim()
    
    const parsed = JSON.parse(cleanJson)
    return res.status(200).json(parsed)

  } catch (err) {
    console.error('AI handler error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}

function buildPrompt(cv) {
  const name       = cv.personal?.name     || 'Not provided'
  const title      = cv.personal?.title    || 'Not provided'
  const summary    = cv.summary            || 'Not provided'
  const skills     = cv.skills?.join(', ') || 'Not provided'
  const experience = cv.experience?.map(e =>
    `${e.role} at ${e.company}: ${e.description?.slice(0, 150) || 'No description'}`
  ).join('\n') || 'Not provided'
  const education  = cv.education?.map(e =>
    `${e.degree} in ${e.field} from ${e.institution}`
  ).join(', ') || 'Not provided'
  const languages  = cv.languages?.map(l =>
    `${l.name} (${l.level})`
  ).join(', ') || 'Not provided'

  return `Analyze this CV and return a JSON object with exactly this schema:
{
  "overallScore": 85,
  "job_title": "Professional Title",
  "titleReason": "Reason here",
  "summary": "ATS optimized summary",
  "summaryReason": "Reason here",
  "skills": ["skill1", "skill2"],
  "tips": ["tip1", "tip2"]
}

CV DATA:
Name: ${name}
Current Title: ${title}
Summary: ${summary}
Skills: ${skills}
Experience: ${experience}
Education: ${education}
Languages: ${languages}

Rules:
- Return ONLY valid JSON.
- Do not include markdown backticks like \`\`\`json.`
}