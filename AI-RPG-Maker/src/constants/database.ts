// ============================================================================
// RPG Maker MZ Style Database Constants
// ============================================================================

import type { GameDatabase, Actor, Class, Skill, Item, Weapon, Armor, Enemy, Troop, State, Animation, Tileset, CommonEvent, SystemSettings } from '../types/database'

// ----------------------------------------------------------------------------
// Default Data
// ----------------------------------------------------------------------------

export const DEFAULT_ACTOR: Omit<Actor, 'id'> = {
  name: '新角色',
  nickname: '',
  classId: '',
  initialLevel: 1,
  maxLevel: 99,
  faceImage: '',
  characterImage: '',
  battlerImage: '',
  profile: '',
  parameters: {
    maxHP: [100],
    maxMP: [0],
    attack: [10],
    defense: [10],
    magicAttack: [10],
    magicDefense: [10],
    agility: [10],
    luck: [10],
  },
  equips: {
    weaponId: null,
    shieldId: null,
    headId: null,
    bodyId: null,
    accessoryId: null,
  },
  skills: [],
}

export const DEFAULT_CLASS: Omit<Class, 'id'> = {
  name: '新职业',
  description: '',
  learnings: [],
  features: [],
  stateResist: [],
}

export const DEFAULT_SKILL: Omit<Skill, 'id'> = {
  name: '新技能',
  description: '',
  iconIndex: 0,
  scope: 'one_enemy',
  occasion: 'always',
  speed: 0,
  animationId: '',
  damage: {
    type: 'hp',
    elementId: '',
    formula: 'a.atk * 2 - b.def',
    variance: 20,
    critical: true,
  },
  effects: [],
  hitType: 'physical',
  mpCost: 0,
  tpCost: 0,
  message1: '',
  message2: '',
  requiredWtypeId1: null,
  requiredWtypeId2: null,
}

export const DEFAULT_ITEM: Omit<Item, 'id'> = {
  name: '新物品',
  description: '',
  iconIndex: 0,
  scope: 'none',
  occasion: 'always',
  consumable: true,
  damage: {
    type: 'none',
    elementId: '',
    formula: '0',
    variance: 0,
    critical: false,
  },
  effects: [],
  price: 0,
  keyItem: false,
}

export const DEFAULT_WEAPON: Omit<Weapon, 'id'> = {
  name: '新武器',
  description: '',
  iconIndex: 0,
  animationId: '',
  price: 0,
  wtypeId: '',
  damage: {
    type: 'hp',
    elementId: '',
    formula: 'a.atk * 2 - b.def',
    variance: 20,
    critical: true,
  },
  effects: [],
  params: {
    atk: 0,
    def: 0,
    mat: 0,
    mdf: 0,
    agi: 0,
    luk: 0,
  },
  features: [],
}

export const DEFAULT_ARMOR: Omit<Armor, 'id'> = {
  name: '新护甲',
  description: '',
  iconIndex: 0,
  price: 0,
  atypeId: '',
  features: [],
  params: {
    atk: 0,
    def: 0,
    mat: 0,
    mdf: 0,
    agi: 0,
    luk: 0,
  },
}

export const DEFAULT_ENEMY: Omit<Enemy, 'id'> = {
  name: '新敌人',
  battlerImage: '',
  battlerHue: 0,
  params: {
    atk: 10,
    def: 10,
    mat: 10,
    mdf: 10,
    agi: 10,
    luk: 10,
  },
  guage: 100,
  dropItems: [
    { kind: 'none', dataId: '', denominator: 1 },
    { kind: 'none', dataId: '', denominator: 1 },
    { kind: 'none', dataId: '', denominator: 1 },
  ],
  actions: [],
  features: [],
}

export const DEFAULT_TROOP: Omit<Troop, 'id'> = {
  name: '新敌群',
  members: [],
  pages: [],
}

export const DEFAULT_STATE: Omit<State, 'id'> = {
  name: '新状态',
  iconIndex: 0,
  message1: '',
  message2: '',
  message3: '',
  message4: '',
  priority: 50,
  removeAtBattleEnd: true,
  removeByWalking: false,
  removeByDamage: false,
  autoRemovalTiming: 'none',
  minTurns: 1,
  maxTurns: 1,
  stepsToRemove: 100,
  restriction: 'none',
  features: [],
}

export const DEFAULT_ANIMATION: Omit<Animation, 'id'> = {
  name: '新动画',
  animation1Name: '',
  animation1Hue: 0,
  animation1Timing: [],
  animation2Name: '',
  animation2Hue: 0,
  animation2Timing: [],
  position: 'center',
}

export const DEFAULT_TILESET: Omit<Tileset, 'id'> = {
  name: '新图块集',
  tilesetNames: [],
  flags: [],
  note: '',
}

export const DEFAULT_COMMON_EVENT: Omit<CommonEvent, 'id'> = {
  name: '新公共事件',
  trigger: 'none',
  switchId: null,
  list: [],
}

export const DEFAULT_SYSTEM: SystemSettings = {
  gameTitle: '新游戏',
  terms: {
    level: '等级',
    levelAbbr: 'Lv.',
    hp: '生命值',
    hpAbbr: 'HP',
    mp: '魔法值',
    mpAbbr: 'MP',
    tp: '特技点',
    tpAbbr: 'TP',
    exp: '经验值',
    expAbbr: 'EXP',
    gold: '金币',
  },
  partyMembers: [],
  currencyUnit: 'G',
  saveSlots: 20,
  windowTone: [0, 0, 0],
  titleBgm: { name: '', volume: 90, pitch: 100, pan: 0 },
  battleBgm: { name: '', volume: 90, pitch: 100, pan: 0 },
  battleEndMe: null,
  gameoverMe: null,
  sounds: {},
  startBattleTransition: '',
  endBattleTransition: '',
  tilesSize: 48,
  screenWidth: 816,
  screenHeight: 624,
  battleback1Name: '',
  battleback2Name: '',
}

// ----------------------------------------------------------------------------
// Initial Database State
// ----------------------------------------------------------------------------

export const createInitialDatabase = (): GameDatabase => ({
  actors: [],
  classes: [],
  skills: [],
  items: [],
  weapons: [],
  armors: [],
  enemies: [],
  troops: [],
  states: [],
  animations: [],
  tilesets: [],
  commonEvents: [],
  system: DEFAULT_SYSTEM,
})

// ----------------------------------------------------------------------------
// Database Section Icons
// ----------------------------------------------------------------------------

export const DATABASE_SECTION_ICONS = {
  actors: '👤',
  classes: '⚔️',
  skills: '✨',
  items: '🎒',
  weapons: '🗡️',
  armors: '🛡️',
  enemies: '👹',
  troops: '👾',
  states: '💊',
  animations: '🎬',
  tilesets: '🧩',
  commonEvents: '📋',
  system: '⚙️',
} as const

export const DATABASE_SECTION_NAMES = {
  actors: '角色',
  classes: '职业',
  skills: '技能',
  items: '物品',
  weapons: '武器',
  armors: '护甲',
  enemies: '敌人',
  troops: '敌群',
  states: '状态',
  animations: '动画',
  tilesets: '图块集',
  commonEvents: '公共事件',
  system: '系统',
} as const

export type DatabaseSection = keyof typeof DATABASE_SECTION_NAMES
