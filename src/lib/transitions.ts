// Transicion de pagina "glitch", usada por <ClientRouter /> en vez del
// crossfade por defecto. Los nombres ('glitch-out'/'glitch-in') referencian
// los @keyframes definidos en src/styles/global.css.
const glitchPair = {
  old: { name: 'glitch-out', duration: '220ms', easing: 'ease-in', fillMode: 'both' },
  new: { name: 'glitch-in', duration: '260ms', easing: 'ease-out', fillMode: 'both' }
};

export const glitchTransition = {
  forwards: glitchPair,
  backwards: glitchPair
};
