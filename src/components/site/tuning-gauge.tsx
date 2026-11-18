"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { TuningDial, type PitchTone } from "@/components/site/tuning-dial";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  GUITAR_STRINGS,
  closestGuitarString,
  createPitchDetector,
  frequencyForMidi,
  noteFromFrequency,
  spellNote,
} from "@/lib/pitch";

const A4_HZ = 440;
const IN_TUNE_CENTS = 5;
const START_CENTS = 12;

type TunerStatus =
  | "idle"
  | "requesting"
  | "listening"
  | "blocked"
  | "unavailable"
  | "unsupported";
type Mode = "guitar" | "voice";

interface LiveReading {
  note: string;
  midi: number;
  frequency: number;
  cents: number;
}

interface Engine {
  context: AudioContext;
  stream: MediaStream;
  analyser: AnalyserNode;
  buffer: Float32Array<ArrayBuffer>;
  frame: number;
}

const ERROR_COPY: Partial<Record<TunerStatus, string>> = {
  blocked:
    "Microphone access was blocked. Allow it in the address bar, then tap Listen again.",
  unavailable: "No microphone was found on this device.",
  unsupported: "This browser does not expose the microphone to the page.",
};

/** Renders "A♯4" with the accidental in the sans face, so it never falls back
 * to a mismatched serif glyph at heading size. */
function NoteValue({ note }: { note: string }) {
  const parts = note.match(/^([A-G])([♯♭]?)(-?\d+)$/);
  if (!parts) return <>{note}</>;
  const [, letter, accidental, octave] = parts;
  return (
    <>
      {letter}
      {accidental ? (
        <span className="inline-block translate-y-[0.04em] font-sans text-[0.72em] tracking-normal">
          {accidental}
        </span>
      ) : null}
      {octave}
    </>
  );
}

function formatCents(cents: number) {
  if (cents === 0) return "0¢";
  return `${cents > 0 ? "+" : "−"}${Math.abs(cents)}¢`;
}

const TONE_TEXT: Record<PitchTone, string> = {
  idle: "text-muted-foreground",
  flat: "text-amber-700 dark:text-amber-400",
  "in-tune": "text-emerald-700 dark:text-emerald-400",
  sharp: "text-red-700 dark:text-red-400",
};

const TONE_DOT: Record<PitchTone, string> = {
  idle: "bg-muted-foreground/50",
  flat: "bg-amber-600 dark:bg-amber-400",
  "in-tune": "bg-emerald-600 dark:bg-emerald-400",
  sharp: "bg-red-600 dark:bg-red-400",
};

const ACTIVE_CHIP: Record<Exclude<PitchTone, "idle">, string> = {
  flat: "border-amber-600/50 bg-amber-500/10 text-amber-800 dark:border-amber-400/50 dark:text-amber-300",
  "in-tune": "border-transparent bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950",
  sharp: "border-red-600/50 bg-red-500/10 text-red-800 dark:border-red-400/50 dark:text-red-300",
};

/** Display form, using the musical accidental symbols. */
function pitchLabel(cents: number) {
  if (Math.abs(cents) <= IN_TUNE_CENTS) return "♮ In tune";
  const accidental = cents > 0 ? "♯" : "♭";
  return `${accidental} ${Math.abs(cents)}¢`;
}

/** Spoken form, for aria text. */
function pitchSpoken(cents: number) {
  if (Math.abs(cents) <= IN_TUNE_CENTS) return "in tune";
  return `${Math.abs(cents)} cents ${cents > 0 ? "sharp" : "flat"}`;
}

export function TuningGauge({ className }: { className?: string }) {
  const [cents, setCents] = useState(START_CENTS);
  const [status, setStatus] = useState<TunerStatus>("idle");
  const [mode, setMode] = useState<Mode>("guitar");
  const [reading, setReading] = useState<LiveReading | null>(null);
  const [stale, setStale] = useState(false);

  const engineRef = useRef<Engine | null>(null);
  const detectorRef = useRef<ReturnType<typeof createPitchDetector> | null>(null);
  const historyRef = useRef<number[]>([]);
  const lastMidiRef = useRef<number | null>(null);
  const silenceRef = useRef(0);
  const lastTickRef = useRef(0);
  const mountedRef = useRef(true);

  const live = status === "listening";

  const teardown = useCallback(() => {
    const engine = engineRef.current;
    engineRef.current = null;
    detectorRef.current = null;
    historyRef.current = [];
    lastMidiRef.current = null;
    silenceRef.current = 0;
    lastTickRef.current = 0;
    if (!engine) return;
    cancelAnimationFrame(engine.frame);
    for (const track of engine.stream.getTracks()) track.stop();
    void engine.context.close().catch(() => {});
  }, []);

  const stop = useCallback(() => {
    teardown();
    setReading(null);
    setStale(false);
    setStatus("idle");
  }, [teardown]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      teardown();
    };
  }, [teardown]);

  const start = async () => {
    if (engineRef.current || status === "requesting") return;
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof AudioContext === "undefined"
    ) {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");
    setReading(null);
    setStale(false);

    // Create and resume the audio context inside the click so Safari keeps the
    // gesture for playback, then wait on the permission prompt.
    let context: AudioContext | null = null;

    try {
      context = new AudioContext({ latencyHint: "interactive" });
      await context.resume();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0;
      source.connect(analyser);

      const engine: Engine = {
        context,
        stream,
        analyser,
        buffer: new Float32Array(analyser.fftSize),
        frame: 0,
      };
      engineRef.current = engine;
      detectorRef.current = createPitchDetector(context.sampleRate);
      setStatus("listening");

      const loop = () => {
        if (engineRef.current !== engine) return;
        engine.frame = requestAnimationFrame(loop);

        const now = performance.now();
        if (now - lastTickRef.current < 50) return;
        lastTickRef.current = now;

        engine.analyser.getFloatTimeDomainData(engine.buffer);
        const detected = detectorRef.current?.detect(engine.buffer) ?? null;

        if (detected && detected.clarity >= 0.7) {
          let frequency = detected.frequency;
          let note = noteFromFrequency(frequency, A4_HZ);

          if (lastMidiRef.current !== null && note.midi !== lastMidiRef.current) {
            // New note: start the median window over instead of blending across.
            historyRef.current = [frequency];
          } else {
            historyRef.current.push(frequency);
            if (historyRef.current.length > 7) historyRef.current.shift();
            const sorted = [...historyRef.current].sort((a, b) => a - b);
            frequency = sorted[Math.floor(sorted.length / 2)];
            note = noteFromFrequency(frequency, A4_HZ);
          }

          lastMidiRef.current = note.midi;
          silenceRef.current = 0;
          if (!mountedRef.current) return;
          setReading({
            note: note.note,
            midi: note.midi,
            frequency,
            cents: note.cents,
          });
          setStale(false);
        } else {
          silenceRef.current += 1;
          if (silenceRef.current === 12) {
            lastMidiRef.current = null;
            historyRef.current = [];
            if (mountedRef.current) setStale(true);
          }
        }
      };

      loop();
    } catch (error) {
      void context?.close().catch(() => {});
      const name = error instanceof DOMException ? error.name : "";
      setStatus(
        name === "NotAllowedError" || name === "SecurityError"
          ? "blocked"
          : "unavailable",
      );
    }
  };

  const liveCents = reading?.cents ?? 0;
  const needleCents = live ? liveCents : cents;
  const hasReading = live ? Boolean(reading) && !stale : true;
  const tone: PitchTone = !hasReading
    ? "idle"
    : Math.abs(needleCents) <= IN_TUNE_CENTS
      ? "in-tune"
      : needleCents > 0
        ? "sharp"
        : "flat";

  const guitarTarget = reading ? closestGuitarString(reading.midi) : null;
  // Only claim a string when the note is actually on it, not when it is a
  // chromatic note that happens to sit closer to one open string than another.
  const activeString =
    mode === "guitar" &&
    reading &&
    guitarTarget &&
    Math.abs(reading.midi - guitarTarget.midi) <= 1
      ? guitarTarget
      : null;

  const statusText = (() => {
    if (status === "requesting") return "Asking for mic";
    if (status === "blocked") return "Mic blocked";
    if (status === "unsupported") return "Mic unsupported";
    if (status === "unavailable") return "Mic unavailable";
    if (live) {
      if (!reading || stale) return "Listening…";
      return pitchLabel(reading.cents);
    }
    return pitchLabel(cents);
  })();

  const errorCopy = ERROR_COPY[status];
  const noteText = live ? (reading?.note ?? "—") : "A4";
  const frequencyText = live
    ? reading
      ? `${reading.frequency.toFixed(1)} Hz`
      : "—"
    : `${(A4_HZ * 2 ** (cents / 1200)).toFixed(1)} Hz`;
  const offsetText = live
    ? reading
      ? formatCents(reading.cents)
      : "—"
    : formatCents(cents);

  // The beat a musician actually hears: the distance from the note being
  // targeted, in Hz. A quarter of a hertz at A4 is one cent.
  const targetFrequency = live && reading
    ? frequencyForMidi(reading.midi, A4_HZ)
    : A4_HZ;
  const soundedFrequency = live
    ? (reading?.frequency ?? null)
    : A4_HZ * 2 ** (cents / 1200);
  const beatFrequency =
    soundedFrequency === null
      ? null
      : Math.abs(soundedFrequency - (live ? targetFrequency : A4_HZ));
  const beatText =
    beatFrequency === null
      ? "—"
      : `${beatFrequency.toFixed(beatFrequency < 10 ? 2 : 1)} Hz`;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Pitch preview
        </p>
        <p
          className={cn(
            "flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.18em] tabular-nums",
            TONE_TEXT[tone],
          )}
          aria-live={live ? "off" : "polite"}
        >
          <span
            className={cn("size-1.5 rounded-full", TONE_DOT[tone])}
            aria-hidden="true"
          />
          {statusText}
        </p>
      </div>

      <div className="px-5 pt-4 pb-2">
        <TuningDial
          cents={needleCents}
          tone={tone}
          interactive={!live}
          label={
            live ? "Live pitch offset in cents" : "Preview pitch offset in cents"
          }
          valueText={`${formatCents(needleCents)}, ${pitchSpoken(needleCents)}, ${spellNote(noteText)} at ${reading?.frequency.toFixed(1) ?? (A4_HZ * 2 ** (needleCents / 1200)).toFixed(1)} hertz`}
          onCentsChange={live ? undefined : setCents}
        />
      </div>

      {mode === "guitar" ? (
        <ul
          className="grid grid-cols-6 gap-1.5 px-5 pb-4"
          aria-label="Guitar strings, low to high"
        >
          {GUITAR_STRINGS.map((string) => {
            const active = activeString?.string === string.string;
            const tuned =
              active &&
              !stale &&
              reading !== null &&
              Math.abs(reading.cents) <= IN_TUNE_CENTS &&
              reading.midi === string.midi;

            return (
              <li
                key={string.string}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-md border py-1.5 text-center transition-colors",
                  tuned
                    ? ACTIVE_CHIP["in-tune"]
                    : active
                      ? tone === "idle"
                        ? "border-border bg-muted text-foreground"
                        : ACTIVE_CHIP[tone]
                      : "border-border text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "text-[0.625rem] font-semibold tabular-nums",
                    tuned ? "opacity-90" : "opacity-70",
                  )}
                >
                  {string.string}
                </span>
                <span className="text-[0.75rem] font-semibold leading-none">
                  {string.note}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="px-5 pb-4 text-[0.6875rem] text-muted-foreground">
          Chromatic · A0 – C8 · nearest note
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
        <button
          type="button"
          onClick={live || status === "requesting" ? stop : start}
          aria-pressed={live}
          className={cn(
            "touch-target inline-flex h-11 items-center gap-2 rounded-full px-4 text-[0.8125rem] font-semibold transition-colors sm:h-8 sm:px-3.5 sm:text-[0.75rem]",
            live
              ? "border border-border text-foreground hover:bg-muted"
              : "bg-primary text-primary-foreground hover:bg-primary/85",
            status === "requesting" && "opacity-70",
          )}
        >
          {live ? (
            <MicOff className="size-3.5" aria-hidden="true" />
          ) : (
            <Mic className="size-3.5" aria-hidden="true" />
          )}
          <span>
            {status === "requesting" ? "Starting…" : live ? "Stop" : "Listen"}
          </span>
        </button>

        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          aria-label="Tuner mode"
          value={mode}
          onValueChange={(value) => {
            if (value) setMode(value as Mode);
          }}
        >
          <ToggleGroupItem
            value="guitar"
            className="touch-target h-11 px-3.5 text-[0.8125rem] text-muted-foreground data-[state=on]:text-foreground sm:h-7 sm:px-2.5 sm:text-[0.8rem]"
          >
            Guitar
          </ToggleGroupItem>
          <ToggleGroupItem
            value="voice"
            className="touch-target h-11 px-3.5 text-[0.8125rem] text-muted-foreground data-[state=on]:text-foreground sm:h-7 sm:px-2.5 sm:text-[0.8rem]"
          >
            Voice
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <p className="px-5 pb-3 text-[0.6875rem] leading-[1.5] text-muted-foreground">
        {errorCopy ??
          (live
            ? "Play one string at a time — Tonic names the note and how far off it sits. One cent is 0.06% of the pitch."
            : "Tap listen to tune with your microphone, or drag the needle to preview. One cent is 0.06% of the pitch — 0.25 Hz at A4.")}
      </p>

      <dl className="grid grid-cols-3 border-t border-border">
        {[
          { label: "Note", value: noteText, accent: true, glyph: true },
          { label: "Frequency", value: frequencyText },
          { label: "Offset", value: offsetText, tone: true },
        ].map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "flex flex-col gap-1 px-4 py-4",
              index !== 0 && "border-l border-border",
            )}
          >
            <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {item.label}
            </dt>
            <dd
              className={cn(
                "tabular-nums tracking-[-0.01em]",
                item.accent
                  ? "font-heading text-2xl leading-none"
                  : "text-sm leading-none",
                item.tone && TONE_TEXT[tone],
                live && stale && "opacity-60",
              )}
            >
              {item.glyph ? <NoteValue note={String(item.value)} /> : item.value}
            </dd>
            {item.label === "Offset" ? (
              <p
                className={cn(
                  "text-[0.6875rem] leading-none text-muted-foreground tabular-nums",
                  live && stale && "opacity-60",
                )}
              >
                {beatFrequency !== null && beatFrequency < 0.05
                  ? "no beats"
                  : `beating ${beatText}`}
              </p>
            ) : null}
          </div>
        ))}
      </dl>
    </div>
  );
}
