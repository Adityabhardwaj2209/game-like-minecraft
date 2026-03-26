import { useEffect, useRef } from 'react'
import { useMissionStore } from '../store/useMissionStore'
import { useGameStore } from '../store/useGameStore'

const MissionBadge = ({ mission }) => {
  const pct = (mission.current / mission.required) * 100
  return (
    <div style={{
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 200, 50, 0.35)', borderRadius: 12,
      padding: '12px 16px', color: 'white', minWidth: 260
    }}>
      {/* Title */}
      {mission.chapter && (
        <div style={{ fontSize: 11, color: '#8ec5ff', marginBottom: 4, letterSpacing: 0.4 }}>
          {mission.chapter}
        </div>
      )}
      <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 0.5, color: '#f1c40f', marginBottom: 4 }}>
        {mission.title}
      </div>
      {/* Description */}
      <div style={{ fontSize: 12, color: '#ccc', marginBottom: 8 }}>{mission.description}</div>
      {/* Progress bar */}
      <div style={{ background: '#333', borderRadius: 4, height: 7, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: 'linear-gradient(90deg, #f39c12, #e74c3c)',
          transition: 'width 0.4s ease'
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 4, color: '#bbb' }}>
        <span>{mission.hint}</span>
        <span>{mission.current}/{mission.required}</span>
      </div>
      {/* Reward */}
      <div style={{ marginTop: 8, fontSize: 12, color: '#2ecc71' }}>
        🎁 Reward: +{mission.reward} ⭐ Score
      </div>
    </div>
  )
}

export function MissionHUD() {
  const missions = useMissionStore(s => s.missions)
  const activeMissionIdx = useMissionStore(s => s.activeMissionIdx)
  const completed = useMissionStore(s => s.completed)
  const completeMission = useMissionStore(s => s.completeMission)
  const addScore = useGameStore(s => s.addScore)

  const mission = missions[activeMissionIdx]
  // Auto-complete detection
  useEffect(() => {
    if (!mission) return
    if (mission.current >= mission.required && !completed.includes(mission.id)) {
      addScore(mission.reward)
      completeMission()
    }
  }, [mission?.current])

  const allDone = activeMissionIdx >= missions.length - 1 && completed.length > 0

  return (
    <div style={{
      position: 'absolute', bottom: 180, right: 20, zIndex: 10,
      display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end'
    }}>
      {/* Label */}
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, textTransform: 'uppercase' }}>
        🎬 Story Mode
      </div>

      {mission && !allDone ? (
        <MissionBadge mission={mission} />
      ) : (
        <div style={{
          background: 'rgba(46,204,113,0.2)', border: '1px solid #2ecc71',
          borderRadius: 12, padding: '10px 16px', color: '#2ecc71', fontSize: 14
        }}>
          🏆 All missions complete!
        </div>
      )}

      {/* Completed list */}
      {completed.length > 0 && (
        <div style={{ fontSize: 11, color: '#2ecc71', textAlign: 'right', lineHeight: 1.6 }}>
          {completed.map(id => {
            const m = missions.find(x => x.id === id)
            return m ? <div key={id}>✅ {m.title.replace(/^\S+ /, '')}</div> : null
          })}
        </div>
      )}
    </div>
  )
}
