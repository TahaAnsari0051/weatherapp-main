const API_URL = 'https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream';

const headers = {
  'Content-Type': 'application/json',
  'x-mastra-dev-playground': 'true'
};

/**
 * A simple parser to extract only the message content from the stream.
 * It looks for the `0:"..."` pattern.
 * @param {string} chunk - A raw chunk from the stream.
 * @returns {string} - The extracted and cleaned message content.
 */
const parseContentFromChunk = (chunk) => {
  // Regex to find all occurrences of the 0:"..." pattern
  const contentRegex = /0:"(.*?)"/g;
  let content = '';
  let match;

  // Loop through all matches in the chunk and concatenate the content
  while ((match = contentRegex.exec(chunk)) !== null) {
    // match[1] is the captured group inside the quotes
    // We need to decode JSON-escaped characters like \" or \n
    try {
      content += JSON.parse(`"${match[1]}"`);
    } catch (e) {
      // Fallback for malformed strings, though unlikely
      content += match[1];
    }
  }

  return content;
};

export const streamWeatherAgentResponse = async ({ messages, threadId, onChunk, onComplete, onError }) => {
  try {
    const body = JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content })),
      runId: "weatherAgent",
      maxRetries: 2,
      maxSteps: 5,
      temperature: 0.5,
      topP: 1,
      runtimeContext: {},
      threadId: threadId,
      resourceId: "weatherAgent"
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        onComplete();
        break;
      }
      const rawChunk = decoder.decode(value, { stream: true });
      
      // FIXED: Parse the raw chunk to get only the real content
      const contentChunk = parseContentFromChunk(rawChunk);
      
      // Only call the onChunk callback if we actually found content
      if (contentChunk) {
        onChunk(contentChunk);
      }
    }
  } catch (error) {
    console.error("Streaming failed:", error);
    onError(error);
  }
};