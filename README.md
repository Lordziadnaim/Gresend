# Gresend — Film motion design « Le Colis »

Film motion design (spec) pour [Gresend](https://gresend.be), service de livraison et logistique à Bruxelles/Drogenbos. Produit avec **Remotion** ; voix off **ElevenLabs v4** (FR, accent belge, voix « Luca »).

**Concept :** un plan-séquence isométrique 2.5D qui suit un colis, de la commande à la porte du client.
**Cible :** les commerces et e-shops bruxellois.
**Objectif :** générer des leads (demandes de devis).
**Durée :** 36,5 s.

## État d'avancement

| Étape | Statut |
|---|---|
| 1. Script verrouillé | ✅ |
| 2–3. Voix off (Luca, prise 2 + corrections) | ✅ `public/audio/vo-fr.wav` |
| 4. **Animatique v2** (blocs gris, vraie caméra, voix calée, roues réalistes) | ✅ composition `Animatique` · `renders/animatique-v2.mp4` |
| 5. Look-dev (4 images de référence) | ⏳ |
| 6–9. Animation finale, musique/SFX, mixage, rendus | ⏳ |

## Lancer le projet

```bash
npm install
npm run studio                 # prévisualisation interactive (Remotion Studio)
npm run render:animatique      # → out/animatique.mp4
```

Le monde 3D est rendu en WebGL via SwiftShader (`--gl=swangle`), donc aucun GPU n'est nécessaire. Sur une machine où Remotion ne trouve pas Chrome, ajoute `--browser-executable=<chemin vers chrome-headless-shell>`.

## Où modifier quoi

| Fichier | Rôle |
|---|---|
| `src/timeline.ts` | **Minutage** : phrases de la voix, ancres de mots, 10 plans. Si la voix change, on ne modifie que ce fichier. |
| `src/world/CameraRig.tsx` | Images-clés de la caméra (le plan-séquence) |
| `src/world/paths.ts` | Trajets du colis, du vélo-cargo, de la camionnette |
| `src/world/World.tsx` | Décor 3D (rue, entrepôt, boutique, ville, véhicules) |
| `src/overlays/Acts.tsx` | Calques 2D : mots-impacts, puces, téléphone, logo, carte de fin |
| `src/overlays/Hud.tsx` | Repères d'animatique (désactivables : prop `showHud`) |
| `src/brand.ts` | Couleurs et police |

## Pré-production

| Doc | Contenu |
|---|---|
| [01 — Stratégie](preprod/01-strategie.md) | Client, marché, niveau de conscience et sophistication (Schwartz), message, stratégie de vente |
| [02 — Script & storyboard](preprod/02-script-storyboard.md) | Voix off, voix retenue, 10 temps de caméra, déclinaisons |
| [03 — Direction artistique & son](preprod/03-direction-artistique-son.md) | Palette, typographie, monde isométrique, langage de caméra, musique, SFX, mixage |
| [04 — Production Remotion](preprod/04-production-remotion.md) | Architecture, pipeline voix → timing, étapes, contrôle qualité |

## Marque

`brand/` contient :
- le logo vectorisé depuis le PDF du site ;
- `tokens.json` (couleurs échantillonnées : lime `#62C70A`, menthe `#00D9A7`, et la police Red Hat Display).

La police est servie en local (`public/fonts/`).
