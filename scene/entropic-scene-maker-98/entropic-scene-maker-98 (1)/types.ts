
export interface GithubAsset {
  name: string;
  path: string;
  type: 'blob' | 'tree';
  url: string;
  size?: number;
}

export type AssetType = 'image' | 'audio';
export type LayerRole = 'background' | 'sprite' | 'ui' | 'item' | 'sound_emitter';
export type AnimationType = 'none' | 'pulse' | 'float' | 'shake' | 'spin' | 'bounce' | 'ghost' | 'rainbow';
export type HoverEffect = 'none' | 'glow' | 'lift' | 'brighten' | 'customCursor' | 'zoom' | 'invert' | 'grayscale' | 'blur';

export interface SceneLayer {
  id: string;
  name: string;
  type: AssetType;
  role: LayerRole;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  opacity: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  animation: AnimationType;
  effectIntensity: number;
  effectSpeed: number;
  effectColor: string;
  hoverEffect: HoverEffect;
  customCursorUrl?: string;
  linkedSoundUrl?: string;
  linkedSoundName?: string;
  clickBehavior?: 'none' | 'playSound' | 'hide' | 'alert' | 'statChange';
  statTarget?: string;
  statValue?: number;
  customMessage?: string;
  isLocked?: boolean;
  isAudioAutoplay?: boolean;
  audioVolume?: number;
}

export interface GameStat {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
}

export interface SavedScene {
  id: string;
  name: string;
  timestamp: number;
  layers: SceneLayer[];
  stats: GameStat[];
}
