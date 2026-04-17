import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { LEVELS } from "../data/levels";
import type { GameContextValue, GameSettings, MedalAward, PlayerProfile, SessionState } from "../types";
import { initializeIdentity, loginWithIdentity, logoutIdentity, signupWithIdentity } from "../services/auth";
import {
  TOTAL_LEVELS,
  createDemoProfile,
  createEmptyProfile,
  getGuestStorageKey,
  getUserStorageKey,
  loadProfileFromLocal,
  mergeProfiles,
  saveProfileToLocal,
} from "../services/localPersistence";
import { fetchRemoteProfile, saveRemoteProfile } from "../services/profileApi";
import { compareMedals, createMedalAward, progressPercent } from "../utils/maze";

const GameContext = createContext<GameContextValue | undefined>(undefined);

function applyRootSettings(settings: GameSettings) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("high-contrast", settings.highContrast);
  document.documentElement.classList.toggle("reduce-motion", settings.reduceMotion);
}

function getLevelParMoves(levelId: number): number {
  return LEVELS.find((level) => level.id === levelId)?.parMoves ?? 12;
}

export function GameProvider({ children }: PropsWithChildren) {
  const demoMode = import.meta.env.VITE_DEMO_MODE === "true" || window.location.hostname === "localhost";
  const [profile, setProfile] = useState<PlayerProfile>(createEmptyProfile());
  const [session, setSession] = useState<SessionState>({
    status: "loading",
    identityEnabled: true,
    demoMode,
    user: null,
    error: null,
  });

  const storageKeyRef = useRef<string>(getGuestStorageKey());

  const persistProfile = useCallback(
    async (nextProfile: PlayerProfile, options?: { attemptRemoteSync?: boolean }) => {
      const withTimestamp: PlayerProfile = {
        ...nextProfile,
        lastUpdated: new Date().toISOString(),
      };

      saveProfileToLocal(storageKeyRef.current, withTimestamp);
      setProfile(withTimestamp);
      applyRootSettings(withTimestamp.settings);

      if (
        options?.attemptRemoteSync &&
        session.status === "authenticated" &&
        session.user &&
        navigator.onLine
      ) {
        try {
          const remoteSaved = await saveRemoteProfile({
            ...withTimestamp,
            pendingRemoteSync: false,
          });
          saveProfileToLocal(storageKeyRef.current, remoteSaved);
          setProfile(remoteSaved);
        } catch {
          const queued = { ...withTimestamp, pendingRemoteSync: true };
          saveProfileToLocal(storageKeyRef.current, queued);
          setProfile(queued);
        }
      }
    },
    [session.status, session.user],
  );

  const syncProfileNow = useCallback(async () => {
    if (session.status !== "authenticated" || !session.user || !navigator.onLine) return;

    try {
      const remote = await fetchRemoteProfile();
      const merged = mergeProfiles(profile, remote);
      const saved = await saveRemoteProfile({
        ...merged,
        pendingRemoteSync: false,
      });
      saveProfileToLocal(storageKeyRef.current, saved);
      setProfile(saved);
    } catch {
      setProfile((current) => {
        const queued = { ...current, pendingRemoteSync: true };
        saveProfileToLocal(storageKeyRef.current, queued);
        return queued;
      });
    }
  }, [profile, session.status, session.user]);

  useEffect(() => {
    applyRootSettings(profile.settings);
  }, [profile.settings]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const auth = await initializeIdentity();
      if (cancelled) return;

      if (auth.user) {
        const key = getUserStorageKey(auth.user.id);
        storageKeyRef.current = key;

        const localProfile = loadProfileFromLocal(key);
        let cloudProfile: PlayerProfile | null = null;

        try {
          cloudProfile = await fetchRemoteProfile();
        } catch {
          cloudProfile = null;
        }

        const merged = mergeProfiles(localProfile, cloudProfile);
        saveProfileToLocal(key, merged);

        setProfile(merged);
        setSession({
          status: "authenticated",
          identityEnabled: auth.identityEnabled,
          demoMode,
          user: auth.user,
          error: auth.error,
        });

        if (merged.pendingRemoteSync && navigator.onLine) {
          void saveRemoteProfile({
            ...merged,
            pendingRemoteSync: false,
          })
            .then((saved) => {
              saveProfileToLocal(key, saved);
              setProfile(saved);
            })
            .catch(() => {
              // keep the local queued copy
            });
        }
      } else {
        storageKeyRef.current = getGuestStorageKey();
        const localGuest = loadProfileFromLocal(storageKeyRef.current);
        setProfile(localGuest ?? createEmptyProfile());
        setSession({
          status: "guest",
          identityEnabled: auth.identityEnabled,
          demoMode,
          user: null,
          error: auth.identityEnabled ? null : auth.error,
        });
      }
    }

    void boot();

    return () => {
      cancelled = true;
    };
  }, [demoMode]);

  useEffect(() => {
    const handler = () => {
      if (session.status === "authenticated") {
        void syncProfileNow();
      }
    };

    window.addEventListener("online", handler);
    return () => window.removeEventListener("online", handler);
  }, [session.status, syncProfileNow]);

  const updateProfile = useCallback(
    async (recipe: (current: PlayerProfile) => PlayerProfile, options?: { sync?: boolean }) => {
      const next = recipe(profile);
      await persistProfile(next, { attemptRemoteSync: Boolean(options?.sync) });
    },
    [persistProfile, profile],
  );

  const updatePlayerName = useCallback(
    async (name: string) => {
      await updateProfile(
        (current) => ({
          ...current,
          playerName: name.trim(),
        }),
        { sync: true },
      );
    },
    [updateProfile],
  );

  const selectCharacter = useCallback(
    async (characterId: string) => {
      await updateProfile(
        (current) => ({
          ...current,
          selectedCharacterId: characterId,
        }),
        { sync: true },
      );
    },
    [updateProfile],
  );

  const toggleSetting = useCallback(
    async (setting: keyof GameSettings) => {
      await updateProfile(
        (current) => ({
          ...current,
          settings: {
            ...current.settings,
            [setting]: !current.settings[setting],
          },
        }),
        { sync: true },
      );
    },
    [updateProfile],
  );

  const rememberCurrentLevel = useCallback(
    async (levelId: number) => {
      await updateProfile(
        (current) => ({
          ...current,
          currentLevel: levelId,
          unlockedLevels: current.unlockedLevels.includes(levelId)
            ? current.unlockedLevels
            : [...current.unlockedLevels, levelId].sort((a, b) => a - b),
        }),
        { sync: true },
      );
    },
    [updateProfile],
  );

  const completeLevel = useCallback(
    async (levelId: number, moves: number, parMoves: number) => {
      const medal = createMedalAward(levelId, moves, parMoves);

      let resolvedMedal = medal;

      await updateProfile(
        (current) => {
          const nextLevel = Math.min(levelId + 1, TOTAL_LEVELS);
          const existing = current.medals.find((entry) => entry.levelId === levelId);
          resolvedMedal = compareMedals(medal, existing);

          const filtered = current.medals.filter((entry) => entry.levelId !== levelId);

          return {
            ...current,
            currentLevel: nextLevel,
            unlockedLevels: [...new Set([...current.unlockedLevels, levelId, nextLevel])].sort((a, b) => a - b),
            completedLevels: [...new Set([...current.completedLevels, levelId])].sort((a, b) => a - b),
            medals: [...filtered, resolvedMedal].sort((a, b) => a.levelId - b.levelId),
          };
        },
        { sync: true },
      );

      return resolvedMedal;
    },
    [updateProfile],
  );

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    const user = await loginWithIdentity(email, password);
    const key = getUserStorageKey(user.id);
    storageKeyRef.current = key;

    const local = loadProfileFromLocal(key);
    let remote: PlayerProfile | null = null;

    try {
      remote = await fetchRemoteProfile();
    } catch {
      remote = null;
    }

    const merged = mergeProfiles(local, remote);
    saveProfileToLocal(key, merged);

    setSession({
      status: "authenticated",
      identityEnabled: true,
      demoMode,
      user,
      error: null,
    });
    setProfile(merged);

    if (merged.pendingRemoteSync && navigator.onLine) {
      const saved = await saveRemoteProfile({
        ...merged,
        pendingRemoteSync: false,
      });
      saveProfileToLocal(key, saved);
      setProfile(saved);
    }
  }, [demoMode, syncProfileNow]);

  const signupWithPassword = useCallback(async (email: string, password: string, fullName: string) => {
    const user = await signupWithIdentity(email, password, fullName);
    const key = getUserStorageKey(user.id);
    storageKeyRef.current = key;

    const localGuest = loadProfileFromLocal(getGuestStorageKey());
    const starter = mergeProfiles(localGuest, createEmptyProfile());
    const seeded = {
      ...starter,
      playerName: fullName.trim() || starter.playerName,
      pendingRemoteSync: true,
    };

    saveProfileToLocal(key, seeded);
    setSession({
      status: "authenticated",
      identityEnabled: true,
      demoMode,
      user,
      error: null,
    });
    setProfile(seeded);

    if (navigator.onLine) {
      const saved = await saveRemoteProfile({
        ...seeded,
        pendingRemoteSync: false,
      });
      saveProfileToLocal(key, saved);
      setProfile(saved);
    }
  }, [demoMode, syncProfileNow]);

  const logoutUser = useCallback(async () => {
    await logoutIdentity();
    storageKeyRef.current = getGuestStorageKey();
    const guestProfile = loadProfileFromLocal(storageKeyRef.current) ?? createEmptyProfile();

    setSession((current) => ({
      ...current,
      status: "guest",
      user: null,
    }));
    setProfile(guestProfile);
  }, []);

  const loadDemoProfile = useCallback(async () => {
    const seeded = createDemoProfile();
    storageKeyRef.current = session.status === "authenticated" && session.user
      ? getUserStorageKey(session.user.id)
      : getGuestStorageKey();

    saveProfileToLocal(storageKeyRef.current, seeded);
    setProfile(seeded);

    if (session.status === "authenticated") {
      await persistProfile(seeded, { attemptRemoteSync: true });
    }
  }, [persistProfile, session.status, session.user]);

  const resetProgress = useCallback(async () => {
    const resetProfile = createEmptyProfile();
    await persistProfile(
      {
        ...resetProfile,
        playerName: profile.playerName,
        selectedCharacterId: profile.selectedCharacterId,
        settings: profile.settings,
      },
      { attemptRemoteSync: session.status === "authenticated" },
    );
  }, [persistProfile, profile.playerName, profile.selectedCharacterId, profile.settings, session.status]);

  const value = useMemo<GameContextValue>(
    () => ({
      profile,
      session,
      isAuthenticated: session.status === "authenticated",
      totalMedals: profile.medals.length,
      completionPercent: progressPercent(profile.completedLevels, TOTAL_LEVELS),
      updatePlayerName,
      selectCharacter,
      toggleSetting,
      rememberCurrentLevel,
      completeLevel,
      loginWithPassword,
      signupWithPassword,
      logoutUser,
      syncProfileNow,
      loadDemoProfile,
      resetProgress,
    }),
    [
      completeLevel,
      loadDemoProfile,
      loginWithPassword,
      logoutUser,
      profile,
      rememberCurrentLevel,
      resetProgress,
      selectCharacter,
      session,
      signupWithPassword,
      syncProfileNow,
      toggleSetting,
      updatePlayerName,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }

  return context;
}

export function useParMoves(levelId: number): number {
  return getLevelParMoves(levelId);
}
