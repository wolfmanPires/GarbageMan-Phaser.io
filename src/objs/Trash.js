export default class Trash extends Phaser.Physics.Arcade.Sprite {
  //Dados para a criacao dos objetos do lixo
  constructor(scene,type) {
    //Implem. na Scene
    if(type==1){
      super(scene,0,0,'trash-green');
    }else if(type==2){
      super(scene,0,0,'trash-yellow');
    }else{
      super(scene,0,0,'trash-blue');
    }
    this.scene = scene;
    this.x = Phaser.Math.Between(100,1170);
    this.y = Phaser.Math.Between(100,620);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Implem. das variaveis de colisao
    this.setScale(1);
    this.body.setCollideWorldBounds(true);

    //Para verificar os tipos de lixo
    this.type = type;
  }

  update(){
    
  }
}