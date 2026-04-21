/**
 * aiService.js
 * Handles all AI analysis requests.
 * - Local dev: calls /api/ai via Vite dev server (proxied or direct)
 * - Production (Vercel): calls /api/ai serverless function
 *
 * SETUP:
 * Local  → create .env.local → add: OPENAI_API_KEY=sk-...
 * Vercel → Dashboard → Settings → Environment Variables → OPENAI_API_KEY
 */

const API_ENDPOINT = '/api/ai'

/**
 * Analyzes CV data using OpenAI via serverless function.
 * @param {Object} cvData - Full CV state object
 * @returns {Promise<Object>} - Parsed AI suggestions
 */
export async function analyzeCV(cvData) {
  if (!cvData) throw new Error('No CV data provided')

  let response
  try {
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvData }),
    })
  } catch {
    throw new Error('Network error — check your connection and try again.')
  }

  let body
  try {
    body = await response.json()
  } catch {
    throw new Error('Invalid response from server.')
  }

  if (!response.ok) {
    throw new Error(body?.error || `Server error: ${response.status}`)
  }

  validateResponse(body)
  return body
}

/**
 * Validates that the AI response has required fields.
 */
function validateResponse(data) {
  const required = ['overallScore', 'job_title', 'summary', 'skills', 'tips']
  const missing = required.filter(k => !(k in data))
  if (missing.length > 0) {
    throw new Error(`Incomplete AI response. Missing: ${missing.join(', ')}`)
  }
  if (!Array.isArray(data.skills) || !Array.isArray(data.tips)) {
    throw new Error('Invalid response format from AI.')
  }
}