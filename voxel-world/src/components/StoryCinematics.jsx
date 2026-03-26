import { useEffect, useMemo, useRef, useState } from 'react'
import { useMissionStore } from '../store/useMissionStore'
import { useGameStore } from '../store/useGameStore'
import { resumeAudio, sounds } from '../utils/sounds'

const INTRO_DIALOG = {
  chapter_1_intro: [
    'Dispatch: Welcome to Block City. Make a name before night does.',
    'Handler: Reach East Island and meet the contact.',
    'You: Copy that. Rolling out.'
  ],
  chapter_1_heist_setup: [
    'Crew Lead: We need a hideout before this city burns.',
    'Crew Lead: Gather blocks and build defenses now.'
  ],
  chapter_1_escape: [
    'Spotter: Heat is rising. Bus route is your clean exit.',
    'You: Moving to extraction lane.'
  ],
  chapter_2_noir: [
    'Narrator: Night falls. Every shadow wants you dead.',
    'Handler: Survive until dawn with your edge intact.'
  ],
  chapter_2_counterstrike: [
    'Crew Lead: They hit first. Now we hit harder.',
    'You: Fortress goes down tonight.'
  ],
  chapter_3_island_run: [
    'Dispatch: Final act. Train line opens one shot.',
    'You: Heading north. No turning back.'
  ],
  chapter_3_takeoff: [
    'Tower: Air corridor ready. Wheels up when you are.',
    'You: Taking to the sky.'
  ],
  chapter_3_builder_king: [
    'Narrator: You fought for this world. Now rebuild it.',
    'You: One block at a time.'
  ]
}

export function StoryCinematics() {
  const missions = useMissionStore(s => s.missions)
  const activeMissionIdx = useMissionStore(s => s.activeMissionIdx)
  const gameStarted = missions.length > 0
  const setCinematicMode = useGameStore(s => s.setCinematicMode)

  const [active, setActive] = useState(false)
  const [lineIdx, setLineIdx] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [typedText, setTypedText] = useState('')
  const seenMissionsRef = useRef(new Set())
  const timeoutRefs = useRef([])
  const typeIntervalRef = useRef(null)

  const mission = missions[activeMissionIdx]
  const lines = useMemo(() => {
    if (!mission) return []
    return INTRO_DIALOG[mission.id] || [mission.description]
  }, [mission])

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout)
      timeoutRefs.current = []
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current)
      setCinematicMode(false)
    }
  }, [setCinematicMode])

  useEffect(() => {
    if (!active) return
    const text = lines[lineIdx] || ''
    let i = 0
    setTypedText('')
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current)

    typeIntervalRef.current = setInterval(() => {
      i += 1
      setTypedText(text.slice(0, i))
      if (i % 3 === 0) sounds.radioBlip()
      if (i >= text.length) {
        clearInterval(typeIntervalRef.current)
        typeIntervalRef.current = null
      }
    }, 18)

    return () => {
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current)
      typeIntervalRef.current = null
    }
  }, [lineIdx, lines, active])

  const endCinematic = () => {
    timeoutRefs.current.forEach(clearTimeout)
    timeoutRefs.current = []
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current)
    typeIntervalRef.current = null
    setActive(false)
    setShowHint(false)
    setTypedText('')
    setCinematicMode(false)
  }

  useEffect(() => {
    if (!gameStarted || !mission) return
    if (seenMissionsRef.current.has(mission.id)) return

    seenMissionsRef.current.add(mission.id)
    resumeAudio()
    sounds.radioBlip()
    setActive(true)
    setLineIdx(0)
    setShowHint(false)
    setTypedText('')
    setCinematicMode(true)

    timeoutRefs.current.forEach(clearTimeout)
    timeoutRefs.current = []

    lines.forEach((_, idx) => {
      timeoutRefs.current.push(setTimeout(() => setLineIdx(idx), 1400 + idx * 1800))
    })

    timeoutRefs.current.push(setTimeout(() => setShowHint(true), 1600 + lines.length * 1700))
    timeoutRefs.current.push(setTimeout(() => endCinematic(), 3900 + lines.length * 1700))
  }, [activeMissionIdx, mission, lines, gameStarted, setCinematicMode])

  useEffect(() => {
    if (!active) return
    const onKeyDown = (e) => {
      if (e.code === 'Enter') {
        endCinematic()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  if (!active || !mission) return null

  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 65, background: 'rgba(0,0,0,0.78)', zIndex: 75 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, background: 'rgba(0,0,0,0.78)', zIndex: 75 }} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 76,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            width: 'min(760px, 92vw)',
            background: 'rgba(6,8,12,0.7)',
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: 10,
            padding: '16px 20px',
            color: 'white',
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)'
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 1.2, color: '#8ec5ff', marginBottom: 4 }}>
            {mission.chapter}
          </div>
          <div style={{ fontSize: 21, fontWeight: 700, marginBottom: 10, color: '#f8e287' }}>
            {mission.title}
          </div>
          <div style={{ fontSize: 14, color: '#d8dee8', minHeight: 24 }}>
            {typedText}
          </div>
          {showHint && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#b4f0c2' }}>
              Objective: {mission.hint}
            </div>
          )}
          <div style={{ marginTop: 8, fontSize: 11, color: '#8fa1b3' }}>
            Press Enter to skip
          </div>
        </div>
      </div>
    </>
  )
}
