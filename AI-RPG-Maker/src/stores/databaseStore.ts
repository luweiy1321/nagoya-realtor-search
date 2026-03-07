// ============================================================================
// Database Store - State Management for RPG Database
// ============================================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameDatabase, Actor, Class, Skill, Item, Weapon, Armor, Enemy, Troop, State, Animation, Tileset, CommonEvent, SystemSettings } from '../types/database'
import { createInitialDatabase, DEFAULT_ACTOR, DEFAULT_CLASS, DEFAULT_SKILL, DEFAULT_ITEM, DEFAULT_WEAPON, DEFAULT_ARMOR, DEFAULT_ENEMY, DEFAULT_TROOP, DEFAULT_STATE, DEFAULT_ANIMATION, DEFAULT_TILESET, DEFAULT_COMMON_EVENT } from '../constants/database'

// ============================================================================
// Store State
// ============================================================================

interface DatabaseState {
  database: GameDatabase
  selectedSection: string
  selectedId: string | null
  dirty: boolean
  version: number
}

// ============================================================================
// Store Actions
// ============================================================================

interface DatabaseActions {
  // Section Selection
  setSelectedSection: (section: string) => void
  setSelectedId: (id: string | null) => void

  // Actor CRUD
  addActor: () => void
  updateActor: (id: string, updates: Partial<Actor>) => void
  deleteActor: (id: string) => void

  // Class CRUD
  addClass: () => void
  updateClass: (id: string, updates: Partial<Class>) => void
  deleteClass: (id: string) => void

  // Skill CRUD
  addSkill: () => void
  updateSkill: (id: string, updates: Partial<Skill>) => void
  deleteSkill: (id: string) => void

  // Item CRUD
  addItem: () => void
  updateItem: (id: string, updates: Partial<Item>) => void
  deleteItem: (id: string) => void

  // Weapon CRUD
  addWeapon: () => void
  updateWeapon: (id: string, updates: Partial<Weapon>) => void
  deleteWeapon: (id: string) => void

  // Armor CRUD
  addArmor: () => void
  updateArmor: (id: string, updates: Partial<Armor>) => void
  deleteArmor: (id: string) => void

  // Enemy CRUD
  addEnemy: () => void
  updateEnemy: (id: string, updates: Partial<Enemy>) => void
  deleteEnemy: (id: string) => void

  // Troop CRUD
  addTroop: () => void
  updateTroop: (id: string, updates: Partial<Troop>) => void
  deleteTroop: (id: string) => void

  // State CRUD
  addState: () => void
  updateState: (id: string, updates: Partial<State>) => void
  deleteState: (id: string) => void

  // Animation CRUD
  addAnimation: () => void
  updateAnimation: (id: string, updates: Partial<Animation>) => void
  deleteAnimation: (id: string) => void

  // Tileset CRUD
  addTileset: () => void
  updateTileset: (id: string, updates: Partial<Tileset>) => void
  deleteTileset: (id: string) => void

  // Common Event CRUD
  addCommonEvent: () => void
  updateCommonEvent: (id: string, updates: Partial<CommonEvent>) => void
  deleteCommonEvent: (id: string) => void

  // System Settings
  updateSystem: (updates: Partial<SystemSettings>) => void

  // Database Operations
  loadDatabase: (database: GameDatabase) => void
  exportDatabase: () => GameDatabase
  clearDatabase: () => void
  markClean: () => void
}

// ============================================================================
// Store Definition
// ============================================================================

export const useDatabaseStore = create<DatabaseState & DatabaseActions>()(
  persist(
    (set, get) => ({
      // Initial State
      database: createInitialDatabase(),
      selectedSection: 'actors',
      selectedId: null,
      dirty: false,
      version: 1,

      // Section Selection
      setSelectedSection: (section) => set({ selectedSection: section, selectedId: null }),
      setSelectedId: (id) => set({ selectedId: id, dirty: true }),

      // Actor CRUD
      addActor: () => set((state) => {
        const newActor: Actor = { ...DEFAULT_ACTOR, id: crypto.randomUUID() }
        return {
          database: { ...state.database, actors: [...state.database.actors, newActor] },
          selectedId: newActor.id,
          dirty: true,
          version: state.version + 1,
        }
      }),

      updateActor: (id, updates) => set((state) => ({
        database: {
          ...state.database,
          actors: state.database.actors.map(a => a.id === id ? { ...a, ...updates } : a),
        },
        dirty: true,
      })),

      deleteActor: (id) => set((state) => ({
        database: { ...state.database, actors: state.database.actors.filter(a => a.id !== id) },
        selectedId: state.selectedId === id ? null : state.selectedId,
        dirty: true,
      })),

      // Class CRUD
      addClass: () => set((state) => {
        const newClass: Class = { ...DEFAULT_CLASS, id: crypto.randomUUID() }
        return {
          database: { ...state.database, classes: [...state.database.classes, newClass] },
          selectedId: newClass.id,
          dirty: true,
          version: state.version + 1,
        }
      }),

      updateClass: (id, updates) => set((state) => ({
        database: {
          ...state.database,
          classes: state.database.classes.map(c => c.id === id ? { ...c, ...updates } : c),
        },
        dirty: true,
      })),

      deleteClass: (id) => set((state) => ({
        database: { ...state.database, classes: state.database.classes.filter(c => c.id !== id) },
        selectedId: state.selectedId === id ? null : state.selectedId,
        dirty: true,
      })),

      // Skill CRUD
      addSkill: () => set((state) => {
        const newSkill: Skill = { ...DEFAULT_SKILL, id: crypto.randomUUID() }
        return {
          database: { ...state.database, skills: [...state.database.skills, newSkill] },
          selectedId: newSkill.id,
          dirty: true,
          version: state.version + 1,
        }
      }),

      updateSkill: (id, updates) => set((state) => ({
        database: {
          ...state.database,
          skills: state.database.skills.map(s => s.id === id ? { ...s, ...updates } : s),
        },
        dirty: true,
      })),

      deleteSkill: (id) => set((state) => ({
        database: { ...state.database, skills: state.database.skills.filter(s => s.id !== id) },
        selectedId: state.selectedId === id ? null : state.selectedId,
        dirty: true,
      })),

      // Item CRUD
      addItem: () => set((state) => {
        const newItem: Item = { ...DEFAULT_ITEM, id: crypto.randomUUID() }
        return {
          database: { ...state.database, items: [...state.database.items, newItem] },
          selectedId: newItem.id,
          dirty: true,
          version: state.version + 1,
        }
      }),

      updateItem: (id, updates) => set((state) => ({
        database: {
          ...state.database,
          items: state.database.items.map(i => i.id === id ? { ...i, ...updates } : i),
        },
        dirty: true,
      })),

      deleteItem: (id) => set((state) => ({
        database: { ...state.database, items: state.database.items.filter(i => i.id !== id) },
        selectedId: state.selectedId === id ? null : state.selectedId,
        dirty: true,
      })),

      // Weapon CRUD
      addWeapon: () => set((state) => {
        const newWeapon: Weapon = { ...DEFAULT_WEAPON, id: crypto.randomUUID() }
        return {
          database: { ...state.database, weapons: [...state.database.weapons, newWeapon] },
          selectedId: newWeapon.id,
          dirty: true,
          version: state.version + 1,
        }
      }),

      updateWeapon: (id, updates) => set((state) => ({
        database: {
          ...state.database,
          weapons: state.database.weapons.map(w => w.id === id ? { ...w, ...updates } : w),
        },
        dirty: true,
      })),

      deleteWeapon: (id) => set((state) => ({
        database: { ...state.database, weapons: state.database.weapons.filter(w => w.id !== id) },
        selectedId: state.selectedId === id ? null : state.selectedId,
        dirty: true,
      })),

      // Armor CRUD
      addArmor: () => set((state) => {
        const newArmor: Armor = { ...DEFAULT_ARMOR, id: crypto.randomUUID() }
        return {
          database: { ...state.database, armors: [...state.database.armors, newArmor] },
          selectedId: newArmor.id,
          dirty: true,
          version: state.version + 1,
        }
      }),

      updateArmor: (id, updates) => set((state) => ({
        database: {
          ...state.database,
          armors: state.database.armors.map(a => a.id === id ? { ...a, ...updates } : a),
        },
        dirty: true,
      })),

      deleteArmor: (id) => set((state) => ({
        database: { ...state.database, armors: state.database.armors.filter(a => a.id !== id) },
        selectedId: state.selectedId === id ? null : state.selectedId,
        dirty: true,
      })),

      // Enemy CRUD
      addEnemy: () => set((state) => {
        const newEnemy: Enemy = { ...DEFAULT_ENEMY, id: crypto.randomUUID() }
        return {
          database: { ...state.database, enemies: [...state.database.enemies, newEnemy] },
          selectedId: newEnemy.id,
          dirty: true,
          version: state.version + 1,
        }
      }),

      updateEnemy: (id, updates) => set((state) => ({
        database: {
          ...state.database,
          enemies: state.database.enemies.map(e => e.id === id ? { ...e, ...updates } : e),
        },
        dirty: true,
      })),

      deleteEnemy: (id) => set((state) => ({
        database: { ...state.database, enemies: state.database.enemies.filter(e => e.id !== id) },
        selectedId: state.selectedId === id ? null : state.selectedId,
        dirty: true,
      })),

      // Troop CRUD
      addTroop: () => set((state) => {
        const newTroop: Troop = { ...DEFAULT_TROOP, id: crypto.randomUUID() }
        return {
          database: { ...state.database, troops: [...state.database.troops, newTroop] },
          selectedId: newTroop.id,
          dirty: true,
          version: state.version + 1,
        }
      }),

      updateTroop: (id, updates) => set((state) => ({
        database: {
          ...state.database,
          troops: state.database.troops.map(t => t.id === id ? { ...t, ...updates } : t),
        },
        dirty: true,
      })),

      deleteTroop: (id) => set((state) => ({
        database: { ...state.database, troops: state.database.troops.filter(t => t.id !== id) },
        selectedId: state.selectedId === id ? null : state.selectedId,
        dirty: true,
      })),

      // State CRUD
      addState: () => set((state) => {
        const newState: State = { ...DEFAULT_STATE, id: crypto.randomUUID() }
        return {
          database: { ...state.database, states: [...state.database.states, newState] },
          selectedId: newState.id,
          dirty: true,
          version: state.version + 1,
        }
      }),

      updateState: (id, updates) => set((state) => ({
        database: {
          ...state.database,
          states: state.database.states.map(s => s.id === id ? { ...s, ...updates } : s),
        },
        dirty: true,
      })),

      deleteState: (id) => set((state) => ({
        database: { ...state.database, states: state.database.states.filter(s => s.id !== id) },
        selectedId: state.selectedId === id ? null : state.selectedId,
        dirty: true,
      })),

      // Animation CRUD
      addAnimation: () => set((state) => {
        const newAnimation: Animation = { ...DEFAULT_ANIMATION, id: crypto.randomUUID() }
        return {
          database: { ...state.database, animations: [...state.database.animations, newAnimation] },
          selectedId: newAnimation.id,
          dirty: true,
          version: state.version + 1,
        }
      }),

      updateAnimation: (id, updates) => set((state) => ({
        database: {
          ...state.database,
          animations: state.database.animations.map(a => a.id === id ? { ...a, ...updates } : a),
        },
        dirty: true,
      })),

      deleteAnimation: (id) => set((state) => ({
        database: { ...state.database, animations: state.database.animations.filter(a => a.id !== id) },
        selectedId: state.selectedId === id ? null : state.selectedId,
        dirty: true,
      })),

      // Tileset CRUD
      addTileset: () => set((state) => {
        const newTileset: Tileset = { ...DEFAULT_TILESET, id: crypto.randomUUID() }
        return {
          database: { ...state.database, tilesets: [...state.database.tilesets, newTileset] },
          selectedId: newTileset.id,
          dirty: true,
          version: state.version + 1,
        }
      }),

      updateTileset: (id, updates) => set((state) => ({
        database: {
          ...state.database,
          tilesets: state.database.tilesets.map(t => t.id === id ? { ...t, ...updates } : t),
        },
        dirty: true,
      })),

      deleteTileset: (id) => set((state) => ({
        database: { ...state.database, tilesets: state.database.tilesets.filter(t => t.id !== id) },
        selectedId: state.selectedId === id ? null : state.selectedId,
        dirty: true,
      })),

      // Common Event CRUD
      addCommonEvent: () => set((state) => {
        const newCommonEvent: CommonEvent = { ...DEFAULT_COMMON_EVENT, id: crypto.randomUUID() }
        return {
          database: { ...state.database, commonEvents: [...state.database.commonEvents, newCommonEvent] },
          selectedId: newCommonEvent.id,
          dirty: true,
          version: state.version + 1,
        }
      }),

      updateCommonEvent: (id, updates) => set((state) => ({
        database: {
          ...state.database,
          commonEvents: state.database.commonEvents.map(e => e.id === id ? { ...e, ...updates } : e),
        },
        dirty: true,
      })),

      deleteCommonEvent: (id) => set((state) => ({
        database: { ...state.database, commonEvents: state.database.commonEvents.filter(e => e.id !== id) },
        selectedId: state.selectedId === id ? null : state.selectedId,
        dirty: true,
      })),

      // System Settings
      updateSystem: (updates) => set((state) => ({
        database: {
          ...state.database,
          system: { ...state.database.system, ...updates },
        },
        dirty: true,
      })),

      // Database Operations
      loadDatabase: (database) => set({ database, dirty: false, version: get().version + 1 }),
      exportDatabase: () => get().database,
      clearDatabase: () => set({ database: createInitialDatabase(), selectedId: null, dirty: true }),
      markClean: () => set({ dirty: false }),
    }),
    {
      name: 'rpg-database',
      partialize: (state) => ({
        database: state.database,
        selectedSection: state.selectedSection,
        selectedId: state.selectedId,
      }),
    }
  )
)

// ============================================================================
// Helper Hooks
// ============================================================================

export const useCurrentItem = <T extends Actor | Class | Skill | Item | Weapon | Armor | Enemy | Troop | State | Animation | Tileset | CommonEvent>(
  section: string
): T | null => {
  const { database, selectedId } = useDatabaseStore()

  const sectionMap: Record<string, T[]> = {
    actors: database.actors as T[],
    classes: database.classes as T[],
    skills: database.skills as T[],
    items: database.items as T[],
    weapons: database.weapons as T[],
    armors: database.armors as T[],
    enemies: database.enemies as T[],
    troops: database.troops as T[],
    states: database.states as T[],
    animations: database.animations as T[],
    tilesets: database.tilesets as T[],
    commonEvents: database.commonEvents as T[],
  }

  const items = sectionMap[section] || []
  return items.find((item) => item.id === selectedId) || null
}

export const useItemList = <T extends Actor | Class | Skill | Item | Weapon | Armor | Enemy | Troop | State | Animation | Tileset | CommonEvent>(
  section: string
): T[] => {
  const { database } = useDatabaseStore()

  const sectionMap: Record<string, T[]> = {
    actors: database.actors as T[],
    classes: database.classes as T[],
    skills: database.skills as T[],
    items: database.items as T[],
    weapons: database.weapons as T[],
    armors: database.armors as T[],
    enemies: database.enemies as T[],
    troops: database.troops as T[],
    states: database.states as T[],
    animations: database.animations as T[],
    tilesets: database.tilesets as T[],
    commonEvents: database.commonEvents as T[],
  }

  return sectionMap[section] || []
}
