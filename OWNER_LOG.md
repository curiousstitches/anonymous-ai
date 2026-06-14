# OWNER LOG — Anonymous AI

**Plain English. Every change. What, why, when.**

---

## June 13, 2026 — LIVE CODING ASSISTANT (THE BIG ONE)

### What I Built
A **real-time pair programming companion** — the feature you asked for. An AI that feels like a senior dev sitting next to you, talking in real-time, remembering your project, responding to voice, giving you quick actions.

### Why
You wanted: "a live chat assistant for coding... give you a personality and have a one on one live chat like real people... take you, give you a personality and have a one on one live chat like real people"

### Changes

**🤖 Live Coding Assistant Persona**
- New persona: "🤖 Live Coding Assistant"
- Prompt: "You are a senior engineer pair-programming in real-time. Concise, practical, talks like a human dev. Lead with the answer — code first, brief explanation after. Never lecture. Short sentences. Fix errors immediately. Improve code immediately. No intros, no fluff. Stay in flow. Remember context — they're building something real."

**⚡ Nemotron 3 Ultra as Default for Live Coding**
- 550B parameters, massive context window, deep reasoning
- Now the primary model for `auto-live` mode
- Fallback chain: Nemotron 3 Ultra → LLaMA 3.1 70B Turbo → Local Ollama

**🔴 New Auto Mode: `auto-live`**
- Chain: Nemotron 3 Ultra → LLaMA 3.1 70B Turbo → Local Ollama
- Label: "🤖 Live Coding Assistant"
- Auto-switches if primary fails

**⚡ Quick Action Bar (Live Coding Mode Only)**
Appears as a sliding bar above the input when in Live Coding mode:
- 💡 **Explain** — "Explain this code/error in plain English"
- 🔧 **Fix** — "Fix this error/bug. Give corrected full code only"
- ♻️ **Refactor** — "Refactor — cleaner, faster, maintainable"
- ✅ **Test** — "Write comprehensive tests. Cover edge cases"
- 📝 **Document** — "Add clear comments and documentation"
- ⚡ **Optimize** — "Optimize for performance. Show before/after"
- 🔒 **Security** — "Review for vulnerabilities. List issues + fixed code"

**🎙️ Voice-First Mode**
- Toggle: Tap mic → "Voice First ON" → Continuous listening
- Auto-sends on sentence end (detects . ? !)
- Tap again to stop
- Mic button stays highlighted when active
- "Voice First ON — Speak anytime" toast

**📁 Project Context Awareness**
- Tracks files you share/build (up to 20, keeps last 20)
- Auto-includes last 5 files as context in Live Coding mode
- Header shows "📁 3 project files" badge
- Settings toggle: ON by default, can disable for privacy
- Only includes in Live Coding mode (not regular chat)
- Smart: doesn't duplicate if you explicitly mention "project context"

**🎨 Visual Polish**
- Quick Actions bar slides down with animation when Live Coding mode active
- Project Context badge in header: "📁 3 project files"
- Live Actions bar slides down smoothly
- Provider badges in model picker (color-coded)
- Smooth slide-down animation for quick actions
- Pulse animation on live mic button

**📱 Settings Additions**
- **Project Context toggle** in AI Behavior section (ON by default)
- Voice First toggle on mic button (long press or double-tap concept)

---

## June 13, 2026 (Earlier) — MAJOR OVERHAUL

### Previous Features (Still Live)
- Auto mode transparency log
- Provider usage stats with progress bars
- Guardrail status badge
- Poolside.ai provider (replaced Together AI)
- Nemotron 3 Ultra in models
- OpenRouter guardrails UI fix
- Project restructure
- Plain English docs

---

## June 12, 2026 — Cleanup

- Removed CodePilot archive (74 files)

---

## Current Model Lineup

| Category | Models | Best For |
|----------|--------|----------|
| **LiveCoding** | Nemotron 3 Ultra (550B), LLaMA 3.1 70B Turbo, Local | **Real-time pair programming** |
| **Coding** | Nemotron 3 Super, Kimi K2.6, Laguna M.1, GPT-OSS 120B | General coding |
| **UnCoding** | Nous-Hermes-3, LLaMA 3.1 Turbo, Local | Unrestricted coding |
| **UnChat** | Mistral Nemo, Dolphin, Venice | Uncensored chat |
| **Other** | Owl Alpha, GLM 4.5, Gemma 4 | General purpose |

---

## Auto Modes (Priority Order)

| Mode | Chain | Best For |
|------|-------|----------|
| `auto-live` | Nemotron 3 Ultra → LLaMA 3.1 Turbo → Local | **Live pair programming** |
| `auto-code` | Nemotron 3 Super → Kimi → Laguna → GPT-OSS → LLaMA → Auto | General coding |
| `auto-uncode` | Nous-Hermes-3 → LLaMA Turbo → Dolphin | Unrestricted coding |
| `auto-unchat` | Mistral Nemo → Dolphin → Venice → Venice Direct | Uncensored chat |

---

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Everything — single deployable file |
| `QUICKSTART.md` | User 2-min guide |
| `README.md` | User overview |
| `CHANGELOG.md` | Technical changelog |
| `OWNER_LOG.md` | This file — plain English history |
| `/docs/` | All technical docs, research, guides |

---

## To Deploy

```bash
git push
```

---

**Last Updated:** June 13, 2026  
**Status:** Production ready — Live Coding Assistant is live!