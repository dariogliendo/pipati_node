import boxen from 'boxen';
import { GlobalKeyboardListener } from 'node-global-key-listener';
import methods from './methods.js';
import chalk from 'chalk'


class Player {
  constructor(name, color) {
    this.name = name;
    this.action = null;
    this.color = color || methods.randomizeColor();
  }

  play(action) {
    if (this.action || !action) return;
    this.action = action
  }

  showAction(opponent) {
    if (!this.action) return '⌛';
    if (!opponent.action) return '✅';
    return this.action
  }

  renderAction(opponent) {
    return boxen(this.showAction(opponent), {
      title: this.name,
      titleAlignment: 'center',
      padding: 1,
      margin: 1,
      borderStyle: this.action ? 'bold' : 'round',
      borderColor: this.color,
      width: 30,
      textAlignment: 'center'
    })
  }
}

export class Game {
  constructor(name1, name2) {
    this.player1 = new Player(name1, methods.randomizeColor());
    this.player2 = new Player(name2, methods.randomizeColor(this.player1));
    this.listener = new GlobalKeyboardListener();
    this.ticker = null;
  }

  start() {
    this.listener.addListener((e) => {
      const { player, action } = methods.captureControls(e.name);
      if (player && action) this.play(player, action)
      if (this.isPlayed()) {
        console.log(boxen(this.getResult(), {
          width: 70,
          borderStyle: 'none',
          textAlignment: 'center'
        }))
        this.listener.kill()
      }
    })
    this.render()
  }

  render() {
    methods.clear()
    const player1 = this.player1.renderAction(this.player2)
    const player2 = this.player2.renderAction(this.player1)
    console.log(methods.sideBoxes(player1, player2))
  }

  gameInfo() {
    console.log('Player 1', this.player1);
    console.log('Player 2', this.player2)
  }

  isPlayed() {
    return this.player1.action && this.player2.action
  }

  play(player, action) {
    if (!player || !action) return
    if (player == 1) this.player1.play(action)
    if (player == 2) this.player2.play(action)
    this.render()
  }

  getResult() {
    if (this.player1.action == this.player2.action) {
      return chalk.yellow('Empate')
    }
    if (this.player1.action == 'Piedra' && this.player2.action == 'Tijera') {
      return chalk[this.player1.color]('Gana ' + this.player1.name)
    }
    if (this.player1.action == 'Papel' && this.player2.action == 'Piedra') {
      return chalk[this.player1.color]('Gana ' + this.player1.name)
    }
    if (this.player1.action == 'Tijera' && this.player2.action == 'Papel') {
      return chalk[this.player1.color]('Gana ' + this.player1.name)
    }
    return chalk[this.player2.color]('Gana ' + this.player2.name)
  }
}