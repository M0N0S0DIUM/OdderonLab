---
title: "Lab Note #001 — The Board I Built After Frying Too Many Dev Kits"
date: 2026-02-01
description: "The origin story of DevGuard 24 — an inline protection board born from too many fried dev boards."
draft: false
---

If you prototype long enough, you'll eventually do it.

Reverse polarity.
Hot-plug a supply.
Grab the wrong wall adapter.
Move a jumper one pin over.

And something quietly dies.

I've done it enough times to stop pretending it wouldn't happen again.

So I built a small inline protection board that lives between my power source and whatever I'm testing.

Nothing fancy. Just:

- MOSFET-based reverse polarity protection
- A TVS diode for transient suppression
- A resettable polyfuse (500mA or ~1.1A versions)
- 3V–24V DC pass-through

It does **not** regulate voltage.
It won't save you from intentionally feeding 24V into a 5V board.

But it will absorb the kinds of mistakes that tend to happen when you're moving fast, tired, or swapping supplies mid-debug.

It's basically a small layer of insurance between you and an avoidable failure.

No firmware.
No measurements.
No blinking LEDs.

Just something that sits there quietly and takes the hit instead of your board.

If that sounds useful, you can find it on our [Products page](/products/).

More small lab tools coming soon.

— Odderon Lab