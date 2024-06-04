import keyMap from './keymap.js';


export const clear = () => {
  var lines = process.stdout.getWindowSize()[1];
  for (var i = 0; i < lines; i++) {
    console.log('\r\n');
  }
}

export const captureControls = (key) => {
  if (!keyMap[key]) return { player: null, action: null };

  const { player, action } = keyMap[key];
  return { player, action };
}

export const randomizeColor = (opponent) => {
  const colors = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan'];
  const randColor = colors[Math.floor(Math.random() * colors.length)];
  if (opponent && opponent.color === randColor) return randomizeColor(opponent)
  return randColor
}

/** Call this at the start of your program */
export const enableAlternativeBuffer = () =>
  process.stdout.write("\u001B[?1049h");

/** Call this before exiting your program */
export const disableAlternativeBuffer = () =>
  process.stdout.write("\u001B[?1049l");

export const sideBoxes = (box1, box2) => {
  const box1Lines = box1.split('\n')
  const box2Lines = box2.split('\n')

  return box1Lines.map((line, index) => {
    return line + ' ' + box2Lines[index]
  }).join('\n')
}

export default {
  enableAlternativeBuffer,
  disableAlternativeBuffer,
  clear,
  captureControls,
  sideBoxes,
  randomizeColor
}