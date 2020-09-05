console.log('[Ala01] Flappy Bird');

let frames = 0;
const som_HIT = new Audio();
som_HIT.src =  './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites/sprites.png';

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
function criaChao(){
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
    atualiza(){
      const movimentoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoChao;
      chao.x = movimentacao % repeteEm;
    }
  };
  return chao;
}

// [criaFlappyBird]
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
    movimentos: [
      {spriteX: 0, spriteY: 0,},
      {spriteX: 0, spriteY: 26,},
      {spriteX: 0, spriteY: 52,}
    ],
    frameAtual: 0,
    atualizaFrameAtual(){
      const interveloDeFrames = 10;
      const passouIntervalo = frames % interveloDeFrames === 0;
      if(passouIntervalo){
        const baseI = 1;
        const i = baseI + flappyBird.frameAtual;
        const totalMovimentos = flappyBird.movimentos.length;
        flappyBird.frameAtual = i % totalMovimentos;
      }
    },
    desenha(){
      flappyBird.atualizaFrameAtual();
      const {spriteX, spriteY} = flappyBird.movimentos[flappyBird.frameAtual];
      contexto.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    },
  
    atualiza(){
      if(fazColisao(flappyBird, globais.chao)){
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
    atualizaFrameAtual(){
      const tempo = 1;
      const frameMax = 3;
      const frame = flappyBird.frameAtual + tempo;
      flappyBird.frameAtual = frame % frameMax;
      console.log(flappyBird.frameAtual)
    },

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

// [Canos]
function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    desenha() {
      canos.pares.forEach(function(par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;
        const canoCeuX = par.x;
        const canoCeuY = yRandom; 
        // [Cano do Céu]
        contexto.drawImage(
          sprites, 
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )
        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom; 
        contexto.drawImage(
          sprites, 
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )
        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },
    temColisaoComOFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
      if(globais.flappyBird.x >= par.x) {
        if(cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }
        if(peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }
      return false;
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if(passou100Frames) {
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }
      canos.pares.forEach(function(par) {
        par.x = par.x - 2;
        if(canos.temColisaoComOFlappyBird(par)) {
          console.log('Você perdeu!')
          mudaParaTela(Telas.INICIO);
        }
        if(par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });
    }
  }
  return canos;
}

//Colisão FlappyBird Chão
function fazColisao(flappyBird, chao){
  const flappyBirdY = flappyBird.y +flappyBird.altura;
  const chaoY = chao.y;

  if(flappyBirdY >= chaoY){
    return true;
  }
  return false;
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
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha(){
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      mensagerGetReady.desenha();
    },
    click(){
      mudaParaTela(Telas.JOGO)
    },
    atualiza(){
      globais.chao.atualiza();
    }
  },
  JOGO: {
    desenha(){
      planoDeFundo.desenha();
      globais.canos.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
    },
    click(){
      globais.flappyBird.pula();
    },
    atualiza(){
      globais.canos.atualiza();
      globais.chao.atualiza();
      globais.flappyBird.atualiza();
    }
  }
};

//[Loop]
function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();
  frames = frames + 1;
  requestAnimationFrame(loop);
}

//[Lister]
window.addEventListener('click', function(){
  if(telaAtiva.click){
    telaAtiva.click();
  }
});

//Roda
mudaParaTela(Telas.INICIO);
loop();
