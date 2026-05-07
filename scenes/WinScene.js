export class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: 'winScene' });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    const isMobile = width < 768;

    this.add.image(width / 2, height / 2, 'background')
      .setDisplaySize(width, height);

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, width, height);

    this.createGoldFrame(width, height);

    const title = this.add.text(width / 2, height * 0.22, 'TINBET COMPLETADO', {
      fontFamily: '"Arial Black", Arial',
      fontSize: isMobile ? '31px' : '62px',
      fontStyle: 'bold',
      color: '#d8b45a',
      stroke: '#191100',
      strokeThickness: isMobile ? 5 : 8,
      align: 'center',
      wordWrap: { width: width * 0.9 },
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#d8b45a',
        blur: 20,
        fill: true
      }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      y: height * 0.21,
      duration: 700,
      ease: 'Cubic.Out'
    });

    const message = this.add.text(
      width / 2,
      height * 0.42,
      'Superaste los 6 niveles de precisión.\nCada rebote construyó la marca.',
      {
        fontFamily: 'Arial',
        fontSize: isMobile ? '17px' : '26px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: width * 0.82 },
        lineSpacing: 8
      }
    ).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: message,
      alpha: 1,
      duration: 500,
      delay: 500
    });

    const again = this.add.text(width / 2, height * 0.64, 'REINICIAR DEMO', {
      fontFamily: '"Arial Black", Arial',
      fontSize: isMobile ? '20px' : '30px',
      fontStyle: 'bold',
      backgroundColor: '#d8b45a',
      color: '#111111',
      padding: {
        x: isMobile ? 30 : 46,
        y: isMobile ? 14 : 18
      }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0);

    this.tweens.add({
      targets: again,
      alpha: 1,
      duration: 500,
      delay: 800
    });

    again.on('pointerover', () => {
      again.setStyle({
        backgroundColor: '#f0cf76',
        color: '#000000'
      });
    });

    again.on('pointerout', () => {
      again.setStyle({
        backgroundColor: '#d8b45a',
        color: '#111111'
      });
    });

    again.on('pointerdown', () => {
      this.scene.start('level1');
    });

    this.add.text(width / 2, height * 0.88, 'Experiencia promocional interactiva', {
      fontFamily: 'Arial',
      fontSize: isMobile ? '12px' : '15px',
      color: '#777777'
    }).setOrigin(0.5);
  }

  createGoldFrame(width, height) {
    const frame = this.add.graphics();

    frame.lineStyle(2, 0xd8b45a, 0.45);
    frame.strokeRect(
      width * 0.055,
      height * 0.06,
      width * 0.89,
      height * 0.86
    );

    frame.lineStyle(1, 0xd8b45a, 0.22);
    frame.strokeRect(
      width * 0.075,
      height * 0.08,
      width * 0.85,
      height * 0.82
    );
  }
}