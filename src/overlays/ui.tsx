// Briques d'interface partagées (cartes, puces, apparitions).
import {CSSProperties} from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../brand';

export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: frame / fps, frame, fps};
};

// 0 → 1 avec un ressort léger (premium, jamais « cartoon »), démarrant à `at` secondes.
export const useAppear = (at: number, damping = 14) => {
  const {frame, fps} = useT();
  return spring({frame: frame - Math.round(at * fps), fps, config: {damping, mass: 0.8}});
};

// Fenêtre d'opacité [in, out] avec fondus courts.
export const windowOpacity = (t: number, start: number, end: number, fade = 0.25) =>
  interpolate(t, [start, start + fade, end - fade, end], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

export const card: CSSProperties = {
  background: C.white,
  borderRadius: 22,
  boxShadow: '0 12px 40px rgba(10,10,10,.14)',
  fontFamily: FONT,
  color: C.ink,
};

export const Check: React.FC<{size?: number}> = ({size = 34}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill={C.lime} />
    <path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Stars: React.FC<{n: number; size?: number}> = ({n, size = 34}) => (
  <div style={{display: 'flex', gap: 4}}>
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24">
        <path
          d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"
          fill={i < n ? '#F5B301' : '#DADFE5'}
        />
      </svg>
    ))}
  </div>
);
