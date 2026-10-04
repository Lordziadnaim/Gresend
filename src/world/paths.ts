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

// Le vélo-cargo : attend devant l'entrepôt, file sur la piste cyclable
// le long de la file de voitures, s'arrête devant chez la cliente.
export const bikeX = (t: number) => {
  if (t < W.file) return WAREHOUSE_DOOR[0];
  if (t < 23.5) {
    const k = interpolate(t, [W.file, 23.5], [0, 1], {
      easing: Easing.bezier(0.45, 0, 0.75, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return WAREHOUSE_DOOR[0] + (APARTMENT_X + 4 - WAREHOUSE_DOOR[0]) * k;
  }
  return interpolate(t, [23.5, 25.4], [APARTMENT_X + 4, APARTMENT_X + 0.5], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};
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
