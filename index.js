import chalk from 'chalk';
import enquirer from 'enquirer';
import { Game } from './classes.js'
import { clear, enableAlternativeBuffer } from './methods.js';

let [name1, name2] = process.argv.slice(2)
enableAlternativeBuffer()

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

  game.start()
}

main()
