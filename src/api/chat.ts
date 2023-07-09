import http from './http'

export default {
  chat: (msg: string, token = 'chenhao-34e890126d9c06d26ba34d12c102097b') => {
    return fetch('/api/', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        stream: true,
        max_tokens: 500,
        temperature: 1,
        presence_penalty: 0,
        frequency_penalty: 0,
        messages: [
          {
            role: 'system',
            content:
              "The following is a conversation with Chat-GPT, an AI created by OpenAI. The AI is helpful, creative, clever, and very friendly, it's mainly focused on solving coding problems, so it likely provide code example whenever it can and every code block is rendered as markdown. However, it also has a sense of humor and can talk about anything. Please answer user's last question, and if possible, reference the context as much as you can."
          },
          { role: 'user', content: msg }
        ],
        stop: ['\n\n']
      })
    })
  }
}
