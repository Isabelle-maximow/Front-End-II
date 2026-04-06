const canvasEl = document.querySelector("canvas");
const canvasCtx = canvasEl.getContext("2d");

// configurações do jogo:
const tamBloco = 30; // cada quadrado tem 30 pixels 
const cols = 10; // quantidade de colunas do tetris: padrão 10
const rows = 20; // quantidade de linhas do tetris: padrão 20

// area lateral (mostra pontuação aprox.):
canvasEl.width = cols * tamBloco + 140; // 140 é o painel lateral
canvasEl.height = rows * tamBloco; 


// peças tetris:
// cada peça é representada por uma matriz
// -> o valor 1 significa que existe bloco naquela posição
// -> o valor 0 significa que é um espoço vazio (sem bloco) 
const pecas = [
    // peça "I":
    [[1, 1, 1, 1]],
    // peça "J":
    [
        [1, 0, 0],
        [1, 1, 1]
    ],
    // peça "L":
    [
        [0, 0, 1],
        [1, 1, 1]
    ],
    // peça "O":
    [
        [1, 1],
        [1, 1]
    ],
    // peça "S":
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    // peça "T":
    [
        [1, 1, 1],
        [0, 1, 0]
    ],
    // peça "Z":
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
];

// cada peça recebe uma cor:
const cores = ["cyan", "blue", "orange", "yellow", "green", "purple", "red"]


// funçoes auxiliares:
// hera um numero aleatorio entre 0 e n-1
const rand = (n) => Math.floor(Math.random() * n);
// grid é uma matriz de 20x10 preenchida com -1
// -1 significa q a celula esta vazia 
const criarGrid = () =>
    Array.from({length: rows}, () => Array(cols).fill(-1));


// objeto principal do jogo:
const jogo = {
    gameOver: false, // indica se o jogo acabou
    // matrix principal do jogo, onde as peças fixadas ficam guardadas
    grid: criarGrid(),
    // peca = peças caindo no momento 
    peca: null,
    // proxima = indica da proxima peça que sera criada 
    proxima: rand(pecas.length),
    // pontos = pontuação acumulada do jogador
    pontos: 0,


    // inicialização do jogo:
    iniciar () {
        this.gameOver = false;
        // limpa o grid p começar do zero
        this.grid = criarGrid();
        // zera a pontuação
        this.pontos = 0;
        // cria a primeira peça 
        this.novaPeca();
    },


    // criação da nova peça:
    novaPeca() {
        const id = this.proxima
        this.peca = {
            id, 
            forma: pecas[id],
            x: rand(cols - pecas[id][0].length + 1),
            y: 0,
        };
        this.proxima = rand(pecas.length);

        // verifica o gameover
        // se a peça ja nasce colidindo com algo, acabou o jogo
        if (!this.pode(0,0)) {
            this.gameOver = true;
        }
    },


    // verificação do movimento :
    // essa função testa se a peça pode se mover para a posição desejada
    // dx: deslocamento horizontal
    // dy: deslocamento vertical
    // forma? matriz da peça
    pode (dx, dy, forma = this.peca.forma){
        // every() percorre tds os elemntos e retorna true apemas c tds forem verdadeiros
        return forma.every((linha, i) =>
            linha.every((v, j) => {
                // se o valor n existe é 0, n existe bloco naquela posição 
                if (!v) return true;

                // calcula a posição real do grid
                // this.peca.x + j = posição horizontal da celula 
                // this.peca.y + i = posição vertical da celula
                // dx/dy = deslocamneto q estamos testante
                const x = this.peca.x + j + dx; 
                const y = this.peca.y + i + dy;
                
                // limite das pardes e chao 
                if (x < 0 || x >= cols || y >= rows) return false;
                // se a celula do grid estiver preemchida t,b limita
                return y < 0 || this.grid[y][x] === -1;
            })
        );
    },


    mover(dx, dy) {
        // se o jogo acabar, não movimenta mais
        if(this.gameOver) return;
        // se a posição for valida, ent mova a peça
        if (this.pode(dx, dy)) {
            this.peca.x += dx;
            this.peca.y += dy;
        } else if (dy === 1) {
            this.fixar();
        }
    },


    // rotação da peça:
    girar() {
        const f = this.peca.forma;
        // a rotação é feita convertendo linhas em colunas 
        // precisamos girar a peça em 90° no sentido horario
        const nova = f[0].map((_, i) => f.map(row => row[i]).reverse());

        // so aplica a rotação se a nova forma couber 
        if (this.pode(0, 0, nova)) {
            this.peca.forma = nova;
        }
    },


    // fixar peça no grid:
    fixar() {
        const{forma, x, y, id} = this.peca
        //percorre a peca atual
        // cada celula com valor 1 sera copiada para o grid
        forma.forEach((linha, i) => {
            linha.forEach((v, j) => {
                if (v) {
                    // a posição final é a posição da peça + posição inytena da matriz
                    this.grid[y + i][x + j] = id;
                }
            });
        });
        // limpa linhas completas e recebe quantas linhas forem removidas
        const linhas = this.limpar()
        // pontuação:
        // cada linha removida vale 100 pontos
        this.pontos+= linhas * 100;
        
        // cria a prox. peça
        this.novaPeca();
    },
    limpar() {
        let removidas = 0;
        this.grid = this.grid.filter((linha) => {
            if (linha.every((c) => c !== -1)) {
                removidas++;
                return false;
            }
            return true;
        } );
        while (this.grid.length < rows) {
            this.grid.unshift(Array(cols).fill(-1));
        }
        return removidas
    },
};

// desenho na tela
function bloco (x, y, cor) {
    canvasCtx.fillStyle = cor;

    canvasCtx.fillRect(x + 1, y + 1, tamBloco - 2, tamBloco - 2);
}

function desenhar () {
    canvasCtx.fillStyle = "#222";
    canvasCtx.fillRect(0, 0, canvasEl.width, canvasEl.height)

    jogo.grid.forEach((linha, i) => {
        linha.forEach((v, j) => {
            bloco(j * tamBloco, i * tamBloco, v === -1 ? "#333" : cores[v]);
        });
    });

    if (jogo.peca) {
        jogo.peca.forma.forEach((linha, i) => {
            linha.forEach((v, j) => {
                if (v) {
                    bloco (
                        (jogo.peca.x + j) * tamBloco,
                        (jogo.peca.y + i) * tamBloco,
                        cores [jogo.peca.id],
                    );
                }
            });
        });
    }

    // desenha a próxima peça
    const p = pecas[jogo.proxima];
    p.forEach((linha, i) => {
        linha.forEach((v, j) => {
            if (v) {
                bloco (
                    cols * tamBloco + 20 + j * tamBloco,
                    60 + i * tamBloco,
                    cores [jogo.proxima],

                );
            }
        });
    });

    // texto da interface
    canvasCtx.fillStyle = "#fff";
    canvasCtx.font = "16px Arial";
    canvasCtx.textAlign = "left";
    canvasCtx.fillText("Pontos: " + jogo.pontos, cols * tamBloco + 10, 30);
    canvasCtx.fillText("Próxima peça:", cols * tamBloco + 10, 50);

    // tela gameover
    if (jogo.gameOver) {
        canvasCtx.fillStyle = "rgba(0,0,0,0.7)";
        canvasCtx.fillRect(0, 0, canvasEl.width, canvasEl.height);

        canvasCtx.fillStyle = "red";
        canvasCtx.textAlign = "center";
        canvasCtx.font = "30px Arial";
        canvasCtx.fillText("GAME OVER", canvasEl.width / 2, canvasEl.height / 2);

        canvasCtx.font = "16px Arial";
    }
}

// CONTROLES DO JOGO
document.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") {
        jogo.iniciar();
        return;
    }
    if (e.key === "ArrowLeft") jogo.mover(-1, 0);
    if (e.key === "ArrowRight") jogo.mover(1, 0);
    if (e.key === "ArrowDown") jogo.mover(0, 1);
    if (e.key === "ArrowUp") jogo.girar();
});

let tempo = 0;
function loop () {
    tempo++;
    if (!jogo.gameOver && tempo % 30 === 0) {
        jogo.mover(0, 1);
    }
    desenhar();
    requestAnimationFrame(loop);
}

jogo.iniciar();
loop();
