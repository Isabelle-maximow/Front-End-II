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



// configuração incial:
function setup() {
    canvasE1.widht = field.w;
    canvasE1.height = field.h;

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
    },

 draw: function() {
        canvasCtx.fillStyle = "#fff"; // cor da linha
        // centralizar a linha horizontalmemte:
        canvasCtx,fillRect(this.x, this.y, this.w, this.h);
        this._move();
    },

};



function draw() {
    field.draw();
    line.draw()
    leftPaddle.draw()
}

setup()
draw()

// captura movimento do mouse:
camvasE1.addEventListener("mousemove", function(e){
    mouse.x = e.pageX;
    mouse.y = e.pageY;
});