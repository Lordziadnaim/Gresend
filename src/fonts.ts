// Red Hat Display (police du site Gresend, licence OFL) servie en local :
// le navigateur de rendu n'a pas forcément accès à Google Fonts.
import {continueRender, delayRender, staticFile} from 'remotion';

const handle = delayRender('Chargement de Red Hat Display');
const face = new FontFace('Red Hat Display', `url(${staticFile('fonts/RedHatDisplay-var.woff2')}) format('woff2')`, {
  weight: '300 900',
  style: 'normal',
});
face
  .load()
  .then((f) => {
    document.fonts.add(f);
    continueRender(handle);
  })
  .catch((err) => {
    console.error('Police non chargée, repli système', err);
    continueRender(handle);
  });
