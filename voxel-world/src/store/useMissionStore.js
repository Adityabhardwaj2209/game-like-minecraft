import { create } from 'zustand'

export const MISSIONS = [
  {
    id: 'chapter_1_intro',
    chapter: 'Act I - Streets of Block City',
    title: 'Mission 1: Make Your Name',
    description: 'Travel from Central Island to East Island and report for your first job.',
    hint: 'Use the Island Transport panel and pick any vehicle.',
    reward: 120,
    type: 'travel',
    required: 1,
    current: 0,
  },
  {
    id: 'chapter_1_heist_setup',
    chapter: 'Act I - Streets of Block City',
    title: 'Mission 2: Build the Hideout',
    description: 'Gather supplies and place 20 blocks to secure your crew safehouse.',
    hint: 'Mine blocks, then right-click to place them.',
    reward: 180,
    type: 'build',
    required: 20,
    current: 0,
  },
  {
    id: 'chapter_1_escape',
    chapter: 'Act I - Streets of Block City',
    title: 'Mission 3: Bus Route Escape',
    description: 'Use the bus line to move to West Island after the setup is done.',
    hint: 'Select bus, then travel from any terminal.',
    reward: 160,
    type: 'vehicle_travel',
    requiredVehicle: 'bus',
    required: 1,
    current: 0,
  },
  {
    id: 'chapter_2_noir',
    chapter: 'Act II - Bullet Time Night',
    title: 'Mission 4: Survive the Ambush',
    description: 'Make it through one full night with at least 50 HP, noir-style.',
    hint: 'Keep moving, use cover, and avoid close-range skeleton swarms.',
    reward: 260,
    type: 'survive_night',
    minHealth: 50,
    required: 1,
    current: 0,
  },
  {
    id: 'chapter_2_counterstrike',
    chapter: 'Act II - Bullet Time Night',
    title: 'Mission 5: Break Their Fortress',
    description: 'Destroy 35 enemy blocks around hostile territory.',
    hint: 'Use left click to demolish and keep checking the minimap.',
    reward: 340,
    type: 'destroy_base',
    required: 35,
    current: 0,
  },
  {
    id: 'chapter_3_island_run',
    chapter: 'Act III - Skyline to Frontier',
    title: 'Mission 6: Train to the Frontier',
    description: 'Ride the train to the North Island to start your final operation.',
    hint: 'Select train in transport, then choose a destination.',
    reward: 220,
    type: 'vehicle_travel',
    requiredVehicle: 'train',
    required: 1,
    current: 0,
  },
  {
    id: 'chapter_3_takeoff',
    chapter: 'Act III - Skyline to Frontier',
    title: 'Mission 7: Airplane Exfil',
    description: 'Use the airplane route once to establish your aerial corridor.',
    hint: 'Switch vehicle to airplane before traveling.',
    reward: 280,
    type: 'vehicle_travel',
    requiredVehicle: 'airplane',
    required: 1,
    current: 0,
  },
  {
    id: 'chapter_3_builder_king',
    chapter: 'Act III - Skyline to Frontier',
    title: 'Mission 8: Build a New World',
    description: 'Place 40 more blocks to rebuild the islands your own way.',
    hint: 'This is your Minecraft-style endgame objective.',
    reward: 500,
    type: 'build',
    required: 40,
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
