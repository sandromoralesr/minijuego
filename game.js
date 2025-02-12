export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
    }

    preload() {
        this.load.image('background', 'images/background.png');
        this.load.image('gameover', 'images/gameover.png');
        this.load.image('plataform', 'images/platform.png');
        this.load.image('ball', 'images/ball.png');
        this.load.image('reiniciar', 'images/reiniciar.png');
        this.load.image('obstacle', 'images/obstacle.png');
        this.load.image('win', 'images/win.png');
        this.load.image('one', 'images/one.png');
        this.load.image('two', 'images/two.png');
        this.load.image('three', 'images/three.png');
    }

    create() {
        // Fondo ajustado a pantalla completa
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background')
            .setDisplaySize(this.scale.width, this.scale.height);

        // Imágenes de "Game Over" y "Victory"
        this.gameoverImage = this.add.image(this.scale.width / 2, 150, 'gameover').setVisible(false)
            .setScale(2.0); // 🔹 Aumentar tamaño 
            
        this.winImage = this.add.image(this.scale.width / 2, 250, 'win').setVisible(false)
            .setScale(2.0); // 🔹 Aumentar tamaño 

        // Botón de reinicio más grande
        this.retryButton = this.add.image(this.scale.width / 2, this.scale.height / 2, 'reiniciar')
            .setScale(1.0)
            .setInteractive()
            .setVisible(false)
            .on('pointerdown', () => this.showImagesAndRestart()); // Reiniciar juego cuando se pierda

        // Agrandar la plataforma
        this.plataform = this.physics.add.image(this.scale.width / 2, this.scale.height - 50, 'plataform')
            .setImmovable()
            .setScale(2.0) // ⬅️ Aumentamos el tamaño de la plataforma
            .setCollideWorldBounds(true);
        this.plataform.body.allowGravity = false;

        // Agrandar la bola
        this.ball = this.physics.add.image(this.scale.width / 2, 100, 'ball')    
            .setCollideWorldBounds(true)    
            .setBounce(1)    
            .setScale(1.8); // ⬅️ Aumentamos el tamaño de la bola

        let velocity = 150 * Phaser.Math.Between(1.3, 2);

        if (Phaser.Math.Between(0, 10) > 5) velocity = -velocity;
        this.ball.setVelocity(velocity, 10);
        this.physics.add.collider(this.ball, this.plataform, this.bounceBall, null, this);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Crear obstáculos con mayor separación
        this.createObstacles();
    }

    createObstacles() {
        const columnas = 1; // Número de columnas
        const filas = 1; // Número de filas
        const espacioX = 250; // ⬅️ Mayor separación horizontal
        const espacioY = 250; // ⬅️ Mayor separación vertical
    
        const startX = (this.scale.width - (columnas - 1) * espacioX) / 2;
        const startY = 300;
    
        this.obstacles = this.physics.add.staticGroup();
    
        for (let i = 0; i < columnas; i++) {
            for (let j = 0; j < filas; j++) {
                let obstacle = this.obstacles.create(
                    startX + i * espacioX,
                    startY + j * espacioY,
                    'obstacle'
                );
    
                obstacle.setScale(0.7) // 🔹 Mantiene su tamaño original
                    .refreshBody();
            }
        }
    
        this.physics.add.collider(this.ball, this.obstacles, this.destroyObstacle, null, this);
    }

    destroyObstacle(ball, obstacle) {
        obstacle.destroy();
        if (this.obstacles.countActive() === 0) {
            this.winGame();
        }
    }

    update() {
        if (this.cursors.left.isDown) {
            this.plataform.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.plataform.setVelocityX(500);
        } else {
            this.plataform.setVelocityX(0);
        }
    
        // 🔴 Corrección: Detectar correctamente si la bola cayó al suelo
        if (this.ball.y >= this.scale.height - this.ball.displayHeight / 2) {
            this.gameOver();
        }
    }

    gameOver() {
        this.ball.setVelocity(0, 0).setVisible(false);
        this.gameoverImage.setVisible(true);
        this.retryButton.setVisible(true);
        this.obstacles.clear(true, true);
        this.physics.pause(); // Detenemos toda la física al perder
    
        // Asegurarse de que el conteo solo se muestre cuando el jugador hace clic en "Reiniciar"
        this.retryButton.once('pointerdown', () => {
            this.showImagesAndRestart(false); // Llamar a showImagesAndRestart sin la bandera de ganar
        });
    }
    
    // Función que se ejecuta cuando se gana
    winGame() {
        this.ball.setVelocity(0, 0).setVisible(false);
        this.winImage.setVisible(true); // Muestra la imagen de victoria
        this.physics.pause(); // Detenemos la física
    
        // Asegurarse de que el conteo solo se muestre cuando el jugador gana
        this.time.delayedCall(1000, () => {
            this.showImagesAndRestart(true); // Pasar a la siguiente escena después de la cuenta
        });
    }

    bounceBall(ball, platform) {
        let platformCenter = platform.x;
        let ballPosition = ball.x;
        let impactPoint = ballPosition - platformCenter;

        let normalizedImpact = impactPoint / (platform.displayWidth / 2);
        let newVelocityX = normalizedImpact * 200;
        let newVelocityY = -Math.abs(ball.body.velocity.y);

        ball.setVelocity(newVelocityX, newVelocityY);
    }

  
    showImagesAndRestart(isWin) {
        // Ocultar imágenes previas y botones
        this.winImage.setVisible(false);
        this.gameoverImage.setVisible(false);
        this.retryButton.setVisible(false);
        this.plataform.setVisible(false);
    
        // Asegurar que no hay imágenes previas
        if (this.oneImage) {
            this.oneImage.destroy();
            this.oneImage = null;
        }
        if (this.twoImage) {
            this.twoImage.destroy();
            this.twoImage = null;
        }
        if (this.threeImage) {
            this.threeImage.destroy();
            this.threeImage = null;
        }
    
        let delay = 500; // Intervalo entre imágenes
    
        // Mostrar "one.png"
        this.oneImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'one')
            .setScale(3.0);
    
        // Ocultar "one" y mostrar "two"
        this.time.delayedCall(delay, () => {
            if (this.oneImage) {
                this.oneImage.destroy();
                this.oneImage = null;
            }
    
            // Verificar si ya existe "twoImage" antes de agregarla
            if (this.twoImage) {
                this.twoImage.destroy();
                this.twoImage = null;
            }
    
            this.twoImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'two')
                .setScale(3.0);
        });
    
        // Ocultar "two" y mostrar "three"
        this.time.delayedCall(delay * 2, () => {
            if (this.twoImage) {
                this.twoImage.destroy();
                this.twoImage = null;
            }
    
            // Verificar si ya existe "threeImage" antes de agregarla
            if (this.threeImage) {
                this.threeImage.destroy();
                this.threeImage = null;
            }
    
            this.threeImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'three')
                .setScale(3.0);
        });
    
        // Ocultar "three" y reiniciar
        this.time.delayedCall(delay * 3, () => {
            if (this.threeImage) {
                this.threeImage.destroy();
                this.threeImage = null;
            }
    
            if (isWin) {
                this.scene.start('game2');
            } else {
                this.scene.restart();
            }
        });
    }
    
}   