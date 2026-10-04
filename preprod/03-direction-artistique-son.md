# 03 — Direction artistique & son

## Références d'univers

- **Leur propre site** : les illustrations isométriques sur fond bleu ciel avec cartons orange. On garde ce langage, mais en version propriétaire, animée et plus raffinée.
- **Cible de rendu :** des maquettes « low-poly propre » à la lumière douce : très lisibles, sans textures, avec ombres portées douces et une palette limitée. Pense à l'esthétique des maquettes de produits SaaS isométriques, mais avec une vraie caméra de cinéma.

## Palette (voir `brand/tokens.json`)

| Rôle | Couleur | Usage |
|---|---|---|
| **Lime Gresend** | `#62C70A` | Logo, véhicules Gresend, ligne de trajet, coches, bouton CTA |
| **Menthe** | `#00D9A7` | Blob de transition, faisceau du scanner, accents d'interface |
| **Menthe claire** | `#8EEBD6` | Seconde couche du blob, reflets |
| **Ciel** | `#EAF4FC` → `#CFE6F7` | Fond du monde (dégradé vertical) |
| **Carton** | `#F2A33A` / `#D9822B` | Le colis (le héros) : seule couleur chaude, elle attire l'œil |
| **Encre** | `#0A0A0A` | Typographie |
| **Problème** | `#E5484D` / `#9AA3AE` | Acte 1 uniquement : feux stop, alertes, voitures |

**Règles :**
1. Le **colis orange** est le seul objet chaud du film. L'œil le suit sans effort, et c'est ce qui fait tenir le plan-séquence.
2. Le **lime** est réservé à Gresend. Dès qu'on voit du lime, on voit Gresend.
3. Le **rouge** disparaît après la bascule (P3). Il ne revient jamais.

## Typographie

- **Red Hat Display** (Google Fonts, licence OFL), la police du site :
  - **Black 900** pour les mots-impacts (`BOUCHONS`, `LEZ`) ;
  - **Bold 700** pour les phrases ;
  - **Medium 500** pour la signature.
- **Red Hat Text** pour les interfaces et sous-titres.
- Chargement dans Remotion via `@remotion/google-fonts/RedHatDisplay`.
- **Tailles en 1080p :** mots-impacts 140–180 px, phrases 64–80 px, interface 28–36 px, sous-titres 48–56 px (en 9:16).

## Monde isométrique 2.5D

- **Caméra orthographique** (aucune déformation de perspective, c'est le vrai rendu isométrique), avec un angle d'environ 35° en plongée et 45° de rotation.
- **Bruxelles stylisée :** maisons de maître étroites avec pignons à gradins, briques ocre et blanches, pavés, arbres ronds, potelets, piste cyclable rouge brique. C'est reconnaissable comme Bruxelles sans être littéral.
- **Matériaux :** couleurs unies et ombrage plat ou doux (`MeshLambert` / `MeshToon`), occlusion ambiante légère, une lumière principale chaude de 3/4 et une lumière de remplissage bleu ciel.
- **Profondeur de champ simulée :** léger flou sur les éléments très proches ou très lointains (premier plan en parallaxe).
- **Personnages :** stylisés et sans visage détaillé (forme de capsule avec une tête ronde), comme sur leur site. Le coursier porte une tenue lime avec casquette.
- **Véhicules :**
  - le vélo-cargo électrique (caisson avant avec le petit « g ») ;
  - la camionnette électrique lime ;
  - les voitures et la camionnette « problème » en gris.

## Langage de caméra

| Mouvement | Où | Pourquoi |
|---|---|---|
| *Push-in* lent | P1, P8 | L'intimité, l'émotion du client |
| Travelling latéral | P2 | Montrer la longueur de la file : l'enfer |
| Gel + *dolly-in* | P3 | Faire respirer la bascule |
| Suivi du colis | P4–P5 | Le plan-séquence : on ne lâche jamais le héros |
| *Crane up* + dézoom | P6 | Révéler l'étendue (la rue → tout Bruxelles) |
| Plongée dans l'écran | P7 | Raccord entre le monde et l'interface |
| Recul et élévation | P9 | La conclusion, la vue d'ensemble |

**Courbes d'animation :** pas de mouvements linéaires. La caméra utilise `Easing.bezier(0.65, 0, 0.35, 1)` (*ease in-out* cinéma). Les objets utilisent `spring({damping: 14, mass: 0.8})` pour un rebond léger et premium, jamais « cartoon ».

**Flou de mouvement :** `@remotion/motion-blur` (`<CameraMotionBlur>`) sur les plans rapides (P5 et le dézoom de P6). C'est l'un des plus gros gains en rendu « cinéma ».

## Interface (puces, téléphone, avis)

Style application moderne : fond blanc, rayon 16–24 px, ombre `0 12px 40px rgba(10,10,10,.12)`, coches lime, texte en Red Hat Text. L'interface est **fictive mais crédible**. On ne montre pas l'appli réelle de Gresend, qu'on n'a pas vue.

---

## Son

Le son représente la moitié de l'effet cinéma. Tout est générable dans ElevenLabs, ce qui garde la chaîne unifiée et les droits clairs. **Vérifie toutefois les conditions d'usage commercial de ton abonnement ElevenLabs** avant de livrer.

### Musique — `eleven_music_v2_5`

Prompt proposé (45 s, à générer *après* la voix off pour caler la durée) :

```text
45-second corporate-cinematic track, 116 BPM, two parts.
Part 1 (0-9s): tense minimal pulse, muted plucked synth, ticking hi-hat, low drone, rising tension, riser into a drop at 9.5s.
Part 2 (9.5-40s): bright, optimistic modern indie-electronic, warm plucks, soft claps, round bass, airy pads, feels effortless and clean, not cheesy.
Ending (40-45s): resolve on a warm major chord, gentle reverse cymbal, soft fade. No vocals.
```

À 116 BPM et 30 i/s, un temps dure 15,5 images. Les coupes de rythme (apparitions de mots, puces) tombent sur les temps.

### Effets sonores — `eleven_text_to_sound_v2`

| # | Plan | SFX (prompt court) |
|---|---|---|
| 1 | P1 | `clock ticking close, clean, dry` |
| 2 | P1–P2 | `muffled city ambience, distant traffic` |
| 3 | P2 | `city traffic jam, car horns, idling engines` |
| 4 | P2 | `rubber stamp hit, punchy` ×3 |
| 5 | P2→P3 | `cinematic riser, 2 seconds, building tension` |
| 6 | P3 | `soft whoosh with bubbly pop, satisfying` |
| 7 | P4 | `barcode scanner beep`, `conveyor belt rolling short` |
| 8 | P4 | `UI tick click, soft` |
| 9 | P5 | `bicycle bell ring, single, crisp` |
| 10 | P5 | `bicycle freewheel ticking`, `electric motor hum` |
| 11 | P6 | `soft UI blips ascending`, `air whoosh wide` |
| 12 | P7 | `phone UI swipe` |
| 13 | P8 | `doorbell ding dong friendly`, `phone notification chime` |
| 14 | P9 | `whoosh retract`, `soft deep impact, logo reveal` |
| 15 | P10 | `button click soft` |

### Mixage (cibles)

- **Master web/réseaux :** −14 LUFS intégré, *true peak* ≤ −1 dBTP.
- **Voix off :** au-dessus de tout, toujours intelligible.
- **Musique :** atténuée de −8 à −10 dB sous la voix (*ducking* via `volume` par image dans Remotion), pleine dans les respirations (gel de P3, logo de P9).
- **Effets sonores :** discrets. Ils « vendent » le mouvement, ils ne le couvrent pas.
