const express = require("express");
const path = require("path");
const app = express();
app.use(express.json({ limit: "30kb" }));
app.use(express.static(path.join(__dirname, "public")));

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

async function askGemini(prompt) {
  if (!API_KEY) throw new Error("GEMINI_API_KEY is not configured");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: "You are a careful Cambridge International O Level, AS Level and A Level study tutor. Match the learner's selected level and subject. Explain clearly, be encouraging, do not invent official syllabus codes or claim generated questions are official Cambridge questions. If uncertain, say so. Use concise, age-appropriate educational explanations." }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: 1200 }
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Gemini API request failed");
  return data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("\n") || "Sorry, I couldn't generate a response. Please try again.";
}
function ctx(b) {
  return `Student level: ${String(b.level || "O Level").slice(0,40)}. Subject: ${String(b.subject || "General").slice(0,80)}. Topic: ${String(b.topic || "General revision").slice(0,180)}.`;
}
app.post("/api/tutor", async (req, res) => {
  try {
    const b = req.body || {};
    const history = Array.isArray(b.history) ? b.history.slice(-8).map(m => `${m.role === "assistant" ? "Tutor" : "Student"}: ${String(m.content || "").slice(0,1200)}`).join("\n") : "";
    const text = await askGemini(`${ctx(b)}\nConversation so far:\n${history}\nStudent question: ${String(b.question || "").slice(0,1500)}\nAnswer the student's question directly, teach the concept and use a relevant example if useful.`);
    res.json({ text });
  } catch (e) { res.status(503).json({ error: "AI tutor is temporarily unavailable. Check API configuration and billing." }); }
});
app.post("/api/notes", async (req, res) => {
  try {
    const b = req.body || {};
    const text = await askGemini(`${ctx(b)}\nCreate concise revision notes directly in plain text. Include key definitions, 4-6 key points, one example if relevant, and exam tips. Do not make a PDF. Do not invent syllabus-specific claims.`);
    res.json({ text });
  } catch (e) { res.status(503).json({ error: "AI notes are temporarily unavailable." }); }
});
app.post("/api/flashcards", async (req, res) => {
  try {
    const b = req.body || {};
    const text = await askGemini(`${ctx(b)}\nGenerate exactly 8 useful flashcards. Return ONLY valid JSON in this format: {"cards":[{"question":"...","answer":"..."}]}. Keep questions and answers concise and accurate.`);
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid JSON from model");
    res.json(JSON.parse(match[0]));
  } catch (e) { res.status(503).json({ error: "Could not generate flashcards. Try again." }); }
});
app.post("/api/quiz", async (req, res) => {
  try {
    const b = req.body || {};
    const text = await askGemini(`${ctx(b)}\nGenerate 5 multiple-choice revision questions. Return ONLY valid JSON: {"questions":[{"q":"question","options":["A","B","C","D"],"answer":0,"why":"brief explanation"}]}. answer must be an integer 0-3. Ensure exactly one correct answer per question and plausible distractors. These are practice questions, not official Cambridge questions.`);
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid JSON from model");
    res.json(JSON.parse(match[0]));
  } catch (e) { res.status(503).json({ error: "Could not generate quiz. Try again." }); }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Cambridge AI Study Tutor listening on port ${port}`));
