# Voxel World Story Mode

A voxel open-world survival/action game built with React + Vite + Three.js (`@react-three/fiber`).

This project now includes:
- Story campaign progression (multi-act missions)
- Island transport system (car, bus, train, airplane)
- Combat against night enemies
- Building/mining mechanics
- Cinematic mission intros with dialogue, typewriter effect, and skip support

## Tech Stack

- React
- Vite
- Three.js
- @react-three/fiber
- @react-three/drei
- Zustand (state management)
- Web Audio API (procedural SFX)

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

Open the local URL shown in terminal (usually `http://localhost:5173`).

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Game Controls

- `W A S D` - Move
- `Space` - Jump
- `V` - Toggle first/third person
- `Left Click` - Break block / shoot
- `Right Click` - Place block
- `1-5` - Select block type
- `Esc` - Unlock mouse
- `Enter` - Skip story cinematic

## Story Mode

Story objectives are shown in the mission HUD:
- Missions are grouped into acts/chapters
- Completing a mission advances to the next one automatically
- Rewards grant score
- Some objectives require specific travel vehicles (bus/train/airplane)
- Night survival missions check your health at dawn

## Island Transport

Use the transport panel to travel between islands:
- Select vehicle type: `car`, `bus`, `train`, `airplane`
- Go to an island terminal
- Pick destination
- Travel begins and you arrive at the destination spawn point

## Cinematic Intros

At each new mission:
- Letterbox cinematic overlay appears
- Mission dialogue plays with typewriter text + radio blips
- Objective hint appears before gameplay resumes
- Press `Enter` to skip

## Notes

- If port `5173` is busy, Vite will use another port (for example `5174`).
- Some Three.js deprecation/SSAO warnings can appear in console and do not block gameplay.
