// Éléments Gresend détaillés (seuls éléments « premium » du décor, pour valoriser
// la marque) : coursier, camionnette électrique, entrepôt, borne de recharge.
import {C} from '../brand';
import {useBrandAssets, useDecalTexture, useShadowTexture} from './decals';
import {Ball, Block, P3, Rod, VanWheel} from './prims';

const NAVY = '#2B3442';
const SKIN = '#E9C3A0';
const GLASS = '#2A3846';
const LIME_DARK = '#4FA308';

// ───────────────────────── Coursier Gresend debout (veste lime, casque)
// Repère : il regarde vers -X ; `facing` = rotation autour de Y.
export const Courier: React.FC<{p: P3; facing?: number; carrying?: boolean; wave?: number}> = ({
  p,
  facing = 0,
  carrying = false,
}) => {
  const shadow = useShadowTexture();
  const hipR: P3 = [0, 0.95, 0.11];
  const hipL: P3 = [0, 0.95, -0.11];
  const footR: P3 = [-0.04, 0.05, 0.13];
  const footL: P3 = [0.04, 0.05, -0.13];
  const kneeR: P3 = [-0.03, 0.5, 0.12];
  const kneeL: P3 = [0.02, 0.5, -0.12];
  const pelvis: P3 = [0, 0.98, 0];
  const chest: P3 = [-0.02, 1.48, 0];
  const head: P3 = [-0.03, 1.72, 0];
  const shR: P3 = [-0.02, 1.47, 0.21];
  const shL: P3 = [-0.02, 1.47, -0.21];
  const elR: P3 = carrying ? [-0.24, 1.22, 0.24] : [0.0, 1.17, 0.26];
  const elL: P3 = carrying ? [-0.24, 1.22, -0.24] : [0.02, 1.17, -0.26];
  const hR: P3 = carrying ? [-0.45, 1.1, 0.2] : [0.0, 0.9, 0.27];
  const hL: P3 = carrying ? [-0.45, 1.1, -0.2] : [0.03, 0.9, -0.27];
  return (
    <group position={p} rotation={[0, facing, 0]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.1, 1.1, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
      {[
        {hip: hipR, knee: kneeR, foot: footR},
        {hip: hipL, knee: kneeL, foot: footL},
      ].map((l, i) => (
        <group key={i}>
          <Rod a={l.hip} b={l.knee} r={0.075} rb={0.085} color={NAVY} />
          <Ball p={l.knee} r={0.072} color={NAVY} />
          <Rod a={l.knee} b={[l.foot[0], l.foot[1] + 0.06, l.foot[2]]} r={0.06} rb={0.07} color={NAVY} />
          <Block p={[l.foot[0] - 0.05, l.foot[1], l.foot[2]]} s={[0.26, 0.09, 0.11]} color="#15181B" />
        </group>
      ))}
      <Ball p={pelvis} r={0.15} color={NAVY} />
      <Rod a={pelvis} b={chest} r={0.18} rb={0.16} color={C.lime} />
      <Ball p={chest} r={0.18} color={C.lime} />
      {/* bande réfléchissante */}
      <Rod a={[pelvis[0], 1.2, 0]} b={[pelvis[0], 1.25, 0]} r={0.185} color="#E8EEF2" />
      <Rod a={chest} b={[-0.03, 1.62, 0]} r={0.05} color={SKIN} />
      <Ball p={head} r={0.12} color={SKIN} />
      <mesh position={[head[0] + 0.01, head[1] + 0.02, 0]} rotation={[0, 0, 0.15]}>
        <sphereGeometry args={[0.14, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#F4F6F8" />
      </mesh>
      {[
        {sh: shR, el: elR, h: hR},
        {sh: shL, el: elL, h: hL},
      ].map((a, i) => (
        <group key={i}>
          <Rod a={a.sh} b={a.el} r={0.062} color={C.lime} />
          <Ball p={a.el} r={0.06} color={C.lime} />
          <Rod a={a.el} b={a.h} r={0.052} color={C.lime} />
          <Ball p={a.h} r={0.05} color={SKIN} />
        </group>
      ))}
    </group>
  );
};

// ───────────────────────── Camionnette électrique Gresend (roule vers +X)
export const GresendVan: React.FC<{p: P3; travel: number; facing?: number; lightsOn?: boolean}> = ({
  p,
  travel,
  facing = 0,
}) => {
  const logo = useBrandAssets();
  const shadow = useShadowTexture();
  const side = useDecalTexture(logo, {
    w: 1400,
    h: 620,
    logoColor: '#FFFFFF',
    logoWidth: 0.62,
    logoY: 0.36,
    lines: [
      {text: '100 % électrique · livraison verte', size: 62, weight: 800, color: '#FFFFFF', y: 0.7},
      {text: 'gresend.be', size: 54, weight: 700, color: '#EAFBE0', y: 0.88},
    ],
    bolt: {x: 1270, y: 380, s: 150, color: C.mint},
  });
  const back = useDecalTexture(logo, {w: 800, h: 520, logoColor: '#FFFFFF', logoWidth: 0.8, logoY: 0.45});
  const L0 = -2.45; // arrière
  const Lc = 1.05; // début cabine
  const W = 1.96;
  const travelZ = W / 2 + 0.002;
  return (
    <group position={p} rotation={[0, facing, 0]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[6.2, 2.9, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
      {/* caisse */}
      <Block p={[(L0 + Lc) / 2, 1.45, 0]} s={[Lc - L0, 2.0, W]} color={C.lime} />
      <Block p={[(L0 + Lc) / 2, 2.47, 0]} s={[Lc - L0 - 0.1, 0.06, W - 0.1]} color="#78D12A" />
      {/* cabine + capot */}
      <Block p={[Lc + 0.55, 1.2, 0]} s={[1.1, 1.5, W]} color={C.lime} />
      <Block p={[Lc + 1.35, 0.85, 0]} s={[0.55, 0.8, W - 0.04]} color={C.lime} />
      {/* pare-brise incliné */}
      <Block p={[Lc + 1.12, 1.62, 0]} s={[0.06, 0.82, W - 0.16]} color={GLASS} rot={[0, 0, -0.55]} />
      {/* vitres latérales */}
      {[1, -1].map((s) => (
        <Block key={s} p={[Lc + 0.5, 1.55, s * (W / 2 + 0.005)]} s={[0.78, 0.55, 0.01]} color={GLASS} />
      ))}
      {/* bas de caisse, pare-chocs */}
      <Block p={[(L0 + Lc + 1.65) / 2, 0.42, 0]} s={[Lc + 1.65 - L0, 0.2, W + 0.02]} color="#2B3036" />
      <Block p={[Lc + 1.66, 0.5, 0]} s={[0.1, 0.25, W + 0.04]} color="#2B3036" />
      <Block p={[L0 - 0.04, 0.5, 0]} s={[0.1, 0.25, W + 0.04]} color="#2B3036" />
      {/* phares / feux */}
      {[0.7, -0.7].map((zz) => (
        <group key={zz}>
          <Block p={[Lc + 1.63, 1.0, zz]} s={[0.04, 0.16, 0.36]} color="#FFF6D6" emissive="#8a7a3a" />
          <Block p={[L0 - 0.01, 1.2, zz * 1.18]} s={[0.04, 0.42, 0.12]} color={C.problemRed} emissive="#6a1010" />
        </group>
      ))}
      {/* rétroviseur */}
      <Block p={[Lc + 0.95, 1.6, W / 2 + 0.12]} s={[0.1, 0.18, 0.12]} color="#2B3036" />
      {/* poignée de recharge (trappe) */}
      <Block p={[Lc + 1.2, 1.0, W / 2 + 0.005]} s={[0.22, 0.16, 0.01]} color={LIME_DARK} />
      {/* marquages */}
      <mesh position={[(L0 + Lc) / 2, 1.5, travelZ]}>
        <planeGeometry args={[3.3, 1.46]} />
        <meshBasicMaterial map={side} transparent depthWrite={false} />
      </mesh>
      <mesh position={[L0 - 0.002, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.5, 0.98]} />
        <meshBasicMaterial map={back} transparent depthWrite={false} />
      </mesh>
      {/* roues */}
      {[-1.5, 1.7].map((wx) =>
        [-1, 1].map((s) => (
          <VanWheel key={`${wx}${s}`} p={[wx, 0.38, s * 0.88]} r={0.38} travel={travel} />
        )),
      )}
    </group>
  );
};

// ───────────────────────── Borne de recharge Gresend
export const ChargingStation: React.FC<{p: P3; t: number}> = ({p, t}) => {
  const pulse = 0.5 + 0.5 * Math.sin(t * 4);
  return (
    <group position={p}>
      <Block p={[0, 0.8, 0]} s={[0.4, 1.6, 0.3]} color="#E8EEF2" />
      <Block p={[0, 1.25, 0.152]} s={[0.26, 0.3, 0.01]} color="#1C2024" />
      <Block p={[0, 1.25, 0.158]} s={[0.18 * (0.4 + 0.6 * pulse), 0.05, 0.005]} color={C.lime} emissive="#3f7f06" />
      <Block p={[0, 1.6, 0]} s={[0.42, 0.06, 0.32]} color={C.lime} />
    </group>
  );
};

// ───────────────────────── Entrepôt Gresend (vue en coupe)
export const GresendWarehouse: React.FC<{t: number; scanOn: boolean; doorX: number}> = ({t, scanOn, doorX}) => {
  const logo = useBrandAssets();
  const sign = useDecalTexture(logo, {
    w: 1600,
    h: 420,
    bg: '#FFFFFF',
    radius: 40,
    logoColor: C.lime,
    logoWidth: 0.62,
    logoY: 0.42,
    lines: [{text: 'Logistique · Stockage · Livraison verte', size: 58, weight: 700, color: '#2B3442', y: 0.84}],
  });
  const doorSign = useDecalTexture(logo, {w: 900, h: 240, bg: C.lime, radius: 24, logoColor: '#FFFFFF', logoWidth: 0.7, logoY: 0.5});
  const [x0, x1, z0, z1] = [17.5, 33, -9, 0.6];
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const rollerPhase = (t * 3) % 1;
  return (
    <group>
      {/* dalle, sol époxy + marquages */}
      <Block p={[cx, 0.15, cz]} s={[x1 - x0, 0.3, z1 - z0]} color="#DDE2E7" />
      {[-4.6, -1.4].map((zz) => (
        <Block key={zz} p={[cx, 0.305, zz]} s={[x1 - x0 - 0.6, 0.01, 0.1]} color="#F2C230" />
      ))}
      {/* murs en coupe */}
      <Block p={[cx, 3.55, z0]} s={[x1 - x0, 6.5, 0.4]} color="#C3CAD2" />
      <Block p={[x0, 3.55, cz]} s={[0.4, 6.5, z1 - z0]} color="#B4BCC5" />
      {/* bandeau lime + enseigne avec le vrai logo */}
      <Block p={[cx, 7.25, z0]} s={[x1 - x0, 0.9, 0.5]} color={C.lime} />
      <mesh position={[cx, 5.0, z0 + 0.205]}>
        <planeGeometry args={[7.2, 1.9]} />
        <meshBasicMaterial map={sign} transparent depthWrite={false} />
      </mesh>
      {/* poutres + lampes suspendues */}
      {[21, 25.5, 30].map((xx) => (
        <group key={xx}>
          <Rod a={[xx, 6.6, z0]} b={[xx, 6.6, z1]} r={0.08} color="#9AA3AE" />
          <Rod a={[xx, 6.6, -3]} b={[xx, 5.6, -3]} r={0.015} color="#6B7480" />
          <mesh position={[xx, 5.5, -3]}>
            <coneGeometry args={[0.35, 0.25, 16, 1, true]} />
            <meshLambertMaterial color="#2B3036" side={2} />
          </mesh>
          <Block p={[xx, 5.42, -3]} s={[0.28, 0.04, 0.28]} color="#FFF6D6" emissive="#a0905a" />
        </group>
      ))}

      {/* convoyeur à rouleaux */}
      <Block p={[22, 0.95, -3]} s={[7.2, 0.12, 1.5]} color="#7C858F" />
      {Array.from({length: 22}, (_, i) => 18.6 + i * 0.32 + rollerPhase * 0.32).map((xx, i) => (
        <mesh key={i} position={[xx, 1.04, -3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.36, 10]} />
          <meshLambertMaterial color="#C9CFD6" />
        </mesh>
      ))}
      {[18.8, 22, 25.2].map((xx) =>
        [-3.6, -2.4].map((zz) => <Rod key={`${xx}${zz}`} a={[xx, 0.3, zz]} b={[xx, 0.9, zz]} r={0.05} color="#5A626B" />),
      )}
      {/* portique scanner Gresend */}
      <Block p={[22, 1.75, -3.85]} s={[0.22, 2.9, 0.22]} color="#2B3036" />
      <Block p={[22, 1.75, -2.15]} s={[0.22, 2.9, 0.22]} color="#2B3036" />
      <Block p={[22, 3.2, -3]} s={[0.3, 0.32, 1.95]} color={C.lime} />
      {scanOn && <Block p={[22, 2.0, -3]} s={[0.06, 1.8, 1.6]} color={C.mint} emissive={C.mint} />}

      {/* rayonnages + colis Gresend */}
      {[0, 1, 2].map((i) => {
        const sx = 26.2 + i * 2.3;
        return (
          <group key={i}>
            {[-6.9, -5.5].map((zz) =>
              [sx - 0.95, sx + 0.95].map((xx) => (
                <Rod key={`${xx}${zz}`} a={[xx, 0.3, zz]} b={[xx, 3.6, zz]} r={0.04} color="#3E6FB0" />
              )),
            )}
            {[0.45, 1.65, 2.85].map((yy) => (
              <group key={yy}>
                <Block p={[sx, yy + 0.3, -6.2]} s={[2.0, 0.08, 1.5]} color="#F28C28" />
                <Block p={[sx - 0.45, yy + 0.66, -6.2]} s={[0.7, 0.6, 0.7]} color="#D9A066" />
                {!(i === 0 && yy === 1.65) && (
                  <Block p={[sx + 0.45, yy + 0.6, -6.1]} s={[0.6, 0.5, 0.6]} color="#E2B37A" />
                )}
                <Block p={[sx - 0.45, yy + 0.66, -5.84]} s={[0.12, 0.6, 0.01]} color="#F4E6C8" />
              </group>
            ))}
          </group>
        );
      })}

      {/* porte côté rue : encadrement lime + rideau métallique relevé + enseigne */}
      <Block p={[doorX - 1.85, 1.95, z1]} s={[0.3, 3.3, 0.3]} color={C.lime} />
      <Block p={[doorX + 1.85, 1.95, z1]} s={[0.3, 3.3, 0.3]} color={C.lime} />
      <Block p={[doorX, 3.75, z1]} s={[4.0, 0.35, 0.3]} color={C.lime} />
      <mesh position={[doorX, 3.6, z1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 3.4, 16]} />
        <meshLambertMaterial color="#9AA3AE" />
      </mesh>
      <mesh position={[doorX, 4.35, z1 + 0.16]}>
        <planeGeometry args={[2.6, 0.7]} />
        <meshBasicMaterial map={doorSign} transparent depthWrite={false} />
      </mesh>

      {/* camionnette Gresend en recharge + borne */}
      <GresendVan p={[29.6, 0.3, -2.2]} travel={0} />
      <ChargingStation p={[32.4, 0.3, -0.6]} t={t} />
      <Rod a={[32.3, 1.3, -0.5]} b={[31.4, 1.05, -1.2]} r={0.025} color="#1C2024" />
    </group>
  );
};
