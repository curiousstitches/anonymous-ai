# Quick Start Guide

Get Anonymous AI working in 2 minutes.

## Step 1: Open the App

Go to: **[curiousstitches.github.io/anonymous-ai](https://curiousstitches.github.io/anonymous-ai)**

The entire app runs in your browser. No installation needed.

---

## Step 2: Enable Free Uncensored Models (Required)

### Get an OpenRouter Key

1. Go to **[openrouter.ai](https://openrouter.ai)**
2. Click **Sign Up** (free, no credit card)
3. Go to **Keys** → Click **Create Key**
4. Copy the key

### Enable Guardrails (Critical!)

Without this step, free uncensored models will be blocked:

1. At OpenRouter, go to **Workspace** (top left)
2. Click **Guardrails** → **Workspace Guardrail**
3. Choose **Model & Provider Access**
4. Turn **ON**: "Free endpoints that may train on request data"
5. Turn **ON**: "Free endpoints that may publish prompts"
6. Click **Save**

### Paste Your Key into the App

1. In Anonymous AI, go to **Settings** (⚙️)
2. Find **OpenRouter**
3. Click **Set / Change Key**
4. Paste your key
5. Click **Test Connection** to verify it works

---

## Step 3: Pick a Model & Start Building

1. Click the model picker (top of chat)
2. Choose **⚡ Auto — Coding** for app building
3. Type anything: `"build me a todo app"` or `"create a weather dashboard"`
4. The AI generates a complete, runnable project—every file

---

## Optional: Add a Second AI Source

If OpenRouter is slow or you hit limits:

### Together AI (Fast)

1. Sign up free at **[together.ai](https://together.ai)**
2. Create an API key
3. In app: Settings → **Together AI** → Set your key
4. Test it

### Venice.ai (Best Uncensored)

1. Sign up free at **[venice.ai](https://venice.ai)** (no card required)
2. Create an API key
3. In app: Settings → **Venice.ai** → Set your key
4. Test it

---

## Using Your Own AI (Unlimited)

Point the app at any OpenAI-compatible AI server:

### Local PC (Easiest)

1. Download and install **[Ollama](https://ollama.ai)**
2. Run: `ollama run dolphin-mistral` (uncensored model)
3. Ollama will be at: `http://localhost:11434/v1/chat/completions`
4. In app: Settings → **Custom/Local** → set this URL
5. Model name: `dolphin-mistral`
6. Test it

### Free GPU (Kaggle)

1. Get a free GPU at **[kaggle.com](https://kaggle.com)** (free tier)
2. Set up port forwarding (ngrok or similar)
3. Same steps as above, but with your ngrok URL

---

## Troubleshooting

### "Model blocked" Error?
→ Check you enabled both guardrails at OpenRouter (see Step 2)

### "No key set" Error?
→ Add a key for that provider in Settings

### Model is slow?
→ Add Together AI key as a backup (Settings → Together AI)

### Unsure which model to pick?
→ Use **Auto** modes—they pick the best one and switch if needed

---

## What You Can Do

| Task | What to Pick |
|------|--------------|
| Build apps/websites | **⚡ Auto — Coding** |
| Get uncensored responses | **🔓 Auto — Unrestricted Coding** or **💬 Auto— Uncensored Chat** |
| Just chat | **💬 Auto — Uncensored Chat** |
| Don't know | **⚡ Auto — Coding** (default) |

---

## Features

- 🎨 **Themes**: Settings → Appearance (7+ themes)
- 🎤 **Voice**: Speak instead of typing
- 📎 **Upload files**: Share code/screenshots with AI
- 🚀 **Push to GitHub**: Save projects in one tap
- 💾 **Auto-save**: Chats saved automatically
- ▶️ **Live preview**: Run HTML apps instantly

---

## Still Stuck?

1. Check the **[full README](README.md)** for deep info
2. Look at **[deployment guides](docs/DEPLOY.md)** for hosting
3. See **[API research](docs/API_RESEARCH_FINDINGS.md)** for provider details
4. Run the **Test Connection** button (⚙️ → Providers) to see exact errors

---

That's it! You're ready to build.
