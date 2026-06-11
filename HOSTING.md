# 🆓 Where to run YOUR own uncensored AI (free)

Anonymous AI can point at any AI server you control via **Settings → Custom / Local Endpoint**.
Here are the free ways to get one, ranked easiest → most powerful.

---

## 🥇 Option 1 — Your PC with Ollama (free forever, no limits)

Best if your PC is on when you want to use it.

1. On your PC, install **Ollama** from `ollama.com`
2. Open a terminal and run:  `ollama run dolphin-mistral`
   *(downloads an uncensored model — try `dolphin-llama3` too)*
3. Let Ollama listen on your network. Set this once:
   - Windows: set env var `OLLAMA_HOST=0.0.0.0`
   - then restart Ollama
4. Find your PC's local IP (e.g. `192.168.1.50`)
5. In the app → Settings → Custom / Local:
   - **URL:** `http://192.168.1.50:11434/v1/chat/completions`
   - **Model:** `dolphin-mistral`
   - **Key:** leave blank
6. Pick **"My Custom / Local"** from the model list. Done.

✅ Unlimited · ✅ Private · ✅ $0 — only works while PC + phone are on the same Wi-Fi (or use ngrok below to reach it anywhere).

---

## 🥈 Option 2 — Kaggle free GPU (bigger models, works anywhere)

Best if your PC is too weak. Kaggle gives a **free GPU, ~30 hrs/week**, runs over the internet.

1. Make a free account at **kaggle.com** (verify phone to unlock GPU)
2. New Notebook → Settings → Accelerator → **GPU T4**
3. Paste the cells from `kaggle-ollama.ipynb` (included)
4. Add your free **ngrok** token (from ngrok.com) where shown
5. Run it — it prints a public URL like `https://xxxx.ngrok.io`
6. In the app → Custom / Local:
   - **URL:** `https://xxxx.ngrok.io/v1/chat/completions`
   - **Model:** whatever you pulled (e.g. `dolphin-llama3`)
   - **Key:** blank
7. Pick **"My Custom / Local"**. Done.

⚠️ The URL changes each session, and sessions last up to 12 hrs. Re-run to get a fresh URL.

---

## 🥉 Option 3 — Paid-but-cheap APIs with free trials

If you'd rather not run anything: **Venice.ai** (free tier built in — just add the key in Settings), or **Featherless / Arli AI** (cheap monthly, huge uncensored model lists). Paste their endpoint into Custom / Local.

> 🚫 Don't try to "bypass" these — stolen/abused keys get banned and can land on you. The free routes above already give you unlimited uncensored AI without any of that risk.

---

## 🧭 Quick pick

| Your situation | Use |
|---|---|
| PC on, same Wi-Fi as phone | **Option 1** (Ollama) |
| Weak PC, want big models | **Option 2** (Kaggle) |
| Want zero setup | **Venice free tier** (Settings → Venice key) |
