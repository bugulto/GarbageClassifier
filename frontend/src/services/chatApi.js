// TODO: Replace with real API call when backend chat endpoint is implemented.
// Expected real endpoint:
//   POST /api/chat/
//   Payload: { question, job_id }

/**
 * Send a question to the chatbot.
 * @param {string} question - The user's question.
 * @param {string|null} jobId - Optional job_id for job-specific context.
 * @returns {Promise<{role: string, content: string}>}
 */
export const askQuestion = async (question, jobId = null) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let content
  if (jobId) {
    content = `Placeholder answer for job ${jobId}. RAG backend will be connected later.`
  } else {
    content = 'Placeholder global chatbot answer. RAG backend will be connected later.'
  }

  return { role: 'assistant', content }
}
