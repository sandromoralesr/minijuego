export class BaseLevelScene extends Phaser.Scene {
  constructor(key, levelConfig, levelNumber) {
    super({ key });

    this.levelConfig = levelConfig;
    this.levelNumber = levelNumber;

    this.hasEnded = false;
    this.runtimeConfig = null;
    this.isTouchingPlatform = false;
    this.resultOverlay = null;
  }

  create() {
    this.hasEnded = false;
    this.isTouchingPlatform = false;
    this.resultOverlay = null;

    this.runtimeConfig = this.getRuntimeLevelConfig();

    const width = this.scale.width;
    const height = this.scale.height;
    const isMobile = this.isMobile();

    this.physics.world.setBounds(0, 0, width, height);

// Rebota en izquierda, derecha y arriba.
// No rebota abajo: si cae, pierde.
this.physics.world.setBoundsCollision(true, true, true, false);

    this.add.image(width / 2, height / 2, 'background')
      .setDisplaySize(width, height)
      .setDepth(0);

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.32);
    overlay.fillRect(0, 0, width, height);
    overlay.setDepth(1);

    this.createHud(width, isMobile);
    this.createStateTexts(width, height, isMobile);
    this.createRetryButton(width, height, isMobile);
    this.createPlatform(width, height);
    this.createBall(width, height);
    this.createObstacles();
    this.createInput();

    if (isMobile) {
      this.createMobileHint(width, height);
      this.createMobileControls();
    }
  }

  isMobile() {
    return this.scale.width < 768 || this.sys.game.device.input.touch;
  }

  getRuntimeLevelConfig() {
    const config = { ...this.levelConfig };

    if (!this.isMobile()) {
      return config;
    }

    return {
      ...config,

      platformScale: config.platformScale * 0.58,
      ballScale: config.ballScale * 0.78,

      ballSpeedMin: Math.floor(config.ballSpeedMin * 0.90),
ballSpeedMax: Math.floor(config.ballSpeedMax * 0.90),

obstacleScale: config.obstacleScale * 0.92,

      pattern: config.pattern
    };
  }

  createHud(width, isMobile) {
    const levelText = `NIVEL ${this.levelNumber} / 6`;
    const letterText = `LETRA ${this.runtimeConfig.letter}`;

    this.add.text(24, 18, levelText, {
      fontFamily: '"Arial Black", Arial',
      fontSize: isMobile ? '17px' : '24px',
      color: '#d8b45a',
      stroke: '#000000',
      strokeThickness: 4
    }).setDepth(100);

    this.add.text(width - 24, 18, letterText, {
      fontFamily: '"Arial Black", Arial',
      fontSize: isMobile ? '17px' : '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(1, 0).setDepth(100);
  }

  createStateTexts(width, height, isMobile) {
    this.gameoverText = this.add.text(
      width / 2,
      height * 0.23,
      'LA SUERTE SE ESCAPÓ',
      {
        fontFamily: '"Arial Black", Arial',
        fontSize: isMobile ? '28px' : '54px',
        fontStyle: 'bold',
        color: '#ff2f5f',
        stroke: '#3a000c',
        strokeThickness: isMobile ? 6 : 10,
        align: 'center',
        wordWrap: { width: width * 0.92 },
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: '#ff1744',
          blur: 22,
          fill: true
        }
      }
    )
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(1000);

    this.winText = this.add.text(
      width / 2,
      height * 0.23,
      'NIVEL SUPERADO',
      {
        fontFamily: '"Arial Black", Arial',
        fontSize: isMobile ? '30px' : '54px',
        fontStyle: 'bold',
        color: '#7CFFB2',
        stroke: '#063d26',
        strokeThickness: isMobile ? 6 : 10,
        align: 'center',
        wordWrap: { width: width * 0.92 },
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: '#00e676',
          blur: 22,
          fill: true
        }
      }
    )
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(1000);

    this.gameoverPulse = this.tweens.add({
      targets: this.gameoverText,
      scale: { from: 1, to: 1.06 },
      alpha: { from: 1, to: 0.92 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      paused: true
    });

    this.winPulse = this.tweens.add({
      targets: this.winText,
      scale: { from: 1, to: 1.06 },
      alpha: { from: 1, to: 0.92 },
      duration: 650,
      yoyo: true,
      repeat: -1,
      paused: true
    });
  }

  createRetryButton(width, height, isMobile) {
    this.retryButton = this.add.image(width / 2, height / 2, 'reiniciar')
      .setScale(isMobile ? 0.75 : 1)
      .setInteractive({ useHandCursor: true })
      .setVisible(false)
      .setDepth(1001);

    this.retryButton.on('pointerdown', () => {
      if (!this.hasEnded) return;
      this.scene.restart();
    });
  }

  createPlatform(width, height) {
    this.plataform = this.physics.add.image(width / 2, height - 55, 'plataform')
      .setImmovable(true)
      .setScale(this.runtimeConfig.platformScale)
      .setCollideWorldBounds(true)
      .setDepth(40);

    this.plataform.body.allowGravity = false;
  }

  createBall(width, height) {
  const isMobile = this.isMobile();

  const startX = isMobile ? width * 0.22 : width * 0.16;
  const startY = isMobile ? 95 : 105;

  this.ball = this.physics.add.image(startX, startY, 'ball')
    .setScale(this.runtimeConfig.ballScale)
    .setCollideWorldBounds(true)
    .setBounce(1, 1)
    .setDepth(50);

  const velocityX = Phaser.Math.Between(
    this.runtimeConfig.ballSpeedMin,
    this.runtimeConfig.ballSpeedMax
  );

  this.ball.setVelocity(velocityX, 120);

  this.physics.add.collider(
    this.ball,
    this.plataform,
    this.bounceBall,
    null,
    this
  );
}

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createMobileHint(width, height) {
    const hint = this.add.text(
      width / 2,
      height - 22,
      'Arrastra la barra para controlar el rebote',
      {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#d8b45a',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 3
      }
    )
      .setOrigin(0.5)
      .setAlpha(0.85)
      .setDepth(120);

    this.tweens.add({
      targets: hint,
      alpha: 0.35,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut'
    });
  }

  createMobileControls() {
    this.input.on('pointerdown', (pointer) => {
      if (this.hasEnded) return;

      this.isTouchingPlatform = true;
      this.movePlatformTo(pointer.x);
    });

    this.input.on('pointermove', (pointer) => {
      if (this.hasEnded) return;
      if (!this.isTouchingPlatform && !pointer.isDown) return;

      this.movePlatformTo(pointer.x);
    });

    this.input.on('pointerup', () => {
      this.isTouchingPlatform = false;

      if (this.plataform) {
        this.plataform.setVelocityX(0);
      }
    });
  }

  movePlatformTo(x) {
    const halfPlatform = this.plataform.displayWidth / 2;

    const targetX = Phaser.Math.Clamp(
      x,
      halfPlatform,
      this.scale.width - halfPlatform
    );

    this.plataform.body.reset(targetX, this.plataform.y);
    this.plataform.setVelocityX(0);
  }

  createObstacles() {
    const width = this.scale.width;
    const height = this.scale.height;
    const isMobile = this.isMobile();

    this.obstacles = this.physics.add.staticGroup();

    const pattern = this.runtimeConfig.pattern;

    const rows = pattern.length;
    const cols = Math.max(...pattern.map(row => row.length));

    const maxPatternWidth = width * (isMobile ? 0.82 : 0.58);
    const maxPatternHeight = height * (isMobile ? 0.42 : 0.46);

    const spacingX = Math.min(
  isMobile ? 70 : 112,
  maxPatternWidth / Math.max(cols - 1, 1)
);

const spacingY = Math.min(
  isMobile ? 66 : 102,
  maxPatternHeight / Math.max(rows - 1, 1)
);

    const spacing = Math.min(spacingX, spacingY);

    const obstacleSize = Phaser.Math.Clamp(
  spacing * this.runtimeConfig.obstacleScale * (isMobile ? 1.65 : 1.95),
  isMobile ? 64 : 105,
  isMobile ? 96 : 150
);
    const startX = width / 2 - ((cols - 1) * spacing) / 2;
    const startY = isMobile ? height * 0.16 : height * 0.15;

    const createSingleObstacle = (x, y) => {
      const obstacle = this.obstacles.create(x, y, 'obstacle');

      obstacle
        .setDisplaySize(obstacleSize, obstacleSize)
        .setDepth(20);

      obstacle.refreshBody();

      obstacle.body.setSize(
        obstacle.displayWidth * 0.58,
        obstacle.displayHeight * 0.58
      );

      obstacle.body.updateFromGameObject();
    };

    for (let row = 0; row < pattern.length; row++) {
      const line = pattern[row];

      for (let col = 0; col < line.length; col++) {
        if (line[col] === 'x') {
          createSingleObstacle(
            startX + col * spacing,
            startY + row * spacing
          );
        }
      }
    }

    this.physics.add.collider(
      this.ball,
      this.obstacles,
      this.destroyObstacle,
      null,
      this
    );
  }

  destroyObstacle(ball, obstacle) {
    obstacle.destroy();

    if (this.obstacles.countActive() === 0) {
      this.winLevel();
    }
  }

  bounceBall(ball, platform) {
  const isMobile = this.isMobile();
  const height = this.scale.height;

  const impactPoint = ball.x - platform.x;

  const normalizedImpact = Phaser.Math.Clamp(
    impactPoint / (platform.displayWidth / 2),
    -1,
    1
  );

  const horizontalBoost = isMobile
    ? 320 + this.levelNumber * 22
    : 360 + this.levelNumber * 28;

  const minVerticalBoost = isMobile
    ? Math.max(440, height * 0.64)
    : Math.max(480, height * 0.60);

  const currentVerticalSpeed = Math.abs(ball.body.velocity.y);

  const velocityX = normalizedImpact * horizontalBoost;
  const velocityY = -Math.max(minVerticalBoost, currentVerticalSpeed);

  ball.setVelocity(velocityX, velocityY);
}
  


  update() {
  if (this.hasEnded) return;

  if (!this.isMobile()) {
    this.updateDesktopControls();
  }

  if (this.ball.y > this.scale.height + this.ball.displayHeight / 2) {
    this.loseLevel();
  }
}

  updateDesktopControls() {
  const speed = 580 + this.levelNumber * 35;

  if (this.cursors.left.isDown) {
    this.plataform.setVelocityX(-speed);
  } else if (this.cursors.right.isDown) {
    this.plataform.setVelocityX(speed);
  } else {
    this.plataform.setVelocityX(0);
  }
}

  showResultOverlay() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.resultOverlay = this.add.graphics();
    this.resultOverlay.fillStyle(0x000000, 0.62);
    this.resultOverlay.fillRect(0, 0, width, height);
    this.resultOverlay.setDepth(900);
  }

  loseLevel() {
    if (this.hasEnded) return;

    this.hasEnded = true;

    this.physics.pause();

    this.showResultOverlay();

    this.ball.setVelocity(0, 0).setVisible(false);

    this.gameoverText.setVisible(true);
    this.gameoverText.setScale(0.6);
    this.gameoverText.setAlpha(0);
    this.gameoverText.setDepth(1000);

    this.retryButton.setVisible(true);
    this.retryButton.setDepth(1001);

    this.tweens.add({
      targets: this.gameoverText,
      scale: 1,
      alpha: 1,
      duration: 350,
      ease: 'Back.Out'
    });

    this.gameoverPulse.play();
  }

  winLevel() {
    if (this.hasEnded) return;

    this.hasEnded = true;

    this.physics.pause();

    this.showResultOverlay();

    this.ball.setVelocity(0, 0).setVisible(false);

    this.winText.setVisible(true);
    this.winText.setScale(0.6);
    this.winText.setAlpha(0);
    this.winText.setDepth(1000);

    this.tweens.add({
      targets: this.winText,
      scale: 1,
      alpha: 1,
      duration: 350,
      ease: 'Back.Out'
    });

    this.winPulse.play();

    this.time.delayedCall(1000, () => {
      this.playCountdownAndContinue();
    });
  }

  playCountdownAndContinue() {
    const width = this.scale.width;
    const height = this.scale.height;
    const delay = 500;

    this.winText.setVisible(false);
    this.winPulse.stop();

    const countdownText = this.add.text(width / 2, height / 2, '3', {
      fontFamily: '"Arial Black", Arial',
      fontSize: this.isMobile() ? '58px' : '76px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#111111',
      strokeThickness: 6
    })
      .setOrigin(0.5)
      .setDepth(1002);

    const animateCountdown = () => {
      countdownText.setScale(1);
      countdownText.setAlpha(1);

      this.tweens.add({
        targets: countdownText,
        scale: 1.16,
        duration: 180,
        yoyo: true
      });
    };

    animateCountdown();

    this.time.delayedCall(delay, () => {
      countdownText.setText('2');
      animateCountdown();
    });

    this.time.delayedCall(delay * 2, () => {
      countdownText.setText('1');
      animateCountdown();
    });

    this.time.delayedCall(delay * 3, () => {
      countdownText.destroy();
      this.scene.start(this.runtimeConfig.nextLevel);
    });
  }
}