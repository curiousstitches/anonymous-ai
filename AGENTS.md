# 🤖 Opencode Agents Guide

This document covers Opencode's built-in agents, how they operate, and how to easily add your own custom agents directly into your workspace.

---

## 🧭 The 2 Standard Built-In Agents

Opencode comes pre-packaged with these two powerful standard agents for handling complex tasks:

### 1. `explore`
* **Purpose:** Specialized for exploring large codebases, locating specific files, searching for patterns, and auditing code structure.
* **Best Used For:** 
  * "Where is the authentication login logic implemented?"
  * "Find all occurrences of the API key variable across the project."
  * "Audit index.html for any unused CSS styles."
* **Under the Hood:** Has optimized access to fast codebase indexing, `glob` file matching, and `grep` pattern searching tools.

### 2. `general`
* **Purpose:** A general-purpose research and execution agent capable of running multi-step tasks and complex research workflows.
* **Best Used For:**
  * Planning and designing multi-file features.
  * Researching complex architecture decisions.
  * Running concurrent search, compilation, and validation tasks.
* **Under the Hood:** Operates as an autonomous loop capable of planning, executing, checking output logs, and correcting course dynamically.

---

## 🛠️ How to Add Custom Agents

You can create your own custom agents in two ways: **File-based** (highly recommended for non-trivial instructions) or **Inline** (configured inside `opencode.json`).

### Option A: File-Based Agents (Recommended)
This is the cleanest approach. Simply create a markdown file in `.opencode/agent/` or `.opencode/agents/` in your workspace root.

1. **Create the file:** `.opencode/agent/code-reviewer.md`
2. **Add frontmatter & instructions:**

```markdown
---
description: Automatically reviews code for style, security, and optimization.
mode: subagent
model: poolside/laguna-m.1
permission:
  edit: ask
  bash: ask
---

You are a senior, strict code reviewer. 
When called, you must:
1. Scan the modified files for style consistency.
2. Check for security vulnerabilities or hardcoded keys.
3. Suggest optimization and modern refactoring patterns.
Always explain your reasoning clearly and concisely.
```

*Note: The file body below the frontmatter (`---`) becomes the agent's system prompt automatically. Do not put a `prompt:` key inside the frontmatter.*

---

### Option B: Inline Agents (inside `opencode.json`)
If you prefer keeping everything in one configuration file, add your custom agent under the `"agent"` key in your `opencode.json` file.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "code-reviewer": {
      "description": "Reviews code for style and security.",
      "mode": "subagent",
      "model": "poolside/laguna-m.1",
      "permission": {
        "edit": "ask",
        "bash": "ask"
      },
      "prompt": "You are a senior, strict code reviewer. Focus on security, style, and optimization..."
    }
  }
}
```

---

## 📝 Frontmatter / Config Reference

When creating a custom agent, you can configure the following keys:

| Field | Type | Description |
|---|---|---|
| `description` | string | Short description of what this agent does (shown in menus). |
| `mode` | string | `"primary"` (shows in main prompt), `"subagent"` (for delegation), or `"all"`. |
| `model` | string | The specific AI model to run (e.g. `"poolside/laguna-m.1"` or `"anthropic/claude-sonnet-4-6"`). |
| `permission` | object | Custom tool permissions for this agent (e.g., allow `read` but restrict `edit`/`bash`). |
| `hidden` | boolean | Set `true` to hide this agent from TUI autocompletes. |
| `disable` | boolean | Set `true` to disable a built-in agent (e.g. `agent: { build: { disable: true } }`). |

---

## ⚡ Applying Your Custom Agents

1. Create/edit your `.opencode/agent/<name>.md` or `opencode.json` file.
2. **Quit and restart Opencode** to load the new configurations (running sessions keep using the already-loaded config).
3. Call your custom agent from the input prompt:
   * **In TUI:** Type `@` and select your agent (e.g., `@code-reviewer`).
   * **In Task commands:** Run them via `task` delegation.
