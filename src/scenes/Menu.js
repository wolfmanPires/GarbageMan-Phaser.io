export class Menu extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  preload() {
    this.load.image('background','assets/background.png');
    this.load.spritesheet('jogarBtn','assets/jogarBtn.png',{frameWidth: 160, frameHeight: 90});
    this.load.spritesheet('menuBtn','assets/menuBtn.png',{frameWidth: 160, frameHeight: 90});
    this.load.image('trash-blue','assets/trash-blue.png');
    this.load.image('trash-green','assets/trash-green.png');
    this.load.image('trash-yellow','assets/trash-yellow.png');
    this.load.image('bin-blue','assets/bin-blue.png');
    this.load.image('bin-green','assets/bin-green.png');
    this.load.image('bin-yellow','assets/bin-yellow.png');
    this.load.spritesheet('enemy-sprites','assets/enemy-sprites.png',{frameWidth: 60, frameHeight: 34})
  }

  create() {
    this.add.sprite(635, 360, "background");
    //Texto e botoes para ecra de tutorial
    const titleText = this.add.text(80,100,"Como Jogar:\nLixos diferentes vão para os seus respetivos caixotes de ecoponto:\n"+
        "\nPapéis -> Ecoponto Azul;        Vidros -> Ecoponto Verde;        Metais e Plásticos -> Ecoponto Amarelo.", {
        fontSize: "18px",
        fill: "#000"
    });
    const jogarBtn = this.add.sprite(450, 600, 'jogarBtn', 0).setInteractive({ useHandCursor: true });
    jogarBtn.on('pointerover', () => jogarBtn.setFrame(1)); 
    jogarBtn.on('pointerout', () => jogarBtn.setFrame(0));  
    jogarBtn.on('pointerdown', () => {
        jogarBtn.setFrame(0);
        this.scene.stop("Menu");
        this.scene.start("Jogo");
    });
    const menuBtn = this.add.sprite(820, 600, 'menuBtn', 0).setInteractive({ useHandCursor: true });
    menuBtn.on('pointerover', () => menuBtn.setFrame(1)); 
    menuBtn.on('pointerout', () => menuBtn.setFrame(0));  
    menuBtn.on('pointerdown', () => {
        menuBtn.setFrame(0);
        this.scene.stop("Menu");
        this.scene.start("Start");
    });
    this.add.sprite(200,220,"trash-blue").setScale(1.5);
    this.add.sprite(550,220,"trash-green").setScale(1.5);
    this.add.sprite(1000,220,"trash-yellow").setScale(1.5);
    this.add.sprite(200,310,"bin-blue").setScale(1.5);
    this.add.sprite(550,310,"bin-green").setScale(1.5);
    this.add.sprite(1000,310,"bin-yellow").setScale(1.5);

    const subText = this.add.text(80,440,"Quando reciclares 10 vezes, podes passar ao próximo nivel! Mas cuidado!\n"+
        "Uma lesma está a tentar-te parar para ela comer o lixo!", {
        fontSize: "18px",
        fill: "#000"
    });
    this.anims.create({
      key: 'enemyAnim',
      frames: this.anims.generateFrameNumbers('enemy-sprites', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1
    });

    this.enemy = this.add.sprite(920, 450, "enemy-sprites").setScale(2);
  }

  update(){
    this.enemy.anims.play('enemyAnim',true);
  }
}