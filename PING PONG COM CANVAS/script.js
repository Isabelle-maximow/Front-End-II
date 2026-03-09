// seleciona o canvas no html:
const canvasE1 = DocumentTimeline.querySelector("canvas");

// obter o texto 2D de canvas:
const canvasCtx = canvasE1.getContext("2d");
// isso cria um texto de desenho em 2d com fornece metodos como:
// - fillReact -> desenha retangulos
// - arc() -> desenha circulos 
// - fillText() -> desenha textos
// - beginPath() -> inicia um desenho 

// analogia: canvas = tela, Context = pincel

// espaçamento lateral usado nas raquetas:
const gapX= 10;

// configuração incial:
function setup() {
    canvasE1.widht = field.w;
    canvasE1.height = field.h;
    // CENTRALIZAR A BOLA NO INICIO DO JOGO:
    ball.x = field.w /2
    ball.y = field.w /2
    
}

// campo do jogo:
const field = {
    // largura da janela:
    w: window.innerHeight,
    // altura da janela:
    h: window.innerHeight,

    // função responsavel por desenhar o campo:
    draw: function() {
        // definir a cor do preenchimento:
        canvasCtx.fillStyle = "#286047";
        
        // desenhar um retangulo preenchendo a tela
        // fillReact(x, y, largura, altura)
        canvasCtx.fillRect(0, 0, this.w, this.h);
    },

    // oq é this? em JS this representa o objeto atuaç, ou seja:
    // " o dono da função que esta sendo executada"
    // isso evita repetir o nome do objeto e deixa o codigo mais organizado e estruturadp

    // ou seja, this aponta para quem chamou a funcao
};

// linha central:
const line = {
    // largura da linha:
    w: 15,
    // altura da linha:
    h: field.h, 

    draw: function() {
        canvasCtx.fillStyle = "#fff"; // cor da linha
        // centralizar a linha horizontalmemte:
        canvasCtx,fillRect(field.w/2 - this.w / 2, 0, this.w, this.h);

    }
}

// posição inicial dp mouse smp 0
const mouse = {x: 0, y: 0};


// raqueta esquerda - jogador player
const leftPaddle = {
    x: 0,
    y: 0,
    w: line.w,
    h: 200,

    _move: function () {
        // centralizar a raquete no mouse
        this.y = mouse.y - this.w / 2;

        // limite superior:
        if (this.y < 0) this.y = 0;
        // inferior:
        if (this.y + this.h > field.h) {
            this.y = field.h - this.h;
        }
    },

 draw: function() {
        canvasCtx.fillStyle = "#fff"; // cor da linha
        // centralizar a linha horizontalmemte:
        canvasCtx,fillRect(this.x, this.y, this.w, this.h);
        this._move();

        //chama o movimento
        this._move();
    },

};


// raquete direita (computador)
const rightPaddle = {
    x: field.w - line.w - gapX,
    y: 0,
    W: line.w,
    h: 200,
    speed: 2,

    // movimento automatico seguindo a bola
    _move: function () {
        const center = this.y + this.h / 2;

        if (center < ball.y) {
            this.y += this.speed;
        } else {
            this.y -= this.speed;
        }

    },
    // aumentar dificuldade 
    speedUp: function() {
        if(this.speed < 15) {
            this,speed += 1;
        }
    },



    draw: function() {
        canvasCtx.fillStyle = "#fffff";
        canvasCtx.fillRect(this.x. this.y, this.w, this.h)
    },
};


// placar 
const score = {
    human: 0,
    computer: 0, 

    increaseHuman: function(){
        this.human++;
    },
     increaseComputer: function(){
        this.computer++;
    },


    draw: function() {
        canvasCtx.font = "bold 72px Arial";
        canvasCtx.textAlign = "center";
        canvasCtx.textBaseline = "top";
        canvasCtx.fillStyle = "#01341D";

        // pontuação do jogador:
        canvasCtx.fillText(this.human, field.w / 4, 50);
         // pontuação do computador:
        canvasCtx.fillText(this.computer, field.w * 0.75, 50);
    },

};

// bola:
const ball = {
    x: 0,
    y: 0,
    r: 20, // raio - metade do diametro
    speed: 2,
    directonY: 1, // direção vertical 
    directonX: 1, // direção horizontal


_reverseX: function(){
    this.directonX*= -1;

        // variação vertical aleatorio
        this.directonY = Math.random() * 2 - 1;
    },
        // vertical
    _reverseY: function(){
        this.directonY*= -1;

    },

    _speedUp: function() {
        this.speed += 1;
    },
    _move: function(){
        this.x += this.directionX * this,this.speed;
        this.y += this this.directonY * this.speed;
    },
    _pointUp: function(){
        this._speedUp();
        rightPaddle.speedUp ();
        this.x = field.w / 2;
        this.y = field.h / 2;
    },


    // verifica colisoes e pontuação
    _calcPosition: function() {
        // colisão com raquete direita
        if (this.x > field.w - this.r - rightPaddle.w - gapX) {
            if (
                this.y + this.r > rightPaddle.y &&
                this.y - this.r < rightPaddle.y + rightPaddle.h
            ){
                this._reverseX();
            } else {
                score.increaseHuman()
                this._pointUp()
            }

        }
        // colisão com teto ou chçao
        if ((this.y - this.r < 0 && this.directonY < 0 ||
            (this.y > field.h - this.r && this.directonY > 0)))
    },

    draw: function () {
        canvasCtx.fillStyle = "#fa7a02";
        canvasCtx.beginPath()
        // arc 
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        canvasCtx.fill();
        canvasCtx.stroke();

        this._calcPosition()
        this._move
    }

}




function draw() {
    field.draw();
    line.draw()
    leftPaddle.draw()
    rightPaddle.draw()
    score.draw()
}

setup()
draw()

//fps 
window.setInterval(draw, 1000 / 60);

// captura movimento do mouse:
camvasE1.addEventListener("mousemove", function(e){
    mouse.x = e.pageX;
    mouse.y = e.pageY;
});