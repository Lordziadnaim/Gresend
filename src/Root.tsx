import {Composition} from 'remotion';
import {Animatique} from './Animatique';
import {FPS, HEIGHT, WIDTH} from './brand';
import {TOTAL_FRAMES} from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Animatique"
      component={Animatique}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{showHud: true}}
    />
  </>
);
