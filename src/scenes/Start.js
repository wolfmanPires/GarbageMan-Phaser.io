export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background','assets/background.png');
        this.load.spritesheet('jogarBtn','assets/jogarBtn.png',{frameWidth: 160, frameHeight: 90});
        this.load.spritesheet('tutorialBtn','assets/tutorialBtn.png',{frameWidth: 160, frameHeight: 90});
        this.load.audio('startTheme','assets/Catching_bugs_in_the_sun.mp3');
    }

    create() {
        this.add.sprite(635, 360, "background");
        //Texto e botoes para ecra inicial
        const titleText = this.add.text(400,200,"GarbageMan", {
            fontSize: "80px",
            fill: "#000"
        });
        const subText = this.add.text(300,300,"Uma aventura reciclável!", {
            fontSize: "48px",
            fill: "#000"
        });
        const jogarBtn = this.add.sprite(450, 450, 'jogarBtn', 0).setInteractive({ useHandCursor: true });
        jogarBtn.on('pointerover', () => jogarBtn.setFrame(1)); 
        jogarBtn.on('pointerout', () => jogarBtn.setFrame(0));  
        jogarBtn.on('pointerdown', () => {
            jogarBtn.setFrame(0);
            this.scene.stop("Start");
            this.scene.start("Jogo");
        });
        const tutorialBtn = this.add.sprite(820, 450, 'tutorialBtn', 0).setInteractive({ useHandCursor: true });
        tutorialBtn.on('pointerover', () => tutorialBtn.setFrame(1)); 
        tutorialBtn.on('pointerout', () => tutorialBtn.setFrame(0));  
        tutorialBtn.on('pointerdown', () => {
            tutorialBtn.setFrame(0);
            this.scene.stop("Start");
            this.scene.start("Menu");
        });
        if(this.sound.getAll().length>0){
            if(this.sound.getAll()[0].key!="startTheme"){ this.sound.removeAll(); }
        }
        this.startTheme = this.sound.add('startTheme');
        this.startTheme.play();
        this.startTheme.setLoop(true);
    }

    update() {
        
    }
}
