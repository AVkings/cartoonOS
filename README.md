# ⚡ CartoonOS

> A fully functional, persistent 2D cartoon-style **Web Desktop Environment** built with React, Zustand, Framer Motion, and Tailwind CSS.

![CartoonOS](https://img.shields.io/badge/CartoonOS-v2.0-FF90E8?style=for-the-badge&logo=react&labelColor=000)
![React](https://img.shields.io/badge/React-18-90C2FF?style=for-the-badge&logo=react&labelColor=000)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-FFDE90?style=for-the-badge&logo=framer&labelColor=000)
![Zustand](https://img.shields.io/badge/Zustand-90FF90?style=for-the-badge&labelColor=000)

---

## 🖥️ What is CartoonOS?

CartoonOS is a browser-based operating system simulation with a **Neobrutalist "Saturday Morning Cartoon"** design aesthetic. It features a full window manager, taskbar, file system, boot sequence, and several functional apps — all running 100% client-side with no backend.

---

## ✨ Features

### 🏠 Desktop Environment
| Feature | Details |
|---|---|
| **Boot Sequence** | BIOS-style startup animation with scrolling text before the desktop loads |
| **Desktop Icons** | Fully **draggable** icons — drag them anywhere, positions persist in localStorage |
| **Cartoon BSOD** | Custom Blue Screen of Death shown when a critical error occurs |
| **Desktop Pet** | An animated cartoon character in the corner that reacts to clicks, idles, and can be dragged |

### 🪟 Window Manager
| Feature | Details |
|---|---|
| **Draggable Windows** | All windows are draggable, bounded within the screen |
| **Z-Index Stack** | Clicking a window brings it to the front automatically |
| **Minimize / Maximize / Close** | Full window controls with Mac-style colored buttons |
| **Centered Spawning** | New windows open centered on screen, cascaded if multiple are open |
| **Animated Open/Close** | Smooth spring animations via Framer Motion |

### 📂 File System
| Feature | Details |
|---|---|
| **Virtual File System** | JSON-based file system stored in **LocalStorage**, persists between sessions |
| **File Types** | `.txt` for notes, `.aex` for CartoonOS apps |
| **File Operations** | Create, rename, delete, read files |

### 🗂️ Apps

#### 📝 Notepad
- File sidebar to switch between files
- Create and delete files
- Word wrap textarea with live character/line count
- Save indicator (unsaved changes warning)

#### 💻 Terminal
- Styled like a real terminal (black bg, green monospace text)
- **Command history** with ↑/↓ arrow keys
- **Tab autocomplete** for commands
- Commands: `help`, `clear`, `echo`, `date`, `whoami`, `ls`, `cat`, `sysinfo`, `neofetch`
- `ls` / `cat` integrate with the virtual file system

#### 🌐 Browser
- Tabbed browsing with multiple tabs
- Smart URL detection (bare domain, search terms, full URL)
- Loading spinners per tab
- Error state with "Open in Real Browser" fallback
- Quick Links sidebar (Wikipedia, MDN, Archive.org, etc.)
- Reload button

#### ⚙️ Settings
- **10 wallpaper presets** (dot grid, gradients, solid colors, Gameboy, checkers…)
- **Custom image URL** wallpaper support
- **Quick theme buttons** (Day, Night, Gameboy, Sunset)
- Troubleshooting tools (Restart, Trigger BSOD)

#### 🛒 App Store
- Browse bundled AEX apps
- **Live preview panel** — preview an app before installing
- Install & Run apps in one click
- Shows your own locally-built AEX apps
- View/edit source code of local apps

#### 🧑‍💻 Code Editor (AEX)
- Full-screen **dark theme code editor** with syntax reference
- Real-time **split-screen live preview** — edit and see changes instantly
- Save as `.aex` file to the virtual file system
- Run button to test your app

---

## 🧬 AEX — CartoonOS App Exchange Format

AEX (`.aex`) is **CartoonOS's own app format** — like `.apk` for Android or `.exe` for Windows, but for CartoonOS.

### File Structure
```
@app "My App"
@version "1.0"
@author "yourname"
@icon "🚀"
@description "What this app does"

---STYLE---
/* CSS goes here */
body { background: #FF90E8; }

---RENDER---
<!-- HTML goes here -->
<div>
  <h1>Hello!</h1>
  <button onclick="greet()">Click</button>
</div>

---SCRIPT---
// JavaScript goes here
function greet() {
  print('Hello from AEX!');
  aex.alert('Hi there!');
}
```

### AEX Runtime API
| Function | Description |
|---|---|
| `print(text)` | Log to on-screen console |
| `aex.alert(text)` | Show dialog |
| `aex.title(text)` | Change app title |
| `aex.color.pink` | Palette shorthand |
| `True` / `False` / `None` | Python-style aliases |
| `range(n)` | Python-style range |

### Running an AEX App
When you open an AEX app, CartoonOS shows a **permission dialog** listing what the app is allowed to do:
- ✅ Render UI on screen
- ✅ Run scripts in sandboxed iframe
- ❌ No access to your real files or network

You can **Allow** to run it or **Deny** to block it.

### Bundled Apps in the Store
| App | Description |
|---|---|
| 🔢 Calculator | Fully functional calculator with cartoon styling |
| 🎨 MiniPaint | Drawing canvas with brush & eraser |
| 🐍 Snake Game | Classic snake with arrow key controls |
| 🕐 World Clock | Analog + digital clock |
| 👋 Hello World | Starter template to build from |

---

## 🎨 Design System

CartoonOS uses a **Neobrutalism + Saturday Morning Cartoon** aesthetic:

| Design Token | Value |
|---|---|
| **Border** | `3px solid #000` |
| **Shadow** | `4px 4px 0px #000` (no blur) |
| **Font** | Nunito (Google Fonts) |
| **Pink** | `#FF90E8` |
| **Blue** | `#90C2FF` |
| **Yellow** | `#FFDE90` |
| **Green** | `#90FF90` |
| **Hover effect** | `active:translate-x-[2px] active:translate-y-[2px] active:shadow-none` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v3 + Custom CSS |
| Animation | Framer Motion |
| State Management | Zustand (with `persist` middleware) |
| Storage | LocalStorage |
| Icons | Lucide React |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/AVkings/cartoonOS.git
cd cartoonOS

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — the boot sequence will play, then the desktop loads!

---

## 📁 Project Structure

```
src/
├── components/
│   ├── apps/
│   │   ├── AppStore/       # App Store
│   │   ├── AEXRunner/      # AEX app runtime + permission dialog
│   │   ├── Browser/        # Tabbed web browser
│   │   ├── CodeEditor/     # AEX code editor
│   │   ├── Notepad/        # File system notepad
│   │   ├── Settings/       # Wallpaper & theme settings
│   │   └── Terminal/       # Command-line terminal
│   ├── os/
│   │   ├── BootSequence.tsx  # BIOS-style startup
│   │   ├── BSOD.tsx          # Cartoon Blue Screen of Death
│   │   ├── Desktop.tsx       # Desktop canvas + draggable icons
│   │   ├── DesktopPet.tsx    # Animated companion
│   │   ├── ErrorBoundary.tsx # React error boundary
│   │   ├── StartMenu.tsx     # Application launcher
│   │   ├── Taskbar.tsx       # Bottom taskbar + clock
│   │   └── WindowManager.tsx # Window rendering orchestrator
│   └── ui/
│       └── Window.tsx        # Draggable window frame
├── store/
│   ├── useOSStore.ts    # Windows, themes, wallpaper (Zustand)
│   └── useFileStore.ts  # Virtual file system (Zustand + persist)
├── utils/
│   ├── aexRuntime.ts    # AEX parser + HTML builder + bundled apps
│   └── cn.ts            # Tailwind class utility
└── App.tsx              # Root: Boot → Desktop routing
```

---

## 🐾 The Desktop Pet

The desktop pet (a cute pink cartoon cat) lives in the corner of your screen:
- **Click it** to make it react with random expressions
- **Drag it** anywhere on the desktop
- It **bobs** up and down when idle
- Random idle messages pop up every ~8 seconds
- Gets **scared** expression when dragged

---

## 📝 License

MIT — do whatever you want with it! 🎉

---

Made with ❤️ and way too many `border: 3px solid black` declarations.
