export default class Obst extends Phaser.Physics.Arcade.Sprite {
  //Dados para a criacao dos objetos do inimigos
  constructor(scene,x,y,sprite) {
    //Implem. na Scene
    super(scene,x,y,sprite);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Implem. das variaveis de colisao
    this.setScale(1);
    //this.setRotation(Math.PI/2);
    this.body.immovable=true;
  }
}