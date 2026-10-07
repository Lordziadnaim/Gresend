// Trajectoires du plan-séquence (temps en secondes → position monde).
// Repère : la rue principale suit l'axe X ; les façades « nord » regardent +Z.
import {Easing, interpolate} from 'remotion';
import {W} from '../timeline';

export type V3 = [number, number, number];

const ease = Easing.bezier(0.65, 0, 0.35, 1);

const lerp3 = (a: V3, b: V3, k: number): V3 => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
  a[2] + (b[2] - a[2]) * k,
];

// Lieux
export const APARTMENT_X = -40;
export const SHOP: V3 = [8, 0, -2.5];
export const WAREHOUSE_DOOR: V3 = [24, 0, 5.2];
export const BIKE_LANE_Z = 5.2;
export const DOOR: V3 = [APARTMENT_X, 0, -0.4];

// Le vélo-cargo : profil de VITESSE réaliste (accélère, file, freine), intégré
// pour obtenir la position — donc pas de glissement, et des roues qui tournent juste.
// Il double la camionnette grise bloquée pendant « …pendant que les autres attendent »
// (≈ 19,3 s) puis freine pour s'arrêter devant chez la cliente.
const BIKE_V: [number, number][] = [
  [W.file, 0],
  [16.9, 14],
  [20.1, 14],
  [21.5, 2],
  [23.7, 0],
];
const BIKE_STOP_X = APARTMENT_X + 0.5;
const distanceUntil = (t: number) => {
  let d = 0;
  for (let i = 0; i < BIKE_V.length - 1; i++) {
    const [t0, v0] = BIKE_V[i];
    const [t1, v1] = BIKE_V[i + 1];
    if (t <= t0) break;
    const te = Math.min(t, t1);
    const ve = v0 + ((v1 - v0) * (te - t0)) / (t1 - t0);
    d += ((v0 + ve) / 2) * (te - t0);
  }
  return d;
};
const BIKE_TOTAL = distanceUntil(1e9);
export const bikeX = (t: number) =>
  WAREHOUSE_DOOR[0] - (distanceUntil(t) / BIKE_TOTAL) * (WAREHOUSE_DOOR[0] - BIKE_STOP_X);
export const bikePos = (t: number): V3 => [bikeX(t), 0, BIKE_LANE_Z];

// Le colis : boutique → convoyeur → scanner → rayonnage → vélo → porte.
type Key = {t: number; p: V3};
const PARCEL_KEYS: Key[] = [
  {t: 0, p: [SHOP[0], 1.1, -0.6]},
  {t: W.recupere, p: [SHOP[0], 1.1, -0.6]},
  {t: W.recupere + 0.7, p: [19.2, 1.35, -3]},
  {t: W.stocke - 0.1, p: [25, 1.35, -3]},
  {t: W.stocke + 0.6, p: [27.5, 2.6, -5.6]},
  {t: 15.2, p: [27.5, 2.6, -5.6]},
  {t: W.file - 0.05, p: [WAREHOUSE_DOOR[0] - 1.1, 1.55, BIKE_LANE_Z]},
];

export const parcelPos = (t: number): V3 => {
  // Sur le vélo pendant le trajet
  if (t >= W.file - 0.05 && t < W.livre + 0.3) {
    const b = bikePos(t);
    return [b[0] - 1.1, 1.55, b[2]];
  }
  // Remis à la cliente
  if (t >= W.livre + 0.3) {
    const from: V3 = [bikePos(t)[0] - 1.1, 1.55, BIKE_LANE_Z];
    const k = interpolate(t, [W.livre + 0.3, W.heure + 0.2], [0, 1], {
      easing: ease,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return lerp3(from, [DOOR[0] + 0.5, 1.25, DOOR[2] + 0.9], k);
  }
  for (let i = 0; i < PARCEL_KEYS.length - 1; i++) {
    const a = PARCEL_KEYS[i];
    const b = PARCEL_KEYS[i + 1];
    if (t <= b.t) {
      const k = b.t === a.t ? 1 : ease((t - a.t) / (b.t - a.t));
      return lerp3(a.p, b.p, Math.max(0, Math.min(1, k)));
    }
  }
  return PARCEL_KEYS[PARCEL_KEYS.length - 1].p;
};

// Camionnette électrique Gresend : roule librement sur l'autre voie.
export const evanX = (t: number) => -46 + (t - 15.2) * 8.5;

// Temps « monde » : gel de 0,4 s au moment de la bascule (P3).
export const simTime = (t: number) =>
  t < W.freeze ? t : t < W.freeze + 0.4 ? W.freeze : t - 0.4;
