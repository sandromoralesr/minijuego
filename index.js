import { Game } from './game.js';
import { Game2 } from './game2.js';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,  // 🔹 Usa el ancho completo de la pantalla
  height: window.innerHeight, // 🔹 Usa el alto completo de la pantalla
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: [Game, Game2], // Agrega tus escenas aquí
  scale: {
      mode: Phaser.Scale.FIT, // 🔹 Ajusta el juego sin dejar bordes blancos
      autoCenter: Phaser.Scale.CENTER_BOTH // 🔹 Centra el juego en pantalla
  }
};

const game = new Phaser.Game(config);

// 🔹 Ajustar el juego al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
