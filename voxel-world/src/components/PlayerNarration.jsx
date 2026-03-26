import { useState, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store/useStore'

const narrationLines = [
  "The city was breathing around me, each street light a watchful eye in the growing darkness.",
  "I walked these streets before, but tonight felt different. The air was thick with stories waiting to be told.",
  "Every corner held a memory, every shadow a possibility. This was my city, my curse, my home.",
  "The neon lights bled across the wet pavement, painting the town in shades of regret and hope.",
  "Another night in the concrete jungle. The buildings stood like tombstones to forgotten dreams.",
  "I could hear the city's heartbeat in the distant sirens and the murmur of traffic.",
  "The rain hadn't started yet, but you could feel it coming - like trouble always does.",
  "Sometimes I wonder if the city remembers me, or if I'm just another ghost haunting its streets.",
  "The night was young, but I felt old. So very old.",
  "In this town, everyone's running from something. Me? I'm running from myself.",
  "The street lights cast long shadows, and mine was the longest of them all.",
  "Another day, another dollar. Another soul lost in the urban maze.",
  "The city never sleeps, and neither do I. Not really.",
  "I've seen things in these streets that would make your blood run cold.",
  "Tonight, the city felt like a loaded gun, and I was the trigger."
]

export const PlayerNarration = () => {
  const [currentNarration, setCurrentNarration] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [narrationIndex, setNarrationIndex] = useState(0)
  const lastNarrationTime = useRef(0)
  const playerPosition = useRef([0, 0, 0])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const { playerPos } = useStore.getState()
    
    // Check if player moved significantly
    const distance = Math.sqrt(
      Math.pow(playerPos[0] - playerPosition.current[0], 2) +
      Math.pow(playerPos[2] - playerPosition.current[2], 2)
    )
    
    // Trigger narration based on movement or time
    if (time - lastNarrationTime.current > 15 || distance > 20) {
      if (!isVisible) {
        const randomIndex = Math.floor(Math.random() * narrationLines.length)
        setCurrentNarration(narrationLines[randomIndex])
        setIsVisible(true)
        lastNarrationTime.current = time
        playerPosition.current = [...playerPos]
        
        // Hide after 5 seconds
        setTimeout(() => {
          setIsVisible(false)
        }, 5000)
      }
    }
  })

  if (!isVisible) return null

  return (
    <div style={{
      position: 'absolute',
      top: '60%',
      left: '50%',
      transform: 'translateX(-50%)',
      color: '#ffffff',
      fontSize: '18px',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'italic',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      maxWidth: '600px',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: '5px',
      border: '1px solid rgba(255,255,255,0.2)',
      zIndex: 100,
      animation: 'fadeIn 0.5s ease-in',
      pointerEvents: 'none'
    }}>
      {currentNarration}
    </div>
  )
}

export const PlayerHealth = () => {
  const [health, setHealth] = useState(100)
  const [hunger, setHunger] = useState(80)

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      color: '#ffffff',
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
      zIndex: 100,
      pointerEvents: 'none'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <span style={{ color: '#ff4444' }}>❤️ Health: {health}%</span>
      </div>
      <div>
        <span style={{ color: '#ffaa00' }}>🍔 Hunger: {hunger}%</span>
      </div>
    </div>
  )
}
