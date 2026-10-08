# ResumeLens — AI Resume Checker

A complete, responsive resume review workspace built with Next.js, TypeScript and Google Gemini. Live review is access-code protected; the illustrative sample is available without a key or AI request.

## Features

- PDF, DOCX and TXT upload, with editable extracted text (3 MB / 10 PDF pages).
- Resume coaching scores and section-by-section feedback.
- Optional target role and job-description matching, with keyword gaps.
- Prioritized improvements, truthful bullet rewrites and improved summary.
- Cover-letter draft and resume-based interview questions.
- Full text report and cover-letter downloads; browser print / Save as PDF for the visible review tab.
- Optional device-local history, with individual deletion and clear-all.
- Responsive layout, resume guide, accessible labels and clear loading/error states.

Scores are coaching estimates, not scores from an actual ATS, interview predictions or hiring decisions. Extracted text cannot establish the original document's visual layout. AI drafts must be checked before use. Scanned PDFs need OCR outside this app or pasted text.

## Local setup

Use Node.js 22 or 24.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Set `GEMINI_API_KEY`, `GEMINI_MODEL` and a strong `APP_ACCESS_CODE` in `.env.local`. Never commit this file. Share the access code only with trusted reviewers. The sample remains available if live review is unconfigured.

```bash
npm run build
npm run typecheck
npm start
```

## Vercel deployment

Import `omparekh54-lgtm/ai-resume-checker` with the Next.js preset and the repository root as root directory. Add these server environment variables before deploying:

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Owner's Google Gemini credential; sensitive, production only |
| `GEMINI_MODEL` | `gemini-3.5-flash-lite` (verified available with the supplied account) |
| `APP_ACCESS_CODE` | Strong private code that unlocks live reviews |

No key is embedded in browser code or committed to Git. Both API routes use the Node.js runtime. Review requests have a 48-second provider timeout and 60-second function duration.

## Privacy and usage controls

Uploads are parsed in memory and not stored by the app. Live review sends extracted text, target role, career stage and job description to Google Gemini. Google handles that data under its applicable service terms. Users should remove sensitive data they do not want to send. Saved review history is opt-in browser localStorage and includes feedback and generated text, which may contain personal data. It is not synchronised between devices.

Every AI request requires a server-checked access code. Request size, input and AI output are validated; credentials and raw provider responses are not logged or returned. Same-origin browser checks, per-instance limits (2 requests/minute/IP and 2 concurrent generations), and bounded output help constrain use. In-memory limits reset on cold starts and are not a global cost cap. Keep the code private and configure provider quotas / billing limits for an account-level cap before broader distribution.

## Validation

Production build and TypeScript checks passed. A single live Gemini generation returned a validated review with four category scores and two rewrites. Invalid input and incorrect access codes were rejected. Browser UI checks may require installing Playwright Chromium in the execution environment.

## Architecture

`app/page.tsx`: interactive workspace and device-local history.

`app/api/extract/route.ts`: format validation and text extraction.

`app/api/analyze/route.ts`: access control, input limits, Gemini integration and structured result validation.

`lib/schema.ts`: shared input / output schemas. `lib/demo.ts`: clearly labelled illustrative review.
