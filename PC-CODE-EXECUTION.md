# 🖥️ PC PLAYBOOK — Real Code Execution (for when you have your computer)

Your phone app can **write** any code and **run web code (HTML/JS)** live.
To actually **run Python, terminal commands, and any language** — and to get
unlimited uncensored AI — you connect your PC. Here's everything, step by step.
Do this once; after that it just works.

---

## PART A — Unlimited uncensored AI on your PC (Ollama)

1. On your PC, go to **ollama.com** and install Ollama.
2. Open a terminal (Windows: PowerShell) and pull uncensored models:
   ```
   ollama pull dolphin-mistral
   ollama pull dolphin-llama3
   ```
   (dolphin = uncensored. For coding also: `ollama pull deepseek-coder`)
3. Let it listen on your network so your phone can reach it:
   - Windows: in PowerShell run
     ```
     setx OLLAMA_HOST "0.0.0.0"
     ```
     then fully close and reopen Ollama.
4. Find your PC's local IP:
   - Windows: run `ipconfig` → look for "IPv4 Address" (e.g. 192.168.1.50)
5. In the phone app → ⚙️ Settings → **Custom / Local Endpoint**:
   - **URL:** `http://192.168.1.50:11434/v1/chat/completions`  (use YOUR ip)
   - **Model:** `dolphin-mistral`  (or `deepseek-coder` for coding)
   - **Key:** leave blank
6. In the ⚡ model menu pick **My Local Companion** (chat) or **My Local Coder** (code).

✅ Now you have unlimited, private, uncensored AI — phone talks to your PC.
(Phone and PC must be on the same Wi-Fi. To reach it from anywhere, see PART C.)

---

## PART B — Actually RUNNING the code the AI writes

The app writes complete projects. To run them on your PC:

### Web apps (HTML/CSS/JS)
- Already runnable **on your phone** with the ▶ Run button. On PC, just open
  the saved `.html` file in a browser.

### Python
1. Install Python from **python.org** (tick "Add to PATH" on Windows).
2. Save the AI's code as `app.py` (use the 💾 Save button, or push to GitHub
   and download on PC).
3. In a terminal in that folder:
   ```
   pip install -r requirements.txt   (if the project has one)
   python app.py
   ```

### Node.js projects (REST APIs, Discord bots, React, etc.)
1. Install **Node.js** from nodejs.org.
2. In the project folder:
   ```
   npm install
   npm start        (or: node index.js)
   ```

### Anything else
The AI includes a short "how to run it" note at the end of each build —
follow those exact lines in a PC terminal.

---

## PART C — Reach your PC AI from ANYWHERE (not just home Wi-Fi)

Use a free tunnel so your phone can talk to your PC over the internet:

1. On the PC, install **ngrok** (ngrok.com, free account).
2. Run:
   ```
   ngrok http 11434
   ```
3. It prints a public URL like `https://abc123.ngrok.io`
4. In the app → Custom / Local → **URL:** `https://abc123.ngrok.io/v1/chat/completions`
5. Same Model name as before. Done — works on mobile data, anywhere.

(URL changes each time you restart ngrok; just paste the new one.)

---

## PART D — The honest limits (so nothing surprises you)

- The **phone app cannot** run Python or terminal commands itself — browsers
  block that for security. The phone runs **web code** and **writes** everything;
  your **PC runs** the rest. That's the real division, and it's the same for
  every web app in the world.
- Once your PC is set up (Part A), the AI side is unlimited and uncensored.
- For a fully installable phone app later, we can wrap this with PWABuilder
  into an APK — ask when you're ready.

---

## QUICK CARD
```
PC AI (chat):   ollama pull dolphin-mistral   → app Custom/Local → My Local Companion
PC AI (code):   ollama pull deepseek-coder     → app Custom/Local → My Local Coder
Run Python:     python app.py
Run Node:       npm install && npm start
From anywhere:  ngrok http 11434  → paste URL in app
```
