# 02 — Script voix off & storyboard (plan-séquence)

**Titre de travail :** *Le Colis*
**Durée :** 36,5 s (voix finale 33,25 s + 3,25 s de carte de fin) · **Cadence :** 30 i/s · **Total :** 1095 images · **Master :** 16:9 (1920×1080)
**Principe :** un seul mouvement de caméra continu, sans coupe franche. On suit **un colis** de la commande à la porte du client. Les « plans » ci-dessous sont des **temps** de caméra, pas des coupes.

> ⏱️ Les minutages par plan ci-dessous datent de la version 45 s. **Le minutage de référence est maintenant `src/timeline.ts`**, calé sur la voix finale (P1 0–3,4 · P2 3,4–9,0 · P3 9,0–12,2 · P4 12,2–15,95 · P5 15,95–20,1 · P6 20,1–23,55 · P7 23,55–25,5 · P8 25,5–28,2 · P9 28,2–31,2 · P10 31,2–36,5 s).

---

## Script voix off — ElevenLabs `eleven_v4` (FR)

Le texte ci-dessous est **exactement** celui envoyé au modèle. Les balises `[…]` règlent l'interprétation et restent actives jusqu'à la balise suivante. « Gresend » est écrit en API (`/ɡʁesɛnd/`) pour forcer la prononciation **« Gré-sennde »**.

```text
[serious] Votre client a commandé hier… [short pause] Il attend toujours.
[slightly annoyed] Bouchons, stationnement, zones basses émissions… [short pause] À Bruxelles, chaque retard vous coûte un client.
[pause]
[warmly] Avec /ɡʁesɛnd/, votre colis ne fait plus la queue.
On le récupère, on le trie, on le stocke… aux portes de Bruxelles.
Puis il file en vélo-cargo, ou en camionnette électrique — pendant que les autres attendent.
[upbeat] Express, au frais, en tournée… [short pause] Sept jours sur sept.
Et vous suivez tout, en temps réel.
[warmly] Livré. [short pause] À l'heure. [short pause] En parfait état.
[confident] /ɡʁesɛnd/. [short pause] La livraison, en toute simplicité.
Demandez votre devis sur notre site.
```

Le texte fait environ 95 mots, soit 38 à 40 s de voix. Il reste ainsi 5 à 7 s pour respirer et pour la carte de fin.

**Prononciation (validée) :**
- **« Gresend » = « Gré-sennde »** : le mot est écrit `/ɡʁesɛnd/` dans le texte envoyé au modèle. Les sous-titres et textes à l'écran gardent bien sûr « Gresend ».
- **L'URL n'est pas prononcée**, pour éviter tout risque (« point bé » ou « point bé-eu »). La voix dit « sur notre site » et la carte de fin affiche `gresend.be` en grand.
- « LEZ » n'est **pas** prononcé, c'est trop ambigu à l'oral. La voix dit « zones basses émissions » et l'écran affiche « LEZ ».

### Voix : français, accent belge

| Voix | Profil | Statut |
|---|---|---|
| **Luca** (`usy5mXLbV9SeGWACyT3Y`) ⭐ | Belge, « calme et pro » | **Voix principale** : le ton posé et professionnel qui parle à un gérant de commerce |
| **Adrien** (`IpTJxgMFj1wbxpha4zxm`) | Belge, la trentaine, calme, décontracté | Alternative : plus proche de l'âge de la cible, plus « voisin » |
| Christophe Géradon (`HDc7042zGcc1SdpT2m1U`) | Belge, 50 ans, accent liégeois marqué | Écartée : l'accent liégeois est moins « bruxellois », et la voix est plutôt narrative |
| Samuel (`KQmyXAYSiYXdRqlwDQFX`) | Belge, podcast | Écartée : profil conversationnel, pas publicitaire |

**✅ Voix retenue : Luca.** « ou partout en Europe » a été **coupé dans l'audio** : c'est une promesse du site qu'on ne peut pas vérifier, et elle n'aide pas la cible locale. La coupe a été faite dans les silences et vérifiée par une transcription Scribe. La dernière phrase a été remplacée par « Demandez votre devis sur notre site » (l'URL est à l'écran) : elle a été régénérée seule, raccordée dans la pause et son volume ajusté (fichiers `public/audio/vo-takes/luca-take1-final.wav` et `luca-take2-final.wav`).

**Prises générées** (`eleven_v4`, flow ElevenLabs « Gresend — Le Colis — VO FR (BE) ») : 2 prises de Luca et 2 prises d'Adrien. Il faut choisir à l'oreille la prise avec l'accent belge le plus naturel et le meilleur rythme.

---

## Script couleur (l'arc émotionnel en couleur)

```
0s ──── Acte 1 : Douleur ────── 9s ── Bascule ── 12s ──── Acte 2 : Mécanisme ──── 31s ── Acte 3 : Résolution ── 45s
gris-bleu désaturé, accents        lavis menthe        monde lumineux : blanc, ciel,            chaud, lumineux, lime dominant,
rouges (feux stop, alertes)        (forme du blob)     lime et menthe, cartons orange           blanc pur pour le logo
```

---

## Storyboard temps par temps

Légende : **CAM** = mouvement de caméra · **ANIM** = animation · **TXT** = texte à l'écran · **SFX** = effets sonores · **MUS** = musique

### P1 — L'attente · 0,0–4,0 s (i 0–120)
**VO :** « Votre client a commandé hier… Il attend toujours. »
- **Image :** gros plan isométrique sur la fenêtre d'un appartement bruxellois (façade de maison de maître, briques). Une cliente regarde son téléphone. À l'écran du téléphone : `Commande #2847 · En attente de livraison` avec une icône de chargement qui tourne. Une horloge murale avance en accéléré.
- **CAM :** lent *push-in* (3 %), puis à 3,2 s début d'un *crane up* et d'un recul qui révèle la rue.
- **ANIM :** l'aiguille de l'horloge tourne vite ; la cliente fait un petit soupir (épaules qui bougent).
- **TXT :** aucun (la VO suffit, l'image raconte).
- **SFX :** tic-tac net, ambiance urbaine étouffée.
- **MUS :** pulsation basse minimale, une seule note tenue.
- **Couleur :** désaturé à 40 %, gris-bleu.

### P2 — Le chaos · 4,0–9,0 s (i 120–270)
**VO :** « Bouchons, stationnement, zones basses émissions… À Bruxelles, chaque retard vous coûte un client. »
- **Image :** la caméra glisse au-dessus d'une rue bloquée : file de voitures grises, **une camionnette de livraison grise sans marque coincée**, feux stop rouges qui pulsent, panneau LEZ, panneau « P complet ».
- **CAM :** travelling latéral lent (de droite à gauche), légèrement plongeant.
- **ANIM :** les mots s'impriment en tampon, synchronisés sur la VO. À 7,5 s, une carte d'avis client apparaît : `★☆☆☆☆ « Toujours pas reçu… »`.
- **TXT :** `BOUCHONS` · `STATIONNEMENT` · `LEZ` (Red Hat Display Black, rouge `#E5484D` sur blanc, léger tremblement).
- **SFX :** klaxons, moteur au ralenti, *stamp* sur chaque mot, *riser* qui monte vers 9 s.
- **MUS :** tension, pulsation qui accélère.

### P3 — La bascule · 9,0–12,0 s (i 270–360)
**VO :** (pause) « Avec Gresend, votre colis ne fait plus la queue. »
- **Image :** à 9,0 s, **arrêt sur image** (le monde se fige pendant 8 images). Puis le **blob menthe** de la charte Gresend entre par le coin inférieur droit et grossit en lavis organique qui recolore tout le monde : désaturé → lumineux. Les voitures restent grises ; tout ce qui est Gresend devient lime et menthe.
- **CAM :** léger *dolly-in* pendant le lavis, comme une respiration.
- **ANIM :** le blob est en deux couches (menthe `#00D9A7` + menthe claire `#8EEBD6` décalée), exactement comme sur le site.
- **TXT :** `ne fait plus la queue.` (Red Hat Display Bold, noir) apparaît mot par mot.
- **SFX :** silence d'une demi-seconde pendant le gel, puis un *whoosh* doux et un « pop » de bulle.
- **MUS :** **drop** à 9,5 s : on passe au thème lumineux (plucks, claquements de mains, basse ronde).

### P4 — La prise en charge · 12,0–17,0 s (i 360–510)
**VO :** « On le récupère, on le trie, on le stocke… aux portes de Bruxelles. »
- **Image :** une petite boutique (« Votre boutique », vitrine avec plantes), un coursier Gresend en tenue lime prend **le colis** (carton orange, étiquette avec le petit « g »). Le colis passe sur un convoyeur dans l'**entrepôt Gresend** (isométrique), sous un scanner (faisceau menthe), puis dans un rayonnage.
- **CAM :** la caméra **suit le colis** (le colis reste dans le tiers droit du cadre). Elle traverse le mur de l'entrepôt en coupe (vue « maison de poupée »).
- **ANIM :** trois micro-actions calées sur « récupère / trie / stocke ». À chaque verbe, une puce d'interface apparaît : `✓ Pris en charge 09:12` → `✓ Trié` → `✓ En stock`.
- **TXT :** les puces d'interface (style application, coins arrondis 16 px, fond blanc, ombre douce).
- **SFX :** bip de scanner, roulement du convoyeur, petit clic à chaque puce.

### P5 — Le mécanisme · 17,0–22,5 s (i 510–675) ⭐ *plan clé*
**VO :** « Puis il file en vélo-cargo, ou en camionnette électrique — pendant que les autres attendent. »
- **Image :** le colis glisse dans le caisson d'un **vélo-cargo électrique Gresend**. Le vélo sort de l'entrepôt et remonte une piste cyclable **le long de la même file grise de l'acte 1** : on reconnaît la camionnette grise, toujours bloquée. Sur la voie d'à côté passe une **camionnette électrique lime Gresend** (icône ⚡). Le panneau LEZ affiche une coche verte au passage.
- **CAM :** **travelling d'accompagnement** à la vitesse du vélo. Les voitures défilent en sens inverse relatif : c'est la démonstration visuelle du mécanisme. Légère parallaxe au premier plan (arbres, potelets).
- **ANIM :** le vélo double 6 voitures. Une ligne de trajet lime se dessine derrière lui (`evolvePath`) : **c'est la ligne qui finira dans le logo.**
- **TXT :** `Vélo-cargo` · `100 % électrique` (petites étiquettes qui suivent les véhicules).
- **SFX :** sonnette de vélo (une fois, à « file »), roue libre, ronronnement électrique, klaxon lointain étouffé côté voitures.

### P6 — L'étendue du service · 22,5–28,5 s (i 675–855)
**VO :** « Express, au frais, en tournée… Sept jours sur sept. »
- **Image :** la caméra **s'élève** à la verticale (*crane up*) jusqu'à une vue carte de Bruxelles en isométrique, puis en vue de dessus. Depuis l'entrepôt, des **lignes lime** partent dans toutes les directions, chacune synchronisée sur un mot :
  - **Express** : une ligne rapide avec un éclair ⚡ ;
  - **au frais** : un pictogramme flocon et un thermomètre bloqué à **3 °C** ;
  - **en tournée** : une boucle avec 5 points d'arrêt qui s'allument, pendant que la caméra *dézoome* jusqu'à voir **tout Bruxelles et sa périphérie**, avec Drogenbos au bord du cadre. Le réseau lime couvre la ville.
- Sur « Sept jours sur sept », une barre `L M M J V S D` apparaît et les 7 jours s'allument en lime, un par un, en cascade rapide.
- **CAM :** *crane up* puis *dézoom* continu, sans coupe.
- **SFX :** un *tick* par ligne, un souffle léger au dézoom, un « ding » cristallin sur le dimanche.

### P7 — Le suivi · 28,5–31,5 s (i 855–945)
**VO :** « Et vous suivez tout, en temps réel. »
- **Image :** le *dézoom* s'inverse et la caméra **plonge** vers Bruxelles, puis **dans l'écran d'un téléphone** tenu par le gérant de la boutique. On y voit l'interface de suivi : la carte et un point lime qui avance. **Raccord sur le mouvement :** ce point *est* le vélo qu'on a suivi.
- **TXT :** `Arrivée dans 4 min` avec un compte à rebours `4 → 3`.
- **SFX :** *swipe* d'interface, légère pulsation du point GPS.

### P8 — La livraison · 31,5–35,5 s (i 945–1065)
**VO :** « Livré. À l'heure. En parfait état. »
- **Image :** **retour à la fenêtre de P1** (on boucle la boucle), cette fois en couleurs chaudes. On sonne, le coursier tend le colis, la cliente sourit. Sur son téléphone : `✓ Livré · 10:42`. La carte d'avis de P2 **se retourne** : `★★★★★ « Super rapide, merci ! »`.
- **CAM :** léger *push-in* sur le sourire, puis début du recul.
- **TXT :** `Livré.` `À l'heure.` `En parfait état.` : trois mots en cascade, chacun avec une coche lime.
- **SFX :** sonnette de porte, notification, petit « pop » des étoiles.
- **MUS :** montée vers l'accord final.

### P9 — Le logo · 35,5–40,0 s (i 1065–1200)
**VO :** « Gresend. La livraison, en toute simplicité. »
- **Image :** la caméra recule et s'élève. Toute la **ligne de trajet lime** dessinée depuis P5 se rétracte et se **réenroule en deux flèches circulaires**. Ce sont exactement les flèches du « s » du logo. Les autres lettres `gre` / `end` apparaissent autour : **le logo est né du trajet**. Fond blanc pur, avec le blob menthe qui respire derrière.
- **ANIM :** morphing du tracé vers le logo (`@remotion/paths` : `interpolatePath`), puis ressort `spring` sur les lettres.
- **TXT :** sous le logo : `La livraison, en toute simplicité.` (Red Hat Display Medium).
- **SFX :** *whoosh* de rétractation, impact doux et feutré au moment où le logo se forme.
- **MUS :** accord final et cymbale inversée.

### P10 — L'appel à l'action · 40,0–45,0 s (i 1200–1350)
**VO :** « Demandez votre devis sur notre site. »
- **Image :** carte de fin. `gresend.be` en grand, un bouton `Demander un devis →` (lime, texte blanc), le téléphone **+32 471 30 40 31**, et une rangée d'icônes : `7j/7 · Électrique · Frigo · Stockage`.
- **Durée de lecture :** la carte reste **au moins 3 s** sans mouvement important.
- **SFX :** clic du bouton (le bouton « s'enfonce » une fois), puis la musique s'éteint.

---

## Déclinaisons

| Version | Format | Durée | Contenu |
|---|---|---|---|
| **Hero** | 16:9 1920×1080 | 36,5 s | Tout (P1 → P10) |
| **Reel / Story** | 9:16 1080×1920 | 15 s | P1 (accroche) → P3 (bascule) → P5 (mécanisme) → P10 (appel à l'action) + **sous-titres complets** |
| **Feed LinkedIn** | 4:5 1080×1350 | 36,5 s | Hero recadré + sous-titres |
| **Bumper** | 16:9 / 9:16 | 6 s | P5 (vélo qui dépasse la file) → logo |

**Voix off de la version 15 s :**

```text
[serious] Votre client attend toujours ? [short pause] [warmly] Avec /ɡʁesɛnd/, votre colis ne fait plus la queue. [upbeat] Vélo-cargo, électrique, sept jours sur sept. [confident] Demandez votre devis sur notre site.
```

**Règle pour les sous-titres :** le master 16:9 n'en a pas (les mots-clés animés suffisent). Toutes les versions réseaux sociaux en ont, car la lecture automatique y est muette.
