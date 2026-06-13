# CHANGELOG

## [Latest] - June 13, 2026

### 🤖 Live Coding Assistant (Major New Feature)

**The big one:** A real-time pair programming companion that feels like a senior dev sitting next to you.

#### What's New:
- **🤖 Live Coding Assistant persona** — Senior engineer pair-programming in real-time. Concise, practical, talks like a human dev. Code first, brief explanation after. Never lectures.
- **⚡ Nemotron 3 Ultra as default** — 550B params, massive context, deep reasoning. Best model for live pair programming.
- **🔴 Auto-Live mode** (`auto-live`) — Nemotron 3 Ultra → LLaMA 3.1 70B Turbo → Local Ollama fallback chain
- **⚡ Quick Action Buttons** (visible in Live Coding mode):
  - 💡 **Explain** — "Explain this code/error in plain English"
  - 🔧 **Fix** — "Fix this error/bug. Give corrected full code only"
  - ♻️ **Refactor** — "Refactor — cleaner, faster, maintainable"
  - ✅ **Test** — "Write comprehensive tests. Cover edge cases"
  - 📝 **Document** — "Add clear comments and documentation"
  - ⚡ **Optimize** — "Optimize for performance. Show before/after"
  - 🔒 **Security** — "Review for vulnerabilities. List issues + fixed code"

#### Voice-First Mode (New)
- **🎙️ Voice First toggle** — Continuous listening, auto-sends on sentence end
- Tap mic once → speaks anytime → auto-sends on pause
- Perfect for hands-free coding while typing

#### Project Context Awareness (New)
- **📁 Project Context** — Automatically tracks files you share/build (up to 20)
- **Auto-includes recent files** as context in Live Coding mode (last 5 files)
- **Header indicator** — Shows "📁 3 project files" in top bar
- **Settings toggle** — Privacy control: ON by default, can disable
- **Smart inclusion** — Only adds context in Live Coding mode, not regular chat

#### Visual Polish
- **Live Actions bar** — Slides down smoothly when Live Coding mode active
- **Project Context badge** in header — "📁 3 project files"
- **Smooth animations** — Slide-down for actions, pulse for live indicators
- **Provider badges** in model picker — Color-coded by provider

---

### Previous: Major Feature Release (Auto Transparency, Provider Stats, Visual Overhaul)

- Auto mode transparency log
- Provider usage stats with progress bars
- Guardrail status badge (green/red)
- Landing page with animated gradient/orbs
- Plain English docs (QUICKSTART, OWNER_LOG, README)
- Project restructure (/docs, /config)
- Together AI provider (replaced Chutes)
- OpenRouter guardrails UI fix
- Nemotron 3 Ultra in "Other" category

---

### Before That: Cleanup & Foundation

- Removed CodePilot archive (74 files)
- OpenRouter guardrails UI path fix
- Error detection improvements
- Documentation overhaul

---

## Model Lineup (Current)

| Category | Models | Best For |
|----------|--------|----------|
| **LiveCoding** | Nemotron 3 Ultra (550B), LLaMA 3.1 70B Turbo, Local | Real-time pair programming |
| **Coding** | Nemotron 3 Super, Kimi K2.6, Laguna M.1, GPT-OSS 120B | General coding tasks |
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

*Last Updated: June 13, 2026*