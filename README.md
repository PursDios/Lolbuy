# LolBuy — The Future of PC Building™

> A satirical e-commerce site that lovingly skewers the dark patterns, manipulative UX, and general shadiness of modern online retail.

**[View Live Site →](https://PursDios.github.io/Lolbuy/)**

---

## What Is This?

LolBuy is a fake PC hardware store built as a comedy project. Every page is designed to look like a legitimate e-commerce site while quietly doing everything a shady company would actually do — pre-checked upsells, moving checkboxes, subscription traps, a delivery driver named Gerald, and a returns policy that leads every possible path to "not eligible."

It is not a real shop. No purchases are processed. Gerald is not real. (Probably.)

---

## Features

### Shop
- Products auto-add to your cart if you hover over them for 2 seconds
- Stock warnings that are always "Only 1–2 left"

### Cart
- "Complimentary" items pre-added on your behalf, complete with a guilt-trip modal if you try to remove them
- Shipping options where the free one is marked `(RISKY)` and disabled
- Gerald's tip, pre-added

### Checkout
- A card belonging to someone called Debra is offered as payment
- Terms of Service, Privacy Policy, Anti-Terms, and *The Other Document* are all clickable and contain full (terrible) text
- The "← Back" button dodges your cursor once you're about to pay
- Surprise items appear at review step, billed per Terms Section 47, Subsection B

### Account
- You are assigned a random user on every visit; clicking "Not You?" assigns a different one
- Order history, user badge, and loyalty points all randomise on reroll
- Subscriptions may or may not already be active when you arrive
- Cancelling a subscription requires a 5-step wizard and takes 6–8 weeks
- Unchecking a communication preference adds a new, worse one (Telepathic Marketing, Dream Sponsorship™, etc.)
- Save Preferences does something. Not what you'd hope.

### Reviews
- 4.9/5 from 47,293 reviews — all five stars, all verified
- One 1-star review from Patricia H., hidden behind a toggle, flagged by Gerald
- Writing a review requires 4 identity verification steps

### Returns & Refunds
- "30-Day Hassle-Free Returns™" (see footnote)
- Interactive eligibility flowchart where answering yes or no both eventually result in not eligible
- Original packaging required (we recycled yours at dispatch)

### Contact
- Live support indicator goes offline 300ms after the page loads
- Gerald is always unavailable, for a randomly selected reason
- Contact form requires blood type, star sign, and shoe size (EU)

---

## Tech Stack

- **[Vue 3](https://vuejs.org/)** — Composition API
- **[Vite](https://vitejs.dev/)** — build tool
- **[Vue Router](https://router.vuejs.org/)** — client-side routing (hash mode)
- **[Pinia](https://pinia.vuejs.org/)** — state management
- **[Tailwind CSS](https://tailwindcss.com/)** — styling
- **[GSAP](https://greensock.com/gsap/)** — animations
- **GitHub Actions** — automated build and deploy to GitHub Pages

---

## Running Locally

Requires [Node.js](https://nodejs.org/) 18+.

```bash
git clone https://github.com/PursDios/Lolbuy.git
cd Lolbuy
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds the project and deploys it to GitHub Pages automatically. No manual steps required.

---

## Disclaimer

LolBuy is a parody. All dark patterns depicted are played for comedy and are intended to highlight — not endorse — manipulative design practices that exist in real online retail. Gerald is a fictional character. Any resemblance to actual delivery drivers, living or sprinting, is coincidental.
