let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!("AudioContext" in window || "webkitAudioContext" in window)) return null;

  if (!audioContext) {
    const AudioCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    audioContext = AudioCtor ? new AudioCtor() : null;
  }

  return audioContext;
}

function playTone(frequency: number, durationMs: number, type: OscillatorType, volume = 0.03) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

  oscillator.start(now);
  oscillator.stop(now + durationMs / 1000);
}

export function playMoveSound(enabled: boolean) {
  if (!enabled) return;
  playTone(392, 80, "triangle", 0.02);
}

export function playBlockedSound(enabled: boolean) {
  if (!enabled) return;
  playTone(180, 110, "sine", 0.015);
}

export function playVictorySound(enabled: boolean) {
  if (!enabled) return;
  playTone(523, 120, "triangle", 0.025);
  setTimeout(() => playTone(659, 140, "triangle", 0.025), 90);
  setTimeout(() => playTone(784, 180, "triangle", 0.03), 180);
}
