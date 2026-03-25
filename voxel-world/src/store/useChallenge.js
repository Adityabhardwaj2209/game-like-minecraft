import { create } from 'zustand'

export const challenges = [
  {
    id: 1,
    title: "The Carpenter",
    description: "Place 5 Wood blocks.",
    color: "#8B4513",
    check: (builtCubes) => builtCubes.filter(c => c.type === 'wood').length >= 5
  },
  {
    id: 2,
    title: "The Mason's Pillar",
    description: "Build a 3-block high Stone pillar.",
    color: "#808080",
    check: (builtCubes) => {
      const stoneCubes = builtCubes.filter(c => c.type === 'stone')
      const cols = {}
      stoneCubes.forEach(c => {
        const key = `${c.pos[0]},${c.pos[2]}`
        if(!cols[key]) cols[key] = []
        cols[key].push(c.pos[1])
      })
      for (const key in cols) {
        const heights = cols[key].sort((a,b)=>a-b)
        let consecutive = 1
        for (let i = 1; i < heights.length; i++) {
          if (heights[i] === heights[i-1] + 1) consecutive++
          else consecutive = 1
          if (consecutive >= 3) return true
        }
      }
      return false
    }
  },
  {
    id: 3,
    title: "The Glazier",
    description: "Place 4 Glass blocks to make a window.",
    color: "#ADD8E6",
    check: (builtCubes) => {
      const glass = builtCubes.filter(c => c.type === 'glass')
      return glass.length >= 4 
    }
  },
  {
    id: 4,
    title: "Master Architect",
    description: "Build a single structure containing 15 Wood, 5 Stone, and 4 Glass.",
    color: "#f1c40f",
    check: (builtCubes) => {
      const wood = builtCubes.filter(c => c.type === 'wood').length
      const stone = builtCubes.filter(c => c.type === 'stone').length
      const glass = builtCubes.filter(c => c.type === 'glass').length
      return wood >= 15 && stone >= 5 && glass >= 4
    }
  }
]

export const useChallenge = create((set) => ({
  currentChallengeIndex: 0,
  showCelebration: false,
  completeChallenge: () => set({ showCelebration: true }),
  nextChallenge: () => set((state) => ({
    currentChallengeIndex: Math.min(state.currentChallengeIndex + 1, challenges.length - 1),
    showCelebration: false,
  }))
}))
