export type MedalTier = "bronze" | "silver" | "gold";

export interface CuteCharacter {
  id: string;
  name: string;
  title: string;
  emoji: string;
  accent: string;
  glow: string;
  description: string;
}

export interface MazeLevel {
  id: number;
  name: string;
  hint: string;
  parMoves: number;
  rows: string[];
}

export interface MedalAward {
  levelId: number;
  tier: MedalTier;
  label: string;
  emoji: string;
  awardedAt: string;
  moves: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
}

export interface PlayerProfile {
  version: number;
  playerName: string;
  selectedCharacterId: string;
  unlockedLevels: number[];
  completedLevels: number[];
  medals: MedalAward[];
  currentLevel: number;
  settings: GameSettings;
  lastUpdated: string;
  pendingRemoteSync: boolean;
}

export interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
}

export interface SessionState {
  status: "loading" | "guest" | "authenticated";
  identityEnabled: boolean;
  demoMode: boolean;
  user: SessionUser | null;
  error: string | null;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameContextValue {
  profile: PlayerProfile;
  session: SessionState;
  isAuthenticated: boolean;
  totalMedals: number;
  completionPercent: number;
  updatePlayerName: (name: string) => Promise<void>;
  selectCharacter: (characterId: string) => Promise<void>;
  toggleSetting: (setting: keyof GameSettings) => Promise<void>;
  rememberCurrentLevel: (levelId: number) => Promise<void>;
  completeLevel: (levelId: number, moves: number, parMoves: number) => Promise<MedalAward>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  signupWithPassword: (email: string, password: string, fullName: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  syncProfileNow: () => Promise<void>;
  loadDemoProfile: () => Promise<void>;
  resetProgress: () => Promise<void>;
}
