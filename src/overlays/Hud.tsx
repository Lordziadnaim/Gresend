// Repères d'animatique : plan en cours, timecode, phrase de voix off.
import {AbsoluteFill} from 'remotion';
import {FONT} from '../brand';
import {BEATS, VO_LINES} from '../timeline';
import {useT} from './ui';

export const Hud: React.FC = () => {
  const {t, frame} = useT();
  const beat = BEATS.find((b) => t >= b.start && t < b.end) ?? BEATS[BEATS.length - 1];
  const line = VO_LINES.find((l) => t >= l.start - 0.05 && t <= l.end + 0.15);
  const k = (t - beat.start) / (beat.end - beat.start);
  const tc = `${String(Math.floor(t)).padStart(2, '0')}:${String(frame % 30).padStart(2, '0')}`;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', fontFamily: FONT}}>
      <div
        style={{
          position: 'absolute',
          left: 28,
          top: 24,
          background: 'rgba(10,10,10,.78)',
          color: '#fff',
          borderRadius: 12,
          padding: '10px 16px',
          fontSize: 22,
          fontWeight: 700,
          display: 'flex',
          gap: 14,
          alignItems: 'center',
        }}
      >
        <span style={{color: '#62C70A'}}>ANIMATIQUE v3</span>
        <span>
          {beat.id} · {beat.name}
        </span>
        <span style={{opacity: 0.7, fontWeight: 500}}>{tc}</span>
        <div style={{width: 120, height: 6, background: 'rgba(255,255,255,.2)', borderRadius: 3}}>
          <div style={{width: `${Math.min(1, k) * 100}%`, height: '100%', background: '#62C70A', borderRadius: 3}} />
        </div>
      </div>
      {line && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 34,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              background: 'rgba(10,10,10,.72)',
              color: '#fff',
              fontSize: 30,
              fontWeight: 500,
              padding: '8px 18px',
              borderRadius: 10,
            }}
          >
            VO : {line.text}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
