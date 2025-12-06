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
    this.load.image('player','assets/player.png');
    this.load.image('enemy','assets/enemy.png');
    this.load.image('trash','assets/trash.png');
    this.load.image('bin','assets/bin.png');
    this.load.image('barra','assets/barra.png');
  }

  create() {
    // Mapa simples (placeholder)
    this.add.rectangle(635, 360, 1270, 720, 0xffffff);

    // Criar personagem e inimigo
    this.player = new Player(this, 400, 300);
    this.obst = [];
    Phaser.Utils.Array.Add(this.obst, new Obst(this,900,500))
    this.enemy = new Enemy(this,100,100,this.player, this.obst);
    this.trash = new Trash(this);
    this.bin = new Bin(this);
    //Obstaculo template
    this.physics.add.collider(this.obst, this.player);
    this.physics.add.collider(this.obst, this.enemy);
    const checkTrash = this.physics.add.collider(this.trash, this.player, function(r,s){
      s.pickupTrash(r);
      r.scene.physics.world.removeCollider(checkTrash);
    });
    //Caso lixo tenha contacto com um obstaculo
    for(let i = 0; i<this.obst.length;i++){
      this.physics.add.collider(this.trash, this.obst[i], function(r,s){
        r.x = Phaser.Math.Between(100,1170)
        r.y = Phaser.Math.Between(100,620)
      });
      this.physics.add.collider(this.bin, this.obst[i], function(r,s){
        r.x = Phaser.Math.Between(100,1170)
        r.y = Phaser.Math.Between(100,620)
      });
    }
    this.physics.add.collider(this.player, this.bin, function(r,s){
      console.log(r.gotTrash)
      if(r.gotTrash!=null){
        s.removeTrash(r.gotTrash);
      }
    });
    this.physics.add.collider(this.trash, this.bin, function(r,s){
      s.removeTrash(r);
    });

    /*// Grupos
    this.enemies = this.physics.add.group();
    this.trashGroup = this.physics.add.group();
    this.binGroup = this.physics.add.group();

    // Spawns iniciais
    this.spawnTrash();
    this.spawnBin();
    this.spawnEnemyRandom();

    // Colisões
    this.physics.add.overlap(this.player, this.trashGroup, this.collectTrash, null, this);
    this.physics.add.overlap(this.player, this.binGroup, this.depositTrash, null, this);

    this.physics.add.overlap(this.player, this.enemies, this.playerHit, null, this);

    // UI
    this.scene.launch('UIScene', { player: this.player });

    // Spawn inimigos ao longo do tempo
    this.time.addEvent({ delay: 5000, callback: this.spawnEnemyRandom, callbackScope: this, loop: true });*/
  }

  update() {
    //Atualizar jogador
    this.player.update();
    //Atualizar inimigo com dados do jogador
    this.enemy.updatePlayer(this.player);
    this.enemy.update();
    this.trash.update();
  }

  /*// ------------------ SPAWNS ------------------
  spawnTrash() {
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(50, 550);
    this.trashGroup.create(x, y, 'trash');
  }

  spawnBin() {
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(50, 550);
    this.binGroup.create(x, y, 'bin');
  }

  spawnEnemyRandom() {
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(50, 550);

    const type = Phaser.Math.RND.pick(['chaser', 'zoner', 'trapper']);
    let enemy;

    if (type === 'chaser') enemy = new Chaser(this, x, y);
    if (type === 'zoner') enemy = new Zoner(this, x, y);
    if (type === 'trapper') enemy = new Trapper(this, x, y);

    this.enemies.add(enemy);
  }

  // ------------------ COLISOES ------------------
  collectTrash(player, trash) {
    trash.destroy();
    player.pickTrash('default');
  }

  depositTrash(player, bin) {
    if (player.hasTrash('default')) {
      player.clearTrash();
      bin.destroy();
      this.spawnBin();
    }
  }

  playerHit(player, enemy) {
    player.loseLife();
  }*/
}
