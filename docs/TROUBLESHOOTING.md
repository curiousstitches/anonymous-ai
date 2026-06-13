# 🆘 Troubleshooting Guide

## Problem: "Free/Uncensored models are blocked"

### Symptom
- You pick "Auto — Uncensored" or "Dolphin (Venice)" but get an error like:
  - `"data policy"` or `"free endpoints that may train on request data"`
  - `"publication"` or `"free endpoints that may publish prompts"`
  - Model just doesn't appear in the list

### Root Cause
**OpenRouter account-level guardrail is blocking free models by default.** This is intentional (a safety feature), but it stops you from using uncensored models.

### Fix (takes 30 seconds)
1. Log into [openrouter.ai](https://openrouter.ai)
2. Click **Workspace** (top-left dropdown)
3. Click **Guardrails**
4. Click **Workspace Guardrail** (the main guardrail listed)
5. Scroll to **Model & Provider Access**
6. Toggle **ON**: "Free endpoints that may train on request data"
7. Toggle **ON**: "Free endpoints that may publish prompts"
8. Click **Save** (changes don't take effect until you save!)
9. Wait 10 seconds for changes to propagate
10. Go back to the app and test

**Still blocked?** In the app:
- Settings → Providers → Test (next to OpenRouter)
- If it still says "data policy blocked," your Workspace setting may not have saved. Try again or create a new key in Workspace → Keys.

---

## Problem: "No OpenRouter key set" or "Key not working"

### Symptom
- Test shows: 🔑 NO KEY
- Or: Models appear but chat fails with 401 error

### Checklist
1. **Paste the right key format**
   - Must start with `sk-or-v1-`
   - Copy from [openrouter.ai/keys](https://openrouter.ai/keys)
   - Don't include spaces or newlines
2. **Key isn't expired**
   - Go to [openrouter.ai/keys](https://openrouter.ai/keys)
   - Check if your key is still listed (not revoked)
3. **Try a fresh key**
   - Create a new key: [openrouter.ai/keys](https://openrouter.ai/keys) → Create Key
   - Paste it in Settings
   - Test again

---

## Problem: "Rate-limited" or "Daily free cap hit"

### Symptom
- Test shows: ⏱️ RATE-LIMITED
- Or: Error `429` (too many requests)
- Or: Error `402` (need credits)

### Why This Happens
OpenRouter's free tier has daily limits:
- ~50–100 free model calls per day (varies by model)
- Resets at midnight UTC
- High-use models (Nemotron, Dolphin) hit limits faster

### Solutions
**Option 1: Wait until tomorrow** (free tier resets daily)

**Option 2: Add a second provider**
- Get a Chutes key from [chutes.ai](https://chutes.ai) (also free)
- Settings → Chutes → Set Key
- App will auto-rotate between OpenRouter & Chutes when one hits limits

**Option 3: Use your own AI** (unlimited, free)
- See HOSTING.md for:
  - Ollama on your PC (truly unlimited)
  - Kaggle GPU (free, works anywhere)
- Settings → Custom / Local Endpoint → Set your server URL

---

## Problem: "Model test passed but chat still fails"

### Symptom
- Settings → Test → ✅ OK
- But when you chat, it says "Error" or provider goes down

### Why This Happens
The model tested (often a small/fast one) works, but the model you picked (maybe a larger one) has issues:
- It's currently overloaded
- It requires a different guardrail setting
- It's temporarily unavailable

### Solutions
1. **Pick a different model**
   - Try "Auto — Coding" (auto-picks and retries)
   - Or manually pick a different model from the dropdown
   - App will try the next one in the fallback chain

2. **Check OpenRouter status**
   - Go to [openrouter.ai/status](https://openrouter.ai/status)
   - See if your model is listed as down
   - If down, wait or pick another

3. **Enable auto-retry**
   - Don't switch models manually
   - Just hit send again
   - Auto mode will rotate to the next provider

---

## Problem: "Custom / Local endpoint not working"

### Symptom
- You set up Ollama or Kaggle GPU
- Test fails or endpoint doesn't connect
- Chat doesn't work

### Checklist
1. **Check endpoint URL format**
   - Should be: `http://localhost:11434/v1/chat/completions` (local Ollama)
   - Or: `https://xxxx.ngrok.io/v1/chat/completions` (public tunnel)
   - Must include `/v1/chat/completions` at the end
   - Must be HTTPS if it's public (ngrok auto-does this)

2. **Test the endpoint outside the app**
   - Open Terminal / Command Prompt
   - Paste this (replace with your URL):
     ```bash
     curl -X POST "http://localhost:11434/v1/chat/completions" \
       -H "Content-Type: application/json" \
       -d '{"model":"dolphin-mistral","messages":[{"role":"user","content":"hi"}],"max_tokens":10}'
     ```
   - If it works, you'll get JSON back
   - If it fails, your endpoint isn't running

3. **Is the model running?**
   - Ollama: Run `ollama run dolphin-mistral` in terminal first
   - Kaggle: Check if the notebook is still running (doesn't auto-pause)
   - ngrok tunnel: Still active and forwarding?

4. **Test in the app**
   - Settings → Custom / Local Endpoint → Test
   - Look at the exact error message

---

## Problem: "Provider is turned OFF in Settings"

### Symptom
- You see models with a ⏸️ "turned off" label
- Can't use those models even though you have a key

### Why
You manually disabled a provider in Settings → Providers (toggle switch).

### Fix
- Settings → Providers
- Toggle it back ON (the switch should be blue)
- Models become available again

---

## Problem: "I'm getting different errors I don't see here"

### What to Do
1. In the app: Settings → Providers → Test (for each provider)
2. The test will show you the exact error from the server
3. Screenshot or copy that error message
4. Check the solutions above or open an issue at [github.com/curiousstitches/anonymous-ai/issues](https://github.com/curiousstitches/anonymous-ai/issues)

### Common Error Codes
| Code | Meaning | Fix |
|------|---------|-----|
| 401 | Unauthorized (bad key) | Paste a valid key |
| 402 | Payment required (no credits) | Use free tier or add balance |
| 429 | Too many requests (rate limited) | Wait or use another provider |
| 500 | Server error (provider down) | Wait or try another model |
| "data policy" | Account guardrail blocking | Enable guardrails in OpenRouter Workspace |

---

## Quick Diagnostic Checklist

Before opening an issue, run through this:

- [ ] I got a key from [openrouter.ai](https://openrouter.ai) ✅
- [ ] I enabled OpenRouter guardrails (Settings → Test shows it)
- [ ] I pasted the key into the app ✅
- [ ] I clicked Save ✅
- [ ] I ran Settings → Providers → Test for each provider ✅
- [ ] The test showed ✅ OK (or explained why it didn't) ✅
- [ ] I tried a different model (maybe the one I picked is down) ✅
- [ ] I checked [openrouter.ai/status](https://openrouter.ai/status) for outages ✅

If all of these pass and you still see issues, [open an issue](https://github.com/curiousstitches/anonymous-ai/issues) and include:
- The exact error message
- Which model you tried
- Screenshot from Settings → Test output

---

## Still Stuck?

1. **Read the README** — check the "If you still see 'blocked' errors" section
2. **Check HOSTING.md** — if you want unlimited AI
3. **Test the app on a different device** — rules out phone/browser-specific issues
4. **Open an issue** — include error messages + steps to reproduce

---

**Updated:** June 2026  
**Last tested:** Anonymous AI v5.2
