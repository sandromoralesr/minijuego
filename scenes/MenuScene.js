export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'menu' });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    const isMobile = width < 768;

    this.add.image(width / 2, height / 2, 'background')
      .setDisplaySize(width, height);

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.62);
    overlay.fillRect(0, 0, width, height);

    this.createAmbientGlow(width, height);

    const logo = this.add.image(width / 2, height * 0.14, 'tinbetLogo')
      .setOrigin(0.5)
      .setAlpha(0);

    const logoMaxWidth = isMobile ? width * 0.52 : 320;
    const logoScale = logoMaxWidth / logo.width;
    logo.setScale(logoScale);

    this.tweens.add({
      targets: logo,
      alpha: 1,
      y: height * 0.13,
      duration: 550,
      ease: 'Cubic.Out'
    });

    const title = this.add.text(width / 2, height * 0.32, 'PRUEBA TU SUERTE!', {
      fontFamily: '"Arial Black", Arial',
      fontSize: isMobile ? '34px' : '68px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#0ebf58',
      strokeThickness: isMobile ? 4 : 7,
      align: 'center',
      wordWrap: { width: width * 0.92 },
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#0ebf58',
        blur: 18,
        fill: true
      }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      y: height * 0.31,
      duration: 600,
      delay: 200,
      ease: 'Back.Out'
    });

    const levels = this.add.text(width / 2, height * 0.45, '6 NIVELES', {
      fontFamily: '"Arial Black", Arial',
      fontSize: isMobile ? '24px' : '40px',
      fontStyle: 'bold',
      color: '#12d463',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: levels,
      alpha: 1,
      duration: 450,
      delay: 450
    });

    const line = this.add.graphics().setAlpha(0);
    line.fillStyle(0xe51f32, 1);
    line.fillRoundedRect(
      width / 2 - (isMobile ? 90 : 150),
      height * 0.51,
      isMobile ? 180 : 300,
      4,
      2
    );

    this.tweens.add({
      targets: line,
      alpha: 1,
      duration: 450,
      delay: 600
    });

    const rewardText = this.add.text(
      width / 2,
      height * 0.60,
      'COMPLETA PARA OBTENER\nTU RECOMPENSA',
      {
        fontFamily: '"Arial Black", Arial',
        fontSize: isMobile ? '20px' : '32px',
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: width * 0.84 },
        lineSpacing: 8,
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: rewardText,
      alpha: 1,
      duration: 450,
      delay: 750
    });

    this.createPlayButton(width, height, isMobile);
  }

  createPlayButton(width, height, isMobile) {
    const buttonY = isMobile ? height * 0.80 : height * 0.82;

    const glow = this.add.graphics().setAlpha(0);
    glow.fillStyle(0x12d463, 0.22);
    glow.fillRoundedRect(
      width / 2 - (isMobile ? 105 : 150),
      buttonY - (isMobile ? 35 : 45),
      isMobile ? 210 : 300,
      isMobile ? 70 : 90,
      12
    );

    const button = this.add.text(width / 2, buttonY, 'JUGAR!', {
      fontFamily: '"Arial Black", Arial',
      fontSize: isMobile ? '30px' : '48px',
      fontStyle: 'bold',
      color: '#031007',
      backgroundColor: '#12d463',
      padding: {
        x: isMobile ? 44 : 70,
        y: isMobile ? 14 : 18
      }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0);

    this.tweens.add({
      targets: [glow, button],
      alpha: 1,
      duration: 500,
      delay: 950
    });

    this.tweens.add({
      targets: button,
      scaleX: 1.035,
      scaleY: 1.035,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
      delay: 1300
    });

    button.on('pointerover', () => {
      button.setStyle({
        backgroundColor: '#35f27c',
        color: '#000000'
      });
    });

    button.on('pointerout', () => {
      button.setStyle({
        backgroundColor: '#12d463',
        color: '#031007'
      });
    });

    button.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scaleX: 0.94,
        scaleY: 0.94,
        duration: 80,
        yoyo: true,
        onComplete: () => {
          this.scene.start('level1');
        }
      });
    });
  }

  createAmbientGlow(width, height) {
    const topGlow = this.add.graphics();
    topGlow.fillGradientStyle(
      0x12d463,
      0x12d463,
      0x12d463,
      0x12d463,
      0.18,
      0.0,
      0.0,
      0.18
    );
    topGlow.fillRect(width * 0.08, height * 0.07, width * 0.84, 4);

    const redAccent = this.add.graphics();
    redAccent.fillGradientStyle(
      0xe51f32,
      0xe51f32,
      0xe51f32,
      0xe51f32,
      0.0,
      0.16,
      0.16,
      0.0
    );
    redAccent.fillRect(width * 0.16, height * 0.92, width * 0.68, 3);
  }
}