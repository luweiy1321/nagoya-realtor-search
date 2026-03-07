// ============================================================================
// Layout Store - Multi-Panel Layout State Management
// ============================================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================================================
// Layout Types
// ============================================================================

export type EditorMode =
  | 'map'        // Map Editor
  | 'database'   // Database Editor
  | 'event'      // Event Editor
  | 'battle'     // Battle Settings
  | 'resources'  // Resource Manager
  | 'animation'  // Animation Editor
  | 'script'     // Script Editor
  // Legacy modes
  | 'npc'        // NPC Editor
  | 'quest'      // Quest Editor
  | 'runtime'    // Game Preview
  | 'ai'         // AI World Generator
  | 'music'      // AI Music Generator
  | 'multiplayer' // Multiplayer System
  | 'market'     // Marketplace
  | 'cloud'      // Cloud Panel
  | 'settings'   // Settings

export type LeftPanelTab =
  | 'resources'
  | 'layers'
  | 'actors'
  | 'tilesets'

export type RightPanelTab =
  | 'properties'
  | 'database'
  | 'events'
  | 'console'

export type PanelState = 'visible' | 'hidden' | 'pinned'

// ============================================================================
// Layout State
// ============================================================================

interface LayoutState {
  // Editor Mode
  currentMode: EditorMode

  // Panel States
  leftPanelVisible: boolean
  leftPanelWidth: number
  leftPanelTab: LeftPanelTab

  rightPanelVisible: boolean
  rightPanelWidth: number
  rightPanelTab: RightPanelTab

  bottomPanelVisible: boolean
  bottomPanelHeight: number

  // Workspace
  workspaceZoom: number
  workspaceCenterX: number
  workspaceCenterY: number

  // UI State
  fullscreen: boolean
  menuBarVisible: boolean
}

// ============================================================================
// Layout Actions
// ============================================================================

interface LayoutActions {
  // Mode Management
  setMode: (mode: EditorMode) => void

  // Left Panel
  toggleLeftPanel: () => void
  setLeftPanelVisible: (visible: boolean) => void
  setLeftPanelWidth: (width: number) => void
  setLeftPanelTab: (tab: LeftPanelTab) => void

  // Right Panel
  toggleRightPanel: () => void
  setRightPanelVisible: (visible: boolean) => void
  setRightPanelWidth: (width: number) => void
  setRightPanelTab: (tab: RightPanelTab) => void

  // Bottom Panel
  toggleBottomPanel: () => void
  setBottomPanelVisible: (visible: boolean) => void
  setBottomPanelHeight: (height: number) => void

  // Workspace
  setWorkspaceZoom: (zoom: number) => void
  setWorkspaceCenter: (x: number, y: number) => void

  // UI State
  toggleFullscreen: () => void
  setFullscreen: (fullscreen: boolean) => void
  toggleMenuBar: () => void

  // Reset
  resetLayout: () => void
}

// ============================================================================
// Default State
// ============================================================================

const defaultState: LayoutState = {
  currentMode: 'map',
  leftPanelVisible: true,
  leftPanelWidth: 280,
  leftPanelTab: 'resources',
  rightPanelVisible: true,
  rightPanelWidth: 320,
  rightPanelTab: 'properties',
  bottomPanelVisible: false,
  bottomPanelHeight: 200,
  workspaceZoom: 1,
  workspaceCenterX: 0,
  workspaceCenterY: 0,
  fullscreen: false,
  menuBarVisible: true,
}

// ============================================================================
// Store Definition
// ============================================================================

export const useLayoutStore = create<LayoutState & LayoutActions>()(
  persist(
    (set) => ({
      ...defaultState,

      // Mode Management
      setMode: (mode) => set({ currentMode: mode }),

      // Left Panel
      toggleLeftPanel: () => set((state) => ({ leftPanelVisible: !state.leftPanelVisible })),
      setLeftPanelVisible: (visible) => set({ leftPanelVisible: visible }),
      setLeftPanelWidth: (width) => set({ leftPanelWidth: Math.max(200, Math.min(500, width)) }),
      setLeftPanelTab: (tab) => set({ leftPanelTab: tab }),

      // Right Panel
      toggleRightPanel: () => set((state) => ({ rightPanelVisible: !state.rightPanelVisible })),
      setRightPanelVisible: (visible) => set({ rightPanelVisible: visible }),
      setRightPanelWidth: (width) => set({ rightPanelWidth: Math.max(250, Math.min(600, width)) }),
      setRightPanelTab: (tab) => set({ rightPanelTab: tab }),

      // Bottom Panel
      toggleBottomPanel: () => set((state) => ({ bottomPanelVisible: !state.bottomPanelVisible })),
      setBottomPanelVisible: (visible) => set({ bottomPanelVisible: visible }),
      setBottomPanelHeight: (height) => set({ bottomPanelHeight: Math.max(100, Math.min(400, height)) }),

      // Workspace
      setWorkspaceZoom: (zoom) => set({ workspaceZoom: Math.max(0.25, Math.min(3, zoom)) }),
      setWorkspaceCenter: (x, y) => set({ workspaceCenterX: x, workspaceCenterY: y }),

      // UI State
      toggleFullscreen: () => set((state) => {
        const newState = !state.fullscreen
        if (typeof document !== 'undefined') {
          if (newState) {
            document.documentElement.requestFullscreen?.()
          } else {
            document.exitFullscreen?.()
          }
        }
        return { fullscreen: newState }
      }),
      setFullscreen: (fullscreen) => set({ fullscreen }),
      toggleMenuBar: () => set((state) => ({ menuBarVisible: !state.menuBarVisible })),

      // Reset
      resetLayout: () => set(defaultState),
    }),
    {
      name: 'rpg-layout',
      partialize: (state) => ({
        currentMode: state.currentMode,
        leftPanelWidth: state.leftPanelWidth,
        rightPanelWidth: state.rightPanelWidth,
        bottomPanelHeight: state.bottomPanelHeight,
        leftPanelTab: state.leftPanelTab,
        rightPanelTab: state.rightPanelTab,
      }),
    }
  )
)
