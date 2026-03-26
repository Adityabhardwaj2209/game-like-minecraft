import { useState, useEffect } from 'react'

export const QuickSetup = ({ onComplete }) => {
  const [installStage, setInstallStage] = useState('initializing')
  const [progress, setProgress] = useState(0)
  const [systemInfo, setSystemInfo] = useState(null)
  const [isInstalling, setIsInstalling] = useState(false)

  const installStages = [
    { name: 'Initializing Setup...', duration: 800 },
    { name: 'Detecting System...', duration: 1200 },
    { name: 'Configuring Settings...', duration: 1000 },
    { name: 'Installing Game Engine...', duration: 1500 },
    { name: 'Loading Assets...', duration: 2000 },
    { name: 'Optimizing Performance...', duration: 1000 },
    { name: 'Finalizing...', duration: 500 }
  ]

  useEffect(() => {
    if (!isInstalling) return

    let currentStageIndex = 0
    let accumulatedProgress = 0

    const runInstallation = async () => {
      for (let i = 0; i < installStages.length; i++) {
        const stage = installStages[i]
        setInstallStage(stage.name)
        
        // Simulate installation progress
        const stageProgress = (100 / installStages.length)
        const stageStartProgress = accumulatedProgress
        
        for (let j = 0; j <= 100; j += 2) {
          await new Promise(resolve => setTimeout(resolve, stage.duration / 50))
          setProgress(stageStartProgress + (j * stageProgress / 100))
        }
        
        accumulatedProgress = stageStartProgress + stageProgress
        currentStageIndex = i
      }

      // Installation complete
      setInstallStage('Installation Complete!')
      setProgress(100)
      
      setTimeout(() => {
        onComplete(systemInfo)
      }, 1000)
    }

    // Detect system first
    detectSystem()
    setTimeout(() => {
      setIsInstalling(true)
      runInstallation()
    }, 500)
  }, [isInstalling])

  const detectSystem = () => {
    // Detect OS
    let os = 'Windows'
    if (navigator.userAgent.indexOf('Mac') !== -1) os = 'macOS'
    else if (navigator.userAgent.indexOf('Linux') !== -1) os = 'Linux'
    else if (navigator.userAgent.indexOf('Android') !== -1) os = 'Android'

    // Detect browser
    let browser = 'Chrome'
    if (navigator.userAgent.indexOf('Firefox') !== -1) browser = 'Firefox'
    else if (navigator.userAgent.indexOf('Safari') !== -1) browser = 'Safari'
    else if (navigator.userAgent.indexOf('Edge') !== -1) browser = 'Edge'

    // Detect specs
    const cores = navigator.hardwareConcurrency || 4
    const memory = navigator.deviceMemory || 4
    const specs = `${cores} cores, ${memory}GB RAM`

    setSystemInfo({ os, browser, specs, cores, memory })
  }

  const getProgressColor = () => {
    if (progress < 30) return '#e74c3c'
    if (progress < 60) return '#f39c12'
    if (progress < 90) return '#3498db'
    return '#27ae60'
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        textAlign: 'center'
      }}>
        {/* Game Logo */}
        <div style={{
          fontSize: '48px',
          marginBottom: '30px',
          background: 'linear-gradient(45deg, #3498db, #2980b9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold'
        }}>
          🎮 Voxel World
        </div>

        {/* Installation Status */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '10px',
            fontSize: '20px'
          }}>
            {installStage}
          </h2>
          
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#ecf0f1',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '15px'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: getProgressColor(),
              transition: 'width 0.3s ease',
              borderRadius: '4px'
            }} />
          </div>
          
          {/* Progress Percentage */}
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            {Math.round(progress)}%
          </div>
        </div>

        {/* System Info */}
        {systemInfo && (
          <div style={{
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'left',
            fontSize: '14px'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>
              🖥️ System Detected
            </h3>
            <div style={{ color: '#34495e', lineHeight: '1.6' }}>
              <p><strong>OS:</strong> {systemInfo.os}</p>
              <p><strong>Browser:</strong> {systemInfo.browser}</p>
              <p><strong>Hardware:</strong> {systemInfo.specs}</p>
              <p><strong>Status:</strong> 
                <span style={{ color: systemInfo.cores >= 4 && systemInfo.memory >= 4 ? '#27ae60' : '#f39c12' }}>
                  {systemInfo.cores >= 4 && systemInfo.memory >= 4 ? '✅ Ready for Ultra Settings' : '⚠️ Recommended Settings Applied'}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Installation Complete Message */}
        {progress === 100 && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: 'rgba(39, 174, 96, 0.1)',
            borderRadius: '10px'
          }}>
            <h3 style={{ color: '#27ae60', marginBottom: '10px' }}>
              🎉 Installation Complete!
            </h3>
            <p style={{ color: '#34495e', fontSize: '16px' }}>
              Voxel World is ready to play. Launching game...
            </p>
            <div style={{
              marginTop: '15px',
              fontSize: '14px',
              color: '#7f8c8d'
            }}>
              <p>🎮 Game will start automatically</p>
              <p>⚡ Optimized for your system</p>
              <p>🌟 All features enabled</p>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {progress < 100 && (
          <div style={{
            marginTop: '20px',
            fontSize: '24px',
            animation: 'pulse 1.5s infinite'
          }}>
            ⚙️ Installing...
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

export const OneClickInstall = ({ onInstall }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '60px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Main Title */}
        <h1 style={{
          fontSize: '48px',
          marginBottom: '20px',
          background: 'linear-gradient(45deg, #3498db, #2980b9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold',
          margin: 0
        }}>
          🎮 Voxel World
        </h1>

        {/* Install Button */}
        <div style={{ marginBottom: '30px' }}>
          <p style={{
            fontSize: '18px',
            color: '#34495e',
            marginBottom: '25px',
            lineHeight: '1.6'
          }}>
            Click the button below to install and configure Voxel World automatically.<br/>
            All settings will be optimized for your system.
          </p>
          
          <button
            onClick={onInstall}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              padding: '20px 60px',
              fontSize: '20px',
              fontWeight: 'bold',
              backgroundColor: isHovered ? '#2980b9' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isHovered ? '0 10px 30px rgba(52, 152, 219, 0.4)' : '0 5px 15px rgba(0, 0, 0, 0.2)'
            }}
          >
            🚀 One-Click Install
          </button>
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          textAlign: 'left',
          fontSize: '14px',
          color: '#34495e'
        }}>
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>⚡ Automatic</h4>
            <p>Detects your system automatically</p>
          </div>
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>🎯 Optimized</h4>
            <p>Configures optimal settings</p>
          </div>
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>🔧 All Features</h4>
            <p>Enables every game component</p>
          </div>
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>⚙️ Ready to Play</h4>
            <p>Instant game launch after install</p>
          </div>
        </div>

        {/* System Requirements Notice */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          borderRadius: '10px',
          fontSize: '12px',
          color: '#7f8c8d'
        }}>
          <strong>💡 Tip:</strong> This installer will automatically detect your system 
          specifications and configure Voxel World for the best performance.
        </div>
      </div>
    </div>
  )
}
