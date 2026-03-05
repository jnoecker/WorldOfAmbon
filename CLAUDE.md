# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

World of Ambon is a JRPG-style game client built with **Tauri 2 (Rust) + React 19 + TypeScript + PixiJS 8**. It connects to the AmbonMUD server via WebSocket and renders structured game data received over the GMCP (Generic MUD Communication Protocol).

This is a **greenfield project** — the README.md contains the architectural plan; implementation follows the phased approach defined there.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Shell | Tauri 2 (Rust) |
| UI | React 19 + TypeScript |
| Rendering | PixiJS 8 (2D WebGL/WebGPU) |
| State | Zustand |
| Styling | Tailwind CSS 4 |
| Audio | Howler.js |
| Build | Vite 6 |

## Build & Development Commands

Package manager: **bun**

```bash
# Install dependencies
bun install

# Development (web only, serves on http://localhost:1420)
bun run dev

# Development (with Tauri native window)
bun run tauri:dev

# Build for production (Tauri bundle)
bun run tauri:build

# Type check
bunx tsc --noEmit

# Lint
bun run lint
```

## Architecture

### Canvas/React Split

- **React** handles all UI panels (vitals, inventory, chat, quests) — standard DOM elements styled with Tailwind
- **PixiJS** handles the game canvas (world view, battle scene, VFX) — WebGL-rendered sprites
- Both read from the same Zustand store
- Canvas is a single `<canvas>` element managed by PixiJS; React panels overlay/surround it

### Data Flow

```
WebSocket frame
  -> GmcpParser.parse(frame)
  -> GmcpDispatcher.dispatch(package, data)
  -> Zustand store slice update
  -> React re-renders subscribed components
  -> PixiJS reads store for canvas updates
```

### GMCP Protocol

The client connects to the MUD server's `/ws` endpoint. GMCP messages use a JSON envelope:
```json
{"gmcp":"<Package.Name>","data":<json-value>}
```
Plain text MUD output arrives as bare text frames. WebSocket clients are auto-subscribed to the core package set on connect — no `Core.Supports.Set` required.

See `docs/mud-docs/GMCP_PROTOCOL.md` for the full protocol reference including all package payloads and timing.

### State Architecture

GMCP packages map 1:1 to Zustand store slices. The dispatcher routes each package to the appropriate slice update. React components subscribe to specific slices for minimal re-renders.

Key slices: vitals, room, combat, stats, inventory, skills, quests, chat, group.

## Design System: "Surreal Gentle Magic"

The visual style is defined in `docs/STYLE_GUIDE.md`. Key rules:

- **Dark mode only** — light text on dark surfaces throughout
- **No neon, no pure black (#000), no saturated primaries** — use the approved palette
- **Never hardcode colors** — always use CSS variables from the design token system
- **Animate only `transform` and `opacity`** for performance
- **Soft shadows, gentle curves, ambient diffused lighting** — nothing sharp unless narratively intentional
- **WCAG AA minimum** (4.5:1 contrast) for text on panel surfaces
- Fonts: `Cormorant Garamond` (display), `Nunito Sans` (UI body), `JetBrains Mono` (terminal/code)

## Key Reference Documentation

- `README.md` — Full architectural plan, module structure, GMCP package reference, phase breakdown
- `docs/STYLE_GUIDE.md` — Complete design system with color tokens, typography, animation, component specs
- `docs/mud-docs/GMCP_PROTOCOL.md` — Wire protocol, all package payloads, send triggers, timing
- `docs/mud-docs/ARCHITECTURE.md` — MUD server architecture (useful for understanding the server side)
- `docs/mud-docs/DEVELOPER_GUIDE.md` — MUD server developer guide (server-side reference)

## MUD Server Connection

- WebSocket endpoint: `/ws`
- Default local server: `http://localhost:8080/ws`
- Live demo server: `wss://mud.ambon.dev/ws`
- Telnet (for reference): port 4000
- GMCP batched packages arrive at 100ms tick rate; some packages are immediate
