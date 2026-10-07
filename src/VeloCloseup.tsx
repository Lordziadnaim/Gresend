// Gros plan de contrôle / look-dev du vélo-cargo (hors film).
import './fonts';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill} from 'remotion';
import {C, HEIGHT, WIDTH} from './brand';
import {CameraRig} from './world/CameraRig';
import {World} from './world/World';

export type VeloCloseupProps = {tOffset: number; zoom: number};

export const VeloCloseup: React.FC<VeloCloseupProps> = ({tOffset, zoom}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.skyTop}, ${C.skyBottom})`}}>
    <ThreeCanvas orthographic width={WIDTH} height={HEIGHT} camera={{zoom: 50, position: [100, 100, 100]}}>
      <CameraRig tOffset={tOffset} closeup={zoom} />
      <World tOffset={tOffset} />
    </ThreeCanvas>
  </AbsoluteFill>
);
