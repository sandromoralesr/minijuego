export class Game2 extends Phaser.Scene {
    constructor() {
        super({ key: 'game2' });
    }

    preload() {
        this.load.image('background', 'images/background.png');
        this.load.image('win', 'images/win.png');
        this.load.image('plataform', 'images/platform.png');
        this.load.image('ball', 'images/ball.png');
        this.load.image('reiniciar', 'images/reiniciar.png');
        this.load.image('obstacle', 'images/obstacle.png');
        this.load.image('gameover', 'images/gameover.png');
    }

    create() {
        // Fondo ajustado a pantalla completa
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background')
            .setDisplaySize(this.scale.width, this.scale.height);
    
        this.winImage = this.add.image(this.scale.width / 2, 250, 'win').setVisible(false)
        .setVisible(false)
        .setScale(2.0);  // AUMENTAR SOLO TAMAÑO

        this.gameoverImage = this.add.image(this.scale.width / 2, 150, 'gameover').setVisible(false)
        .setVisible(false)
        .setScale(2.0);  // AUMENTAR SOLO TAMAÑO
    
        this.retryButton = this.add.image(this.scale.width / 2, this.scale.height / 2, 'reiniciar')
            .setScale(1.0) // 🔹 Aumentar tamaño del botón
            .setInteractive()
            .setVisible(false)
            .on('pointerdown', () => this.scene.start('game')); // 🔹 Volver a Game1
    
        // Plataforma ajustada
        this.plataform = this.physics.add.image(this.scale.width / 2, this.scale.height - 40, 'plataform')
            .setImmovable()
            .setScale(1.5);
        this.plataform.body.allowGravity = false;
        this.plataform.setCollideWorldBounds(true);
    
        // Bola ajustada
        this.ball = this.physics.add.image(this.scale.width / 2, 30, 'ball')
            .setScale(1.2)
            .setCollideWorldBounds(true);
        this.ball.setVelocity(Phaser.Math.Between(-300, 300), 250);
        this.ball.setBounce(1);
    
        // 🔹 Corrige el rebote en las esquinas de la plataforma
        this.physics.add.collider(this.ball, this.plataform, (ball, plataform) => {
            let relativeImpact = (ball.x - plataform.x) / (plataform.displayWidth / 2);
            ball.setVelocityX(300 * relativeImpact);
        });
    
        this.cursors = this.input.keyboard.createCursorKeys();
    
        this.createHeartObstacles();
    }
    
    createHeartObstacles() {
        const pattern = [
            "", 
            "xxxx      ", 
            "   ",  
            "xxxx       ", 
            ""
        ];

        const startX = (this.scale.width - pattern[0].length * 115) / 2; // Ajuste horizontal
        const startY = 220;
        const espacio = 150; // Espaciado mayor entre obstáculos
    
        this.obstacles = this.physics.add.staticGroup();
    
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 'x') {
                    let obstacle = this.obstacles.create(startX + col * espacio, startY + row * espacio, 'obstacle')
                        .setScale(0.6) // Tamaño ajustado
                        .refreshBody();
                }
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
    
        // 🔹 Verificar si la bola cae fuera de la pantalla
        if (this.ball.y >= this.scale.height - this.ball.displayHeight / 2) {
            console.log("💀 La bola ha caído, activando Game Over...");
            this.gameOver();
        }
    }
    
    gameOver() {
        console.log("💀 Ejecutando gameOver()");
    
        this.physics.pause();
        this.ball.setActive(false).setVisible(false);
        this.gameoverImage.setVisible(true);
        this.retryButton.setVisible(true);
    
        // ✅ Borrar todos los obstáculos manualmente
        this.obstacles.children.each((obstacle) => obstacle.destroy());
    
        this.retryButton.once('pointerdown', () => {
            console.log("🔄 Volviendo al nivel 1...");
            this.scene.stop('game2'); // 🔹 Detener Game2 antes de volver
            this.scene.start('game');  // 🔹 Reiniciar primer nivel
        });
    }
    
    
    winGame() {
        this.ball.setVelocity(0, 0).setVisible(false);
        this.winImage.setVisible(true);
        this.retryButton.setVisible(true);
        this.physics.pause();
    
        // Al hacer clic en el botón, iniciar la cuenta regresiva
        this.retryButton.once('pointerdown', () => {
            this.winImage.setVisible(false); // Ocultar "Win"
            this.retryButton.setVisible(false); // Ocultar botón de repetir
            this.showImagesAndRestart(); // Ahora sí se ejecuta la cuenta regresiva antes de ir al nivel 1
        });
    }
    
    

    showImagesAndRestart() {
        let delay = 500; // Intervalo entre imágenes
    
        // Asegurar que no haya imágenes previas visibles
        if (this.oneImage) this.oneImage.destroy();
        if (this.twoImage) this.twoImage.destroy();
        if (this.threeImage) this.threeImage.destroy();
    
        // Mostrar "one.png"
        this.oneImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'one')
            .setScale(3.0);
    
        this.time.delayedCall(delay, () => {
            this.oneImage.destroy(); // Ocultar "one"
            this.twoImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'two')
                .setScale(3.0);
        });
    
        this.time.delayedCall(delay * 2, () => {
            this.twoImage.destroy(); // Ocultar "two"
            this.threeImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'three')
                .setScale(3.0);
        });
    
        // 🔹 Después del conteo, iniciar la escena "game"
        this.time.delayedCall(delay * 3, () => {
            this.threeImage.destroy();
            this.scene.stop('game2');
            this.scene.start('game');
        });
    }
    
}
    
