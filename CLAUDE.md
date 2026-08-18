# Coin-Oid — CLAUDE.md
*For Trinity. Read this first.*

---

## What Coin-Oid Is

Free AI-powered identification tool for coins, banknotes, medals and tokens.
Upload a photo — Coin-Oid (Old Penny) identifies it, grades it, and gives a
value estimate. Ask Old Penny anything about numismatics, fakes, grading,
or metal detecting finds.

Part of the FeelFamous -Oid Ecosystem.

**Live at:** coin-oid.netlify.app — confirmed 2026-08-18 against the real
Netlify project record (`get-project` on site ID `12577c42-...`); no
`.co.uk` custom domain is attached, despite this file previously saying
`coin-oid.co.uk`. Don't reintroduce `coin-oid.co.uk` in canonical/OG tags,
robots.txt/sitemap.xml, watermark text, or cross-links elsewhere in the
ecosystem until a real `.co.uk` domain is actually attached in Netlify.
**Exception, left alone deliberately:** `index.html`'s `PATREON_OAUTH_URL`
still uses `coin-oid.co.uk/auth/patreon` as its `redirect_uri` — that must
match whatever's registered in the Patreon developer dashboard, which
wasn't visible this session. Confirm/update the registered Redirect URI
before changing that one line, or Patreon sign-in will break.

---

## The Character

**Old Penny** — 68 years old, been on the coin stalls at Portobello Road
since he was 12, helping his old dad. East London market trader voice,
sharp, warm, zero tolerance for dishonesty. Remembers Decimal Day (15 Feb
1971). Used for both the identify/roast prompts in `analyze-image.js` and
the chat persona in `chat-penny.js`.

`mode: 'identify'` = full expert identification. `mode: 'roast'` = Old
Penny's market-stall verdict, more character, less formality.

---

## Stack

- **Static HTML** — single page (`index.html`), no framework, no build step
- **Tailwind CSS CDN** — inline
- **Netlify** — hosting + serverless `netlify/functions/`
- **Supabase** — `pdnjeynugptnavkdbmxh` — users, kudos, leaderboard, activity feed
- **Gemini 2.5 Flash** — identification + Old Penny chat (never Anthropic API in production)
- **Patreon** — OAuth membership check (`patreon-auth.js`), tiers only, no gate on the tool
- **what3words** — Meet tab (meeting point generator for coin fairs)

---

## File Map

```
/
├── CLAUDE.md
├── LICENSE                          ← AGPL v3
├── index.html                       ← entire app: identify/roast, Learn, Q&A,
│                                        Ask Old Penny, Gear, Meet, Village/join
├── netlify.toml
└── netlify/functions/
    ├── analyze-image.js             ← Gemini vision — identify + roast modes (ungated)
    ├── chat-penny.js                ← Old Penny chatbot (ungated)
    └── patreon-auth.js              ← Patreon OAuth token exchange + tier check
```

---

## Free-to-use philosophy (Chris, 2026-07-13 — read before adding any gate)

The core tool is free for everyone, no sign-in, no lock icon, no "Villager+
only" banner. Don't gate the tool itself behind Patreon.

**What Patreon/paid tiers are for:** genuine extras that cost ongoing hosting/
upkeep and aren't required to use the tool. Frame honestly, never as a
shame-lock ("🔒 ... Unlock →"). No tier-comparison shop windows, no
LinkedIn-style "join my community to see what I can do."

**The ask, when there is one:** one honest, low-key line after the task
completes — free to use, tell a mate if it helped, buy-me-a-coffee if you
want to say thanks (one-off, `buymeacoffee.com/chrispteemagician`), Patreon
if you want to be a regular. Not a gate. Not gamified.

**Repo-specific facts (checked 2026-07-29, don't relitigate):**
- Audited `index.html` and every `netlify/functions/*.js` for
  `isPro`/`patron_status`/lock-emoji/shame-lock copy — found none blocking
  core functionality. `analyze-image.js` and `chat-penny.js` have no
  tier/`isPro` check at all; `patreon-auth.js` only ever feeds a session
  object (`isPro`, `tier`) used to show a badge and to hide the honesty-box
  ask/sign-in prompt for supporters (`showPatreonStatus()` in `index.html`).
- The honesty box already exists (`#honestyBoxAsk`, inside `#resultView`,
  shown once after an identification/roast result renders) and already
  matches the standard copy pattern — free always, tell a mate, one-off Buy
  Me a Coffee or ongoing Patreon, "nothing here was ever locked behind it."
  Hidden automatically for signed-in Patreon supporters.
- No false-scarcity banner found (no "Founding Member — first 1,000
  only"-style copy) — the top banner already reads "It's free to use,
  always will be."
- No dead `showUpgradeModal`-style upsell state found.
- Pricing already correct everywhere it appears (see table below) — no
  stale £3/£7/£15 figures found.
- Bucket-2 perks (kept gated, correctly): hut/hamlet page, kudos,
  leaderboard, activity feed, invite-link kudos — all genuine
  Supabase-backed ongoing hosting cost, framed honestly ("Sign in with
  Patreon to earn kudos, track your finds, and unlock village features" —
  not a shame-lock).
- This was a routine audit pass, not a fix — a previous session
  (see `git log`: `6dbc956` de-gate/honesty-box, `85b9013` pricing fix,
  `1ac8fd0` age-gate removal) had already brought this repo in line with
  the ecosystem pattern before this file existed.

Full doctrine: DocBrain `concepts/the-tip-jar-doctrine`, mechanical pattern:
`tech/free-to-use-degate-skill`.

---

## Membership Tiers (Patreon — chrisptee campaign)

| Tier | Price | Pence threshold |
|------|-------|----------------|
| 🏡 Villager | £4.95/mo | ≥300¢ |
| ⭐ Elder | Earned (not bought) | ≥700¢ |
| 👑 Founder | £14.95/mo | ≥1500¢ |

Checked in `netlify/functions/patreon-auth.js`. All Patreon links go to
`https://www.patreon.com/chrisptee`.

---

## Gemini API Rules (Ecosystem-Wide)

Two known pitfalls — both already correct in this repo:

1. **Do NOT set `thinkingBudget: 0`** — Gemini 2.5 Flash rejects it with a
   silent 400. No `thinkingConfig` present in either function — correct.
2. **Do NOT hardcode `mime_type: "image/jpeg"`** — always extract the real
   type from the data URL first. `analyze-image.js` already does this
   correctly:
   ```js
   const mimeMatch = image.match(/^data:(image\/[\w+.-]+);base64,/);
   const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
   const rawImage = image.replace(/^data:image\/[\w+.-]+;base64,/, '');
   ```

---

## Security notes

- User-derived and Gemini-derived text (usernames in the activity
  feed/leaderboard, the AI result description/Amazon search term) is passed
  through `escapeHtml()` before being rendered into `innerHTML` — fixed
  ecosystem-wide stored-XSS class of bug, see `git log` commit `eaec596`.
  Don't reintroduce raw interpolation into `innerHTML` for anything that
  ultimately traces back to a user or an AI response.

---

## Deploy

Push to `main` → Netlify auto-deploys. Never drag-to-Netlify.
Before every push: `git pull` first.

---

*"Every coin tells a story." — Old Penny*
