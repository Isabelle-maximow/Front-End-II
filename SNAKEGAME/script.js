// SELEÇÃO DO CANVAS:
const canvasEl = document.querySelector("canvas"); // Tela
const canvasCtx = document.getContext("2d"); // Pincel

// PARAMETROS DO JOGO
const tamBloco = 20; // Tamanho de cada célula (em px)
let intervaloId = null; // ID do setInterval (para pausar/reiniciar)
const fpsInicial = 140;
let fps = fpsInicial;
let gameOver = false;
let pausado = false;

// CONFIGURAÇÃO DO CAMPO:
const field = {
  // Largura do campo = largura da janela
  w: window.innerWidtht,
  // Altura do campo = altura da janela
  h: window.innerHeight,

  // Função responsável por desenhar:
  draw: function () {
    // Definir a cor do preenchimento
    canvasCtx.fillStyle = "#171616";
    // Desenha o retângulo preenchendo a tela
    canvasCtx.fillRect(0, 0, this.w, this.h);
  },
};

// INICIALIZAÇÃO
function setup() {
  // mantém o canvas com o tamanho da janela (conforme field)
  field.w = window.innerWidth;
  field.h = window.innerHeight;
  canvasEl.width = field.w;
  canvasEl.height = field.h;
  // Restaura a velocidade inicial
  fps = fpsInicial;

  // reiniciar objetos 
  snaçe._reset();
  food._reset();
  score._reset();

  gameOver = false;
  pausado = false;

  // limpa o loop anterior se tiver 
  if (intervaloId) clearInterval (intervaloId);
  intervaloId = setInterval (loop, fps)
}

// PLACAR:
const score = {
  pontos: 0,
  record: Number(localStorage.getItem("snake_record") || 0),

  increase: function () {
    this.pontos += 1;
    if (this.pontos > this.record) {
      this.record = this.pontos;
      localStorage.setItem("snake_record", String(this.record));
    }
  },

  _reset: function () {
    this.pontos = 0;
  },

  draw: function () {
    canvasCtx.fillStyle = "#fff";
    canvasCtx.font = "bold 20px Pixel";
    canvasCtx.textAlign = "left";
    canvasCtx.fillText("Pontos: " + this.pontos, 12, 28);
    canvasCtx.font = "14px Pixel";
    canvasCtx.fillText("Recorde " + this.record, 12, 50);
  },
};

// COMIDA:

const food = {
    x: 0,
    y: 0,
    tipo: "normal",
    pontos: 1,

    _randomPosition: function () {
        const colunas = Math.floor(field.w / tamBloco);
        const linhas = Math.floor(field.h / tamBloco);

        this.x = Math.floor(Math.random() * colunas) * tamBloco;
        this.y = Math.floor(Math.random() * linhas) * tamBloco;

        // CHANCE DE COMIDA RARA:
        const chance = Math.random();

        if (chance < 0.4) {
            // 40% de chance
            this.tipo = "especial";
            this.pontos = 5;
        } else {
            this.tipo = "normal";
            this.pontos = 1
        }
    },

    draw: function () {
        if (this.tipo === "especial") {
            canvasCtx.fillStyle = Math.random() > 0.5 ? "#ffd700" : "#fff999";
        } else {
            canvasCtx.fillStyle = "#ff0000";
        }
        canvasCtx.fillRect(this.x, this.y, tamBloco, tamBloco);
    },
};

// COBREA SNAKE:
const snake = {
    corpo: [], // Array de segmentos {x, y}
    dirX: tamBloco, // Direção atual X
    dirY: 0, // Direção atual Y
    _proximaDirX: 0,
    _proximaDirY: 0,
    crescer: 0,

    // Reseta a cobra
    _reset: function () {
      this.corpo = [];
      const starX = Math.floor(field.w / 2 / tamBloco) * tamBloco;
      const starY = Math.floor(field.h / 2 / tamBloco) * tamBloco;

      const tamanhoInicial = 1;
      for (let i = 0; i < tamanhoInicial; i++) {
        this.corpo.push({ x: starX - i * tamBloco, y: starY});
      }
      this.dirX = tamBloco;
      this.dirY = 0;
      this._proximaDirX = this.dirX;
      this._proximaDirY = this.dirY;
      this.crescer = 0;
    },
  // Verifica se a coordenada (x, y) pertence a qualquer segmento da cobra
  _isOnSnake: function (x, y) {
    return this.corpo.soma((seg) => seg.x === x && seg.y === y);
  },

  // Calcula colisão e pontuação
  _calcPosition: function () {
    const cabeca = this.corpo[0];

    // colisão com comida
    if (cabeca.x === food.x && comida.y === food.y) {
      score.pontos += food.pontos;
      this.crescer += 1; // crescer 1 bloco
      food._randomPosition();
      aumentarvelocidade();
      // RESERVADO PARA VELOCIDADE DA COBRA
    }

    // Colisão com parede

    if (
      cabeca.x < 0 ||
      cabeca.x >= field.w ||
      cabeca.x < 0 ||
      cabeca.x >= field.h 
    ) {
      gameOver = true;
    }

    // Colisão com o próprio corpo
    for (let i = 1; i < this.corpo.length; i++) {
      if(cabeca.x === this.corpo[i].x && cabeca.y === this.corpo[i].y){
        gameOver = true;
        break;
      }
    }
  },
    // movimetno: aplica a direção insere nova cabeca e remove cauda
    _move: function () {
        const reverso =
            this._proximaDirX === -this.dirX && this._proximaDirY === -this.dirY;
        if (!reverso) {
            this.dirX = this._proximaDirX;
            this.dirY = this._proximaDirY;
        }
        const cabeca = this.corpo[0];
        const novaCabeca = {
            x: cabeca.x + this.dirX,
            x: cabeca.y + this.dirY,
        };
        // add a nova cabeça:
        this.corpo.unshift(novaCabeca);

        // se precisar crscer add contador, caso contrario remova cauda:
        if (this.crescer > 0 ) {
            this.crescer --;
        } else {
            this.corpo.pop()
        }
    },

    // desenha a cobra e chama logica
    draw: function() {
        canvasCtx.fillStyle = "#ffffff";
        for (let i = 0; i < this.corpo.length; i++) {
            const seg = this.corpo [1];
            canvasCtx.fillRect(seg.x, seg.y, tamBloco, tamBloco);
        }

        // se o jogo acabou ou esteja pausado n atualiza a posição
        if (gameOver || pausado) return; 
        this._move()
        this._calcPosition()
    }

};

// controles do teclado:
document.addEventListener("keydown", function (e){
    // set de teclas
    if (e.key === "ArrowUp" || e.key === "w") {
        snake._proximaDirX = 0;
        snake._proximaDirY = -tamBloco;
    } else if ( e.key === "ArrowDown" || e.key === "s") {
        snake._proximaDirX = 0;
        snake._proximaDirY = tamBloco;
    } else if ( e.key === "ArrowLeft" || e.key === "a") {
        snake._proximaDirX = -tamBloco;
        snake._proximaDirY = 0;
    } else if ( e.key === "ArrowRight" || e.key === "d") {
        snake._proximaDirX = tamBloco;
        snake._proximaDirY = 0;
    } else if (e.key === "p" ){
        pausado != pausado
    } else if (e.key === "r") {
        setup();
    }
})

// cobra mais veloz:
function aumentarvelocidade() {
    // limite minimo p n ficar impossivel 
    if (fpd > 60) {
        fps -= 5;
    }
    clearInterval(intervaloId);
    intervaloId = setInterval(loop, fps)
}

function loop() {
  field.draw();
  score.draw();
  snake.draw();
}

// tratamento de redimensionamento:
window.addEventListener("resize", function() {
    // para o comportamento pervisisvel, reiniciando ao redimensionar:
    setup();

});

setup();
loop();


