---
layout: post.njk
title: "Lab Note #004 — The Bodge Wire That Crossed the Entire Board"
date: 2026-06-15
description: "A bodge wire saved a board with missing test points. The fix works, the board runs, and it's got more character than before."
draft: false
---

I built a board without enough test points.

The project has a bunch of addressable LEDs controlled by the MCU. Signals worked great; data line was clean, timing was right, LEDs responded perfectly.

But when I told the MCU to cut power to the LEDs, current kept flowing. Not a little; a lot. I did the math and my battery was only going to last about 5% as long as expected.

It took a while to track down; turns out I'd used a reference circuit incorrectly and never connected the power enable pin on the LED driver. Without test points, narrowing that down meant probing blindly through a dense layout.

The fix: I pulled a pulldown resistor off the board and used its pad to solder a bodge wire to a completely separate test point meant for a different purpose. Rerouted the signal through copper I'd laid down for something else entirely.

It works. Board runs, LEDs shut off properly, battery life is back where it should be. And it's got more character than it had before.

Next revision gets more test points. But this one stays on the bench as a reminder.

— Odderon Lab