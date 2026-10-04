// ANIMATIQUE v1 — « Le Colis » (Gresend)
// Blocs gris, vraie caméra, vrai rythme, voix off finale. On valide ici le
// timing et la lisibilité AVANT le look-dev (étape 4 de 04-production-remotion.md).
import './fonts';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile} from 'remotion';
import {C, FONT, HEIGHT, WIDTH} from './brand';
import {Hud} from './overlays/Hud';
import {
  BlobWipe,
  ChaosWords,
  DeliveredNotif,
  DeliveredWords,
  EndCard,
  LogoReveal,
  PickupChips,
  QueueLine,
  ReviewCard,
  ServicesAndWeek,
  TrackingPhone,
  VehicleTags,
  WaitingPhone,
} from './overlays/Acts';
import {useT} from './overlays/ui';
import {W} from './timeline';
import {CameraRig} from './world/CameraRig';
import {World} from './world/World';

export type AnimatiqueProps = {showHud: boolean};

export const Animatique: React.FC<AnimatiqueProps> = ({showHud}) => {
  const {t} = useT();

  // Script couleur : acte 1 désaturé, bascule pendant le lavis menthe.
  const sat = interpolate(t, [W.freeze + 0.6, W.freeze + 1.0], [0.3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const bright = interpolate(t, [W.freeze + 0.6, W.freeze + 1.0], [0.96, 1.02], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${C.skyTop}, ${C.skyBottom})`,
        fontFamily: FONT,
      }}
    >
      <AbsoluteFill style={{filter: `saturate(${sat}) brightness(${bright})`}}>
        <ThreeCanvas orthographic width={WIDTH} height={HEIGHT} camera={{zoom: 50, position: [100, 100, 100]}}>
          <CameraRig />
          <World />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* Acte 1 */}
      <WaitingPhone />
      <ChaosWords />
      <ReviewCard />
      {/* Bascule */}
      <BlobWipe />
      <QueueLine />
      {/* Acte 2 */}
      <PickupChips />
      <VehicleTags />
      <ServicesAndWeek />
      <TrackingPhone />
      {/* Acte 3 */}
      <DeliveredWords />
      <DeliveredNotif />
      <LogoReveal />
      <EndCard />

      <Audio src={staticFile('audio/vo-fr.wav')} />
      {showHud && <Hud />}
    </AbsoluteFill>
  );
};
