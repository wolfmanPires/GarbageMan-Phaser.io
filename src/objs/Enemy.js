export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  //Dados para a criacao dos objetos do inimigos
  constructor(scene,x,y,player,obst) {
    //Implem. na Scene
    super(scene,x,y,'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Implem. das cariaveis de movimento
    this.player = player;
    this.obst = obst;
    this.speed = this.player.speed*2/3;
    this.maxVel = this.player.maxVel*2/3;
    this.atrition = 0.97;

    //Implem. das variaveis de colisao
    this.body.setCollideWorldBounds(true);
    this.setScale(1);
    this.body.setMaxVelocity(this.maxVel,this.maxVel);
    this.obstBlocking = false;
    this.currentObst = null;
    this.detour = null;
    this.gameWidth = 1270;
    this.gameHeight = 720;
    this.reSearchTimer = 0;
  }

  //Dados processados a cada tick do jogo
  update(){
    const body = this.body;
    const playerBody = this.player.body;
    let angleRad;

    //Perseguir o jogador de forma mais lenta que ele
    const playerCenter = new Phaser.Math.Vector2(playerBody.position.x+playerBody.halfWidth,playerBody.position.y+playerBody.halfHeight)
    this.hasObst(playerCenter);

    body.velocity.x *= this.atrition; body.velocity.y *= this.atrition;
    if(this.obstBlocking){
      if(this.detour==null){
        this.detour = this.calcDetour(playerBody.position);
      }
      angleRad = Math.atan2(this.detour.y-body.position.y,this.detour.x-body.position.x);
      this.reSearchTimer++;
      //Passado algum tempo, reiniciar procura de desvio para nao ir sempre na mesma direcao
      if(this.reSearchTimer>=50){
        this.detour=null;
        this.reSearchTimer=0;
      }
    }else{
      angleRad = Math.atan2(playerBody.position.y-body.position.y,playerBody.position.x-body.position.x);
    }
    //angleRad = Math.atan2(playerBody.position.y-body.position.y,playerBody.position.x-body.position.x);
    body.velocity.x += this.speed*Math.cos(angleRad); body.velocity.y += this.speed*Math.sin(angleRad);
  }
  
  //Metodo para refrescar os dados do jogador
  updatePlayer(player){
    this.player = player;
  }

  //Metodo para desviar de obstaculos
  hasObst(target){
    const rayCast = new Phaser.Geom.Line(this.body.position.x+this.body.halfWidth, this.body.position.y+this.body.halfHeight, target.x, target.y);

    //Obstaculo detetado, guardar obstaculo especifico para calcular desvio
    for(const obst of this.obst){
      if(Phaser.Geom.Intersects.LineToRectangle(rayCast, obst.getBounds())){
        this.obstBlocking = true;
        this.currentObst = obst;
        return;
      }
    }

    this.obstBlocking = false;
    if(this.detour != null){
      this.detour = null;
    }
    if(this.currentObst != null){
      this.currentObst = null;
    }
  }

  //Metodo para calcular coordenadas do ponto de desvio caso haja obstaculo
  calcDetour(target){
    const rayCast = new Phaser.Geom.Line(this.body.position.x+this.body.halfWidth, this.body.position.y+this.body.halfHeight, target.x, target.y);

    //Caso ainda houver obstaculo, percorrer recursivamente ate ir para espaco vazio
    if(Phaser.Geom.Intersects.LineToRectangle(rayCast, this.currentObst.getBounds())){
      //Obter angulo
      let angleAssist = Math.atan2(target.y-this.body.position.y,target.x-this.body.position.x)
      
      //Fazer novo angulo de forma a desviar-se de objeto
      if(this.currentObst.getBounds().x<=0){
        //Obstaculo que colide com a parede do mapa pela esquerda
        if(target.y<=this.currentObst.getBounds().centerY){
          //Caso alvo esteja abaixo de obstaculo
          angleAssist += 0.35;
        }else{
          //Caso alvo esteja acima de obstaculo
          angleAssist -= 0.35;
        }
      }else if(this.currentObst.getBounds().x+this.currentObst.getBounds().width>=this.gameWidth){
        //Obstaculo que colide com a parede do mapa pela direita
        if(target.y<=this.currentObst.getBounds().centerY){
          //Caso alvo esteja abaixo de obstaculo
          angleAssist -= 0.35;
        }else{
          //Caso alvo esteja acima de obstaculo
          angleAssist += 0.35;
        }
      }else if(this.currentObst.getBounds().y<=0){
        //Obstaculo que colide com a parede do mapa em cima
        if(target.x<=this.currentObst.getBounds().centerX){
          //Caso alvo esteja a esquerda de obstaculo
          angleAssist -= 0.35;
        }else{
          //Caso alvo esteja a direita de obstaculo
          angleAssist += 0.35;
        }
      }else if(this.currentObst.getBounds().y+this.currentObst.getBounds().height>=this.gameHeight){
        //Obstaculo que colide com a parede do mapa em baixo
        if(target.x<=this.currentObst.getBounds().centerX){
          //Caso alvo esteja a esquerda de obstaculo
          angleAssist += 0.35;
        }else{
          //Caso alvo esteja a direita de obstaculo
          angleAssist -= 0.35;
        }
      }

      //Para casos de voltas completas
      if(angleAssist>Math.PI){
        angleAssist -= 2*Math.PI
      }else if(angleAssist<-Math.PI){
        angleAssist += 2*Math.PI
      }
      /*console.log(angleAssist)
      console.log("X="+Math.cos(angleAssist))
      console.log("Y="+Math.sin(angleAssist))*/
      const newTarget = new Phaser.Math.Vector2(this.body.position.x+1000*Math.cos(angleAssist),this.body.position.y+1000*Math.sin(angleAssist));
      return this.calcDetour(newTarget);
    }
    //console.log(target)
    //Caso nao haja mais obstaculos, percorrer ate novo alvo
    this.obstBlocking = false;
    return target;
  }
}