const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function test() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Reply with JSON: {"test":"ok"}' }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });
    console.log('SUCCESS:', chatCompletion.choices[0].message.content);
  } catch(e) {
    console.log('ERROR:', e.message);
  }
}
test();
