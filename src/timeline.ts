// Minutage calé sur la voix off finale (public/audio/vo-fr.wav, Luca prise 2, 33,25 s).
// Les ancres (en secondes) viennent de la carte des silences de la prise (ffmpeg
// silencedetect) recoupée avec la transcription Scribe. Si la voix change, on ne
// modifie QUE ce fichier : tout le film se recale.
import {FPS} from './brand';

export const VO_DURATION = 33.25;
export const END_HOLD = 3.25; // carte de fin lisible > 3 s après la dernière phrase
export const TOTAL_SEC = VO_DURATION + END_HOLD; // 36,5 s
export const TOTAL_FRAMES = Math.round(TOTAL_SEC * FPS);

export const f = (sec: number) => Math.round(sec * FPS);

// Phrases de la voix off (début, fin) — sert aux sous-titres et au HUD.
export const VO_LINES: {start: number; end: number; text: string}[] = [
  {start: 0.12, end: 1.65, text: 'Votre client a commandé hier…'},
  {start: 2.34, end: 3.13, text: 'Il attend toujours.'},
  {start: 3.62, end: 6.22, text: 'Bouchons, stationnement, zones basses émissions…'},
  {start: 6.8, end: 8.81, text: 'À Bruxelles, chaque retard vous coûte un client.'},
  {start: 9.89, end: 12.02, text: 'Avec Gresend, votre colis ne fait plus la queue.'},
  {start: 12.38, end: 14.53, text: 'On le récupère, on le trie, on le stocke…'},
  {start: 14.96, end: 15.78, text: 'aux portes de Bruxelles.'},
  {start: 16.14, end: 18.65, text: 'Puis il file en vélo-cargo, ou en camionnette électrique —'},
  {start: 18.93, end: 19.9, text: 'pendant que les autres attendent.'},
  {start: 20.31, end: 22.26, text: 'Express, au frais, en tournée…'},
  {start: 22.55, end: 23.45, text: 'Sept jours sur sept.'},
  {start: 23.71, end: 25.3, text: 'Et vous suivez tout, en temps réel.'},
  {start: 25.72, end: 28.07, text: 'Livré. À l’heure. En parfait état.'},
  {start: 28.37, end: 31.02, text: 'Gresend. La livraison, en toute simplicité.'},
  {start: 31.36, end: 32.88, text: 'Demandez votre devis sur notre site.'},
];

// Ancres de mots clés (secondes) utilisées par l'animation.
export const W = {
  bouchons: 3.62,
  stationnement: 4.3,
  lez: 5.15,
  bruxellesRetard: 6.8,
  freeze: 8.85,
  avec: 9.89,
  queue: 11.2,
  recupere: 12.38,
  trie: 13.2,
  stocke: 13.95,
  portes: 14.96,
  file: 16.14,
  camionnette: 17.55,
  autres: 18.93,
  express: 20.31,
  frais: 21.08,
  tournee: 21.71,
  septJours: 22.55,
  suivez: 23.71,
  livre: 25.72,
  heure: 26.52,
  etat: 27.48,
  gresend: 28.37,
  livraison: 29.32,
  demandez: 31.36,
} as const;

// Les 10 temps de caméra du storyboard (preprod/02-script-storyboard.md).
export const BEATS: {id: string; name: string; start: number; end: number}[] = [
  {id: 'P1', name: 'L’attente', start: 0, end: 3.4},
  {id: 'P2', name: 'Le chaos', start: 3.4, end: 9.0},
  {id: 'P3', name: 'La bascule', start: 9.0, end: 12.2},
  {id: 'P4', name: 'La prise en charge', start: 12.2, end: 15.95},
  {id: 'P5', name: 'Le mécanisme', start: 15.95, end: 20.1},
  {id: 'P6', name: 'L’étendue du service', start: 20.1, end: 23.55},
  {id: 'P7', name: 'Le suivi', start: 23.55, end: 25.5},
  {id: 'P8', name: 'La livraison', start: 25.5, end: 28.2},
  {id: 'P9', name: 'Le logo', start: 28.2, end: 31.2},
  {id: 'P10', name: 'L’appel à l’action', start: 31.2, end: TOTAL_SEC},
];
