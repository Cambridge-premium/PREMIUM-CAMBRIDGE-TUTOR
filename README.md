# Cambridge AI Study Tutor

A mobile-friendly starter web app for Cambridge O Level, AS Level and A Level students. Includes:
- AI tutor chat
- Short revision notes shown on screen
- Flashcards
- Multiple-choice quizzes with feedback
- Subject, level and topic selectors

## Important
The app has a demo fallback when opened as a static HTML file. Real, subject-specific AI responses require the included server and a Gemini API key. Never put the API key in `public/index.html` or any browser-side code.

## Run on a computer
1. Install Node.js 18 or newer.
2. In this folder, run `npm install`.
3. Set your Gemini API key as an environment variable:
   - macOS/Linux: `export GEMINI_API_KEY="YOUR_KEY"`
   - Windows PowerShell: `$env:GEMINI_API_KEY="YOUR_KEY"`
4. Run `npm start`.
5. Open `http://localhost:3000`.

Get API access and review current usage limits at https://aistudio.google.com/ and https://ai.google.dev/gemini-api/docs/pricing.

## Deploy publicly
Deploy this project to a Node.js host that supports environment variables (for example, Render or another suitable Node host). Set:
- `GEMINI_API_KEY` = your secret API key
- `GEMINI_MODEL` = `gemini-2.5-flash` (or a currently available model you choose)
- `NODE_ENV` = `production`

Then deploy and use the public URL supplied by the host. Check the host's free-tier limits and current pricing before publishing. A static host alone cannot run `server.js`.

## Before inviting 100–500 students
- Add per-user rate limits and stronger abuse protection.
- Add authentication and quotas if you need student-specific progress.
- Review privacy/data protection requirements, especially if students are minors.
- Check Gemini API pricing and usage limits; free access is not unlimited.
- Verify syllabus codes and subject content against the current official syllabuses.
- This independent tool is not affiliated with or endorsed by Cambridge International Education.
