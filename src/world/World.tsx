// Monde isométrique — version ANIMATIQUE : blocs gris, seuls le colis (orange)
// et les véhicules Gresend (lime) sont en couleur pour lire l'action.
import {useLayoutEffect, useMemo, useRef} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Color, InstancedMesh, Object3D} from 'three';
import {C} from '../brand';
import {CargoBike} from './CargoBike';
import {W} from '../timeline';
import {
  APARTMENT_X,
  BIKE_LANE_Z,
  DOOR,
  SHOP,
  WAREHOUSE_DOOR,
  bikePos,
  evanX,
  parcelPos,
  simTime,
} from './paths';

const Box: React.FC<{
  p: [number, number, number];
  s: [number, number, number];
  color: string;
  emissive?: string;
  opacity?: number;
}> = ({p, s, color, emissive, opacity = 1}) => (
  <mesh position={[p[0], p[1] + s[1] / 2, p[2]]}>
    <boxGeometry args={s} />
    <meshLambertMaterial
      color={color}
      emissive={emissive ?? '#000000'}
      transparent={opacity < 1}
      opacity={opacity}
    />
  </mesh>
);

// Générateur pseudo-aléatoire déterministe (rendu identique à chaque image)
const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

// Ville en arrière-plan : blocs instanciés (un seul draw call).
const City: React.FC = () => {
  const ref = useRef<InstancedMesh>(null);
  const blocks = useMemo(() => {
    const r = rng(42);
    const out: {x: number; z: number; w: number; d: number; h: number; c: string}[] = [];
    for (let x = -150; x <= 120; x += 13) {
      for (let z = -110; z <= 110; z += 13) {
        // on laisse libre le couloir de la rue principale et ses façades
        if (z > -16 && z < 18) continue;
        if (r() < 0.12) continue; // places / parcs
        out.push({
          x: x + r() * 2,
          z: z + r() * 2,
          w: 7 + r() * 4,
          d: 7 + r() * 4,
          h: z > 0 ? 0.8 + r() * 2.2 : 4 + r() * 9,
          c: r() < 0.5 ? C.block : C.blockDark,
        });
      }
    }
    return out;
  }, []);

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new Object3D();
    blocks.forEach((b, i) => {
      o.position.set(b.x, b.h / 2, b.z);
      o.scale.set(b.w, b.h, b.d);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, new Color(b.c));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [blocks]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, blocks.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial />
    </instancedMesh>
  );
};

// Rangée de maisons bruxelloises étroites le long de la rue (façade + pignon).
const StreetRow: React.FC<{z: number; skip: [number, number][]}> = ({z, skip}) => {
  const houses = useMemo(() => {
    const r = rng(7 + Math.round(z));
    const out: {x: number; w: number; h: number; c: string}[] = [];
    for (let x = -70; x < 50; ) {
      const w = 3.2 + r() * 1.6;
      const inSkip = skip.some(([a, b]) => x + w > a && x < b);
      if (!inSkip) out.push({x: x + w / 2, w: w - 0.15, h: 6 + r() * 4, c: r() < 0.5 ? C.block : C.blockDark});
      x += w;
    }
    return out;
  }, [z, skip]);
  return (
    <group>
      {houses.map((h, i) => (
        <group key={i}>
          <Box p={[h.x, 0, z]} s={[h.w, h.h, 5]} color={h.c} />
          {/* pignon à gradins stylisé */}
          <Box p={[h.x, h.h, z]} s={[h.w * 0.6, 0.9, 5]} color={h.c} />
          <Box p={[h.x, h.h + 0.9, z]} s={[h.w * 0.25, 0.7, 5]} color={h.c} />
        </group>
      ))}
    </group>
  );
};

// Côté caméra : arbres ronds et haies basses (ne masquent jamais l'action).
const Trees: React.FC<{z: number}> = ({z}) => {
  const xs = useMemo(() => Array.from({length: 26}, (_, i) => -72 + i * 5.2), []);
  return (
    <group>
      <Box p={[-10, 0, z + 1.6]} s={[140, 0.5, 1.2]} color="#C9D9C3" />
      {xs.map((x) => (
        <group key={x} position={[x, 0, z]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.12, 0.15, 1.4, 8]} />
            <meshLambertMaterial color="#8C7A6B" />
          </mesh>
          <mesh position={[0, 2.0, 0]}>
            <sphereGeometry args={[0.95, 16, 12]} />
            <meshLambertMaterial color="#B5CDB0" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Car: React.FC<{x: number; z: number; t: number; van?: boolean; brakeOn: boolean}> = ({
  x,
  z,
  van,
  brakeOn,
}) => {
  const L = van ? 4.6 : 3.6;
  const H = van ? 2.3 : 1.4;
  return (
    <group position={[x, 0, z]}>
      <Box p={[0, 0.3, 0]} s={[L, H, 1.8]} color={van ? '#A3ABB5' : C.problemGrey} />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <Wheel key={`${sx}${sz}`} p={[sx * (L / 2 - 0.75), 0.36, sz * 0.92]} r={0.36} travelX={x} />
        )),
      )}
      {!van && <Box p={[0.2, 0.3 + H, 0]} s={[L * 0.55, 0.8, 1.6]} color={C.problemGrey} />}
      {/* feux stop (côté +X = arrière) */}
      <Box
        p={[L / 2 + 0.02, 0.6, 0.6]}
        s={[0.08, 0.3, 0.35]}
        color={C.problemRed}
        emissive={brakeOn ? '#ff2a2a' : '#000000'}
      />
      <Box
        p={[L / 2 + 0.02, 0.6, -0.6]}
        s={[0.08, 0.3, 0.35]}
        color={C.problemRed}
        emissive={brakeOn ? '#ff2a2a' : '#000000'}
      />
    </group>
  );
};

// Roue réaliste : elle tourne autour de SON axe, à la vitesse qui correspond au
// déplacement (angle = distance / rayon), avec jante et rayons pour qu'on voie
// la rotation. Axe de la roue = Z monde (les véhicules roulent le long de X).
const Wheel: React.FC<{p: [number, number, number]; r: number; travelX: number; width?: number}> = ({
  p,
  r,
  travelX,
  width = 0.16,
}) => {
  // Rouler vers +X = rotation horaire vue depuis +Z (angle négatif autour de Z).
  const angle = -travelX / r;
  return (
    // Euler XYZ : on tourne d'abord autour de l'axe du cylindre (Y local), puis on
    // le couche (X) pour aligner son axe sur Z monde.
    <group position={p} rotation={[Math.PI / 2, angle, 0]}>
      <mesh>
        <cylinderGeometry args={[r, r, width, 20]} />
        <meshLambertMaterial color={C.ink} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[r * 0.6, r * 0.6, width + 0.02, 20]} />
        <meshLambertMaterial color="#C9CFD6" />
      </mesh>
      {[0, Math.PI / 3, (2 * Math.PI) / 3].map((a) => (
        <mesh key={a} rotation={[0, a, 0]}>
          <boxGeometry args={[r * 1.15, width + 0.04, r * 0.16]} />
          <meshLambertMaterial color="#6B7480" />
        </mesh>
      ))}
    </group>
  );
};

const Person: React.FC<{p: [number, number, number]; color: string; scale?: number}> = ({
  p,
  color,
  scale = 1,
}) => (
  <group position={p} scale={scale}>
    <mesh position={[0, 0.75, 0]}>
      <cylinderGeometry args={[0.32, 0.36, 1.5, 12]} />
      <meshLambertMaterial color={color} />
    </mesh>
    <mesh position={[0, 1.8, 0]}>
      <sphereGeometry args={[0.32, 16, 12]} />
      <meshLambertMaterial color="#F1D3B6" />
    </mesh>
  </group>
);

const EVan: React.FC<{t: number}> = ({t}) => {
  const x = evanX(t);
  if (x < -75 || x > 60) return null;
  return (
    <group position={[x, 0, 2.9]}>
      <Box p={[0, 0.35, 0]} s={[4.8, 2.4, 1.9]} color={C.lime} />
      <Box p={[2.65, 0.35, 0]} s={[0.6, 1.5, 1.8]} color={C.lime} />
      {[-1.5, 1.6].map((wx) =>
        [-0.95, 0.95].map((wz) => <Wheel key={`${wx}${wz}`} p={[wx, 0.38, wz]} r={0.38} travelX={x} />),
      )}
    </group>
  );
};

const Warehouse: React.FC<{t: number}> = ({t}) => {
  const [x0, x1, z0, z1] = [17.5, 33, -9, 0.6];
  const scan = t > W.trie - 0.1 && t < W.trie + 0.6;
  return (
    <group>
      {/* dalle + murs en coupe (vue « maison de poupée ») */}
      <Box p={[(x0 + x1) / 2, 0, (z0 + z1) / 2]} s={[x1 - x0, 0.3, z1 - z0]} color="#E4E8EC" />
      <Box p={[(x0 + x1) / 2, 0, z0]} s={[x1 - x0, 6.5, 0.4]} color={C.blockDark} />
      <Box p={[x0, 0, (z0 + z1) / 2]} s={[0.4, 6.5, z1 - z0]} color={C.blockDark} />
      {/* bandeau lime : c'est l'entrepôt Gresend */}
      <Box p={[(x0 + x1) / 2, 6.5, z0]} s={[x1 - x0, 0.9, 0.5]} color={C.lime} />
      {/* convoyeur */}
      <Box p={[22, 0.3, -3]} s={[7, 0.75, 1.4]} color="#9AA3AE" />
      {/* portique scanner + faisceau menthe */}
      <Box p={[22, 0.3, -3.9]} s={[0.25, 2.6, 0.25]} color={C.ink} />
      <Box p={[22, 0.3, -2.1]} s={[0.25, 2.6, 0.25]} color={C.ink} />
      <Box p={[22, 2.9, -3]} s={[0.25, 0.25, 2.05]} color={C.ink} />
      {scan && <Box p={[22, 1.05, -3]} s={[0.08, 1.8, 1.7]} color={C.mint} emissive={C.mint} opacity={0.75} />}
      {/* rayonnages */}
      {[0, 1, 2].map((i) => (
        <group key={i}>
          <Box p={[26 + i * 2.4, 0.3, -6.2]} s={[2, 0.15, 1.6]} color={C.blockDark} />
          <Box p={[26 + i * 2.4, 2.1, -6.2]} s={[2, 0.15, 1.6]} color={C.blockDark} />
          <Box p={[26 + i * 2.4, 0.45, -6.2]} s={[0.9, 0.8, 0.9]} color="#E2B37A" />
        </group>
      ))}
      {/* porte côté rue */}
      <Box p={[WAREHOUSE_DOOR[0], 0, z1]} s={[3.2, 3.4, 0.2]} color={C.ink} opacity={0.15} />
    </group>
  );
};

const Shop: React.FC = () => (
  <group>
    <Box p={[SHOP[0], 0, -3.6]} s={[6, 4, 4.8]} color={C.blockDark} />
    {/* vitrine + store */}
    <Box p={[SHOP[0], 0.4, -1.15]} s={[4.6, 2.2, 0.1]} color="#DDEAF3" />
    <Box p={[SHOP[0], 2.9, -0.7]} s={[6, 0.25, 1.2]} color={C.parcelShadow} />
    {/* comptoir */}
    <Box p={[SHOP[0], 0, -0.6]} s={[2.4, 1.0, 0.8]} color={C.block} />
  </group>
);

const Apartment: React.FC<{t: number}> = ({t}) => {
  const atDoor = t >= 25.2; // la cliente descend pendant l'écran du téléphone
  return (
    <group>
      <Box p={[APARTMENT_X, 0, -4]} s={[5, 8.5, 5]} color="#CBD2DA" />
      <Box p={[APARTMENT_X, 8.5, -4]} s={[3, 1, 5]} color="#CBD2DA" />
      {/* fenêtre + balcon */}
      <Box p={[APARTMENT_X, 3.6, -1.45]} s={[2.2, 2.2, 0.1]} color="#DDEAF3" />
      <Box p={[APARTMENT_X, 3.4, -0.9]} s={[2.8, 0.15, 1.0]} color={C.blockDark} />
      {/* porte */}
      <Box p={[APARTMENT_X + 1.4, 0, -1.45]} s={[1.2, 2.3, 0.1]} color="#8A6F5A" />
      {atDoor ? (
        <Person p={[DOOR[0] + 1.4, 0, DOOR[2] - 0.3]} color={C.mint} />
      ) : (
        <Person p={[APARTMENT_X - 0.4, 3.55, -0.9]} color={C.mint} />
      )}
    </group>
  );
};

export const World: React.FC<{tOffset?: number}> = ({tOffset = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + tOffset;
  const st = simTime(t);
  const [px, py, pz] = parcelPos(t);
  const brakePulse = Math.sin(st * 6) > -0.2;

  // File de voitures bloquées (on avance de quelques cm par seconde)
  const jam = useMemo(() => Array.from({length: 9}, (_, i) => -34 + i * 4.7), []);

  return (
    <group>
      <ambientLight intensity={1.4} />
      <hemisphereLight args={['#EAF4FC', '#B9C0C9', 0.9]} />
      <directionalLight position={[40, 70, 35]} intensity={2.2} color="#FFF4E5" />

      {/* sol, route, piste cyclable, trottoirs */}
      <Box p={[0, -0.3, 0]} s={[420, 0.3, 420]} color={C.ground} />
      <Box p={[-10, 0, 2]} s={[140, 0.04, 4.4]} color={C.asphalt} />
      <Box p={[-10, 0, BIKE_LANE_Z]} s={[140, 0.05, 1.5]} color={C.bikeLane} />
      <Box p={[-10, 0, -0.6]} s={[140, 0.12, 1.4]} color="#E3E7EC" />
      <Box p={[-10, 0, 6.6]} s={[140, 0.12, 1.2]} color="#E3E7EC" />

      <City />
      <StreetRow z={-4} skip={[[APARTMENT_X - 2.6, APARTMENT_X + 2.6], [SHOP[0] - 3.2, SHOP[0] + 3.2], [17, 33.5]]} />
      <Trees z={10.5} />

      <Apartment t={t} />
      <Shop />
      <Warehouse t={t} />

      {jam.map((x, i) => (
        <Car
          key={i}
          x={x - Math.min(st, 30) * 0.06}
          z={1.1}
          t={st}
          van={i === 4}
          brakeOn={brakePulse}
        />
      ))}

      <EVan t={t} />
      <CargoBike t={t} />

      {/* coursier Gresend devant la boutique (P4) */}
      {t > 11.5 && t < 13.4 && <Person p={[SHOP[0] + 1.4, 0, 0.4]} color={C.lime} />}

      {/* LE COLIS — le héros, seul objet chaud du film */}
      <Box p={[px, py, pz]} s={[0.75, 0.6, 0.75]} color={C.parcel} />
    </group>
  );
};
