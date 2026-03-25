import { create } from 'zustand'

export const MISSIONS = [
  {
    id: 'destroy_base',
    title: '💣 Destroy the Enemy Base',
    description: 'Blow up the enemy stone fortress to the north!',
    hint: 'Head north. Watch the minimap for the red marker.',
    reward: 300,
    type: 'destroy_base',
    target: 'base_blocks',
    required: 20, // destroy 20 enemy blocks
    current: 0,
  },
  {
    id: 'kill_5',
    title: '☠️ Skeleton Hunter',
    description: 'Survive the night and kill 5 skeletons.',
    hint: 'Equip your gun and wait for nightfall!',
    reward: 150,
    type: 'kill',
    required: 5,
    current: 0,
  },
  {
    id: 'build_wall',
    title: '🧱 Fortify Your Base',
    description: 'Build a defensive wall of 10 Stone blocks.',
    hint: 'Switch to Stone and right-click to place blocks.',
    reward: 120,
    type: 'build',
    blockType: 'stone',
    required: 10,
    current: 0,
  },
  {
    id: 'survive_night',
    title: '🌙 Night Survivor',
    description: 'Survive a full night with at least 50 HP remaining.',
    hint: 'Stay away from skeletons or kill them!',
    reward: 200,
    type: 'survive',
    required: 1,
    current: 0,
  },
  {
    id: 'kill_10',
    title: '💀 Skeleton King Slayer',
    description: 'Kill 10 skeletons in total.',
    hint: 'Restock ammo at the Ammo Store between nights.',
    reward: 500,
    type: 'kill',
    required: 10,
    current: 0,
  },
]

export const useMissionStore = create((set, get) => ({
  activeMissionIdx: 0,
  missions: MISSIONS.map(m => ({ ...m })),
  completed: [],
  
  getMission: () => {
    const state = get()
    return state.missions[state.activeMissionIdx] || null
  },

  progress: (type, amount = 1) => set(state => {
    const missions = [...state.missions]
    const mission = missions[state.activeMissionIdx]
    if (!mission || mission.type !== type) return {}
    
    mission.current = Math.min(mission.required, mission.current + amount)
    return { missions }
  }),

  completeMission: () => set(state => {
    const missions = [...state.missions]
    const mission = missions[state.activeMissionIdx]
    if (!mission) return {}
    const nextIdx = Math.min(state.activeMissionIdx + 1, missions.length - 1)
    return {
      completed: [...state.completed, mission.id],
      activeMissionIdx: nextIdx,
      missions
    }
  }),

  isCurrentComplete: () => {
    const state = get()
    const mission = state.missions[state.activeMissionIdx]
    return mission && mission.current >= mission.required
  }
}))
