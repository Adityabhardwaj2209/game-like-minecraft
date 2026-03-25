import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, SSAO } from '@react-three/postprocessing'
import { Player } from './components/Player.jsx'
import { Cubes } from './components/Cubes.jsx'
import { Hotbar } from './components/Hotbar.jsx'
import { ChallengeUI } from './components/ChallengeUI.jsx'
import { Minimap } from './components/Minimap.jsx'
import { NPCs } from './components/NPCs.jsx'
import { DayNightCycle } from './components/DayNightCycle.jsx'
import { Weather } from './components/Weather.jsx'
import { Enemies } from './components/Enemies.jsx'
import { HUD } from './components/HUD.jsx'
import { Farming } from './components/Farming.jsx'
import { ParticleSystem, useParticles } from './components/Particles.jsx'
import { BulletSystem } from './components/BulletSystem.jsx'
import { AmmoStore } from './components/AmmoStore.jsx'
import { EnemyBase } from './components/EnemyBase.jsx'
import { MissionHUD } from './components/MissionHUD.jsx'
import { Drops } from './components/Drops.jsx'
import { StartScreen } from './components/StartScreen.jsx'

function App() {
  const { particles, setParticles, spawnParticles } = useParticles()
  const [drops, setDrops] = useState([])
  const [gameStarted, setGameStarted] = useState(false)

  return (
    <>
      {!gameStarted && <StartScreen onStart={() => setGameStarted(true)} />}
      {/* Top-Left Controls */}
      <div style={{ position: 'absolute', top: 10, left: 170, color: 'white', zIndex: 10 }}>
        <h1 style={{ margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Voxel World</h1>
        <p style={{ margin: '2px 0', fontSize: 12, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>WASD: Move | Space: Jump | V: 3rd Person | 1-5: Block</p>
        <p style={{ margin: '2px 0', fontSize: 12, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Left Click: Destroy | Right Click: Build | 🌙 Beware of Night!</p>
      </div>

      {/* Crosshair */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 10, pointerEvents: 'none', mixBlendMode: 'difference' }}>+</div>
      
      <Hotbar />
      <ChallengeUI />
      <Minimap />
      <HUD />
      <AmmoStore />
      <MissionHUD />

      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }} onContextMenu={(e) => e.preventDefault()}>
        <fog attach="fog" args={['#87CEEB', 15, 50]} />

        <DayNightCycle />
        <Weather />
        <Player onBlockBreak={spawnParticles} />
        <NPCs />
        <Enemies />
        <BulletSystem />
        <Cubes />
        <EnemyBase position={[20, 0, 20]} />
        <EnemyBase position={[-25, 0, 10]} />
        <Farming />
        <Drops drops={drops} setDrops={setDrops} />
        <ParticleSystem particles={particles} setParticles={setParticles} />

        <EffectComposer multisampling={0}>
          <SSAO samples={21} radius={0.15} intensity={15} luminanceInfluence={0.6} color="black" />
        </EffectComposer>
      </Canvas>
    </>
  )
}

export default App
