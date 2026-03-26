import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { useGameStore } from '../store/useGameStore'
import { useMissionStore } from '../store/useMissionStore'

// Watches world state and advances story objectives.
export function StoryDirector() {
  const playerPosRef = useStore(s => s.playerPosRef)
  const timeOfDay = useGameStore(s => s.timeOfDay)
  const health = useGameStore(s => s.health)
  const activeIsland = useGameStore(s => s.activeIsland)
  const lastTravelVehicle = useGameStore(s => s.lastTravelVehicle)
  const missions = useMissionStore(s => s.missions)
  const activeMissionIdx = useMissionStore(s => s.activeMissionIdx)
  const completed = useMissionStore(s => s.completed)
  const progress = useMissionStore(s => s.progress)

  const prevIslandRef = useRef(activeIsland)
  const prevNightRef = useRef(timeOfDay < 0.2 || timeOfDay > 0.8)
  const nightStartHealthRef = useRef(health)

  useEffect(() => {
    prevIslandRef.current = activeIsland
  }, [activeIsland])

  // Travel and vehicle-travel mission progress.
  useEffect(() => {
    const mission = missions[activeMissionIdx]
    if (!mission || completed.includes(mission.id)) return
    if (prevIslandRef.current === activeIsland) return

    if (mission.type === 'travel') {
      progress('travel', 1)
    }

    if (mission.type === 'vehicle_travel' && mission.requiredVehicle === lastTravelVehicle) {
      progress('vehicle_travel', 1)
    }
  }, [activeIsland, lastTravelVehicle, missions, activeMissionIdx, completed, progress])

  // Night survival objective.
  useEffect(() => {
    const mission = missions[activeMissionIdx]
    if (!mission || completed.includes(mission.id) || mission.type !== 'survive_night') return

    const isNight = timeOfDay < 0.2 || timeOfDay > 0.8
    const wasNight = prevNightRef.current

    if (!wasNight && isNight) {
      nightStartHealthRef.current = health
    }

    if (wasNight && !isNight) {
      const minHealth = mission.minHealth ?? 50
      if (health >= minHealth && nightStartHealthRef.current >= minHealth) {
        progress('survive_night', 1)
      }
    }

    prevNightRef.current = isNight
  }, [timeOfDay, health, missions, activeMissionIdx, completed, progress])

  // Optional location-based hooks for future missions.
  useEffect(() => {
    const interval = setInterval(() => {
      const mission = useMissionStore.getState().missions[useMissionStore.getState().activeMissionIdx]
      if (!mission || mission.type !== 'reach_point') return
      const [x, , z] = playerPosRef.current
      const [tx, tz] = mission.targetPoint || [0, 0]
      const radius = mission.radius ?? 5
      const dx = x - tx
      const dz = z - tz
      if (Math.sqrt(dx * dx + dz * dz) <= radius) {
        useMissionStore.getState().progress('reach_point', 1)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [playerPosRef])

  return null
}
