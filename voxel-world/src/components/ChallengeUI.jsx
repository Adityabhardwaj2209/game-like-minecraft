import React, { useEffect } from 'react'
import { useChallenge, challenges } from '../store/useChallenge'
import { useStore } from '../store/useStore'

export function ChallengeUI() {
  const { currentChallengeIndex, showCelebration, completeChallenge, nextChallenge } = useChallenge()
  const cubes = useStore((state) => state.cubes)
  
  const currentChallenge = challenges[currentChallengeIndex]
  const isFinalChallenge = currentChallengeIndex === challenges.length - 1

  // Validate challenge progress whenever cubes change
  useEffect(() => {
    if (showCelebration) return
    const builtCubes = cubes.filter(c => c.built)
    if (currentChallenge.check(builtCubes)) {
      completeChallenge()
    }
  }, [cubes, currentChallenge, showCelebration, completeChallenge])

  return (
    <>
      {/* Challenge Tracker UI in Top Right */}
      <div style={{
        position: 'absolute', top: 20, right: 20, zIndex: 10,
        background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12,
        padding: '15px 20px', color: 'white', maxWidth: 300,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: 14, letterSpacing: 1, color: '#f39c12' }}>
          Objective {currentChallengeIndex + 1}/{challenges.length}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          {/* Isometric CSS Block Icon */}
          <div style={{
            width: 40, height: 40, position: 'relative', transformStyle: 'preserve-3d',
            transform: 'rotateX(-20deg) rotateY(-45deg)', flexShrink: 0
          }}>
            <div style={{ position: 'absolute', width: 20, height: 20, background: currentChallenge.color, border: '1px solid rgba(0,0,0,0.2)', transform: 'translateZ(10px)' }}></div>
            <div style={{ position: 'absolute', width: 20, height: 20, background: currentChallenge.color, border: '1px solid rgba(0,0,0,0.2)', transform: 'rotateY(90deg) translateZ(10px)', filter: 'brightness(0.8)' }}></div>
            <div style={{ position: 'absolute', width: 20, height: 20, background: currentChallenge.color, border: '1px solid rgba(0,0,0,0.2)', transform: 'rotateX(90deg) translateZ(10px)', filter: 'brightness(1.2)' }}></div>
          </div>
          
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: 18 }}>{currentChallenge.title}</h2>
            <p style={{ margin: 0, fontSize: 14, color: '#dcdde1' }}>{currentChallenge.description}</p>
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white', textAlign: 'center'
        }}>
          <h1 style={{ fontSize: 64, margin: '0 0 20px 0', color: '#f1c40f', textShadow: '0 0 20px rgba(241, 196, 15, 0.5)' }}>
            Challenge Complete!
          </h1>
          <p style={{ fontSize: 24, marginBottom: 40 }}>You completed: {currentChallenge.title}</p>
          
          {isFinalChallenge ? (
            <h2 style={{ color: '#2ecc71' }}>You are a Master Builder!</h2>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); nextChallenge() }}
              style={{
                background: '#3498db', border: 'none', padding: '15px 40px',
                color: 'white', fontSize: 20, borderRadius: 30, cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(52, 152, 219, 0.4)', fontWeight: 'bold'
              }}>
              Next Challenge
            </button>
          )}
        </div>
      )}
    </>
  )
}
