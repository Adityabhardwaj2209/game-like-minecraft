import { useState } from 'react'

export const GameSetup = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [systemInfo, setSystemInfo] = useState({
    os: '',
    browser: '',
    specs: '',
    recommended: false
  })
  const [installProgress, setInstallProgress] = useState(0)
  const [isInstalling, setIsInstalling] = useState(false)

  const totalSteps = 4

  const detectSystem = () => {
    // Detect OS
    let os = 'Unknown'
    if (navigator.userAgent.indexOf('Win') !== -1) os = 'Windows'
    else if (navigator.userAgent.indexOf('Mac') !== -1) os = 'macOS'
    else if (navigator.userAgent.indexOf('Linux') !== -1) os = 'Linux'
    else if (navigator.userAgent.indexOf('Android') !== -1) os = 'Android'

    // Detect browser
    let browser = 'Unknown'
    if (navigator.userAgent.indexOf('Chrome') !== -1) browser = 'Chrome'
    else if (navigator.userAgent.indexOf('Firefox') !== -1) browser = 'Firefox'
    else if (navigator.userAgent.indexOf('Safari') !== -1) browser = 'Safari'
    else if (navigator.userAgent.indexOf('Edge') !== -1) browser = 'Edge'

    // Detect system specs
    const cores = navigator.hardwareConcurrency || 'Unknown'
    const memory = navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown'
    const specs = `${cores} cores, ${memory} RAM`

    // Check if recommended
    const recommended = (
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 4) &&
      (navigator.deviceMemory && navigator.deviceMemory >= 4)
    )

    setSystemInfo({ os, browser, specs, recommended })
  }

  const startInstallation = () => {
    setIsInstalling(true)
    setInstallProgress(0)

    const installSteps = [
      { step: 'Checking system requirements...', duration: 1000 },
      { step: 'Downloading game assets...', duration: 2000 },
      { step: 'Installing game engine...', duration: 1500 },
      { step: 'Configuring game settings...', duration: 1000 },
      { step: 'Finalizing installation...', duration: 500 }
    ]

    let currentProgress = 0
    installSteps.forEach((installStep, index) => {
      setTimeout(() => {
        currentProgress = ((index + 1) / installSteps.length) * 100
        setInstallProgress(currentProgress)
        
        if (index === installSteps.length - 1) {
          setTimeout(() => {
            setIsInstalling(false)
            onComplete()
          }, 500)
        }
      }, installStep.duration)
    })
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  useState(() => {
    detectSystem()
  }, [])

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ color: '#3498db', marginBottom: '20px' }}>Welcome to Voxel World Setup</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
              This setup wizard will guide you through installing and configuring Voxel World for optimal performance.
            </p>
            <button
              onClick={nextStep}
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Next
            </button>
          </div>
        )
      
      case 2:
        return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ color: '#3498db', marginBottom: '20px' }}>System Information</h2>
            <div style={{
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <p><strong>Operating System:</strong> {systemInfo.os}</p>
              <p><strong>Browser:</strong> {systemInfo.browser}</p>
              <p><strong>System Specs:</strong> {systemInfo.specs}</p>
              <p><strong>Recommended Specs:</strong> 
                <span style={{ color: systemInfo.recommended ? '#27ae60' : '#e74c3c' }}>
                  {systemInfo.recommended ? '✅ Meets Requirements' : '⚠️ Below Recommended'}
                </span>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={prevStep}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
                onClick={nextStep}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ color: '#3498db', marginBottom: '20px' }}>Game Settings</h2>
            <div style={{
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <h3 style={{ marginBottom: '15px' }}>Recommended Settings</h3>
              <p><strong>Graphics Quality:</strong> {systemInfo.recommended ? 'High' : 'Medium'}</p>
              <p><strong>Render Distance:</strong> {systemInfo.recommended ? 'Far' : 'Medium'}</p>
              <p><strong>Shadows:</strong> {systemInfo.recommended ? 'Enabled' : 'Disabled'}</p>
              <p><strong>Anti-Aliasing:</strong> {systemInfo.recommended ? '4x' : '2x'}</p>
              <p><strong>Texture Quality:</strong> {systemInfo.recommended ? 'High' : 'Medium'}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={prevStep}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
                onClick={nextStep}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ color: '#3498db', marginBottom: '20px' }}>Ready to Install</h2>
            <div style={{
              backgroundColor: 'rgba(39, 174, 96, 0.1)',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '16px', marginBottom: '15px' }}>
                🎮 Voxel World is ready to be installed!
              </p>
              <p style={{ fontSize: '14px', color: '#7f8c8d' }}>
                Click "Install Game" to begin the installation process.
              </p>
            </div>
            
            {!isInstalling ? (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#27ae60', marginBottom: '15px' }}>Installing...</h3>
                <div style={{
                  width: '300px',
                  height: '20px',
                  backgroundColor: '#ecf0f1',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  margin: '0 auto'
                }}>
                  <div style={{
                    width: `${installProgress}%`,
                    height: '100%',
                    backgroundColor: '#27ae60',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '10px' }}>
                  {installProgress}% Complete
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={prevStep}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  onClick={startInstallation}
                  style={{
                    padding: '12px 30px',
                    fontSize: '16px',
                    backgroundColor: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Install Game
                </button>
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '600px',
        width: '90%',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #ecf0f1',
          paddingBottom: '10px'
        }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Voxel World Setup</h1>
          <div style={{ display: 'flex', gap: '5px' }}>
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: index + 1 <= currentStep ? '#3498db' : '#bdc3c7'
                }}
              />
            ))}
          </div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  )
}

export const InstallationComplete = ({ onPlay }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
        <h1 style={{ margin: 0, color: '#27ae60', marginBottom: '15px' }}>
          Installation Complete!
        </h1>
        <p style={{ fontSize: '16px', color: '#7f8c8d', marginBottom: '25px' }}>
          Voxel World has been successfully installed and is ready to play.
        </p>
        <button
          onClick={onPlay}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#229954'
            e.target.style.transform = 'scale(1.05)'
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#27ae60'
            e.target.style.transform = 'scale(1)'
          }}
        >
          Play Game
        </button>
      </div>
    </div>
  )
}
