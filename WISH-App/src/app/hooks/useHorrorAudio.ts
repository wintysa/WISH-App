import { useRef, useCallback } from "react";

export function useHorrorAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // Deep horror click — low thud + crackle
  const playClick = useCallback(() => {
    try {
      const c = getCtx();
      const t = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(75, t);
      osc.frequency.exponentialRampToValueAtTime(22, t + 0.35);
      gain.gain.setValueAtTime(0.55, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.start(t);
      osc.stop(t + 0.45);

      const bufSize = Math.floor(c.sampleRate * 0.07);
      const buf = c.createBuffer(1, bufSize, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
      const src = c.createBufferSource();
      src.buffer = buf;
      const ng = c.createGain();
      ng.gain.setValueAtTime(0.18, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      src.connect(ng);
      ng.connect(c.destination);
      src.start(t);
    } catch (_) {}
  }, [getCtx]);

  // Ominous drone + descending whistle — for SETUJUI
  const playAccept = useCallback(() => {
    try {
      const c = getCtx();
      const t = c.currentTime;
      [1, 2, 3].forEach((h) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = h === 1 ? "sawtooth" : "sine";
        osc.frequency.setValueAtTime(55 * h, t);
        osc.frequency.linearRampToValueAtTime(50 * h, t + 2.5);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.13 / h, t + 0.2);
        gain.gain.setValueAtTime(0.13 / h, t + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 3);
        osc.start(t);
        osc.stop(t + 3);
      });
      const w = c.createOscillator();
      const wg = c.createGain();
      w.connect(wg);
      wg.connect(c.destination);
      w.type = "sine";
      w.frequency.setValueAtTime(700, t + 0.4);
      w.frequency.exponentialRampToValueAtTime(60, t + 2);
      wg.gain.setValueAtTime(0.07, t + 0.4);
      wg.gain.exponentialRampToValueAtTime(0.001, t + 2.2);
      w.start(t + 0.4);
      w.stop(t + 2.2);
    } catch (_) {}
  }, [getCtx]);

  // Stutter glitch burst
  const playGlitch = useCallback(() => {
    try {
      const c = getCtx();
      const t = c.currentTime;
      for (let i = 0; i < 7; i++) {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(80 + Math.random() * 1400, t + i * 0.038);
        gain.gain.setValueAtTime(0.07, t + i * 0.038);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.038 + 0.032);
        osc.start(t + i * 0.038);
        osc.stop(t + i * 0.038 + 0.032);
      }
    } catch (_) {}
  }, [getCtx]);

  // Lub-dub heartbeat + eerie sustained drone
  const playHeartbeat = useCallback(() => {
    try {
      const c = getCtx();
      const t = c.currentTime;
      [0, 0.18, 1.0, 1.18, 2.0, 2.18, 3.0, 3.18].forEach((offset, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(i % 2 === 0 ? 68 : 52, t + offset);
        osc.frequency.exponentialRampToValueAtTime(22, t + offset + 0.22);
        gain.gain.setValueAtTime(0.45, t + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.28);
        osc.start(t + offset);
        osc.stop(t + offset + 0.28);
      });
      const drone = c.createOscillator();
      const dg = c.createGain();
      drone.connect(dg);
      dg.connect(c.destination);
      drone.type = "sine";
      drone.frequency.setValueAtTime(111, t);
      drone.frequency.linearRampToValueAtTime(108, t + 5);
      dg.gain.setValueAtTime(0, t);
      dg.gain.linearRampToValueAtTime(0.07, t + 0.6);
      dg.gain.setValueAtTime(0.07, t + 4);
      dg.gain.linearRampToValueAtTime(0, t + 5.5);
      drone.start(t);
      drone.stop(t + 5.5);
    } catch (_) {}
  }, [getCtx]);

  // Dark screen-transition whoosh
  const playTransition = useCallback(() => {
    try {
      const c = getCtx();
      const t = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(28, t + 0.55);
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.start(t);
      osc.stop(t + 0.55);
    } catch (_) {}
  }, [getCtx]);

  // Breath sound — for splash
  const playBreath = useCallback(() => {
    try {
      const c = getCtx();
      const t = c.currentTime;
      const bufSize = Math.floor(c.sampleRate * 1.2);
      const buf = c.createBuffer(1, bufSize, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        const env =
          i < bufSize * 0.4
            ? i / (bufSize * 0.4)
            : (bufSize - i) / (bufSize * 0.6);
        data[i] = (Math.random() * 2 - 1) * env * 0.18;
      }
      const src = c.createBufferSource();
      src.buffer = buf;
      const filter = c.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 800;
      filter.Q.value = 0.8;
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.6, t);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(c.destination);
      src.start(t);
    } catch (_) {}
  }, [getCtx]);

  return { playClick, playAccept, playGlitch, playHeartbeat, playTransition, playBreath };
}
