// Calques 2D synchronisés sur la voix off, plan par plan.
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';
import {C, FONT} from '../brand';
import {W} from '../timeline';
import {Check, Stars, card, useAppear, useT, windowOpacity} from './ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ───────────────────────── P1 — téléphone « en attente »
export const WaitingPhone: React.FC = () => {
  const {t} = useT();
  const o = windowOpacity(t, 0.3, 3.6);
  const a = useAppear(0.3);
  return (
    <div
      style={{
        position: 'absolute',
        right: 170,
        top: 230,
        opacity: o,
        transform: `translateY(${(1 - a) * 40}px)`,
        ...card,
        padding: '26px 30px',
        width: 470,
      }}
    >
      <div style={{fontSize: 22, color: '#6B7480', fontWeight: 500}}>Commande #2847</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 10}}>
        <svg width="34" height="34" viewBox="0 0 50 50" style={{transform: `rotate(${t * 360}deg)`}}>
          <circle cx="25" cy="25" r="20" stroke="#DADFE5" strokeWidth="6" fill="none" />
          <path d="M25 5 a20 20 0 0 1 20 20" stroke={C.problemRed} strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
        <div style={{fontSize: 32, fontWeight: 700}}>En attente de livraison</div>
      </div>
      <div style={{fontSize: 22, color: C.problemRed, marginTop: 10, fontWeight: 700}}>
        Commandé hier · {14 + Math.floor(t * 2)} h de retard
      </div>
    </div>
  );
};

// ───────────────────────── P2 — mots-impacts + avis 1 étoile
const Stamp: React.FC<{at: number; text: string; x: number; y: number; rot: number}> = ({at, text, x, y, rot}) => {
  const {t} = useT();
  const a = useAppear(at, 11);
  const o = windowOpacity(t, at, W.freeze + 0.5, 0.12);
  const shake = t < W.freeze ? Math.sin(t * 60) * 1.5 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: o,
        transform: `rotate(${rot}deg) scale(${1.6 - 0.6 * a}) translateX(${shake}px)`,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 116,
        letterSpacing: -2,
        color: C.white,
        background: C.problemRed,
        padding: '0 28px',
        borderRadius: 14,
        boxShadow: '0 16px 40px rgba(229,72,77,.35)',
      }}
    >
      {text}
    </div>
  );
};

export const ChaosWords: React.FC = () => (
  <AbsoluteFill>
    <Stamp at={W.bouchons} text="BOUCHONS" x={120} y={110} rot={-4} />
    <Stamp at={W.stationnement} text="STATIONNEMENT" x={260} y={290} rot={2} />
    <Stamp at={W.lez} text="LEZ" x={1480} y={120} rot={-6} />
  </AbsoluteFill>
);

// Carte d'avis : 1★ (P2) qui se retourne en 5★ (P8).
export const ReviewCard: React.FC = () => {
  const {t} = useT();
  const bad = windowOpacity(t, W.bruxellesRetard + 0.7, W.freeze + 0.5);
  const good = windowOpacity(t, W.heure + 0.3, 28.3);
  const flip = interpolate(t, [W.heure + 0.3, W.heure + 0.8], [90, 0], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const show = bad > 0 ? {o: bad, n: 1, txt: '« Toujours pas reçu… »', rot: 0} : {o: good, n: 5, txt: '« Super rapide, merci ! »', rot: flip};
  if (show.o <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        right: 150,
        bottom: 170,
        opacity: show.o,
        transform: `perspective(900px) rotateY(${show.rot}deg)`,
        ...card,
        padding: '24px 30px',
        width: 460,
      }}
    >
      <Stars n={show.n} />
      <div style={{fontSize: 32, fontWeight: 700, marginTop: 12}}>{show.txt}</div>
      <div style={{fontSize: 20, color: '#6B7480', marginTop: 6}}>Avis client · Google</div>
    </div>
  );
};

// ───────────────────────── P3 — la bascule : blob menthe 2 couches
export const BlobWipe: React.FC = () => {
  const {t} = useT();
  const grow = interpolate(t, [W.freeze + 0.3, W.freeze + 0.95], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const out = interpolate(t, [W.freeze + 0.95, W.avec + 0.15], [1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
  if (grow <= 0 || out <= 0) return null;
  const s = grow * 34;
  const blob = (color: string, dx: number, dy: number, scale: number) => (
    <svg
      viewBox="0 0 100 100"
      style={{
        position: 'absolute',
        right: -60 + dx,
        bottom: -60 + dy,
        width: 160,
        height: 160,
        transform: `scale(${s * scale}) rotate(${t * 40}deg)`,
        transformOrigin: '70% 70%',
      }}
    >
      <path d="M50 4c22 0 44 14 44 40 0 30-24 52-52 52C18 96 6 78 6 58 6 26 26 4 50 4z" fill={color} />
    </svg>
  );
  return (
    <AbsoluteFill style={{opacity: out}}>
      {blob(C.mintLight, -30, -24, 1.04)}
      {blob(C.mint, 0, 0, 1)}
    </AbsoluteFill>
  );
};

export const QueueLine: React.FC = () => {
  const {t} = useT();
  const words = ['ne', 'fait', 'plus', 'la', 'queue.'];
  const o = windowOpacity(t, W.queue - 0.2, 12.3, 0.2);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', opacity: o, fontFamily: FONT}}>
      {words.map((w, i) => {
        const at = W.queue + i * 0.14;
        const k = interpolate(t, [at, at + 0.3], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 14px',
              fontSize: 110,
              fontWeight: 800,
              color: w === 'queue.' ? C.lime : C.ink,
              opacity: k,
              transform: `translateY(${(1 - k) * 30}px)`,
              textShadow: '0 4px 30px rgba(255,255,255,.9)',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ───────────────────────── P4 — puces d'interface (récupère / trie / stocke)
const Chip: React.FC<{at: number; label: string; sub?: string; y: number}> = ({at, label, sub, y}) => {
  const {t} = useT();
  const a = useAppear(at);
  const o = windowOpacity(t, at, 15.95);
  return (
    <div
      style={{
        position: 'absolute',
        left: 110,
        top: y,
        opacity: o,
        transform: `translateX(${(1 - a) * -40}px)`,
        ...card,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '18px 28px 18px 20px',
      }}
    >
      <Check />
      <div style={{fontSize: 34, fontWeight: 700}}>{label}</div>
      {sub && <div style={{fontSize: 26, color: '#6B7480', fontWeight: 500}}>{sub}</div>}
    </div>
  );
};

export const PickupChips: React.FC = () => (
  <AbsoluteFill>
    <Chip at={W.recupere} label="Pris en charge" sub="09:12" y={170} />
    <Chip at={W.trie} label="Trié" y={270} />
    <Chip at={W.stocke} label="En stock" y={370} />
    <Chip at={W.portes} label="Drogenbos" sub="aux portes de Bruxelles" y={470} />
  </AbsoluteFill>
);

// ───────────────────────── P5 — étiquettes véhicules
const Tag: React.FC<{at: number; end: number; text: string; x: number; y: number; icon?: string}> = ({at, end, text, x, y, icon}) => {
  const {t} = useT();
  const a = useAppear(at);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: windowOpacity(t, at, end),
        transform: `scale(${0.8 + 0.2 * a})`,
        background: C.lime,
        color: C.white,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 40,
        padding: '10px 24px',
        borderRadius: 999,
        boxShadow: '0 10px 30px rgba(98,199,10,.35)',
      }}
    >
      {icon ? `${icon} ` : ''}
      {text}
    </div>
  );
};

export const VehicleTags: React.FC = () => (
  <AbsoluteFill>
    <Tag at={W.file + 0.2} end={20.0} text="Vélo-cargo" x={760} y={250} />
    <Tag at={W.camionnette} end={20.0} text="100 % électrique" icon="⚡" x={1090} y={340} />
    <Tag at={W.autres} end={20.0} text="LEZ ✓" x={160} y={240} />
  </AbsoluteFill>
);

// ───────────────────────── P6 — services + 7j/7
const Service: React.FC<{at: number; icon: string; label: string; x: number}> = ({at, icon, label, x}) => {
  const {t} = useT();
  const a = useAppear(at, 12);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 150,
        opacity: windowOpacity(t, at, 23.6),
        transform: `translateY(${(1 - a) * 30}px) scale(${0.85 + 0.15 * a})`,
        ...card,
        padding: '22px 34px',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <div style={{fontSize: 52}}>{icon}</div>
      <div style={{fontSize: 44, fontWeight: 800}}>{label}</div>
    </div>
  );
};

export const ServicesAndWeek: React.FC = () => {
  const {t} = useT();
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  return (
    <AbsoluteFill>
      <Service at={W.express} icon="⚡" label="Express" x={250} />
      <Service at={W.frais} icon="❄️" label="Au frais · 3 °C" x={720} />
      <Service at={W.tournee} icon="📍" label="Tournées" x={1330} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 150,
          display: 'flex',
          justifyContent: 'center',
          gap: 18,
          opacity: windowOpacity(t, W.septJours - 0.1, 23.7, 0.15),
        }}
      >
        {days.map((d, i) => {
          const on = t > W.septJours + i * 0.1;
          return (
            <div
              key={i}
              style={{
                width: 104,
                height: 104,
                borderRadius: 24,
                background: on ? C.lime : C.white,
                color: on ? C.white : C.ink,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 54,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(10,10,10,.12)',
                transform: `scale(${on ? 1.06 : 1})`,
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── P7 — suivi en temps réel (plein écran téléphone)
export const TrackingPhone: React.FC = () => {
  const {t} = useT();
  const inK = interpolate(t, [W.suivez - 0.25, W.suivez + 0.25], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const outK = interpolate(t, [25.2, 25.55], [1, 0], {...clamp, easing: Easing.in(Easing.cubic)});
  const k = Math.min(inK, outK);
  if (k <= 0) return null;
  const prog = interpolate(t, [W.suivez, 25.4], [0.15, 0.92], clamp);
  // tracé de la tournée sur la mini-carte
  const path = 'M60 520 C 140 470, 120 380, 210 340 S 330 250, 300 160 S 360 80, 420 70';
  const pt = (p: number) => {
    // approximation : interpolation sur des points du tracé
    const pts = [[60, 520], [150, 450], [210, 340], [300, 260], [300, 160], [360, 95], [420, 70]];
    const f = p * (pts.length - 1);
    const i = Math.min(pts.length - 2, Math.floor(f));
    const r = f - i;
    return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r];
  };
  const [dx, dy] = pt(prog);
  const mins = Math.max(1, Math.ceil(4 - (t - W.suivez) * 1.2));
  return (
    <AbsoluteFill style={{background: `rgba(234,244,252,${0.92 * k})`, alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          width: 520,
          height: 900,
          borderRadius: 64,
          background: C.ink,
          padding: 18,
          transform: `scale(${0.7 + 0.3 * k}) translateY(${(1 - k) * 200}px)`,
          boxShadow: '0 40px 120px rgba(10,10,10,.35)',
        }}
      >
        <div style={{width: '100%', height: '100%', borderRadius: 48, background: '#F4F7FA', overflow: 'hidden', position: 'relative', fontFamily: FONT}}>
          <svg viewBox="0 0 484 600" style={{position: 'absolute', top: 0, width: '100%'}}>
            <rect width="484" height="600" fill="#EAF0F5" />
            {[80, 180, 280, 380, 480].map((y) => <rect key={y} x="0" y={y} width="484" height="18" fill="#fff" />)}
            {[70, 200, 330, 440].map((x) => <rect key={x} x={x} y="0" width="18" height="600" fill="#fff" />)}
            <path d={path} stroke={C.lime} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="6 0" />
            <circle cx="420" cy="70" r="16" fill={C.ink} />
            <circle cx={dx} cy={dy} r={22 + Math.sin(t * 8) * 3} fill={C.lime} opacity={0.3} />
            <circle cx={dx} cy={dy} r="14" fill={C.lime} stroke="#fff" strokeWidth="4" />
          </svg>
          <div style={{position: 'absolute', left: 24, right: 24, bottom: 24, ...card, padding: 26}}>
            <div style={{fontSize: 22, color: '#6B7480', fontWeight: 500}}>Votre colis · Gresend</div>
            <div style={{fontSize: 40, fontWeight: 800, marginTop: 6}}>Arrivée dans {mins} min</div>
            <div style={{height: 10, borderRadius: 5, background: '#E4E8EC', marginTop: 16}}>
              <div style={{width: `${prog * 100}%`, height: '100%', borderRadius: 5, background: C.lime}} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── P8 — Livré. À l'heure. En parfait état.
export const DeliveredWords: React.FC = () => {
  const {t} = useT();
  const items = [
    {at: W.livre, txt: 'Livré.'},
    {at: W.heure, txt: 'À l’heure.'},
    {at: W.etat, txt: 'En parfait état.'},
  ];
  const o = windowOpacity(t, W.livre - 0.1, 28.35, 0.2);
  return (
    <div style={{position: 'absolute', left: 120, top: 170, opacity: o}}>
      {items.map((it) => {
        const k = interpolate(t, [it.at, it.at + 0.3], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        return (
          <div key={it.txt} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18, opacity: k, transform: `translateX(${(1 - k) * -30}px)`}}>
            <Check size={56} />
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 78, color: C.ink, textShadow: '0 4px 30px rgba(255,255,255,.9)'}}>{it.txt}</div>
          </div>
        );
      })}
    </div>
  );
};

export const DeliveredNotif: React.FC = () => {
  const {t} = useT();
  const a = useAppear(W.livre + 0.15);
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 40,
        opacity: windowOpacity(t, W.livre + 0.1, 28.3),
        transform: `translate(-50%, ${(1 - a) * -60}px)`,
        ...card,
        padding: '18px 30px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <Check size={40} />
      <div style={{fontSize: 34, fontWeight: 700}}>Livré · 10:42</div>
      <div style={{fontSize: 24, color: '#6B7480'}}>Gresend</div>
    </div>
  );
};

// ───────────────────────── P9 — logo + signature (sur blanc)
export const LogoReveal: React.FC = () => {
  const {t} = useT();
  const white = interpolate(t, [28.25, 28.75], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const outToEnd = interpolate(t, [31.05, 31.4], [1, 0], clamp);
  const a = useAppear(W.gresend, 13);
  if (white <= 0) return null;
  const tag = interpolate(t, [W.livraison, W.livraison + 0.45], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const blobBreath = 1 + Math.sin(t * 2.2) * 0.03;
  return (
    <AbsoluteFill style={{background: C.white, opacity: white, alignItems: 'center', justifyContent: 'center'}}>
      <svg viewBox="0 0 100 100" style={{position: 'absolute', right: 120, top: 70, width: 260, height: 260, transform: `scale(${blobBreath * a})`, opacity: outToEnd}}>
        <path d="M50 6c22 0 42 14 42 38 0 28-22 48-48 48C20 92 8 76 8 56 8 26 28 6 50 6z" fill={C.mintLight} transform="translate(4 -3)" />
        <path d="M50 6c22 0 42 14 42 38 0 28-22 48-48 48C20 92 8 76 8 56 8 26 28 6 50 6z" fill={C.mint} />
      </svg>
      <div style={{opacity: outToEnd, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-gresend.svg')} style={{width: 980, transform: `scale(${0.85 + 0.15 * a})`, opacity: a}} />
        <div style={{fontFamily: FONT, fontWeight: 500, fontSize: 64, color: C.ink, marginTop: 36, opacity: tag, transform: `translateY(${(1 - tag) * 20}px)`}}>
          La livraison, en toute simplicité.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── P10 — carte de fin
export const EndCard: React.FC = () => {
  const {t} = useT();
  const k = interpolate(t, [31.1, 31.6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const press = t > W.demandez + 1.1 && t < W.demandez + 1.35 ? 0.96 : 1;
  if (k <= 0) return null;
  const icons = ['7j/7', '⚡ Électrique', '❄️ Frigo', '📦 Stockage'];
  return (
    <AbsoluteFill style={{background: C.white, opacity: k, alignItems: 'center', justifyContent: 'center', fontFamily: FONT}}>
      <Img src={staticFile('brand/logo-gresend.svg')} style={{width: 420, marginBottom: 40}} />
      <div style={{fontSize: 150, fontWeight: 900, color: C.ink, letterSpacing: -3}}>gresend.be</div>
      <div
        style={{
          marginTop: 40,
          background: C.lime,
          color: C.white,
          fontSize: 54,
          fontWeight: 800,
          padding: '22px 56px',
          borderRadius: 999,
          transform: `scale(${press})`,
          boxShadow: '0 16px 40px rgba(98,199,10,.35)',
        }}
      >
        Demander un devis →
      </div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: C.ink}}>+32 471 30 40 31</div>
      <div style={{display: 'flex', gap: 22, marginTop: 40}}>
        {icons.map((i) => (
          <div key={i} style={{fontSize: 30, fontWeight: 700, padding: '10px 22px', borderRadius: 999, background: '#F1F5F8', color: C.ink}}>
            {i}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
