# StudyForge AI

This is my submission for the Flam Frontend Internship assignment. I chose the **Study Assistant** option: the user provides a topic or a set of notes, and the app generates flashcards and a quiz they can actually interact with, rather than displaying raw AI text.

I chose this option over the recipe and trip-planner alternatives because it allowed for genuine interaction loops — flipping cards, answering questions, and reviewing what was missed — rather than simply rendering a list.

---

## Demo

- **Live app:** []
- **Demo video:** []
- **GitHub:** []

---

## What it does

The user enters a topic or pastes their notes, and the app generates:

- A set of flashcards with a 3D flip animation, navigable via previous/next controls or the keyboard
- A multiple-choice quiz with immediate feedback and an explanation after each answer
- A results screen showing overall score, concepts answered correctly, and concepts that need review
- The ability to retake the quiz without regenerating the study set

It also includes dark/light mode, a responsive mobile layout, and loading/error states so the app degrades gracefully rather than freezing or breaking.

## Stack

**Frontend:** React + TypeScript, built with Vite, plain CSS, Lucide React for icons.

**Backend:** Node/Express with TypeScript, Zod for validation.

**AI:** Google Gemini API.

I used a small Express server in front of Gemini instead of calling it directly from the browser, so the API key never ends up in client-side code.

## How it flows

```
User enters topic / notes
        |
React frontend
        |
Express API
        |
Gemini
        |
Parse response -> Zod validation -> quality checks
        |
Flashcards + Quiz UI
```

---

## Handling unreliable AI output

This was the area the assignment weighted most heavily, and it's also where I focused most of my effort. A successful response from Gemini does not guarantee usable content — it can arrive with a missing field, duplicate quiz options, an invalid answer index, or a shape that doesn't match what was requested. I handle this in four stages:

**1. Input validation.** Before any request reaches Gemini, the backend rejects input that is empty or excessively long.

**2. Structured output.** Gemini is prompted to return JSON in a fixed shape (`title`, `summary`, `flashcards[]`, `quiz[]`). The model's raw output is never shown to the user directly — there is no chat interface anywhere in the app.

**3. Schema validation with Zod.** Every quiz question must include a question, exactly four options, a valid index for the correct answer, and an explanation. Flashcards must include both a question and an answer. Anything that doesn't match is rejected before it reaches the UI.

**4. Content-quality checks.** Structurally valid JSON can still be low-quality. For example, this passes schema validation without issue:

```json
{
  "options": ["ArrayList", "HashSet", "HashMap", "HashMap"]
}
```

It's a poor quiz question because two options are identical. To catch cases like this, the backend also checks for duplicate questions, duplicate options, duplicate IDs, and answer indexes that don't resolve to a valid option.

**5. Graceful failure.** If generation fails, or the response doesn't pass validation, the user sees an error message with a retry option instead of a blank screen or crash. A loading state is shown while Gemini generates content, since responses can take several seconds.

---

## Flashcards

Flashcards are rendered as interactive components with a flip animation, previous/next navigation, a progress indicator, and keyboard support for flipping cards.

## Quiz

The app records the full answer history for a session — the selected answer, whether it was correct, and the explanation for each question — rather than just a running score. This is what allows the results screen to show exactly which concepts were answered correctly and which need revision. The quiz can be retaken without regenerating a new study set.

## Loading, error, and empty states

- **Loading:** an overlay is shown while Gemini generates content.
- **Error:** if the API call fails or the response fails validation, the user sees an error message with a retry option; the previous topic is preserved so it doesn't need to be re-entered.
- **Empty data:** the flashcard and quiz components include fallback states in case empty data reaches them unexpectedly.

## Responsive design

Tested across desktop, tablet, and mobile: cards stack vertically, quiz options resize, buttons remain usable, and result actions stack on smaller screens.

## Dark mode

The selected theme is saved locally and persists across refreshes. If no preference has been set, the app defaults to the user's system theme.

---

## Project structure

```
studyforge--ai/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FlashcardDeck.tsx
│   │   │   ├── GenerationLoader.tsx
│   │   │   ├── Quiz.tsx
│   │   │   ├── StudyDashboard.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── TopicInput.tsx
│   │   ├── hooks/
│   │   │   ├── useStudyGenerator.ts
│   │   │   └── useTheme.ts
│   │   ├── types/
│   │   │   └── study.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   └── package.json
├── server/
│   ├── src/
│   │   ├── routes/generate.ts
│   │   ├── schemas/studySchema.ts
│   │   ├── services/gemini.ts
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## Running it locally

**Prerequisites:** Node.js, npm, and a Google Gemini API key.

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd studyforge--ai
```

**Backend:**

```bash
cd server
npm install
cp .env.example .env   # Windows PowerShell: Copy-Item .env.example .env
```

Add your key to `.env`:

```env
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

`.env` is gitignored — only `.env.example` is committed.

```bash
npm run dev
```

**Frontend** (in a second terminal):

```bash
cd client
npm install
npm run dev
```

Open the URL printed by Vite in the terminal.

**Build checks:**

```bash
cd client && npm run build
cd server && npm run typecheck
```

---

## API

```
POST /api/generate
```

Request:

```json
{
  "topic": "Explain database normalization including 1NF, 2NF, 3NF and BCNF"
}
```

Response:

```json
{
  "data": {
    "title": "Database Normalization",
    "summary": "A study set covering the main normalization concepts.",
    "flashcards": [],
    "quiz": []
  }
}
```

---

## AI usage note

I used ChatGPT as a development assistant throughout this project — primarily for discussing implementation approaches, debugging TypeScript issues, reviewing validation and edge-case handling, and refining the Gemini prompt. I reviewed and tested every change in the context of my own project, and understand the code well enough to explain and extend it.

The study content itself (flashcards and quiz questions) is generated at runtime by the Gemini API; it is not hardcoded or pre-written.

## Known limitations

- **Generation time** depends on Gemini's response time and network conditions; some requests take several seconds.
- **AI output remains probabilistic.** Validation catches structural and several categories of quality issues, but cannot guarantee every generated fact is accurate.
- **No persistence.** Refreshing the page clears the current study set. Local or server-side session storage would be the next addition.
- **No authentication.** Not required by the assignment, so I kept the scope focused on the core study workflow.
- **Quiz difficulty is not configurable.** The current prompt produces a mix of conceptual and applied questions; a difficulty selector (beginner / intermediate / interview-level) would be a natural extension.

## What I would do next

In rough priority order:

1. Save and reload study sessions
2. Allow retesting only incorrectly answered questions
3. Add difficulty selection
4. Introduce spaced-repetition scheduling for flashcards
5. Add a refinement loop — follow-up prompts that edit the existing result instead of regenerating it
6. Add automated tests around malformed or unexpected AI responses

If I had reached the time limit before completing additional polish, I would have prioritized reliability and failure handling over further visual refinement, since that was the core focus of the assignment.

## Time spent

Approximately **[6] hours**, split roughly across:

- Initial React UI and study flow
- Gemini integration
- Structured output and validation
- Retry and failure handling
- Flashcard and quiz interaction logic
- Responsive styling and final testing

## API key / security note

The Gemini API key is used only by the backend. It is not included in the frontend bundle and is not committed to the repository. `server/.env.example` is tracked in the repo; the real `server/.env` is gitignored.

---

## Author

**Navya Sri Kolusu**
B.Tech Computer Science and Engineering, SRM University-AP

Built for the Flam Frontend Internship Assignment.