# Voxel World - Installation & Setup Guide

## 🎮 Quick Start

### Option 1: Automatic Setup (Recommended)
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the game
3. Follow the on-screen setup wizard

### Option 2: Manual Setup
1. Install Node.js (version 16 or higher)
2. Clone or download the game files
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

## 📋 System Requirements

### Minimum Requirements:
- **OS**: Windows 10, macOS 10.14, or Linux (Ubuntu 18.04+)
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM**: 4GB
- **CPU**: 2 cores
- **Graphics**: WebGL 2.0 compatible

### Recommended Requirements:
- **OS**: Windows 11, macOS 12+, or Linux (Ubuntu 20.04+)
- **Browser**: Chrome 100+, Firefox 95+, Safari 15+
- **RAM**: 8GB or more
- **CPU**: 4 cores or more
- **Graphics**: Dedicated GPU with 2GB+ VRAM

## 🛠️ Installation Steps

### Step 1: Environment Setup
```bash
# Check Node.js version
node --version  # Should be 16.0.0 or higher

# If Node.js is not installed, download from:
# https://nodejs.org/
```

### Step 2: Install Dependencies
```bash
# Navigate to game directory
cd voxel-world

# Install all required packages
npm install

# Alternative: Use yarn
yarn install
```

### Step 3: Configuration
The game includes an automatic setup wizard that will:
- ✅ Detect your system specifications
- ✅ Configure optimal graphics settings
- ✅ Set up game controls
- ✅ Initialize save data

### Step 4: Launch Game
```bash
# Development mode (recommended for testing)
npm run dev

# Production build
npm run build
npm run preview
```

## 🎯 Setup Wizard Features

The built-in setup wizard provides:

### **System Detection**
- Automatically detects OS, browser, and hardware
- Recommends optimal settings based on your specs
- Warns about potential compatibility issues

### **Graphics Configuration**
- Automatically adjusts quality settings
- Configures render distance
- Sets up shadow quality
- Optimizes texture resolution

### **Control Setup**
- Default keyboard controls (WASD + Mouse)
- Customizable key bindings
- Gamepad support setup
- Sensitivity adjustment

## 🚀 First Time Launch

1. **Open your browser** and navigate to `http://localhost:5173`
2. **Wait for setup wizard** to load (automatic)
3. **Follow the prompts** - 4 simple steps
4. **Enter your character name** when prompted
5. **Click "Play Game"** when installation completes

## 🎮 Game Controls

### Default Keyboard Controls:
- **W/A/S/D** - Movement
- **Space** - Jump
- **V** - Toggle first/third person
- **Mouse** - Look around
- **Left Click** - Break blocks/Attack
- **Right Click** - Place blocks
- **1-5** - Select block type
- **ESC** - Unlock mouse
- **Enter** - Skip cinematics

### Advanced Controls:
- **Shift** - Run/Sprint
- **Ctrl** - Crouch
- **E** - Interact with objects
- **Tab** - Open inventory
- **M** - Toggle map

## 🔧 Troubleshooting

### Common Issues:

#### **Game Won't Start**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### **Blue Screen/Errors**
1. Check browser console for error messages
2. Ensure WebGL is enabled in browser
3. Try updating graphics drivers
4. Disable browser extensions

#### **Performance Issues**
1. Lower graphics quality in settings
2. Close other browser tabs
3. Use hardware acceleration
4. Update to latest browser version

#### **Audio Problems**
1. Check browser audio permissions
2. Ensure volume is up
3. Try different browser
4. Check system audio drivers

### Browser Compatibility:
- ✅ **Chrome**: Full support
- ✅ **Firefox**: Full support  
- ✅ **Edge**: Full support
- ⚠️ **Safari**: Basic support (some features limited)
- ❌ **Internet Explorer**: Not supported

## 📁 File Structure

```
voxel-world/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── store/              # State management
│   ├── utils/              # Utility functions
│   └── textures.js         # Texture definitions
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎯 Development

### Adding New Features:
1. Create components in `src/components/`
2. Add textures to `src/textures.js`
3. Update state in `src/store/`
4. Import and use in `App.jsx`

### Building for Production:
```bash
# Create optimized build
npm run build

# Preview production build
npm run preview

# Build will be in /dist folder
```

## 🆘 Support

### Getting Help:
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check inline help menus
- **Community**: Join Discord/Forum for tips

### Performance Tips:
1. Use recommended browser (Chrome/Firefox)
2. Close unnecessary applications
3. Ensure hardware acceleration is enabled
4. Keep graphics drivers updated
5. Use appropriate quality settings

---

**Enjoy your Voxel World adventure! 🎮✨**
