const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  const prompt = `
You are an expert AI Resume Analyst and ATS (Applicant Tracking System) specialist.

You are given a candidate's resume data (structured JSON) and a target job description. 
Perform a comprehensive analysis and return the results as JSON.

Resume Data:
{
  "name": "John Doe",
  "skills": ["React", "JavaScript"]
}

Job Description:
Looking for a React developer with Next.js experience.

Analyze the resume against the job description and return a JSON object with this exact structure:

{
  "matchScore": <number 0-100, how well the resume matches the job>,
  "matchSummary": "<1-2 sentence summary of how well the candidate fits the role>",
  "atsScore": <number 0-100, how ATS-friendly the resume is for this job>,
  "atsSummary": "<1-2 sentence summary of ATS compatibility>",
  "matchingKeywords": ["array of keywords/skills from the job description that ARE present in the resume"],
  "missingKeywords": ["array of important keywords/skills from the job description that are MISSING from the resume"],
  "optimizationTips": ["array of 5-8 specific, actionable tips to improve the resume for this job"],
  "strengths": ["array of 3-5 things the candidate does well relative to this job"],
  "weaknesses": ["array of 3-5 gaps or areas for improvement relative to this job"]
}

Rules:
1. Be honest and accurate in scoring. Do not inflate scores.
2. matchScore should reflect actual skill/experience alignment.
3. atsScore should consider: keyword density, formatting friendliness, section headers, quantified achievements.
4. optimizationTips should be specific and actionable, not generic advice.
5. Keywords should be actual technical skills, tools, frameworks, or domain terms from the job description.
6. Return valid JSON only. No markdown, no code blocks.
`;

  try {
    const result = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });
    console.log(result.choices[0].message.content);
  } catch(e) {
    console.error(e.message);
  }
}
test();
