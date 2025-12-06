export default class Player extends Phaser.Physics.Arcade.Sprite {
  //Dados para a criacao do objeto do jogador
  constructor(scene,x,y) {
    //Implem. na Scene
    super(scene,x,y,'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Implem. das cariaveis de movimento
    this.speed = 10;
    this.maxVel = 200;
    this.atrition = 0.97;
    this.lives = 3;
    this.gotTrash = null;
    this.cursors = scene.input.keyboard.addKeys({
      up: 'W',
      down: 'S',
      left: 'A',
      right: 'D'
    });

    //Implem. das variaveis de colisao
    this.body.setCollideWorldBounds(true);
    this.setScale(1);
    this.body.setMaxVelocity(this.maxVel,this.maxVel);
  }

  //Dados processados a cada tick do jogo
  update(){
    const body = this.body;

    //Criar movimento com atrito
    let ax = 0, ay = 0;

    if (this.cursors.left.isDown)  { ax = -this.speed }
    if (this.cursors.right.isDown) { ax = this.speed }
    if (this.cursors.up.isDown)    { ay = -this.speed }
    if (this.cursors.down.isDown)  { ay = this.speed }

    //Delta esta em segundos, dividir em 1000 para ter em milisegundos
    body.velocity.x *= this.atrition; body.velocity.y *= this.atrition; 
    body.velocity.x += ax; body.velocity.y += ay;
    
    if(this.gotTrash!=null){
      this.gotTrash.x = this.x;
      this.gotTrash.y = this.y - body.height;
    }
  }
  
  //Metodos para tratar do lixo
  //Pegar num lixo
  pickupTrash(trash){
    if(this.gotTrash==null){
      this.gotTrash = trash;
    }else{
      console.log("pickup ping")
    }
  }

  //Limpar lixo pegado
  clearTrash(){
    this.gotTrash = null;
  }

  //Metodo para quando se perde uma vida
  loseLife(){
    this.lives -= 1;
    //Caso fique sem vidas
    if(this.lives <= 0){
      this.scene.scene.restart();
    }
  }
}