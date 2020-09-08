console.log('[Ala01] Punk Bird');

const globais = {};
let telaAtiva = {};
let frames = 0;
let recorde = 0;

const som_HIT = new Audio();
som_HIT.src =  './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites/spritesPunk.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  frameAtual: 0,
  movimentos: [
    {spriteX: 390, spriteY: 0,},
    {spriteX: 390, spriteY: 209,},
    {spriteX: 390, spriteY: 417,}
  ],
  cores: [
    '#70c5ce','#d13715','#04031b'
  ],
  atualizaFrameAtual(){
    const passou7800Frames = frames % 100 === 0 && planoDeFundo.frameAtual > planoDeFundo.movimentos.length;
    if(passou7800Frames){
      planoDeFundo.frameAtual = planoDeFundo.frameAtual + 1
    }
  },
  desenha() {
    contexto.fillStyle = planoDeFundo.cores[planoDeFundo.frameAtual];
    contexto.fillRect(0,0, canvas.width, canvas.height)
    const {spriteX, spriteY} = planoDeFundo.movimentos[planoDeFundo.frameAtual];
    contexto.drawImage(
      sprites,
      spriteX, spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
    contexto.drawImage(
      sprites,
      spriteX, spriteY,
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
    largura: 38,
    altura: 33,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    pulo: 4.6,
    movimentos: [
      {spriteX: 0, spriteY: 0,},
      {spriteX: 40, spriteY: 0,},
      {spriteX: 80, spriteY: 0,}
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
      //Colisao
      if(fazColisao(flappyBird, globais.chao)){
        globais.placar.pontoMaximo();
        som_HIT.play();
        console.log('Você perdeu!')
        console.log('Ponto: '+globais.placar.ponto)
        setTimeout(() => {
          mudaParaTela(Telas.FIM);
        },150);
        return;
      }
      //Fim Colisao
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },  
    pula(){
      flappyBird.velocidade = - flappyBird.pulo;
    }
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
    pares: [],
    tamanhoEspaco: 6,
    espaco: globais.flappyBird.altura,
    atualizaTamanhoEspaco(){
      const passou7800Frames = frames % 100 === 0 && canos.tamanhoEspaco > 3;
      if(passou7800Frames){
        tamanhoEspaco = tamanhoEspaco - 1 
      }
    },
    desenha() {
      canos.pares.forEach(function(par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = canos.espaco * canos.tamanhoEspaco;
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
    //Colisao
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
    //Fim Colisao
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if(passou100Frames) {
        canos.pares.push({
          x: canvas.width,
          y: -200 * (Math.random() + 1),
        });
      }
      //Colisao +-
      canos.pares.forEach(function(par) {
        par.x = par.x - 2;
        globais.placar.pontoMaximo();
        if(canos.temColisaoComOFlappyBird(par)) {
          console.log('Você perdeu!')
          mudaParaTela(Telas.FIM);
        }
        if(par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });
      //Fim Colisao +-
    }
  }
  return canos;
}

//[Placar]
function criaPlacar(){
  const placar = {
    w: 0,
    h: 0,
    x: canvas.width / 2,
    y: 20,
    ponto: 0,
    desenha(){
      contexto.font = "bold 18px serif";
      contexto.fillStyle = "#FFF";
      contexto.fillText(placar.ponto, placar.x, placar.y);
    },
    atualiza(){
      const passou100Frames = frames % 100 === 0;
      if(passou100Frames) {
        placar.ponto = placar.ponto + 1;
      }
    },
    pontoMaximo(){
      if(recorde < placar.ponto){
        recorde = placar.ponto;
      }
    }
  };
  return placar;
}

//[Colisao]
function criaColisao(){
  const colisao = {
    atualiza(){
    },
    fazColisao(flappyBird, chao){
      const flappyBirdY = flappyBird.y +flappyBird.altura;
      const chaoY = chao.y;
      if(flappyBirdY >= chaoY){
        return true;
      }
      return false;
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
    }

  }
  return colisao;
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

// [mensagerGameOver]
const mensagerGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,
  desenha(){
    contexto.drawImage(
      sprites,
      mensagerGameOver.sX, mensagerGameOver.sY,
      mensagerGameOver.w, mensagerGameOver.h,
      mensagerGameOver.x, mensagerGameOver.y,
      mensagerGameOver.w, mensagerGameOver.h
    );
    contexto.font = "bold 18px serif";
    contexto.fillStyle = "#d7a84c";
    contexto.fillText(
      globais.placar.ponto,
      mensagerGameOver.x + mensagerGameOver.w - 19 - (10 * globais.placar.ponto.toString().length), 
      mensagerGameOver.y + mensagerGetReady.h - 63
    );
    contexto.fillText(
      recorde,
      mensagerGameOver.x + mensagerGameOver.w - 19 - (10 * recorde.toString().length),
      mensagerGameOver.y + mensagerGetReady.h - 22
    );
  }
}

// [Telas]
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
      globais.placar = criaPlacar();
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
      globais.placar.desenha();
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
      globais.placar.atualiza();
    }
  },
  FIM: {
    desenha(){
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      mensagerGameOver.desenha();
    },
    click(){
      mudaParaTela(Telas.INICIO)
    },
    atualiza(){
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

// Roda
mudaParaTela(Telas.INICIO);
loop();
