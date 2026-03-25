import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  // Day/Night — 3 min day (t=0.2→0.8) + 3 min night = 6 min full cycle
  timeOfDay: 0.25,
  daySpeed: 1 / 360,
  tickTime: (delta) => set(state => {
    const next = (state.timeOfDay + state.daySpeed * delta) % 1
    return { timeOfDay: next }
  }),

  // Skin
  selectedSkin: 'default',
  setSkin: (id) => set({ selectedSkin: id }),

  // Health
  health: 100,
  maxHealth: 100,
  isAlive: true,
  takeDamage: (dmg) => set(state => {
    const next = Math.max(0, state.health - dmg)
    return { health: next, isAlive: next > 0 }
  }),
  heal: (amount) => set(state => ({
    health: Math.min(state.maxHealth, state.health + amount)
  })),
  respawn: () => set({ health: 100, isAlive: true }),

  // Ammo & Gun
  ammo: 30,
  maxAmmo: 30,
  gunUnlocked: true,
  addAmmo: (count) => set(state => ({ ammo: Math.min(state.maxAmmo + count, state.ammo + count), maxAmmo: state.maxAmmo + count })),
  useAmmo: () => set(state => state.ammo > 0 ? { ammo: state.ammo - 1 } : {}),

  // Weather
  weather: 'clear', // 'clear' | 'rain' | 'fog'
  weatherTimer: 60, // seconds until weather changes
  tickWeather: (delta) => set(state => {
    const nextTimer = state.weatherTimer - delta
    if (nextTimer <= 0) {
      const weathers = ['clear', 'clear', 'rain', 'fog']
      const next = weathers[Math.floor(Math.random() * weathers.length)]
      return { weather: next, weatherTimer: 40 + Math.random() * 60 }
    }
    return { weatherTimer: nextTimer }
  }),

  // Score
  score: 0,
  addScore: (n) => set(state => ({ score: state.score + n })),

  // Inventory
  inventory: { wood: 5, stone: 5, grass: 5, dirt: 5, glass: 2 },
  addToInventory: (type, count = 1) => set(state => ({
    inventory: { ...state.inventory, [type]: (state.inventory[type] || 0) + count }
  })),

  // Crafting recipes
  craft: (recipe) => {
    const state = get()
    const recipes = {
      glass: { sand: 2 },
    }
    // placeholder — returns true if crafted
    return false
  }
}))
