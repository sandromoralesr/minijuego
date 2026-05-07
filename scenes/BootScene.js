export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'boot' });
  }

  preload() {
    this.load.image('background', 'images/background.png');

    // Tu logo está en WEBP
    this.load.image('tinbetLogo', 'images/tinbet-logo.webp');

    this.load.image('plataform', 'images/platform.png');
    this.load.image('ball', 'images/ball.png');
    this.load.image('reiniciar', 'images/reiniciar.png');
    this.load.image('obstacle', 'images/obstacle.png');
  }

  create() {
    this.scene.start('menu');
  }
}