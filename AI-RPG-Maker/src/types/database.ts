// ============================================================================
// RPG Maker MZ Style Database Types
// ============================================================================

// ----------------------------------------------------------------------------
// Actor (角色/英雄)
// ----------------------------------------------------------------------------
export interface Actor {
  id: string
  name: string
  nickname: string
  classId: string // Reference to Class
  initialLevel: number
  maxLevel: number
  faceImage: string
  characterImage: string
  battlerImage: string
  profile: string
  parameters: ActorParameters
  equips: ActorEquips
  skills: ActorSkill[]
}

export interface ActorParameters {
  maxHP: number[] // HP growth curve by level
  maxMP: number[]
  attack: number[]
  defense: number[]
  magicAttack: number[]
  magicDefense: number[]
  agility: number[]
  luck: number[]
}

export interface ActorEquips {
  weaponId: string | null
  shieldId: string | null
  headId: string | null
  bodyId: string | null
  accessoryId: string | null
}

export interface ActorSkill {
  skillId: string
  level: number // Required level to learn
}

// ----------------------------------------------------------------------------
// Class (职业)
// ----------------------------------------------------------------------------
export interface Class {
  id: string
  name: string
  description: string
  learnings: ClassLearning[]
  features: Feature[]
  stateResist: string[] // State IDs that this class resists
}

export interface ClassLearning {
  skillId: string
  level: number
}

export interface Feature {
  code: number // Feature type code
  dataId: string // Reference ID
  value: number // Feature value
}

// ----------------------------------------------------------------------------
// Skill (技能)
// ----------------------------------------------------------------------------
export interface Skill {
  id: string
  name: string
  description: string
  iconIndex: number
  scope: SkillScope
  occasion: SkillOccasion
  speed: number
  animationId: string
  damage: DamageFormula
  effects: SkillEffect[]
  hitType: 'certain' | 'physical' | 'magical'
  mpCost: number
  tpCost: number
  message1: string
  message2: string
  requiredWtypeId1: string | null
  requiredWtypeId2: string | null
}

export type SkillScope =
  | 'none' // 无效果
  | 'one_enemy' // 敌单体
  | 'all_enemies' // 敌全体
  | 'one_random_enemy' // 敌单体随机
  | 'two_random_enemies' // 敌2体随机
  | 'three_random_enemies' // 敌3体随机
  | 'four_random_enemies' // 敌4体随机
  | 'one_ally' // 我方单体
  | 'all_allies' // 我方全体
  | 'one_dead_ally' // 我方单体(死亡)
  | 'all_dead_allies' // 我方全体(死亡)
  | 'user' // 使用者

export type SkillOccasion =
  | 'always' // 始终
  | 'battle' // 仅战斗
  | 'menu' // 仅菜单
  | 'never' // 不能使用

export interface DamageFormula {
  type: 'none' | 'hp' | 'mp' | 'recover_hp' | 'recover_mp'
  elementId: string
  formula: string
  variance: number
  critical: boolean
}

export interface SkillEffect {
  code: number
  dataId: string
  value1: number
  value2: number
}

// ----------------------------------------------------------------------------
// Item (物品)
// ----------------------------------------------------------------------------
export interface Item {
  id: string
  name: string
  description: string
  iconIndex: number
  scope: SkillScope
  occasion: SkillOccasion
  consumable: boolean
  damage: DamageFormula
  effects: SkillEffect[]
  price: number
  keyItem: boolean
}

// ----------------------------------------------------------------------------
// Weapon (武器)
// ----------------------------------------------------------------------------
export interface Weapon {
  id: string
  name: string
  description: string
  iconIndex: number
  animationId: string
  price: number
  wtypeId: string // Weapon type
  damage: DamageFormula
  effects: SkillEffect[]
  params: WeaponParams
  features: Feature[]
}

export interface WeaponParams {
  atk: number
  def: number
  mat: number
  mdf: number
  agi: number
  luk: number
}

// ----------------------------------------------------------------------------
// Armor (护甲)
// ----------------------------------------------------------------------------
export interface Armor {
  id: string
  name: string
  description: string
  iconIndex: number
  price: number
  atypeId: string // Armor type
  features: Feature[]
  params: WeaponParams
}

// ----------------------------------------------------------------------------
// Enemy (敌人)
// ----------------------------------------------------------------------------
export interface Enemy {
  id: string
  name: string
  battlerImage: string
  battlerHue: number
  params: WeaponParams
  guage: number // Max HP bar size
  dropItems: DropItem[]
  actions: EnemyAction[]
  features: Feature[]
}

export interface DropItem {
  kind: 'item' | 'weapon' | 'armor' | 'none' | 'gold'
  dataId: string
  denominator: number // Drop chance (1/x)
}

export interface EnemyAction {
  skillId: string
  conditionType: 'always' | 'turn' | 'hp' | 'mp' | 'state' | 'party_level' | 'switch'
  conditionParam1: number
  conditionParam2: number
  rating: number // Action priority (1-10)
}

// ----------------------------------------------------------------------------
// Troop (敌群)
// ----------------------------------------------------------------------------
export interface Troop {
  id: string
  name: string
  members: TroopMember[]
  pages: TroopPage[]
}

export interface TroopMember {
  enemyId: string
  x: number
  y: number
  hidden: boolean
}

export interface TroopPage {
  conditions: PageCondition
  list: EventCommand[]
}

export interface PageCondition {
  turnEnding: boolean
  turnValid: boolean
  turnA: number
  turnB: number
  enemyValid: boolean
  enemyHp: number
  enemyIndex: number
  actorValid: boolean
  actorHp: number
  actorId: string
  switchValid: boolean
  switchId: string
}

// ----------------------------------------------------------------------------
// State (状态)
// ----------------------------------------------------------------------------
export interface State {
  id: string
  name: string
  iconIndex: number
  message1: string // Message when inflicted
  message2: string // Message during damage
  message3: string // Message when recovered
  message4: string // Message when already inflicted
  priority: number // Priority for multi-state application
  removeAtBattleEnd: boolean
  removeByWalking: boolean
  removeByDamage: boolean
  autoRemovalTiming: 'none' | 'action_end' | 'turn_end'
  minTurns: number
  maxTurns: number
  stepsToRemove: number
  restriction: 'none' | 'attack_enemy' | 'attack_ally' | 'cannot_move'
  features: Feature[]
}

// ----------------------------------------------------------------------------
// Animation (动画)
// ----------------------------------------------------------------------------
export interface Animation {
  id: string
  name: string
  animation1Name: string
  animation1Hue: number
  animation1Timing: AnimationTiming[]
  animation2Name: string
  animation2Hue: number
  animation2Timing: AnimationTiming[]
  position: 'head' | 'center' | 'base' | 'screen'
}

export interface AnimationTiming {
  frame: number
  se: SoundEffect | null
  flash: FlashEffect | null
}

export interface SoundEffect {
  name: string
  volume: number
  pitch: number
}

export interface FlashEffect {
  color: [number, number, number, number] // r, g, b, intensity
  duration: number
}

// ----------------------------------------------------------------------------
// Tileset (图块集)
// ----------------------------------------------------------------------------
export interface Tileset {
  id: string
  name: string
  tilesetNames: string[]
  flags: number[] // Passage settings
  note: string
}

// ----------------------------------------------------------------------------
// Common Event (公共事件)
// ----------------------------------------------------------------------------
export interface CommonEvent {
  id: string
  name: string
  trigger: 'none' | 'auto_run' | 'parallel' | 'parallel_common'
  switchId: string | null
  list: EventCommand[]
}

// ----------------------------------------------------------------------------
// Event Command (事件命令)
// ----------------------------------------------------------------------------
export interface EventCommand {
  code: number
  indent: number
  parameters: (string | number | boolean)[]
}

// ----------------------------------------------------------------------------
// System Settings (系统设置)
// ----------------------------------------------------------------------------
export interface SystemSettings {
  gameTitle: string
  terms: GameTerms
  partyMembers: string[] // Actor IDs for starting party
  currencyUnit: string
  saveSlots: number
  windowTone: [number, number, number] // r, g, b
  titleBgm: AudioFile
  battleBgm: AudioFile
  battleEndMe: AudioFile | null
  gameoverMe: AudioFile | null
  sounds: Record<string, SoundEffect>
  startBattleTransition: string
  endBattleTransition: string
  tilesSize: number
  screenWidth: number
  screenHeight: number
  battleback1Name: string
  battleback2Name: string
}

export interface GameTerms {
  level: string
  levelAbbr: string
  hp: string
  hpAbbr: string
  mp: string
  mpAbbr: string
  tp: string
  tpAbbr: string
  exp: string
  expAbbr: string
  gold: string
}

export interface AudioFile {
  name: string
  volume: number
  pitch: number
  pan: number
}

// ----------------------------------------------------------------------------
// Main Database Interface
// ----------------------------------------------------------------------------
export interface GameDatabase {
  actors: Actor[]
  classes: Class[]
  skills: Skill[]
  items: Item[]
  weapons: Weapon[]
  armors: Armor[]
  enemies: Enemy[]
  troops: Troop[]
  states: State[]
  animations: Animation[]
  tilesets: Tileset[]
  commonEvents: CommonEvent[]
  system: SystemSettings
}

// ----------------------------------------------------------------------------
// Database Metadata
// ----------------------------------------------------------------------------
export interface DatabaseMetadata {
  version: string
  lastModified: number
  schemaVersion: string
}
