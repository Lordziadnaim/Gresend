// Caméra orthographique (vrai rendu isométrique) pilotée par images-clés.
// Une seule caméra pour tout le film : c'est le plan-séquence.
import {useThree} from '@react-three/fiber';
import {useLayoutEffect} from 'react';
import {Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {OrthographicCamera, Vector3} from 'three';
import {W} from '../timeline';
import {APARTMENT_X, bikePos, V3} from './paths';

type CamKey = {t: number; target: V3; zoom: number};

// Direction de vue : plongée ~35°, façades nord (face +Z) bien visibles.
const VIEW_DIR = new Vector3(0.85, 1.05, 1.45).normalize();
const DIST = 160;

const FOLLOW_START = W.file + 0.05;
const FOLLOW_END = 20.1;
const followTarget = (t: number): V3 => {
  const b = bikePos(t);
  return [b[0] - 3, 1, b[2] - 1.5];
};

const KEYS: CamKey[] = [
  // P1 — fenêtre de la cliente, push-in lent
  {t: 0, target: [APARTMENT_X, 4.0, -1.4], zoom: 78},
  {t: 2.7, target: [APARTMENT_X, 4.0, -1.4], zoom: 84},
  // → crane up / recul : on découvre la rue
  {t: 3.9, target: [-33, 1.5, 1.5], zoom: 52},
  // P2 — travelling latéral le long de la file
  {t: W.freeze, target: [-12, 0.6, 2], zoom: 46},
  // P3 — gel, puis dolly-in pendant la bascule
  {t: W.freeze + 0.35, target: [-12, 0.6, 2], zoom: 46},
  {t: 11.9, target: [-9, 0.6, 2], zoom: 55},
  // P4 — on suit le colis : boutique → entrepôt
  {t: 12.7, target: [7, 1, -1], zoom: 54},
  {t: 13.5, target: [20.5, 1.2, -2.5], zoom: 52},
  {t: 14.7, target: [25.5, 1.6, -3.5], zoom: 50},
  // → porte de l'entrepôt, le vélo attend
  {t: FOLLOW_START, target: followTarget(FOLLOW_START), zoom: 48},
  // P5 — (suivi du vélo, voir plus bas)
  {t: FOLLOW_END, target: followTarget(FOLLOW_END), zoom: 44},
  // P6 — crane up + dézoom : tout Bruxelles
  {t: 21.6, target: [-10, 0, 0], zoom: 15},
  {t: 23.4, target: [-14, 0, 2], zoom: 9},
  // P7 — plongée vers chez la cliente (couverte par l'écran du téléphone)
  {t: 25.2, target: [APARTMENT_X, 1.8, -0.2], zoom: 72},
  // P8 — la livraison, push-in
  {t: 28.0, target: [APARTMENT_X, 1.8, -0.2], zoom: 82},
  // P9 — recul et élévation vers le logo
  {t: 29.4, target: [-30, 0, 0], zoom: 18},
];

const ease = Easing.bezier(0.65, 0, 0.35, 1);

export const cameraAt = (t: number): CamKey => {
  if (t >= FOLLOW_START && t <= FOLLOW_END) {
    const zoom = 48 + ((44 - 48) * (t - FOLLOW_START)) / (FOLLOW_END - FOLLOW_START);
    return {t, target: followTarget(t), zoom};
  }
  if (t <= KEYS[0].t) return KEYS[0];
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (t <= b.t) {
      const k = ease((t - a.t) / (b.t - a.t));
      return {
        t,
        target: [
          a.target[0] + (b.target[0] - a.target[0]) * k,
          a.target[1] + (b.target[1] - a.target[1]) * k,
          a.target[2] + (b.target[2] - a.target[2]) * k,
        ],
        // le zoom s'interpole en log pour un dézoom « optique »
        zoom: Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * k),
      };
    }
  }
  return KEYS[KEYS.length - 1];
};

// `closeup` : caméra qui suit le vélo de près (composition VeloCloseup, look-dev).
export const CameraRig: React.FC<{zoomScale?: number; tOffset?: number; closeup?: number}> = ({
  zoomScale = 1,
  tOffset = 0,
  closeup,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const camera = useThree((s) => s.camera) as OrthographicCamera;

  useLayoutEffect(() => {
    const t = frame / fps + tOffset;
    const cam = closeup
      ? {target: [bikePos(t)[0] - 0.4, 0.9, bikePos(t)[2]] as V3, zoom: closeup}
      : cameraAt(t);
    const {target, zoom} = cam;
    const tgt = new Vector3(...target);
    camera.position.copy(tgt.clone().add(VIEW_DIR.clone().multiplyScalar(DIST)));
    camera.up.set(0, 1, 0);
    camera.lookAt(tgt);
    camera.zoom = zoom * zoomScale;
    camera.near = 0.1;
    camera.far = 1000;
    camera.updateProjectionMatrix();
  }, [frame, fps, camera, zoomScale, tOffset, closeup]);

  return null;
};
