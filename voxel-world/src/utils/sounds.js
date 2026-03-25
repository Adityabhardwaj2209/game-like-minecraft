// Advanced Procedural Sound Engine — Realistic Web Audio API synthesis

let audioCtx = null

const getCtx = () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

export const resumeAudio = () => {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()
}

// --- Shared Reverb (convolver) ---
let reverbNode = null
const getReverb = () => {
  const ctx = getCtx()
  if (reverbNode) return reverbNode
  const sampleRate = ctx.sampleRate
  const length = sampleRate * 1.5
  const impulse = ctx.createBuffer(2, length, sampleRate)
  for (let c = 0; c < 2; c++) {
    const data = impulse.getChannelData(c)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5)
    }
  }
  reverbNode = ctx.createConvolver()
  reverbNode.buffer = impulse
  reverbNode.connect(ctx.destination)
  return reverbNode
}

// --- Compressor for loudness ---
let masterComp = null
const getMaster = () => {
  const ctx = getCtx()
  if (masterComp) return masterComp
  masterComp = ctx.createDynamicsCompressor()
  masterComp.threshold.value = -18
  masterComp.knee.value = 8
  masterComp.ratio.value = 4
  masterComp.attack.value = 0.003
  masterComp.release.value = 0.15
  masterComp.connect(ctx.destination)
  return masterComp
}

// --- Core helpers ---
const makeGain = (volume, dest) => {
  const ctx = getCtx()
  const g = ctx.createGain()
  g.gain.value = volume
  if (dest) g.connect(dest)
  return g
}

const envelope = (gainNode, attack, sustain, decay, peak = 1) => {
  const ctx = getCtx()
  const now = ctx.currentTime
  gainNode.gain.setValueAtTime(0, now)
  gainNode.gain.linearRampToValueAtTime(peak, now + attack)
  gainNode.gain.setValueAtTime(peak * sustain, now + attack + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay)
}

const noiseBuffer = (duration) => {
  const ctx = getCtx()
  const size = Math.ceil(ctx.sampleRate * duration)
  const buf = ctx.createBuffer(1, size, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1
  return buf
}

const playNoise = (dest, duration, filter, volume, { attack = 0, decay = duration, peak = 1 } = {}) => {
  const ctx = getCtx()
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(duration)

  const bq = ctx.createBiquadFilter()
  bq.type = filter.type
  bq.frequency.value = filter.freq
  if (filter.Q) bq.Q.value = filter.Q

  const gain = ctx.createGain()
  envelope(gain, attack, 0.7, decay, peak * volume)

  src.connect(bq)
  bq.connect(gain)
  gain.connect(dest)
  src.start()
  src.stop(ctx.currentTime + duration + 0.05)
}

const playOsc = (dest, freq, type, volume, { attack = 0.001, decay = 0.3, pitchDrop, detune = 0 } = {}) => {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  if (pitchDrop) osc.frequency.exponentialRampToValueAtTime(pitchDrop, ctx.currentTime + decay)
  osc.detune.value = detune

  const gain = ctx.createGain()
  envelope(gain, attack, 0.5, decay, volume)

  osc.connect(gain)
  gain.connect(dest)
  osc.start()
  osc.stop(ctx.currentTime + decay + 0.1)
}

// =============================================================
// SOUND LIBRARY
// =============================================================
export const sounds = {

  // Real-sounding gunshot: noise crack + bass thump + subtle reverb tail
  gunshot: () => {
    const ctx = getCtx()
    const master = getMaster()
    const reverb = getReverb()

    // Layer 1: High crack (noise transient)
    playNoise(master, 0.06, { type: 'highpass', freq: 2500 }, 0.8, { attack: 0, decay: 0.06, peak: 1 })

    // Layer 2: Mid body
    playNoise(master, 0.15, { type: 'bandpass', freq: 600, Q: 0.5 }, 0.5, { attack: 0, decay: 0.14 })

    // Layer 3: Bass boom (punch)
    playOsc(master, 120, 'sine', 0.6, { attack: 0.001, decay: 0.18, pitchDrop: 30 })

    // Layer 4: Reverb tail (quiet)
    playNoise(reverb, 0.3, { type: 'bandpass', freq: 800, Q: 0.8 }, 0.15, { attack: 0, decay: 0.28 })

    // Layer 5: Shell casing tick (tiny highpass transient with tiny delay)
    setTimeout(() => {
      playNoise(master, 0.04, { type: 'highpass', freq: 4000 }, 0.2, { decay: 0.04 })
    }, 120)
  },

  // Dry click for empty gun
  emptyClick: () => {
    const ctx = getCtx()
    const master = getMaster()
    playNoise(master, 0.03, { type: 'highpass', freq: 5000 }, 0.3, { decay: 0.03 })
    playOsc(master, 400, 'square', 0.1, { decay: 0.02 })
  },

  // Material-specific block break
  blockBreak: (type = 'grass') => {
    const ctx = getCtx()
    const master = getMaster()
    const configs = {
      grass:  { freq: 220, Q: 0.8, vol: 0.35, bass: 80,  dec: 0.18 },
      dirt:   { freq: 180, Q: 0.9, vol: 0.35, bass: 70,  dec: 0.18 },
      stone:  { freq: 700, Q: 1.5, vol: 0.5,  bass: 120, dec: 0.12 },
      wood:   { freq: 400, Q: 1.2, vol: 0.45, bass: 100, dec: 0.15 },
      glass:  { freq: 3000,Q: 3.0, vol: 0.6,  bass: 60,  dec: 0.22 },
      water:  { freq: 600, Q: 0.5, vol: 0.25, bass: 50,  dec: 0.2  },
      leaves: { freq: 300, Q: 0.6, vol: 0.3,  bass: 60,  dec: 0.16 },
    }
    const c = configs[type] || configs.stone
    playNoise(master, c.dec, { type: 'bandpass', freq: c.freq, Q: c.Q }, c.vol, { attack: 0, decay: c.dec })
    playOsc(master, c.bass, 'sine', 0.3, { attack: 0, decay: c.dec * 0.8, pitchDrop: c.bass * 0.3 })
  },

  // Soft but satisfying place thud
  blockPlace: () => {
    const master = getMaster()
    playNoise(master, 0.06, { type: 'bandpass', freq: 350, Q: 1 }, 0.25, { decay: 0.06 })
    playOsc(master, 180, 'sine', 0.2, { attack: 0, decay: 0.1, pitchDrop: 80 })
  },

  // Randomized footstep — slightly different each time
  footstep: () => {
    const master = getMaster()
    const f = 180 + Math.random() * 80
    playNoise(master, 0.08, { type: 'lowpass', freq: f, Q: 0.5 }, 0.18 + Math.random() * 0.06, { attack: 0, decay: 0.07 })
    playOsc(master, 60 + Math.random() * 20, 'sine', 0.12, { decay: 0.06 })
  },

  // Jump whoosh + slight impact prep
  jump: () => {
    const master = getMaster()
    // Whoosh up
    playOsc(master, 180, 'sine', 0.12, { attack: 0.01, decay: 0.14, pitchDrop: 400 })
    playNoise(master, 0.08, { type: 'bandpass', freq: 500, Q: 0.6 }, 0.08, { decay: 0.08 })
  },

  // Landing thud
  land: () => {
    const master = getMaster()
    playNoise(master, 0.12, { type: 'lowpass', freq: 300, Q: 0.8 }, 0.5, { decay: 0.12 })
    playOsc(master, 50, 'sine', 0.4, { attack: 0, decay: 0.18, pitchDrop: 20 })
  },

  // Enemy death: crunch + metallic rattle
  enemyDeath: () => {
    const master = getMaster()
    const reverb = getReverb()
    // Bone crunch
    playNoise(master, 0.12, { type: 'bandpass', freq: 900, Q: 2 }, 0.5, { decay: 0.12 })
    // Metal rattle
    playOsc(master, 800, 'sawtooth', 0.2, { attack: 0, decay: 0.2, pitchDrop: 200 })
    // Low groan
    playOsc(master, 80, 'sine', 0.35, { attack: 0.02, decay: 0.25, pitchDrop: 40 })
    // Reverb wash
    playNoise(reverb, 0.4, { type: 'bandpass', freq: 600 }, 0.1, { decay: 0.35 })
  },

  // Sparkly pickup chime
  itemPickup: () => {
    const master = getMaster()
    const freqs = [880, 1100, 1320]
    freqs.forEach((f, i) => {
      setTimeout(() => {
        playOsc(master, f, 'sine', 0.22, { attack: 0.005, decay: 0.18 })
        playOsc(master, f * 2, 'sine', 0.08, { attack: 0.005, decay: 0.12 })
      }, i * 60)
    })
  },

  // Epic mission complete fanfare
  missionComplete: () => {
    const master = getMaster()
    const reverb = getReverb()
    const melody = [523, 659, 784, 1047, 1319]
    melody.forEach((f, i) => {
      setTimeout(() => {
        playOsc(master, f, 'sine', 0.38, { attack: 0.01, decay: 0.3 })
        playOsc(master, f * 1.5, 'sine', 0.1, { attack: 0.005, decay: 0.25 })
        playOsc(reverb, f, 'sawtooth', 0.05, { attack: 0.02, decay: 0.4 })
      }, i * 100)
    })
  },

  // Gravelly player hurt grunt
  playerHurt: () => {
    const master = getMaster()
    // Distorted thud
    playNoise(master, 0.15, { type: 'lowpass', freq: 250, Q: 1 }, 0.6, { attack: 0, decay: 0.15, peak: 1 })
    // Low pitched groan oscillator
    playOsc(master, 90, 'sawtooth', 0.3, { attack: 0.005, decay: 0.22, pitchDrop: 55 })
    const ctx = getCtx()
    // Slight distortion via waveshaper
    const ws = ctx.createWaveShaper()
    const curve = new Float32Array(256)
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1
      curve[i] = (Math.PI + 200) * x / (Math.PI + 200 * Math.abs(x))
    }
    ws.curve = curve
    ws.connect(master)
    playNoise(ws, 0.1, { type: 'bandpass', freq: 400, Q: 1 }, 0.2, { decay: 0.1 })
  },

  // Rain ambient — looping filtered noise
  rainLoop: (() => {
    let node = null
    let gainNode = null
    return {
      start: () => {
        if (node) return
        try {
          const ctx = getCtx()
          const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
          const d = buf.getChannelData(0)
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1

          node = ctx.createBufferSource()
          node.buffer = buf
          node.loop = true

          gainNode = ctx.createGain()
          gainNode.gain.value = 0

          const lp = ctx.createBiquadFilter()
          lp.type = 'bandpass'
          lp.frequency.value = 1400
          lp.Q.value = 0.4

          const hp = ctx.createBiquadFilter()
          hp.type = 'highpass'
          hp.frequency.value = 700

          node.connect(lp)
          lp.connect(hp)
          hp.connect(gainNode)
          gainNode.connect(ctx.destination)
          node.start()

          // Fade in
          gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2)
        } catch(e) {}
      },
      stop: () => {
        if (!node) return
        try {
          const ctx = getCtx()
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
          setTimeout(() => {
            try { node.stop() } catch(e) {}
            node = null
            gainNode = null
          }, 1600)
        } catch(e) { node = null }
      }
    }
  })()
}
