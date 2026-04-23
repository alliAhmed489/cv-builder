export default async function handler(req, res) {
  // ── CORS ──
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // ✅ HuggingFace key بدل OpenAI
  const apiKey = process.env.HUGGINGFACE_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'HUGGINGFACE_API_KEY is not configured' })
  }

  const { cvData } = req.body
  if (!cvData) return res.status(400).json({ error: 'CV data is required' })

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/google/flan-t5-large',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: buildPrompt(cvData),
        }),
      }
    )

    const data = await response.json()

    const text = data?.[0]?.generated_text
    if (!text) {
      return res.status(500).json({ error: 'No response from HuggingFace', raw: data })
    }

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (e) {
      return res.status(500).json({
        error: 'JSON parse failed',
        raw: text,
      })
    }

    return res.status(200).json(parsed)

  } catch (err) {
    console.error('AI handler error:', err)
    return res.status(500).json({
      error: err.message || 'Internal server error',
    })
  }
}

// ── Prompt ──
function buildPrompt(cv) {
  return `
Return ONLY JSON in this format:

{
  "overallScore": 80,
  "job_title": "",
  "summary": "",
  "skills": [],
  "tips": []
}

CV:
${JSON.stringify(cv)}
`
}