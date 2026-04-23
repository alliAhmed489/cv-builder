/**
 * aiService.js
 * كل الطلبات بتروح لـ /api/ai (سواء local أو production)
 * الـ API key بيكون في السيرفر بس (أمان)
 */

export async function analyzeCV(cvData) {
  if (!cvData) throw new Error('No CV data provided')

  try {
    return await callServerless(cvData)
  } catch (err) {
    if (err instanceof Error) throw err
    throw new Error(String(err))
  }
}

// ── Serverless call ──
async function callServerless(cvData) {
  let response

  try {
    response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvData }),
    })
  } catch {
    throw new Error('Network error. Check your connection.')
  }

  let body
  try {
    body = await response.json()
  } catch {
    throw new Error('Invalid server response.')
  }

  if (!response.ok) {
    throw new Error(body?.error || `Server error: ${response.status}`)
  }

  return body
}