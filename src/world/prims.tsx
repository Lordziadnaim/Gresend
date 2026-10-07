// Primitives partagées (tubes, rotules, roues) pour les éléments détaillés.
import {Quaternion, Vector3} from 'three';

export type P3 = [number, number, number];
const UP = new Vector3(0, 1, 0);

// Cylindre tendu entre deux points.
export const Rod: React.FC<{a: P3; b: P3; r: number; color: string; rb?: number; emissive?: string}> = ({
  a,
  b,
  r,
  color,
  rb,
  emissive,
}) => {
  const va = new Vector3(...a);
  const vb = new Vector3(...b);
  const dir = vb.clone().sub(va);
  const len = Math.max(dir.length(), 1e-4);
  const q = new Quaternion().setFromUnitVectors(UP, dir.normalize());
  const mid = va.add(vb).multiplyScalar(0.5);
  return (
    <mesh position={mid} quaternion={q}>
      <cylinderGeometry args={[rb ?? r, r, len, 12]} />
      <meshLambertMaterial color={color} emissive={emissive ?? '#000000'} />
    </mesh>
  );
};

export const Ball: React.FC<{p: P3; r: number; color: string}> = ({p, r, color}) => (
  <mesh position={p}>
    <sphereGeometry args={[r, 14, 10]} />
    <meshLambertMaterial color={color} />
  </mesh>
);

export const Block: React.FC<{
  p: P3; // centre
  s: P3;
  color: string;
  emissive?: string;
  rot?: P3;
}> = ({p, s, color, emissive, rot}) => (
  <mesh position={p} rotation={rot ?? [0, 0, 0]}>
    <boxGeometry args={s} />
    <meshLambertMaterial color={color} emissive={emissive ?? '#000000'} />
  </mesh>
);

// Roue de véhicule (pneu, jante en alu, 5 branches). Roule : angle = distance / rayon.
// Axe = Z local ; la roue est dans le plan XY (sens de marche le long de X).
export const VanWheel: React.FC<{p: P3; r: number; travel: number}> = ({p, r, travel}) => (
  <group position={p} rotation={[0, 0, travel / r]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[r, r, 0.24, 24]} />
      <meshLambertMaterial color="#1B1E22" />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[r * 0.62, r * 0.62, 0.26, 24]} />
      <meshLambertMaterial color="#C9CFD6" />
    </mesh>
    {[0, 1, 2, 3, 4].map((i) => (
      <mesh key={i} position={[0, 0, 0.135]} rotation={[0, 0, (i * 2 * Math.PI) / 5]}>
        <boxGeometry args={[r * 1.1, r * 0.16, 0.02]} />
        <meshLambertMaterial color="#8C949C" />
      </mesh>
    ))}
  </group>
);
