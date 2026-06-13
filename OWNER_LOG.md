# OWNER LOG — Anonymous AI

**Plain English. Every change. What, why, when.**

---

## June 13, 2026 — MAJOR OVERHAUL

### What I Did
Completely rebuilt the AI provider system, fixed all guardrail issues, added transparency features, reorganized the project, and made the visual design exciting.

### Why
- Users were confused by outdated OpenRouter instructions
- Only one AI provider = fragile (if it failed, app was dead)
- No visibility into which model actually answered in Auto mode
- Project structure was messy
- Visual design was functional but boring

### Changes

**🔧 OpenRouter Guardrails Fixed**
- Updated ALL instructions from old `Settings → Privacy` to current `Workspace → Guardrails → Workspace Guardrail → Model & Provider Access`
- Added visual guardrail badge in Settings (green = working, red = blocking)
- Test Connection now detects guardrail blocks and tells users exactly what to fix

**🚀 Added Together AI Provider**
- Replaced Chutes (unreliable) with Together AI
- Together AI is 31% faster, better free tier, has Nous-Hermes-3 and LLaMA 3.1 uncensored models
- Now 3 solid providers: OpenRouter → Together AI → Venice.ai → Local Ollama
- Auto-fallback chain works properly

**👁️ Auto Mode Transparency Log**
- When using Auto modes, you now see a live log: "1. Nemotron → Trying... 2. Kimi → Waiting..."
- Shows exactly which model answered and which ones were skipped/failed
- No more mystery — you see the whole chain

**📊 Usage Stats Per Provider**
- Settings → Usage now shows requests & words per provider
- Visual progress bars show which provider you're using most
- Tracks: OpenRouter, Together AI, Venice.ai, Custom/Local

**📁 Project Reorganized**
```
/docs          → All guides, research, technical docs
/config        → Reserved for future config files
index.html     → Single deployable app (only file at root)
README.md      → Overview
QUICKSTART.md  → 2-minute user guide
CHANGELOG.md   → Technical changelog
OWNER_LOG.md   → This file (plain English)
```

**🎨 Visual Overhaul**
- Landing page: animated gradient background, floating orbs, grid animation
- Setup screen: feature cards, hero animation, pulsing brand mark
- Auto mode log: animated status items (waiting → trying → success/failed)
- Provider badges in model picker
- Smoother transitions everywhere

**📱 Mobile-First Polish**
- All new visuals work on small screens
- Touch-reactive backgrounds
- Proper safe-area handling
- Install-to-homescreen works

---

## June 12, 2026 — Cleanup

### Removed CodePilot Archive
- Deleted 74 files from old Next.js backend (`codepilot-archive/`)
- Was deprecated, confusing, had hardcoded keys
- Now clean single-file architecture

---

## Next Ideas (Not Done Yet)

- [ ] Model update notifier (warns when model names change)
- [ ] Rate-limit awareness (auto-pauses when hitting daily caps)
- [ ] Prompt template library (one-tap common prompts)
- [ ] Sync visual preview of what changed between versions
- [ ] Export chat as formatted markdown/PDF

---

## Current Provider Stack (Priority Order)

| Provider | Status | Best For | Free Tier |
|----------|--------|----------|-----------|
| **OpenRouter** | ✅ Primary | Stable coding, most models | Limited/day |
| **Together AI** | ✅ Backup | Speed, Nous-Hermes, LLaMA | Generous |
| **Venice.ai** | ✅ Premium | Best uncensored chat | Limited |
| **Ollama (Local)** | ✅ Ultimate | Unlimited, private, custom | Unlimited |

---

## Key Files to Know

| File | What It Is |
|------|------------|
| `index.html` | **Everything** — HTML, CSS, JS in one file |
| `QUICKSTART.md` | User-facing 2-min guide |
| `CHANGELOG.md` | Technical changelog |
| `OWNER_LOG.md` | This file — plain English history |
| `/docs/API_RESEARCH_FINDINGS.md` | Why Together AI was chosen |
| `/docs/DEEP_AUDIT_REPORT.md` | Full code audit details |

---

## To Deploy

```bash
git push
```
GitHub Actions builds → deploys to Pages automatically.

---

**Last Updated:** June 13, 2026  
**Status:** Production ready, all features live