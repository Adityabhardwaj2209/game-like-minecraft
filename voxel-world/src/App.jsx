import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { PCFShadowMap, ACESFilmicToneMapping } from 'three'
import { Player } from './components/Player.jsx'
import { Cubes } from './components/Cubes.jsx'
import { Hotbar } from './components/Hotbar.jsx'
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
import { TransportSystem, TransportHUD } from './components/TransportSystem.jsx'
import { StoryDirector } from './components/StoryDirector.jsx'
import { StoryCinematics } from './components/StoryCinematics.jsx'
import { Roads } from './components/Roads.jsx'
import { PlayerNameInput, PlayerNameDisplay } from './components/PlayerNameInput.jsx'
import { ImprovedNPCSystem } from './components/ImprovedNPCSystem.jsx'
import { QuickSetup, OneClickInstall } from './components/QuickSetup.jsx'
// Temporarily disabled imports to fix blue screen
// import { BusSystem } from './components/BusSystem.jsx'
// import { AirportSystem } from './components/AirportSystem.jsx'
// import { WaterTransport } from './components/WaterTransport.jsx'
// import { Buildings } from './components/Buildings.jsx'
// import { HospitalSystem } from './components/HospitalSystem.jsx'
// import { TrafficSystem } from './components/TrafficSystem.jsx'
// Temporarily disabled imports to fix blue screen
// import { StreetLighting } from './components/StreetLighting.jsx'
// import { PlayerNarration, PlayerHealth } from './components/PlayerNarration.jsx'
// import { BeachSystem } from './components/BeachSystem.jsx'
// import { FoodVendorSystem } from './components/FoodVendorSystem.jsx'
// import { PlayerVehicleSystem } from './components/PlayerVehicleSystem.jsx'
// import { CompanionSystem } from './components/CompanionSystem.jsx'

function App() {
  const { particles, setParticles, spawnParticles } = useParticles()
  const [drops, setDrops] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [nameSubmitted, setNameSubmitted] = useState(false)
  const [showOneClickInstall, setShowOneClickInstall] = useState(true)
  const [showQuickSetup, setShowQuickSetup] = useState(false)
  const isLowSpec =
    (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 4)

  const handleNameSubmit = (name) => {
    setPlayerName(name)
    setNameSubmitted(true)
  }

  const handleGameStart = () => {
    setGameStarted(true)
  }

  const handleQuickSetupComplete = (systemInfo) => {
    setShowQuickSetup(false)
    // Auto-generate a name if not provided
    if (!playerName) {
      setPlayerName('Player')
      setNameSubmitted(true)
    }
    setTimeout(() => {
      setGameStarted(true)
    }, 1000)
  }

  const handleOneClickInstall = () => {
    setShowOneClickInstall(false)
    setShowQuickSetup(true)
  }

  return (
    <>
      {/* One-Click Install Screen */}
      {showOneClickInstall && <OneClickInstall onInstall={handleOneClickInstall} />}
      
      {/* Quick Setup Process */}
      {showQuickSetup && <QuickSetup onComplete={handleQuickSetupComplete} />}
      
      {/* Original Name Input (fallback) */}
      {!nameSubmitted && !showOneClickInstall && !showQuickSetup && <PlayerNameInput onNameSubmit={handleNameSubmit} onStart={handleGameStart} />}
      
      {/* Start Screen */}
      {!gameStarted && nameSubmitted && !showOneClickInstall && !showQuickSetup && <StartScreen onStart={handleGameStart} />}
      
      {/* Player Name Display */}
      {gameStarted && nameSubmitted && <PlayerNameDisplay playerName={playerName} />}
      
      {/* Top-Left Controls */}
      <div style={{ position: 'absolute', top: 10, left: 170, color: 'white', zIndex: 10 }}>
        <h1 style={{ margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Voxel World</h1>
        <p style={{ margin: '2px 0', fontSize: 12, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>WASD: Move | Space: Jump | V: 3rd Person | 1-5: Block</p>
        <p style={{ margin: '2px 0', fontSize: 12, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Left Click: Destroy | Right Click: Build | 🌙 Beware of Night!</p>
      </div>

      {/* Crosshair */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 10, pointerEvents: 'none', mixBlendMode: 'difference' }}>+</div>
      
      <Hotbar />
      <Minimap />
      <HUD />
      <AmmoStore />
      <MissionHUD />
      <StoryDirector />
      <StoryCinematics />
      <TransportHUD />
      {/* Temporarily disabled to fix blue screen */}
      {/* <PlayerNarration />
      <PlayerHealth />
      <CompanionSystem /> */}

      <Canvas
        shadows
        dpr={isLowSpec ? [1, 1.2] : [1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: ACESFilmicToneMapping
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = PCFShadowMap
          gl.toneMappingExposure = 1.05
        }}
        camera={{ position: [0, 5, 10], fov: 60, near: 0.1, far: 220 }}
        onContextMenu={(e) => e.preventDefault()}
      >
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
        <TransportSystem />
        <Drops drops={drops} setDrops={setDrops} />
        <ParticleSystem particles={particles} setParticles={setParticles} />
        
        {/* Infrastructure Components */}
        <Roads />
        <ImprovedNPCSystem />
        {/* Temporarily disabled to fix blue screen */}
        {/* <StreetLighting />
        <TrafficSystem />
        <PlayerVehicleSystem />
        <BusSystem />
        <AirportSystem />
        <WaterTransport />
        <Buildings />
        <HospitalSystem />
        <BeachSystem />
        <FoodVendorSystem /> */}

        {!isLowSpec && (
          <EffectComposer multisampling={2}>
            <Bloom intensity={0.14} luminanceThreshold={0.72} luminanceSmoothing={0.5} />
            <Vignette eskil={false} offset={0.2} darkness={0.35} />
          </EffectComposer>
        )}
      </Canvas>
    </>
  )
}

export default App
