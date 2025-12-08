export class LostScreen extends Phaser.Scene {
  constructor() {
    super('LostScreen');
  }

  preload() {
    this.load.image('background','assets/background.png');
    this.load.spritesheet('restartBtn','assets/restartBtn.png',{frameWidth: 160, frameHeight: 90});
    this.load.spritesheet('menuBtn','assets/menuBtn.png',{frameWidth: 160, frameHeight: 90});
    this.load.audio('loseTheme','assets/Prepare_to_dice.mp3');
  }

  create() {
    this.add.sprite(635, 360, "background");
    //Texto e botoes para ecra de recomeco
    const titleText = this.add.text(450,200,"Perdeste!", {
        fontSize: "64px",
        fill: "#000"
    });
    const restartBtn = this.add.sprite(450, 450, 'restartBtn', 0).setInteractive({ useHandCursor: true });
    restartBtn.on('pointerover', () => restartBtn.setFrame(1)); 
    restartBtn.on('pointerout', () => restartBtn.setFrame(0));  
    restartBtn.on('pointerdown', () => {
        restartBtn.setFrame(0);
        this.scene.stop("LostScreen");
        this.scene.start("Jogo");
    });
    const menuBtn = this.add.sprite(820, 450, 'menuBtn', 0).setInteractive({ useHandCursor: true });
    menuBtn.on('pointerover', () => menuBtn.setFrame(1)); 
    menuBtn.on('pointerout', () => menuBtn.setFrame(0));  
    menuBtn.on('pointerdown', () => {
        menuBtn.setFrame(0);
        this.scene.stop("LostScreen");
        this.scene.start("Start");
    });
    const subText = this.add.text(230,320,"Queres voltar a tentar ou ir ao menu?", {
        fontSize: "36px",
        fill: "#000"
    });
    this.sound.removeByKey('gameTheme');
    this.loseTheme = this.sound.add('loseTheme');
    this.loseTheme.play();
    this.loseTheme.setLoop(true);
  }

  update(){
    
  }
}