console.log('[Ala01] Flappy Bird');

const som_HIT = new Audio();
som_HIT.src =  './efeitos/hit.wav'

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');
var escolha = 0;



// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,

  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

// [Chao]
const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
  desenha() {
    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.largura, chao.altura,
    );

    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y,
      chao.largura, chao.altura,
    );
  },
};

function fazColisao(flappyBird, chao){
  const flappyBirdY = flappyBird.y +flappyBird.altura;
  const chaoY = chao.y;

  if(flappyBirdY >= chaoY){
    return true;
  }
  return false;
}

function criaFlappyBird(){
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    pulo: 4.6,
  
    desenha(){
      contexto.drawImage(
        sprites,
        flappyBird.spriteX, flappyBird.spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    },
  
    atualiza(){
      if(fazColisao(flappyBird, chao)){
        som_HIT.play();
        setTimeout(() => {
        mudaParaTela(Telas.INICIO);
      },150);
        return;
      }
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
  
    pula(){
      flappyBird.velocidade = -flappyBird.pulo;
    }
  
    //Testes
    /*,
    atualiza(){
      console.log(flappyBird.y)
      if(flappyBird.y <= 0 || flappyBird.y >= canvas.height - 112){
        mudaParaTela(Telas.INICIO);
        flappyBird.reseta()
      }else{
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        flappyBird.y = flappyBird.y + flappyBird.velocidade;
      }
    },
  
    reseta(){
      flappyBird.x = 10;
      flappyBird.y = 50;
      flappyBird.gravidade = 0.25,
      flappyBird.velocidade = 0
    },
  
    voa(){
      flappyBird.y = flappyBird.y - 30;
    },
  
    quica(){
      if(escolha === 0){
        flappyBird.y = flappyBird.y - 5;
        if(flappyBird.y < 1){
          escolha = 1;
        }
      }else{
        flappyBird.y = flappyBird.y + 5;
        if(flappyBird.y > 430){
          escolha = 0;
        }
      }
    }
    */
  }
  return flappyBird;
}


// [mensagerGetReady]
const mensagerGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,

  desenha(){
    contexto.drawImage(
      sprites,
      mensagerGetReady.sX, mensagerGetReady.sY,
      mensagerGetReady.w, mensagerGetReady.h,
      mensagerGetReady.x, mensagerGetReady.y,
      mensagerGetReady.w, mensagerGetReady.h
    );
  }
}

// [Telas]
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela){
  telaAtiva = novaTela;
  if(telaAtiva.inicializa){
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa(){
      globais.flappyBird = criaFlappyBird();
    },
    desenha(){
      planoDeFundo.desenha();
      chao.desenha();
      globais.flappyBird.desenha();
      mensagerGetReady.desenha();
    },
    click(){
      mudaParaTela(Telas.JOGO)
    },
    atualiza(){

    }
  },
  JOGO: {
    desenha(){
      planoDeFundo.desenha();
      chao.desenha();
      globais.flappyBird.desenha();
    },
    click(){
      globais.flappyBird.pula();
    },
    atualiza(){
      globais.flappyBird.atualiza();
    }
  }
};

function loop() {

  telaAtiva.desenha();
  telaAtiva.atualiza();

  requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
  if(telaAtiva.click){
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();
