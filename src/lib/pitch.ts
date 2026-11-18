/**
 * Pitch detection and note maths for the live tuner. Pure and dependency-free
 * so it can run in an audio callback loop without allocating.
 *
 * Detection is YIN (difference function + cumulative mean normalisation) on a
 * lightly decimated time-domain window. That is accurate to well under a cent
 * on a clean string and stays cheap enough to run every other animation frame.
 */

const MIN_HZ = 60;
const MAX_HZ = 1250;
const YIN_THRESHOLD = 0.16;
const SILENCE_RMS = 0.004;

export interface PitchReading {
  frequency: number;
  /** 0–1, where 1 is a perfect periodic signal. */
  clarity: number;
}

export interface NoteReading {
  frequency: number;
  midi: number;
  name: string;
  octave: number;
  /** e.g. "A4", "E2" */
  note: string;
  /** −50…+50: how far the pitch sits from the nearest note. */
  cents: number;
}

// Real accidental glyphs (♯ / ♭), not keyboard substitutes.
export const NOTE_NAMES = [
  "C",
  "C♯",
  "D",
  "D♯",
  "E",
  "F",
  "F♯",
  "G",
  "G♯",
  "A",
  "A♯",
  "B",
] as const;

/** "A♯4" -> "A sharp 4", for screen readers and aria text. */
export function spellNote(note: string) {
  const spelled = note.replace("♯", " sharp").replace("♭", " flat");
  // "A♯4" reads as "A sharp 4"; plain notes stay "E2".
  return /sharp|flat/.test(spelled) ? spelled.replace(/(-?\d)/, " $1") : spelled;
}

export function frequencyForMidi(midi: number, reference = 440) {
  return reference * 2 ** ((midi - 69) / 12);
}

export function noteFromFrequency(frequency: number, reference = 440): NoteReading {
  const exact = 69 + 12 * Math.log2(frequency / reference);
  const midi = Math.round(exact);
  const index = ((midi % 12) + 12) % 12;
  return {
    frequency,
    midi,
    name: NOTE_NAMES[index],
    octave: Math.floor(midi / 12) - 1,
    note: `${NOTE_NAMES[index]}${Math.floor(midi / 12) - 1}`,
    cents: Math.round((exact - midi) * 100),
  };
}

export interface GuitarString {
  /** 1 = high E, 6 = low E. */
  string: number;
  midi: number;
  note: string;
  frequency: number;
}

/** Standard tuning, low to high. */
export const GUITAR_STRINGS: GuitarString[] = [
  { string: 6, midi: 40 },
  { string: 5, midi: 45 },
  { string: 4, midi: 50 },
  { string: 3, midi: 55 },
  { string: 2, midi: 59 },
  { string: 1, midi: 64 },
].map((entry) => ({
  ...entry,
  note: noteFromFrequency(frequencyForMidi(entry.midi)).note,
  frequency: frequencyForMidi(entry.midi),
}));

/** The open string whose pitch is closest to the note being played. */
export function closestGuitarString(midi: number): GuitarString {
  return GUITAR_STRINGS.reduce((best, candidate) =>
    Math.abs(candidate.midi - midi) < Math.abs(best.midi - midi) ? candidate : best,
  );
}

export function createPitchDetector(sampleRate: number) {
  const decimation = Math.max(1, Math.round(sampleRate / 22050));
  const rate = sampleRate / decimation;
  const minLag = Math.max(2, Math.floor(rate / MAX_HZ));
  const maxLag = Math.floor(rate / MIN_HZ);
  let window = new Float32Array(0);
  const difference = new Float32Array(maxLag + 2);
  const normalized = new Float32Array(maxLag + 2);

  return {
    detect(samples: Float32Array): PitchReading | null {
      const length = Math.floor(samples.length / decimation);
      if (length < maxLag * 2) return null;
      if (window.length < length) window = new Float32Array(length);

      // Decimate with a short box filter, and gate on level as we go.
      let energy = 0;
      for (let index = 0; index < length; index += 1) {
        let sum = 0;
        const base = index * decimation;
        for (let tap = 0; tap < decimation; tap += 1) sum += samples[base + tap];
        const value = sum / decimation;
        window[index] = value;
        energy += value * value;
      }
      if (Math.sqrt(energy / length) < SILENCE_RMS) return null;

      const span = length - maxLag;
      difference[0] = 0;
      for (let lag = 1; lag <= maxLag; lag += 1) {
        let sum = 0;
        for (let index = 0; index < span; index += 1) {
          const delta = window[index] - window[index + lag];
          sum += delta * delta;
        }
        difference[lag] = sum;
      }

      // Cumulative mean normalised difference.
      normalized[0] = 1;
      let running = 0;
      for (let lag = 1; lag <= maxLag; lag += 1) {
        running += difference[lag];
        normalized[lag] = running > 0 ? (difference[lag] * lag) / running : 1;
      }

      let estimate = -1;
      for (let lag = minLag; lag < maxLag; lag += 1) {
        if (normalized[lag] < YIN_THRESHOLD) {
          while (lag + 1 < maxLag && normalized[lag + 1] < normalized[lag]) lag += 1;
          estimate = lag;
          break;
        }
      }
      if (estimate < 0) {
        let best = minLag;
        for (let lag = minLag; lag <= maxLag; lag += 1) {
          if (normalized[lag] < normalized[best]) best = lag;
        }
        if (normalized[best] > 0.45) return null;
        estimate = best;
      }

      // Parabolic interpolation around the chosen lag for sub-sample accuracy.
      const before = normalized[estimate - 1] ?? 1;
      const at = normalized[estimate];
      const after = normalized[estimate + 1] ?? at;
      const denominator = 2 * (before - 2 * at + after);
      const shift = denominator !== 0 ? (before - after) / denominator : 0;
      const lag = estimate + Math.max(-0.5, Math.min(0.5, shift));
      const frequency = rate / lag;
      if (!Number.isFinite(frequency) || frequency < MIN_HZ || frequency > MAX_HZ) {
        return null;
      }

      return { frequency, clarity: 1 - at };
    },
  };
}
