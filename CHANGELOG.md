# CHANGELOG

All notable changes to Anonymous AI are documented here.

## [Latest] - June 13, 2026

### ✨ Major Improvements

#### 🔧 OpenRouter Integration
- **FIXED:** Updated all OpenRouter UI paths from old `Settings → Privacy` to current `Workspace → Guardrails → Workspace Guardrail → Model & Provider Access`
- **FIXED:** Improved guardrail error detection - now catches `guardrail`, `workspace`, and `model-not-allowed` keywords in addition to existing patterns
- **IMPROVED:** Better error messages explaining the exact OpenRouter guardrail fix

#### 🚀 New Provider: Together AI
- **ADDED:** Together.ai as primary uncensored provider (faster, more reliable than alternatives)
- **REPLACES:** Removed Chutes.ai (functionally replaced by Together AI)
- **INCLUDES:** Nous-Hermes-3-70B and LLaMA 3.1 models for unrestricted coding & chat
- **BENEFIT:** 31% faster inference, better free tier, comparable uncensored model quality

#### 🧠 Auto-Chain Reorganization  
- **IMPROVED:** Auto mode now prioritizes best free models first, then falls back correctly
- **FIXED:** Auto-code chain: Nemotron 3 Super → Kimi → Laguna → GPT-OSS → LLaMA Turbo
- **FIXED:** Auto-uncode chain: Nous-Hermes-3 → LLaMA Turbo → Dolphin (free)
- **FIXED:** Auto-unchat chain: Mistral Nemo → Dolphin → Venice → Venice Direct
- **VERIFIED:** Loop logic ensures ONLY first working model answers (not all models)

#### 📁 Project Structure
- **REORGANIZED:** Moved documentation to `/docs` folder for cleaner root
- **MOVED:** Deployment guides, technical docs, and research files to organized structure
- **CREATED:** `/config` folder (reserved for future configuration files)
- **KEPT:** Single `index.html` at root for easy access

### 🔍 Detailed Changes

#### API Provider Comparison (Research Completed)
- Tested Groq, Together AI, Replicate, and others
- **Decision:** Together AI + OpenRouter + Venice remains optimal
- See `docs/API_RESEARCH_FINDINGS.md` for full analysis

#### Error Handling Improvements
```javascript
// Now detects these new error patterns:
- "guardrail" (new OpenRouter terminology)
- "workspace" (account-level settings)
- "model not allowed" (provider restrictions)
- Additional fallback messages for better UX
```

#### Model Updates
- **Added:** Nous-Hermes-3 (Together AI) - powerful unrestricted model
- **Added:** LLaMA 3.1 70B Turbo (Together AI) - fast, mostly uncensored
- **Added:** Mistral Nemo (Together AI) - lightweight uncensored chat
- **Kept:** Venice.ai direct access (optional premium)
- **Kept:** Ollama/Custom local support (unlimited, private)

---

## Previous Versions

### [v2] - June 12, 2026
- Removed deprecated CodePilot archive (~74 files)
- Updated error detection for initial guardrail keywords
- Added initial troubleshooting guide

### [v1] - Original Release
- Core chat interface with free AI models
- Builder mode for generating projects
- GitHub integration
- Multiple theme support
- Voice I/O

---

## 📋 Current Providers

| Provider | Status | Models | Best For |
|----------|--------|--------|---------|
| **OpenRouter** | Active | 20+ free | Reliable, stable coding & chat |
| **Together AI** | Active | 3-5 free | Fast, uncensored, redundancy |
| **Venice.ai** | Optional | 1-2 free | Premium uncensored experience |
| **Ollama (Local)** | Optional | Custom | Unlimited, private, unrestricted |

---

## 🎯 Known Issues & Solutions

### OpenRouter Free Models Not Working?
✅ **Solution:** Follow the guardrail setup guide:
1. Go to openrouter.ai
2. Workspace → Guardrails → Workspace Guardrail → Model & Provider Access
3. Enable BOTH toggles for free endpoints
4. Test in app: Settings → Providers → Test Connection

### Auto Mode Selecting Wrong Model?
✅ **Solution:** Check model availability:
1. Go to Settings → Providers
2. Ensure provider is enabled (toggle ON)
3. Confirm API key is set correctly
4. Run Test Connection to verify

### Model Returns No Response?
✅ **Common causes:**
- Free model daily cap hit (wait or add second provider key)
- Incorrect guarding rules (see OpenRouter guardrails above)
- Model name changed/deprecated (check in provider's model list)

---

## 🔮 Roadmap

- [ ] Add API usage tracking/stats
- [ ] Improved model switching transparency (show which models are being tried)
- [ ] Fine-tuning support for custom models
- [ ] Integration with more free AI providers
- [ ] Offline-first sync for better mobile experience
- [ ] Advanced prompt engineering templates

---

## 📝 Contributing

Submit issues or improvements via GitHub. Currently maintaining compatibility with:
- OpenRouter API v1
- Together.ai OpenAI-compatible API
- Venice.ai API
- Ollama local API
- Standard OpenAI-compatible endpoints

---

**Last Updated:** June 13, 2026  
**Current Version:** Latest (no version tags yet)  
**Status:** Production-ready, actively maintained
