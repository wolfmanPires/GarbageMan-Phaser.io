import Player from '../objs/Player.js';
import Enemy from '../objs/Enemy.js';
import Obst from '../objs/Obst.js';
import Trash from '../objs/Trash.js';
import Bin from '../objs/Bin.js';

export class Jogo extends Phaser.Scene {
  constructor() {
    super('Jogo');
  }

  preload(){
    this.loadImgs();
  }

  create() {
    // Mapa de base e musica
    this.add.sprite(635, 360, "background");
    this.sound.removeAll();
    this.gameTheme = this.sound.add('gameTheme');
    this.gameTheme.play();
    this.gameTheme.setLoop(true);

    //Pontuacao e timers
    this.score = 0;
    this.wrongType = "";
    this.wrongTypeTimer = 0;
    this.newTrashTimer = 0;

    // Criar personagem e inimigo
    this.player = new Player(this, 400, 300);
    this.playerAnims();
    this.obst = [];
    this.level1();
    this.bin = [];
    this.enemy = new Enemy(this,100,100,this.player, this.obst);
    this.enemyAnims();
    Phaser.Utils.Array.Add(this.bin, new Bin(this,3))
    Phaser.Utils.Array.Add(this.bin, new Bin(this,2))
    Phaser.Utils.Array.Add(this.bin, new Bin(this,1))
    this.newTrash();
    //Obstaculo template
    this.loadCollisions();

    //Texto para pontuacao, vidas e trazer lixo errado
    this.scoreText = this.add.text(1270-220,16,"Pontos: "+this.score, {
      fontSize: "32px",
      fill: "#000"
    });
    this.livesText = this.add.text(32,16,"Vidas: "+this.player.lives, {
      fontSize: "32px",
      fill: "#000"
    });
    this.wrongTypeText = this.add.text(250,360,this.wrongType, {
      fontSize: "32px",
      fill: "#f00"
    });
  }

  update() {
    //Atualizar jogador
    this.player.update();
    //Atualizar inimigo com dados do jogador
    this.enemy.updatePlayer(this.player);
    this.enemy.update();
    this.trash.update();
    this.livesText.setText("Vidas: "+this.player.lives);
    this.scoreText.setText("Pontos: "+this.score);
    this.wrongTypeText.setText(this.wrongType);
    if(this.wrongTypeTimer!=0){
      this.wrongTypeTimer--;
      if(this.wrongTypeTimer==0){
        this.wrongType = "";
      }
    }

    //Verifica se Player ganhou
    if(this.score >= 10){
      this.scene.stop("Jogo");
      this.scene.start("WonScreen");
    }
  }

  //Metodo para carregar imagens
  loadImgs(){
    //Templates de testes
    this.load.image('player','assets/player.png');
    this.load.image('enemy','assets/enemy.png');
    this.load.image('barra','assets/barra.png');
    //Imagens a usar no produto final
    this.load.image('background','assets/background.png');
    this.load.image('trash-blue','assets/trash-blue.png');
    this.load.image('trash-green','assets/trash-green.png');
    this.load.image('trash-yellow','assets/trash-yellow.png');
    this.load.image('bin-blue','assets/bin-blue.png');
    this.load.image('bin-green','assets/bin-green.png');
    this.load.image('bin-yellow','assets/bin-yellow.png');
    this.load.spritesheet('player-sprites','assets/player-sprites.png',{frameWidth: 46, frameHeight: 48})
    this.load.spritesheet('enemy-sprites','assets/enemy-sprites.png',{frameWidth: 60, frameHeight: 34})
    this.load.image('bush-small','assets/bushLine500.png');
    this.load.image('bush-big','assets/bushLine1000.png');
    this.load.image('grass-small','assets/grassLine500.png');
    this.load.image('grass-big','assets/grassLine1000.png');
    this.load.spritesheet('trap-marker','assets/trap-marker.png',{frameWidth: 97, frameHeight: 48})
    this.load.spritesheet('attack','assets/attack-sprite.png',{frameWidth: 98, frameHeight: 48})
    this.load.audio('gameTheme','assets/catterpillar.mp3');
    this.load.audio('bonk','assets/bonk.mp3');
    this.load.audio('spring','assets/spring.mp3');
  }

  //Metodo para carregar colisoes entre objetos
  loadCollisions(){
    this.physics.add.collider(this.obst, this.player);
    this.physics.add.collider(this.obst, this.enemy);
    //Caso lixo tenha contacto com um obstaculo
    for(let i = 0; i<this.obst.length;i++){
      for(let j = 0; j < this.bin.length;j++){
          this.physics.add.collider(this.bin[j], this.obst[i], function(r,s){
          r.x = Phaser.Math.Between(100,1170)
          r.y = Phaser.Math.Between(100,620)
        });
      }
    }
    for(let i = 0; i<this.bin.length;i++){
      this.physics.add.collider(this.player, this.bin[i], function(r,s){
        if(r.gotTrash!=null){
          if(r.gotTrash.type==s.type){
            s.removeTrash(r.gotTrash);
          }else{
            let binType;
            if(s.type==1){
              binType = "vidro"
            }else if(s.type==2){
              binType = "plástico"
            }else{
              binType = "papel"
            }
            s.scene.wrongType = "Lixo errado! Esse caixote é para "+binType+"!";
            s.scene.wrongTypeTimer = 300;
          }
        }
      });
    }
    
    this.physics.add.collider(this.player, this.enemy, function(r,s){
      s.resetPosition();
      r.loseLife()
    });
  }

  //Metodos para os niveis
  //Nivel 1
  level1(){
    Phaser.Utils.Array.Add(this.obst, new Obst(this,900,400,"bush-big"));
    Phaser.Utils.Array.Add(this.obst, new Obst(this,200,200,"bush-small"));
    Phaser.Utils.Array.Add(this.obst, new Obst(this,200,600,"bush-small"));
  }

  //Nivel 2
  level2(){

  }

  //Metodo para inserir lixo no mapa
  newTrash(){
    const newType = Phaser.Math.Between(1,3)
    this.trash = new Trash(this,newType);
    for(let i = 0; i<this.bin.length;i++){
      this.physics.add.collider(this.trash, this.bin[i], function(r,s){
        if(r.type==s.type){
          s.removeTrash(r);
        }else{
          let binType;
          switch (s.type){
            case 1:
              binType = "vidro";
              break;
            case 2:
              binType = "plástico";
              break;
            case 3:
              binType = "papel";
              break;
          }
          s.scene.wrongType = "Lixo errado! Esse caixote é para "+binType+"!";
          s.scene.wrongTypeTimer = 300;
        }
      });
    }
    for(let i = 0;i < this.obst.length;i++){
      this.physics.add.collider(this.trash, this.obst[i], function(r,s){
        r.x = Phaser.Math.Between(100,1170)
        r.y = Phaser.Math.Between(100,620)
      });
    }
    const checkTrash = this.physics.add.collider(this.trash, this.player, function(r,s){
      s.pickupTrash(r);
      r.scene.physics.world.removeCollider(checkTrash);
    });
  }

  //Metodo para criar animacoes para o nosso Player usar
  playerAnims(){
    this.anims.create({
      key: 'leftPlayer',
      frames: this.anims.generateFrameNumbers('player-sprites', { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'rightPlayer',
      frames: this.anims.generateFrameNumbers('player-sprites', { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'upPlayer',
      frames: this.anims.generateFrameNumbers('player-sprites', { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'downPlayer',
      frames: this.anims.generateFrameNumbers('player-sprites', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idlePlayer',
      frames: [ { key: 'player-sprites', frame: 1 } ],
      frameRate: 10,
      repeat: -1
    });
  }

  //Metodo para criar animacoes para o nosso Enemy usar
  enemyAnims(){
    this.anims.create({
      key: 'enemyAnim',
      frames: this.anims.generateFrameNumbers('enemy-sprites', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'trapStart',
      frames: this.anims.generateFrameNumbers('trap-marker', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'trapSet',
      frames: [ { key: 'trap-marker', frame: 0 } ],
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'trapGone',
      frames: [ { key: 'trap-marker', frame: 1 } ],
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNumbers('attack', { start: 0, end: 12 }),
      frameRate: 60,
      repeat: -1
    });
  }
}
