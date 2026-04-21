export default async function handler(req, res) {
  // ── CORS ──
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' })

  const { cvData } = req.body
  if (!cvData) return res.status(400).json({ error: 'CV data is required' })

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are an expert CV coach and ATS optimization specialist. 
Analyze CVs professionally and return ONLY valid JSON matching the exact schema provided.
Never include markdown, explanations, or text outside the JSON object.`,
          },
          {
            role: 'user',
            content: buildPrompt(cvData),
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        error: err.error?.message || `OpenAI API error: ${response.status}`,
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) return res.status(500).json({ error: 'Empty response from OpenAI' })

    const parsed = JSON.parse(content)
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
  "overallScore": <integer 0-100>,
  "job_title": "<optimized professional job title string>",
  "titleReason": "<one sentence explaining why this title is better>",
  "summary": "<rewritten ATS-optimized summary, 3-4 sentences>",
  "summaryReason": "<one sentence explaining what makes this summary stronger>",
  "skills": ["<skill1>", "<skill2>", "<skill3>", "<skill4>", "<skill5>", "<skill6>"],
  "tips": ["<specific tip 1>", "<specific tip 2>", "<specific tip 3>"]
}

CV DATA:
Name: ${name}
Current Title: ${title}
Summary: ${summary}
Skills: ${skills}
Experience:
${experience}
Education: ${education}
Languages: ${languages}

Rules:
- overallScore: base on completeness, clarity, ATS-friendliness, and impact
- job_title: make it more specific, keyword-rich, and market-aligned
- summary: start with years of experience, highlight key strengths, end with value proposition
- skills: include both existing strong skills AND 1-2 strategic additions
- tips: be specific and actionable, not generic advice
- Return ONLY the JSON object, nothing else`
}