---
layout: post.njk
title: "Lab Note #003 — Simulating Sensors Instead of Chasing Them"
date: 2026-05-20
description: "Why I built a sensor emulator board instead of waiting on real hardware. The art of testing embedded systems without the actual sensors."
draft: false
---

A lot of debugging time gets wasted waiting on a sensor that isn't cooperating.

Sometimes the hardware isn't mounted yet. Sometimes the engine isn't running. Sometimes the sensor is buried inside a machine you don't want to tear apart again just to test one input.

Lately I've been experimenting with a small board designed to do the opposite: instead of reading sensors, it emulates them.

The goal is simple — generate predictable outputs that look like real-world sensors so embedded systems can be tested without the actual hardware attached.

Right now the prototype can produce adjustable analog outputs ranging from 3.3 V up to around 12 V, which opens the door to simulating a surprising number of automotive and industrial signals.

What started as a quick internal tool is slowly turning into a broader question: what kinds of sensors would actually be useful to emulate?

Automotive systems alone cover a huge range:

- Pressure sensors
- Throttle position sensors
- Temperature senders
- Fuel level sensors
- MAP / MAF style outputs
- Variable resistance sensors
- 0–5 V analog industrial sensors

There's also the question of how "real" it should behave.

Should it just output fixed voltages?
Should it generate changing waveforms and noisy signals?
Should it emulate sensor faults intentionally for diagnostics testing?

Part of me wants to keep it simple and reliable. Another part keeps sketching features that would turn it into a general-purpose automotive development tool.

I suspect there are plenty of niche debugging tools that don't exist simply because nobody bothered building them.

If you work on ECUs, industrial controls or embedded systems and have thoughts on what sensors are most annoying to test without real hardware attached, I'd genuinely like to hear about it.

This one may end up becoming something larger than originally planned.

— Odderon Lab