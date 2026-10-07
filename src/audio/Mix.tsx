// Mixage final : voix off (priorité), musique avec ducking automatique sous la voix,
// bruitages placés sur les ancres de la timeline. Normalisation -14 LUFS faite à
// l'export (ffmpeg loudnorm), ici on règle les équilibres.
import {Audio, Sequence, interpolate, staticFile, useVideoConfig} from 'remotion';
import {TOTAL_SEC, VO_LINES, W} from '../timeline';

// Décalage de la musique : son « drop » (~8,3 s dans le fichier) tombe sur le lavis
// menthe de la bascule (~9,3 s dans le film).
const MUSIC_OFFSET = 1.0;

const voActivity = (t: number) => {
  // part du temps occupée par la voix dans une fenêtre de ±0,25 s (ducking doux)
  let on = 0;
  const N = 10;
  for (let i = 0; i < N; i++) {
    const s = t - 0.25 + (0.5 * i) / (N - 1);
    if (VO_LINES.some((l) => s >= l.start - 0.08 && s <= l.end + 0.12)) on++;
  }
  return on / N;
};

const musicGain = (t: number) => {
  const base = t < W.freeze ? 0.42 : 0.6;
  const ducked = base - (base - 0.2) * voActivity(t);
  // silence dramatique pendant le gel de la bascule
  const freeze = interpolate(t, [W.freeze - 0.1, W.freeze, W.freeze + 0.35, W.freeze + 0.5], [1, 0.08, 0.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(t, [TOTAL_SEC - 1.4, TOTAL_SEC - 0.05], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return ducked * freeze * fadeOut;
};

const Sfx: React.FC<{at: number; src: string; vol: number; trim?: number; dur?: number; loop?: boolean}> = ({
  at,
  src,
  vol,
  trim = 0,
  dur,
  loop,
}) => {
  const {fps} = useVideoConfig();
  return (
    <Sequence from={Math.round(at * fps)} durationInFrames={dur ? Math.round(dur * fps) : undefined} layout="none">
      <Audio src={staticFile(`audio/sfx/${src}`)} volume={vol} trimBefore={Math.round(trim * fps)} loop={loop} />
    </Sequence>
  );
};

export const Mix: React.FC = () => {
  const {fps} = useVideoConfig();
  const clicks = [W.recupere, W.stocke, W.portes, W.file + 0.2, W.camionnette, W.autres, W.express, W.frais, W.tournee];
  return (
    <>
      {/* voix off */}
      <Audio src={staticFile('audio/vo-fr.wav')} volume={1} />

      {/* musique */}
      <Sequence from={Math.round(MUSIC_OFFSET * fps)} layout="none">
        <Audio src={staticFile('audio/music/music.mp3')} volume={(f) => musicGain(f / fps + MUSIC_OFFSET) * 0.9} />
      </Sequence>

      {/* acte 1 */}
      <Sfx at={0} src="clock.mp3" vol={0.45} />
      <Sfx at={3.4} src="traffic.mp3" vol={0.18} dur={5.4} loop />
      <Sfx at={W.bouchons} src="stamp.mp3" vol={0.5} dur={0.6} />
      <Sfx at={W.stationnement} src="stamp.mp3" vol={0.5} dur={0.6} />
      <Sfx at={W.lez} src="stamp.mp3" vol={0.5} dur={0.6} />
      <Sfx at={W.freeze - 3.9} src="riser.mp3" vol={0.28} trim={3.5} />

      {/* bascule */}
      <Sfx at={W.freeze + 0.32} src="whoosh-pop.mp3" vol={0.6} />

      {/* acte 2 */}
      {clicks.map((c) => (
        <Sfx key={c} at={c} src="click.mp3" vol={0.28} dur={0.5} />
      ))}
      <Sfx at={W.trie - 0.05} src="scanner.mp3" vol={0.4} />
      <Sfx at={W.file + 0.05} src="bell.mp3" vol={0.5} />

      {/* acte 3 */}
      <Sfx at={W.livre + 0.1} src="chime.mp3" vol={0.55} />
      <Sfx at={W.gresend - 0.05} src="impact.mp3" vol={0.7} />
      <Sfx at={W.demandez + 1.1} src="click.mp3" vol={0.45} dur={0.5} />
    </>
  );
};
