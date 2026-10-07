import {Composition} from 'remotion';
import {Animatique} from './Animatique';
import {VeloCloseup} from './VeloCloseup';
import {FPS, HEIGHT, WIDTH} from './brand';
import {TOTAL_FRAMES} from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    {/* MASTER à livrer : sans repères, musique + bruitages mixés */}
    <Composition
      id="GresendLeColis"
      component={Animatique}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{showHud: false, mix: true}}
    />
    <Composition
      id="Animatique"
      component={Animatique}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{showHud: true}}
    />
    <Composition
      id="VeloCloseup"
      component={VeloCloseup}
      durationInFrames={120}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{tOffset: 17.2, zoom: 210}}
    />
  </>
);
