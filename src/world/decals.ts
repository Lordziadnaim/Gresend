// Marquages Gresend peints dans des textures (vrai logo SVG + police de la marque).
// Utilisés uniquement sur ce qui appartient à Gresend : vélo, camionnette, entrepôt.
import {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {CanvasTexture, SRGBColorSpace} from 'three';

// Charge le logo SVG + la police une seule fois, en bloquant le rendu tant que ce
// n'est pas prêt (sinon la première image partirait sans marquage).
let logoPromise: Promise<HTMLImageElement | null> | null = null;
const loadLogo = () => {
  if (!logoPromise) {
    logoPromise = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = staticFile('brand/logo-gresend.svg');
    });
  }
  return logoPromise;
};

export const useBrandAssets = () => {
  const [logo, setLogo] = useState<HTMLImageElement | null | undefined>(undefined);
  const [handle] = useState(() => delayRender('Logo + police Gresend pour les marquages'));
  useEffect(() => {
    Promise.all([loadLogo(), document.fonts.load('900 120px "Red Hat Display"').catch(() => null)]).then(([img]) => {
      setLogo(img);
      continueRender(handle);
    });
  }, [handle]);
  return logo;
};

type DecalSpec = {
  w: number; // px
  h: number;
  bg?: string; // fond (sinon transparent)
  radius?: number;
  logoColor: string;
  logoWidth: number; // fraction de la largeur
  logoY: number; // centre vertical (fraction)
  lines?: {text: string; size: number; weight: number; color: string; y: number}[];
  bolt?: {x: number; y: number; s: number; color: string};
};

const tintedLogo = (logo: HTMLImageElement, color: string, w: number) => {
  const ratio = 669 / 2663; // proportions du logo vectorisé
  const c = document.createElement('canvas');
  c.width = Math.round(w);
  c.height = Math.round(w * ratio);
  const g = c.getContext('2d')!;
  g.drawImage(logo, 0, 0, c.width, c.height);
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = color;
  g.fillRect(0, 0, c.width, c.height);
  return c;
};

export const useDecalTexture = (logo: HTMLImageElement | null | undefined, spec: DecalSpec) =>
  useMemo(() => {
    const c = document.createElement('canvas');
    c.width = spec.w;
    c.height = spec.h;
    const g = c.getContext('2d')!;
    if (spec.bg) {
      const r = spec.radius ?? 0;
      g.fillStyle = spec.bg;
      g.beginPath();
      g.roundRect(0, 0, spec.w, spec.h, r);
      g.fill();
    }
    const lw = spec.w * spec.logoWidth;
    if (logo) {
      const t = tintedLogo(logo, spec.logoColor, lw);
      g.drawImage(t, (spec.w - t.width) / 2, spec.h * spec.logoY - t.height / 2);
    } else {
      g.fillStyle = spec.logoColor;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.font = `900 ${Math.round(lw / 4)}px "Red Hat Display", Arial`;
      g.fillText('gresend', spec.w / 2, spec.h * spec.logoY);
    }
    for (const l of spec.lines ?? []) {
      g.fillStyle = l.color;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.font = `${l.weight} ${l.size}px "Red Hat Display", Arial`;
      g.fillText(l.text, spec.w / 2, spec.h * l.y);
    }
    if (spec.bolt) {
      const {x, y, s, color} = spec.bolt;
      g.fillStyle = color;
      g.beginPath();
      g.moveTo(x + 0.15 * s, y);
      g.lineTo(x - 0.35 * s, y + 0.55 * s);
      g.lineTo(x - 0.02 * s, y + 0.55 * s);
      g.lineTo(x - 0.15 * s, y + s);
      g.lineTo(x + 0.35 * s, y + 0.42 * s);
      g.lineTo(x + 0.02 * s, y + 0.42 * s);
      g.closePath();
      g.fill();
    }
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logo]);

// Ombre douce posée au sol (dégradé radial).
export const useShadowTexture = () =>
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
