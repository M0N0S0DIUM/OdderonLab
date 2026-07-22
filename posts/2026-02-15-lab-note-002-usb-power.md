---
title: "Lab Note #002 — Is USB 5V Good Enough?"
date: 2026-02-15
description: "Why I stopped trusting USB VBUS and added a buck-boost converter. Small decisions that separate prototypes from bench tools."
draft: false
---

I'm working on something that started as a small circuit and is slowly turning into something more serious.

It runs from USB.

At first, I did what I always do — route VBUS to the 5V rail and move on.

That's how most dev boards work.
It's simple.
It usually behaves.

But this build isn't meant to be "usually fine."

The more I looked at it, the more I realized USB 5V is really just "close enough."

Different ports sit at slightly different voltages.
Cables drop a little under load.
Switching relays or driving outputs can nudge the rail just enough to matter.

For quick prototypes, that's acceptable.

For something that's supposed to behave like a bench tool — predictable, repeatable — it feels like cutting a corner.

So instead of trusting VBUS directly, I added a current-limited input stage and a buck-boost converter to generate a steady internal rail just under 5V.

It might be overkill.

But I'd rather eliminate variables now than debug strange behavior later and wonder if it was the cable.

Small decisions like this are starting to define whether this stays a prototype — or becomes something more refined.

If you've built something similar and have strong opinions about USB power architecture, I'd genuinely like to hear them.

Reach out at <a href="mailto:odderonlab@protonmail.com">odderonlab@protonmail.com</a>.

— Odderon Lab