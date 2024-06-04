import chalk from 'chalk';
import enquirer from 'enquirer';
import boxen from 'boxen';
import { GlobalKeyboardListener } from 'node-global-key-listener';

let [name1, name2] = process.argv.slice(2)

const keyboardListener = new GlobalKeyboardListener();

const keyMap = {
  'S': {
    player: 1,
    action: 'Piedra'
  },
  'D': {
    player: 1,
    action: 'Papel'
  },
  'F': {
    player: 1,
    action: 'Tijera'
  },
  'J': {
    player: 2,
    action: 'Piedra'
  },
  'K': {
    player: 2,
    action: 'Papel'
  },
  'L': {
    player: 2,
    action: 'Tijera'
  }
}

const clear = () => {
  var lines = process.stdout.getWindowSize()[1];
  for (var i = 0; i < lines; i++) {
    console.log('\r\n');
  }
}

function captureControls(key) {
  if (!keyMap[key]) return { player: null, action: null };

  const { player, action } = keyMap[key];
  return { player, action };
}

class Player {
  constructor(name) {
    this.name = name;
  }

  play(action) {
    if (!action) return;
    this.action = action
  }

  showAction(opponent) {
    if (!opponent.action || !this.action) return 'x';
    return this.action
  }
}

class Game {
  constructor(name1, name2) {
    this.player1 = new Player(name1);
    this.player2 = new Player(name2);
  }

  gameInfo() {
    console.log('Player 1', this.player1);
    console.log('Player 2', this.player2)
  }

  isPlayed() {
    return this.player1.action && this.player2.action
  }

  play(player, action) {
    if (player == 1) this.player1.play(action)
    if (player == 2) this.player2.play(action)
  }

  getResult() {
    if (this.player1.action == this.player2.action) {
      return 'Empate'
    }
    if (this.player1.action == 'Piedra' && this.player2.action == 'Tijera') {
      return 'Gana ' + this.player1.name
    }
    if (this.player1.action == 'Papel' && this.player2.action == 'Piedra') {
      return 'Gana ' + this.player1.name
    }
    if (this.player1.action == 'Tijera' && this.player2.action == 'Papel') {
      return 'Gana ' + this.player1.name
    }
  }
}

function render(game) {
  clear
  const player1 = boxen(game.player1.showAction(game.player2), {padding: 1, margin: 1, borderStyle: 'round', title: game.player1.name, titleAlignment: 'center'})
  const player2 = boxen(game.player2.showAction(game.player1), {padding: 1, margin: 1, borderStyle: 'round', title: game.player2.name, titleAlignment: 'center'})
  console.log(player1 + player2)
}


const main = async () => {
  clear()
  if (!name1) name1 = (await enquirer.prompt({
    type: 'input',
    message: 'Nombre del jugador 1',
    name: 'response'
  })).response
  clear()
  if (!name2) name2 = (await enquirer.prompt({
    type: 'input',
    message: 'Nombre del jugador 2',
    name: 'response'
  })).response
  clear()
  console.log('Hola ' + name1 + ' y ' + name2)

  const game = new Game(name1, name2)

  keyboardListener.addListener((e) => {
    const { player, action } = captureControls(e.name);
    if (player && action) game.play(player, action)
    if (game.isPlayed()) {
      console.log(game.getResult())
      keyboardListener.kill()
    }
  })
}

main()
