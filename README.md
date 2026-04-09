# Popover → Modal Demo

A minimal Angular demo showing how to smoothly transition a **popover** (anchored to a trigger element) into a **centered modal** — and back — using a single CDK Overlay instance.

[**Live Demo on StackBlitz →**](https://stackblitz.com/github/vinceang/popover-modal-demo)

![Angular](https://img.shields.io/badge/Angular-21-dd0031?logo=angular)
![CDK Overlay](https://img.shields.io/badge/CDK-Overlay-3f51b5)

---

## The Problem

Many UIs need a detail panel that starts small (a popover attached to a row or button) and can expand into a full modal for more content. Naively, this means destroying one overlay and creating another — which causes flickers, lost state, and jarring jumps.

**Goal:** Keep a single overlay alive and animate it between two layout modes:

| Mode | Position Strategy | Backdrop |
|---|---|---|
| **Popover** | `FlexibleConnectedPositionStrategy` — anchored below (or above) the trigger element | Transparent / no backdrop |
| **Modal** | `GlobalPositionStrategy` — centered on the viewport | Semi-transparent backdrop |

---

## Strategy & Approach

### 1. Single Overlay, Swapped Position Strategies

Instead of tearing down and recreating overlays, the `PopoverModalService` holds one `OverlayRef` and calls `updatePositionStrategy()` to switch between connected (popover) and global (modal) positioning at runtime. This preserves component state and enables CSS transitions.

### 2. Angular CDK Overlay

The entire overlay lifecycle — positioning, backdrop, scroll handling, and portal attachment — is managed by `@angular/cdk/overlay`. No third-party modal or tooltip libraries are needed.

Key CDK features used:
- **`FlexibleConnectedPositionStrategy`** — positions the popover relative to the clicked table row, with preferred/fallback anchor points and viewport margin.
- **`GlobalPositionStrategy`** — centers the expanded modal on screen.
- **`ComponentPortal`** — dynamically attaches the `DetailOverlayComponent` into the overlay.
- **`OverlayRef.updatePositionStrategy()`** — hot-swaps the strategy without disposing the overlay.
- **Backdrop classes** — toggled between `popover-backdrop-hidden` (transparent, no pointer events) and `popover-backdrop-visible` (dimmed) to animate the backdrop in/out.

### 3. CSS Transitions & Animations

The overlay pane (`.popover-overlay-pane`) uses CSS `transition` on `transform`, `width`, and `height` so the CDK's repositioning animates smoothly. `scaleUp` / `scaleDown` keyframe animations add a subtle zoom effect on expand and collapse.

### 4. Component Design

| File | Responsibility |
|---|---|
| `PopoverModalService` | Creates the overlay, wires up expand/collapse/close, swaps position strategies |
| `DetailOverlayComponent` | Pure presentation — receives a `Person` input, emits expand/collapse/close events |
| `App` | Renders the data table, passes the clicked row's `ElementRef` to the service |

The overlay component has **no knowledge** of CDK overlays — it just emits events. All orchestration lives in the service.

---

## Assumptions

- **Desktop-first** — the popover positioning and expand animation are tuned for desktop viewports. Mobile would need a bottom-sheet variant.
- **Single overlay at a time** — opening a new popover closes the previous one.
- **No routing** — the modal doesn't have its own route. Pressing back won't close it.
- **Static data** — the `PEOPLE` array is hardcoded. In a real app this would come from an API.

---

## Tech Stack

| | |
|---|---|
| **Framework** | Angular 21 (standalone-ready components) |
| **Overlay system** | `@angular/cdk/overlay` + `@angular/cdk/portal` |
| **Styling** | SCSS, CDK overlay prebuilt CSS |
| **Build** | Angular CLI |

---

## Getting Started

```bash
# Clone
git clone https://github.com/vinceang/popover-modal-demo.git
cd popover-modal-demo

# Install
npm install

# Run
ng serve
```

Open [http://localhost:4200](http://localhost:4200). Click any table row to open the popover, then hit the expand icon to promote it to a modal.

---

## Project Structure

```
src/app/
├── app.ts / app.html / app.scss      # Root component — data table
├── data.ts                            # Person interface & sample data
├── popover-modal.service.ts           # Overlay orchestration service
└── detail-overlay/
    ├── detail-overlay.component.ts    # Overlay presentation component
    ├── detail-overlay.component.html
    └── detail-overlay.component.scss
```

---

## How It Works (Step by Step)

1. User clicks a table row → `App` passes the row's `ElementRef` and `Person` data to `PopoverModalService.open()`.
2. The service creates an overlay with a **connected position strategy** anchored to that row.
3. A `DetailOverlayComponent` is attached via `ComponentPortal`. It shows basic info (name, role, email, department).
4. User clicks the **expand** button → the component emits `onExpand`.
5. The service swaps to a **global centered position strategy**, adds the `expanded` CSS class, and reveals the backdrop. CSS transitions animate the movement.
6. The component now shows additional fields (location, bio).
7. User clicks **shrink** → the service swaps back to the connected strategy, hides the backdrop, and plays the collapse animation.
8. User clicks **close** or the backdrop → `OverlayRef.dispose()` tears everything down.
