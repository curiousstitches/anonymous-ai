# ⚠️ Archive Notice

## `codepilot-archive/` is Deprecated

The `codepilot-archive/` folder contains the original Next.js backend implementation. **It is no longer active.**

**Use `index.html` instead** — the current, maintained app that runs entirely in the browser.

### Why It Was Archived
- The Next.js API routes relied on server-side API keys (insecure for open-source)
- The current approach uses client-side keys on your device (more private)
- The dashboard/usage tracking added complexity without clear benefit

### If You Need Features From the Archive
The archive contains:
- Supabase integration (usage tracking)
- Dashboard UI components
- Server-side provider orchestration

**Do NOT restore this code without:**
1. Removing hardcoded API keys
2. Moving to environment variables
3. Adding proper auth/rate-limiting
4. Clear documentation on data privacy

### How to Help
If you want to build on the `index.html` app, contribute there. Don't revive the archive.

---

**Last Updated:** June 2026  
**Status:** Frozen (read-only for reference)
