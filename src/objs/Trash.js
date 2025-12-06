export default class Trash extends Phaser.Physics.Arcade.Sprite {
  //Dados para a criacao dos objetos do inimigos
  constructor(scene) {
    //Implem. na Scene
    super(scene,0,0,'trash');
    this.scene = scene;
    this.x = Phaser.Math.Between(100,1170);
    this.y = Phaser.Math.Between(100,620);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Implem. das variaveis de colisao
    this.setScale(1);
    this.body.setCollideWorldBounds(true);
  }

  update(){
    
  }
}