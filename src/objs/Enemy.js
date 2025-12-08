export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  //Dados para a criacao dos objetos do inimigos
  constructor(scene,x,y,player,obst) {
    //Implem. na Scene
    super(scene,x,y,'enemy-sprites');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.spring = scene.sound.add('spring');

    //Implem. das variaveis de movimento
    this.xInicial = x;
    this.yInicial = y;
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

    //Implem. das variaveis de armadilhas
    this.trapTimer = 500;
    this.trapSetTimer = 300;
    this.hasTrap = false;
    this.trap;
    this.trapSet = false;
    this.attack;
    this.setAttack = false;
    this.attackTimer = 100;
    this.attackLifespan = 100;
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
    body.velocity.x += this.speed*Math.cos(angleRad); body.velocity.y += this.speed*Math.sin(angleRad);
    this.anims.play('enemyAnim',true);
    
    //Sistema de logica para as armadilhas aparecerem
    if(this.trapTimer != 0 && !this.hasTrap){
      this.trapTimer--;
    }else if(this.trapTimer == 0 && !this.hasTrap){
      this.setTrap();
    }else if(this.hasTrap && this.trapSetTimer != 0 && !this.trapSet){
      this.trapSetTimer--;
    }else if(this.hasTrap && this.trapSetTimer == 0 && !this.trapSet){
      this.trapSet = true;
      this.armedTrap();
    }else if(this.setAttack && this.attackTimer!=0){
      this.attackTimer--;
    }else if(this.setAttack && this.attackTimer==0){
      this.createAttack();
    }else if(!this.setAttack && this.attackTimer==0 && this.attackLifespan!=0){
      this.attackLifespan--;
    }else if(this.attackLifespan==0){
      this.resetTraps();
    }
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
          angleAssist += 0.5;
        }else{
          //Caso alvo esteja acima de obstaculo
          angleAssist -= 0.5;
        }
      }else if(this.currentObst.getBounds().x+this.currentObst.getBounds().width>=this.gameWidth){
        //Obstaculo que colide com a parede do mapa pela direita
        if(target.y<=this.currentObst.getBounds().centerY){
          //Caso alvo esteja abaixo de obstaculo
          angleAssist -= 0.5;
        }else{
          //Caso alvo esteja acima de obstaculo
          angleAssist += 0.5;
        }
      }else if(this.currentObst.getBounds().y<=0){
        //Obstaculo que colide com a parede do mapa em cima
        if(target.x<=this.currentObst.getBounds().centerX){
          //Caso alvo esteja a esquerda de obstaculo
          angleAssist -= 0.5;
        }else{
          //Caso alvo esteja a direita de obstaculo
          angleAssist += 0.5;
        }
      }else if(this.currentObst.getBounds().y+this.currentObst.getBounds().height>=this.gameHeight){
        //Obstaculo que colide com a parede do mapa em baixo
        if(target.x<=this.currentObst.getBounds().centerX){
          //Caso alvo esteja a esquerda de obstaculo
          angleAssist += 0.5;
        }else{
          //Caso alvo esteja a direita de obstaculo
          angleAssist -= 0.5;
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

  //Metodo para repor posicao do inimigo
  resetPosition(){
    this.body.position = new Phaser.Math.Vector2(this.xInicial,this.yInicial)
  }

  //Metodo para criar uma armadilha
  setTrap(){
    this.hasTrap = true;
    this.trapSet = false;
    const trapX = Phaser.Math.Between(100,1170);
    const trapY = Phaser.Math.Between(100,620);
    this.trap = this.scene.add.sprite(trapX,trapY,"trap-marker");
    this.scene.add.existing(this.trap);
    this.scene.physics.add.existing(this.trap);
    this.trap.body.immovable=true;
    this.scene.physics.add.collider(this.obst, this.trap, function(r,s){
      s.x = Phaser.Math.Between(100,1170)
      s.y = Phaser.Math.Between(100,620)
    });  
    this.trap.anims.play('trapStart',true);
  }

  //Metodo para quando a armadilha fica armada e pronta para ser destruida
  armedTrap(){
    this.trapSet = true;
    this.trap.anims.play('trapSet');
    this.scene.physics.add.overlap(this.player, this.trap, function(r,s){
      r.scene.enemy.setAttack = true;
    });  
  }

  //Metodo para criar o ataque
  createAttack(){
    this.setAttack = false;
    this.attack = this.scene.add.sprite(this.trap.x,this.trap.y,"attack");
    this.scene.add.existing(this.attack);
    this.scene.physics.add.existing(this.attack);
    this.attack.body.immovable=true;
    this.trap.anims.play('trapGone');
    this.attack.anims.play('attack',true);
    this.spring.play();
    this.scene.physics.add.overlap(this.player, this.attack, function(r,s){
      r.loseLife();
      r.scene.enemy.resetTraps();
    });  
  }

  //Metodo para reiniciar todas as variaveis para o ataque
  resetTraps(){
    this.hasTrap = false;
    this.trapSet = false;
    this.setAttack = false;
    this.trapTimer = 500;
    this.trapSetTimer = 300;
    this.attackTimer = 150;
    this.attackLifespan = 100;
    this.trap.destroy();
    this.attack.destroy();
  }
}