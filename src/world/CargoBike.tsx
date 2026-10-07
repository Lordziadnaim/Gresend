// Vélo-cargo électrique Gresend (biporteur à 3 roues, caisson avant), à l'échelle
// réelle (1 unité = 1 m). Orienté vers -X (sens de la marche). Le livreur pédale
// réellement : les pédales tournent avec la distance parcourue et les jambes
// suivent les pédales par cinématique inverse (hanche → genou → pied).
import {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import {CanvasTexture, Quaternion, SRGBColorSpace, Vector3} from 'three';
import {C} from '../brand';
import {BIKE_BOX_X, bikeDistance, bikePos} from './paths';

type P3 = [number, number, number];

const FRAME = '#2B3036';
const NAVY = '#2B3442';
const SKIN = '#E9C3A0';
const UP = new Vector3(0, 1, 0);

// Cylindre tendu entre deux points (tubes du cadre, membres du livreur).
const Rod: React.FC<{a: P3; b: P3; r: number; color: string; rb?: number}> = ({a, b, r, color, rb}) => {
  const va = new Vector3(...a);
  const vb = new Vector3(...b);
  const dir = vb.clone().sub(va);
  const len = Math.max(dir.length(), 1e-4);
  const q = new Quaternion().setFromUnitVectors(UP, dir.normalize());
  const mid = va.add(vb).multiplyScalar(0.5);
  return (
    <mesh position={mid} quaternion={q}>
      <cylinderGeometry args={[rb ?? r, r, len, 12]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};

const Ball: React.FC<{p: P3; r: number; color: string}> = ({p, r, color}) => (
  <mesh position={p}>
    <sphereGeometry args={[r, 14, 10]} />
    <meshLambertMaterial color={color} />
  </mesh>
);

// Roue de vélo : pneu, jante, moyeu, rayons. Elle roule (angle = distance / rayon).
const BikeWheel: React.FC<{p: P3; r: number; travel: number}> = ({p, r, travel}) => (
  <group position={p} rotation={[0, 0, travel / r]}>
    <mesh>
      <torusGeometry args={[r - 0.035, 0.038, 10, 36]} />
      <meshLambertMaterial color="#1B1E22" />
    </mesh>
    <mesh>
      <torusGeometry args={[r - 0.085, 0.014, 6, 36]} />
      <meshLambertMaterial color="#AEB6BF" />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.035, 0.035, 0.1, 12]} />
      <meshLambertMaterial color="#6B7480" />
    </mesh>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <mesh key={i} rotation={[0, 0, (i * Math.PI) / 6]}>
        <boxGeometry args={[2 * (r - 0.09), 0.014, 0.014]} />
        <meshLambertMaterial color="#C9CFD6" />
      </mesh>
    ))}
  </group>
);

// Cinématique inverse à 2 segments dans le plan XY ; le genou part vers l'avant (-X).
const solveKnee = (hip: P3, foot: P3, l1: number, l2: number): P3 => {
  const dx = foot[0] - hip[0];
  const dy = foot[1] - hip[1];
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 1e-3);
  const base = Math.atan2(dy, dx);
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const k1: P3 = [hip[0] + l1 * Math.cos(base + a), hip[1] + l1 * Math.sin(base + a), (hip[2] + foot[2]) / 2];
  const k2: P3 = [hip[0] + l1 * Math.cos(base - a), hip[1] + l1 * Math.sin(base - a), (hip[2] + foot[2]) / 2];
  return k1[0] < k2[0] ? k1 : k2;
};

// Attend que Red Hat Display soit chargée avant de « peindre » le logo du caisson.
const useFontReady = () => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('Police du marquage du vélo'));
  useEffect(() => {
    const done = () => {
      setReady(true);
      continueRender(handle);
    };
    document.fonts.load('900 120px "Red Hat Display"').then(done, done);
  }, [handle]);
  return ready;
};

const useDecal = (ready: boolean) =>
  useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const g = c.getContext('2d')!;
    g.clearRect(0, 0, c.width, c.height);
    g.fillStyle = '#FFFFFF';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = '900 230px "Red Hat Display", Arial, sans-serif';
    g.fillText('gresend', 512, 230);
    g.font = '700 70px "Red Hat Display", Arial, sans-serif';
    g.fillText('livraison verte', 512, 400);
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [ready]);

const useShadow = () =>
  useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(20,28,36,0.42)');
    grad.addColorStop(1, 'rgba(20,28,36,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const tex = new CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);

// Géométrie du vélo (repère local, mètres)
const REAR: P3 = [0.82, 0.36, 0];
const R_REAR = 0.36;
const R_FRONT = 0.3;
const BB: P3 = [0.24, 0.3, 0]; // pédalier (moteur central)
const SEAT_TOP: P3 = [0.4, 0.98, 0];
const SADDLE: P3 = [0.42, 1.03, 0];
const HEAD_BOT: P3 = [-0.55, 0.55, 0];
const HEAD_TOP: P3 = [-0.44, 1.08, 0];
const BAR: P3 = [-0.36, 1.13, 0];
const BOX = {x: BIKE_BOX_X, floor: 0.42, L: 1.0, W: 0.86, H: 0.62};
const CRANK = 0.17;
const THIGH = 0.48;
const SHIN = 0.48;

const lerp = (a: P3, b: P3, k: number): P3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const z = (p: P3, zz: number): P3 => [p[0], p[1], zz];

export const CargoBike: React.FC<{t: number}> = ({t}) => {
  const ready = useFontReady();
  const decal = useDecal(ready);
  const shadow = useShadow();
  const [x, , zPos] = bikePos(t);
  const travel = bikeDistance(t);

  // Pédalage : 1 tour de pédalier tous les 9 m (assistance électrique, grand braquet).
  const theta = (travel * 2 * Math.PI) / 9;
  const pedal = (phase: number, side: number): P3 => [
    BB[0] + CRANK * Math.cos(theta + phase),
    BB[1] + CRANK * Math.sin(theta + phase),
    0.15 * side,
  ];
  const pedR = pedal(0, 1);
  const pedL = pedal(Math.PI, -1);
  const hipR: P3 = [0.4, 1.1, 0.11];
  const hipL: P3 = [0.4, 1.1, -0.11];
  const kneeR = solveKnee(hipR, pedR, THIGH, SHIN);
  const kneeL = solveKnee(hipL, pedL, THIGH, SHIN);

  const pelvis: P3 = [0.4, 1.12, 0];
  const chest: P3 = [0.08, 1.6, 0];
  const head: P3 = [-0.02, 1.82, 0];
  const shR: P3 = [0.07, 1.57, 0.2];
  const shL: P3 = [0.07, 1.57, -0.2];
  const handR: P3 = [BAR[0], BAR[1] + 0.02, 0.27];
  const handL: P3 = [BAR[0], BAR[1] + 0.02, -0.27];
  const elR: P3 = [-0.16, 1.33, 0.27];
  const elL: P3 = [-0.16, 1.33, -0.27];

  const bx = BOX.x;
  const top = BOX.floor + BOX.H;

  return (
    <group position={[x, 0, zPos]}>
      {/* ombre douce au sol */}
      <mesh position={[-0.35, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[3.2, 1.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>

      {/* roues */}
      <BikeWheel p={REAR} r={R_REAR} travel={travel} />
      <BikeWheel p={[bx, R_FRONT, 0.53]} r={R_FRONT} travel={travel} />
      <BikeWheel p={[bx, R_FRONT, -0.53]} r={R_FRONT} travel={travel} />
      <Rod a={[bx, R_FRONT, -0.55]} b={[bx, R_FRONT, 0.55]} r={0.025} color={FRAME} />

      {/* cadre */}
      <Rod a={z(REAR, 0.06)} b={z(BB, 0.04)} r={0.022} color={FRAME} />
      <Rod a={z(REAR, -0.06)} b={z(BB, -0.04)} r={0.022} color={FRAME} />
      <Rod a={z(REAR, 0.06)} b={[0.38, 0.92, 0.03]} r={0.018} color={FRAME} />
      <Rod a={z(REAR, -0.06)} b={[0.38, 0.92, -0.03]} r={0.018} color={FRAME} />
      <Rod a={BB} b={SEAT_TOP} r={0.03} color={FRAME} />
      <Rod a={SEAT_TOP} b={SADDLE} r={0.016} color="#9AA3AE" />
      <Rod a={BB} b={HEAD_BOT} r={0.045} color={FRAME} />
      <Rod a={HEAD_BOT} b={HEAD_TOP} r={0.035} color={FRAME} />
      <Rod a={HEAD_TOP} b={BAR} r={0.022} color={FRAME} />
      <Rod a={[BAR[0], BAR[1], -0.3]} b={[BAR[0], BAR[1], 0.3]} r={0.017} color={FRAME} />
      <Rod a={[BAR[0], BAR[1], 0.22]} b={[BAR[0], BAR[1], 0.31]} r={0.024} color="#15181B" />
      <Rod a={[BAR[0], BAR[1], -0.22]} b={[BAR[0], BAR[1], -0.31]} r={0.024} color="#15181B" />
      {/* longerons sous le caisson */}
      {[-0.28, 0.28].map((zz) => (
        <group key={zz}>
          <Rod a={z(HEAD_BOT, 0)} b={[-0.66, 0.4, zz]} r={0.025} color={FRAME} />
          <Rod a={[-0.66, 0.4, zz]} b={[bx - BOX.L / 2 - 0.02, 0.4, zz]} r={0.025} color={FRAME} />
        </group>
      ))}
      {/* batterie + moteur central + transmission */}
      <Rod a={lerp(BB, HEAD_BOT, 0.22)} b={lerp(BB, HEAD_BOT, 0.68)} r={0.07} color="#1C2024" />
      <mesh position={BB} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.16, 16]} />
        <meshLambertMaterial color="#1C2024" />
      </mesh>
      <mesh position={[BB[0], BB[1], 0.09]}>
        <torusGeometry args={[0.1, 0.012, 6, 24]} />
        <meshLambertMaterial color="#8C949C" />
      </mesh>
      <Rod a={[BB[0], BB[1] + 0.1, 0.09]} b={[REAR[0], REAR[1] + 0.05, 0.09]} r={0.007} color="#3A3F45" />
      <Rod a={[BB[0], BB[1] - 0.1, 0.09]} b={[REAR[0], REAR[1] - 0.05, 0.09]} r={0.007} color="#3A3F45" />
      {/* garde-boue arrière + feu */}
      <mesh position={REAR} rotation={[0, 0, Math.PI * 0.05]}>
        <torusGeometry args={[R_REAR + 0.05, 0.03, 6, 24, Math.PI * 0.75]} />
        <meshLambertMaterial color={FRAME} />
      </mesh>
      <mesh position={[REAR[0] + 0.36, REAR[1] + 0.22, 0]}>
        <boxGeometry args={[0.03, 0.05, 0.08]} />
        <meshLambertMaterial color={C.problemRed} emissive="#7a1010" />
      </mesh>
      {/* selle */}
      <mesh position={SADDLE}>
        <boxGeometry args={[0.27, 0.06, 0.15]} />
        <meshLambertMaterial color="#15181B" />
      </mesh>

      {/* caisson ouvert Gresend */}
      <mesh position={[bx, BOX.floor, 0]}>
        <boxGeometry args={[BOX.L, 0.04, BOX.W]} />
        <meshLambertMaterial color="#4FA308" />
      </mesh>
      <mesh position={[bx - BOX.L / 2, BOX.floor + BOX.H / 2, 0]}>
        <boxGeometry args={[0.04, BOX.H, BOX.W]} />
        <meshLambertMaterial color={C.lime} />
      </mesh>
      <mesh position={[bx + BOX.L / 2, BOX.floor + BOX.H / 2, 0]}>
        <boxGeometry args={[0.04, BOX.H, BOX.W]} />
        <meshLambertMaterial color="#58B309" />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} position={[bx, BOX.floor + BOX.H / 2, (s * BOX.W) / 2]}>
          <boxGeometry args={[BOX.L, BOX.H, 0.04]} />
          <meshLambertMaterial color={C.lime} />
        </mesh>
      ))}
      {/* liseré du rebord */}
      <Rod a={[bx - BOX.L / 2, top, BOX.W / 2]} b={[bx + BOX.L / 2, top, BOX.W / 2]} r={0.02} color="#3E8406" />
      <Rod a={[bx - BOX.L / 2, top, -BOX.W / 2]} b={[bx + BOX.L / 2, top, -BOX.W / 2]} r={0.02} color="#3E8406" />
      <Rod a={[bx + BOX.L / 2, top, -BOX.W / 2]} b={[bx + BOX.L / 2, top, BOX.W / 2]} r={0.02} color="#3E8406" />
      <Rod a={[bx - BOX.L / 2, top, -BOX.W / 2]} b={[bx - BOX.L / 2, top, BOX.W / 2]} r={0.02} color="#3E8406" />
      {/* marquage « gresend » sur le flanc visible */}
      <mesh position={[bx, BOX.floor + BOX.H / 2, BOX.W / 2 + 0.025]}>
        <planeGeometry args={[0.9, 0.45]} />
        <meshBasicMaterial map={decal} transparent depthWrite={false} />
      </mesh>
      {/* phare avant */}
      <mesh position={[bx - BOX.L / 2 - 0.03, BOX.floor + 0.45, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 14]} />
        <meshLambertMaterial color="#FFF6D6" emissive="#7a6a30" />
      </mesh>

      {/* livreur : jambes (pédalent) */}
      {[
        {hip: hipR, knee: kneeR, foot: pedR},
        {hip: hipL, knee: kneeL, foot: pedL},
      ].map((l, i) => (
        <group key={i}>
          <Rod a={l.hip} b={l.knee} r={0.075} rb={0.085} color={NAVY} />
          <Ball p={l.knee} r={0.072} color={NAVY} />
          <Rod a={l.knee} b={[l.foot[0], l.foot[1] + 0.06, l.foot[2]]} r={0.06} rb={0.07} color={NAVY} />
          <mesh position={[l.foot[0] - 0.04, l.foot[1] + 0.03, l.foot[2]]}>
            <boxGeometry args={[0.24, 0.08, 0.1]} />
            <meshLambertMaterial color="#15181B" />
          </mesh>
          {/* pédale + manivelle */}
          <Rod a={[BB[0], BB[1], l.foot[2] * 0.6]} b={[l.foot[0], l.foot[1], l.foot[2] * 0.6]} r={0.015} color="#8C949C" />
        </group>
      ))}
      {/* bassin, buste (veste lime Gresend), tête + casque */}
      <Ball p={pelvis} r={0.15} color={NAVY} />
      <Rod a={pelvis} b={chest} r={0.17} rb={0.15} color={C.lime} />
      <Ball p={chest} r={0.17} color={C.lime} />
      <Rod a={chest} b={[0.0, 1.74, 0]} r={0.05} color={SKIN} />
      <Ball p={head} r={0.12} color={SKIN} />
      <mesh position={[head[0] + 0.01, head[1] + 0.02, 0]} rotation={[0, 0, 0.25]}>
        <sphereGeometry args={[0.14, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#F4F6F8" />
      </mesh>
      {/* bras vers le guidon */}
      {[
        {sh: shR, el: elR, hand: handR},
        {sh: shL, el: elL, hand: handL},
      ].map((a, i) => (
        <group key={i}>
          <Rod a={a.sh} b={a.el} r={0.06} color={C.lime} />
          <Ball p={a.el} r={0.058} color={C.lime} />
          <Rod a={a.el} b={a.hand} r={0.05} color={C.lime} />
          <Ball p={a.hand} r={0.05} color={SKIN} />
        </group>
      ))}
    </group>
  );
};
