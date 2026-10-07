# BhashaSetu (भाषासेतु) - Indic Language Academic Portal

A full-stack Indic linguistics, dialectology, and language learning web application with interactive 3D flashcards, audio pronunciation synthesizers, voice recognition phonetic scoring, gamified daily quizzes, academic dashboards, CSV export, and an integrated Java OOP & Multithreading Academic Concurrency Suite.

---

## 🚀 Quick Start in Visual Studio Code

### 1. Prerequisites
Ensure you have Node.js installed on your computer:
* **Node.js**: Version 18.x or 20.x+ ([Download Node.js](https://nodejs.org/))
* **npm**: Included with Node.js (or use `pnpm` / `bun` / `yarn`)

### 2. Open Project in VS Code
1. Open Visual Studio Code.
2. Click **File** > **Open Folder...** (or `Cmd+O` on Mac / `Ctrl+O` on Windows).
3. Select the folder containing this project.

### 3. Install Dependencies
Open the built-in terminal in VS Code (`Ctrl + ~` or **Terminal** > **New Terminal**) and run:
```bash
npm install
```

### 4. Start the Development Server
```bash
npm run dev
```

Your app will be live at:
```
http://localhost:3000
```
Open that URL in your browser (Google Chrome or Microsoft Edge recommended for full Web Speech API and Speech Recognition support).

---

## 🛠 Available Scripts

* **`npm run dev`**: Starts the Vite development server on port 3000.
* **`npm run build`**: Type-checks and compiles the production bundle into `/dist`.
* **`npm run preview`**: Previews the built production app locally.
* **`npm run lint`**: Runs TypeScript type-checking without emitting files.

---

## 📂 Project Structure

```
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Vite configuration with Tailwind CSS plugin
├── tsconfig.json              # TypeScript strict configuration
├── README.md                  # This setup guide
└── src/
    ├── main.tsx               # React root entry point
    ├── App.tsx                # View router & application state provider
    ├── index.css              # Tailwind CSS styles and 3D card perspective utilities
    ├── components/
    │   ├── Navbar.tsx         # Academic top navigation & student streak status
    │   ├── FlashcardView.tsx  # 3D interactive flashcards with audio & dialect toggles
    │   ├── QuizView.tsx       # Gamified quiz with timer, streak multipliers & confetti
    │   ├── StudentDashboardView.tsx # Progress charts, SVG trends & CSV export
    │   ├── VoiceFeedbackModal.tsx   # Speech recognition & phonetic accuracy evaluator
    │   ├── AdminLoginView.tsx # Faculty portal authentication screen
    │   ├── AdminPortalView.tsx# Admin management, moderation & student progress charts
    │   └── JavaAcademicLabView.tsx  # Java OOP, Generics & Multithreading Live Lab
    ├── context/
    │   └── AppContext.tsx     # Global React context, persistent repository & session store
    ├── data/
    │   └── indianLanguagesData.ts # 6 regions, 28+ states, 60-70 vocabulary words per region
    ├── services/
    │   ├── speechSynthesisService.ts   # Indic speech synthesis with fallback audio synthesis
    │   ├── speechRecognitionService.ts # Web Speech Recognition & Levenshtein phonetic distance
    │   └── oop/
    │       └── JavaOOPArchitecture.ts  # Academic OOP & Thread Pool simulation engine
    └── types/
        └── index.ts           # TypeScript interfaces and domain types
```

---

## 💡 Recommended VS Code Extensions

For the best development experience in VS Code, install:
1. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
2. **ESLint** (`dbaeumer.vscode-eslint`)
3. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
4. **Error Lens** (for instant TypeScript error highlighting)

---

## 🎙️ Note on Audio & Microphone in Localhost
* Modern browsers require user interaction (e.g. clicking a button) before audio playback is permitted.
* Voice recognition uses the browser's native `webkitSpeechRecognition` / `SpeechRecognition` API. When prompted by your browser on `localhost:3000`, click **Allow** to grant microphone permissions.
