# 04 — Plan de production Remotion

## Choix technique

**Monde 3D isométrique avec `@remotion/three`** (React Three Fiber) et une **caméra orthographique**, plus des **calques 2D** en React/SVG pour le texte, l'interface et le logo.

Pourquoi la 3D plutôt que du SVG isométrique dessiné à la main :
- **On obtient de vrais mouvements de caméra** (suivi, *crane*, dézoom) gratuitement. Pour un plan-séquence, c'est indispensable.
- **Le recadrage 9:16 et 4:5 est quasi gratuit :** on change seulement le cadrage de la caméra, pas les décors.
- **Le monde est réutilisable :** chaque future vidéo Gresend repart du même monde, c'est ce qui rend le prix de 100–200 € rentable.

**Plan B :** si le rendu WebGL pose problème sur ta machine ou sur le serveur, on passe le monde en SVG isométrique (projection 2:1). Les calques 2D restent identiques.

### Ressources 3D

- **Kenney.nl** (licence **CC0**, usage commercial libre) : *City Kit (Commercial)*, *City Kit (Roads)*, *Car Kit*. Ils fournissent les bâtiments, routes et voitures low-poly.
- **Fait sur mesure (primitives three.js) :**
  - le vélo-cargo Gresend ;
  - le colis ;
  - l'entrepôt en coupe ;
  - les personnages capsules ;
  - le blob.
- Les maisons bruxelloises à pignons à gradins sont construites avec des empilements de boîtes, c'est simple et très reconnaissable.

## Arborescence prévue

```
gresend/
├─ brand/                    # logo SVG, tokens.json
├─ preprod/                  # ces documents
├─ public/
│  ├─ audio/vo-fr.mp3        # voix off ElevenLabs v4
│  ├─ audio/music.mp3        # ElevenLabs Music
│  ├─ audio/sfx/*.mp3
│  ├─ models/*.glb           # Kenney CC0 + modèles maison
│  └─ data/vo-words.json     # timestamps mot à mot (Scribe)
└─ src/
   ├─ Root.tsx               # compositions : Hero16x9, Hero4x5, Reel9x16, Bumper6s
   ├─ brand.ts               # couleurs, polices, ressorts
   ├─ timeline.ts            # beats P1–P10 calés sur vo-words.json
   ├─ world/
   │  ├─ World.tsx           # scène 3D complète (une seule, tout le film)
   │  ├─ CameraRig.tsx       # caméra ortho, images-clés de position, zoom, cible
   │  ├─ BrusselsStreet.tsx, Warehouse.tsx, Shop.tsx, Apartment.tsx
   │  ├─ CargoBike.tsx, EVan.tsx, Car.tsx, Parcel.tsx, Person.tsx
   │  └─ RouteLine.tsx       # tracé lime (évolue → morph en logo)
   ├─ overlays/
   │  ├─ KineticWord.tsx     # BOUCHONS / LEZ…
   │  ├─ UiChip.tsx, PhoneTracking.tsx, ReviewCard.tsx, WeekBar.tsx
   │  ├─ BlobWipe.tsx        # transition menthe 2 couches
   │  ├─ LogoReveal.tsx      # flèches du « s » + lettres
   │  ├─ EndCard.tsx
   │  └─ Captions.tsx        # @remotion/captions (versions réseaux sociaux)
   └─ audio/Mix.tsx          # VO, musique avec ducking, SFX placés par beat
```

## Paquets

`remotion`, `@remotion/cli`, `@remotion/three`, `@react-three/fiber`, `@react-three/drei`, `three`, `@remotion/paths`, `@remotion/google-fonts`, `@remotion/captions`, `@remotion/motion-blur`, `@remotion/transitions`, `zod` (props typées, donc templates réutilisables).

**Rendu WebGL :** `npx remotion render … --gl=angle` (ou `--gl=swangle` sur un serveur sans GPU).

## Le principe clé : la voix off pilote le montage

1. On génère la VO (`eleven_v4`), en un seul fichier.
2. On la transcrit avec **ElevenLabs Scribe** (`eleven_scribe_v1`) pour obtenir le **timestamp de chaque mot**, enregistré dans `public/data/vo-words.json`.
3. `timeline.ts` définit chaque beat par **ancre de mot**, par exemple `P3.start = word("Avec").start - 0.3s`, et non en images codées en dur.
4. Si on change de voix ou de prise, **tout le film se recale automatiquement**. C'est indispensable pour la version NL et les futures vidéos.

## Étapes de production (dans l'ordre)

| # | Étape | Livrable | Validation |
|---|---|---|---|
| 1 | **Verrouiller le script** | `02-script-storyboard.md` final | Toi |
| 2 | **Tests de voix** (2 premières phrases × 3 voix) | 3 MP3 | Toi : choix de la voix |
| 3 | **VO complète** (2–3 prises) + Scribe | `vo-fr.mp3`, `vo-words.json` | Toi |
| 4 | **Animatique** : boîtes grises, caméra et timing réels, VO calée | MP4 basse définition | Toi : rythme et lisibilité |
| 5 | **Look-dev** : 1 image fixe par plan (P1, P3, P5, P9) en rendu final | 4 PNG | Toi : direction artistique |
| 6 | **Animation complète** | Hero 16:9 en brouillon | Toi |
| 7 | **Musique et SFX** (générés sur la durée finale) + mixage | `music.mp3`, sfx | Toi |
| 8 | **Finitions** : flou de mouvement, grain léger, étalonnage par acte | — | — |
| 9 | **Rendu** : Hero 16:9, 4:5, Reel 9:16 de 15 s, Bumper 6 s | MP4 H.264, −14 LUFS | Toi → envoi au client |

> L'**animatique** (étape 4) est l'étape « cinéma » qu'on ne saute jamais : c'est là qu'on valide le rythme, avant de passer des heures sur le look.

## Contrôle qualité avant envoi

- [ ] Lisible **sans le son** (versions réseaux sociaux sous-titrées)
- [ ] Accroche compréhensible en **moins de 3 s**
- [ ] Logo **absent** avant la bascule (Schwartz : la douleur d'abord)
- [ ] **Une seule** action demandée à la fin, lisible au moins 3 s
- [ ] Numéro de téléphone **confirmé**, URL correcte
- [ ] Aucun chiffre inventé ni fausse promesse (rien qui ne soit sur leur site)
- [ ] Zones sûres 9:16 respectées (UI Instagram/TikTok en haut et en bas)
- [ ] −14 LUFS, *true peak* ≤ −1 dBTP
- [ ] Polices OFL, modèles CC0, musique et SFX ElevenLabs couverts par la licence de ton abonnement

## Questions ouvertes (à régler avant l'étape 2)

1. **Prononciation de « Gresend »** : « Gré-sennde » ou « Gri-sennde » ?
2. **Numéro de l'appel à l'action** : 0498 16 96 70 ou +32 471 30 40 31 ?
3. **Logo officiel en SVG** : on a une vectorisation propre depuis le PDF, mais l'original est préférable pour la version finale.
4. **Une vraie photo ou un nom de client ?** C'est optionnel, mais ce serait une preuve forte pour une vidéo suivante (témoignage).
