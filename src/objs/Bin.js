export default class Bin extends Phaser.Physics.Arcade.Sprite {
  //Dados para a criacao dos objetos do caixote de lixo
  constructor(scene,type) {
    //Implem. na Scene
    if(type==1){
      super(scene,0,0,'bin-green');
    }else if(type==2){
      super(scene,0,0,'bin-yellow');
    }else{
      super(scene,0,0,'bin-blue');
    }
    this.scene = scene;
    this.x = Phaser.Math.Between(100,1170);
    this.y = Phaser.Math.Between(100,620);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Implem. das variaveis de colisao
    this.setScale(1);
    this.body.setCollideWorldBounds(true);
    this.body.immovable=true;

    //Para verificar os tipos de lixo
    this.type = type;
  }

  update(){
    
  }

  //Quando lixo e removido, adicionar na pontuacao e remover-lo para ajudar com memoria
  removeTrash(trash){
    this.scene.player.clearTrash();
    this.scene.score++;
    trash.destroy();
  }
}