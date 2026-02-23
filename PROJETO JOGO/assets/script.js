// variaveis globais

// capturar nome do jogador
var jogadorNome;

// pontuação ( inicia em 0)
var jogadorPontos = 0;

// 0 = nenhuma escolha, 1 - pedra, 2 = papel, 3 = tesoura
var jogadorEscolha = 0

// pontuação (inicia em 0)
var computadorPontos = 0;

//0 = nenhuma escolha, 1 - pedra, 2 = papel, 3 = tesoura
var computadorEscolha = 0;

// funcoes da interface:
// exibe mensagem na tela
function mensagem(texto) {
    document.getElementById("mensagem").innerHTML = texto;
}

// definir nome do jogador 
function definirNomeJogador(nome) {
    document.getElementById("jogadorNome").innerHTML = nome;
}

// funçoes auc=xiliares:
// sortear um número entre min e max
function sortear(min, max) {
    return Math.floor(Math.random() * (max - min + 1 )) + min;
}

// calcular quem ganhou a rodada:
// 0 = empate, 1 = jogador, 3 = computado r
function calcularEscolha(jogador, computador) {
    //empates:
    if (jogador == 1 && computador == 1) {
        return 0;
    } else if (jogador == 2 && computador == 2) {
        return 0;
    } else if (jogador == 3 && computador == 3) {
        return 0;
    }

    // jogador ganha:
    else if (jogador == 1 && computador == 3) {
        return 1;
    } else if (jogador == 2 && computador == 1) {
        return 1;
    } else if (jogador == 3 && computador == 2) {
        return 1;
    }

    // computador ganha:
     else if (jogador == 1 && computador == 2) {
        return 2;
    } else if (jogador == 2 && computador == 3) {
        return 2;
    } else if (jogador == 3 && computador == 1) {
        return 2;
    }

}

// soma jogador
function somaPontoJogador() {
    jogadorPontos++
    document.getElementById("jogadorPontos").innerHTML = jogadorPontos;}

// soma computador
function somaPontoComputador() {
    jogadorPontos++
    document.getElementById("computadorPontos").innerHTML = computadorPontos;}


// add a classe "selecionado" ao elemento clicado
function selecionar (tipo, escolha) {
    document.getElementById(tipo + "Escolha" + escolha).classList.add("selecionado");
}

function deselecionar (tipo, escolha) {
    document.getElementById(tipo + "Escolha" + escolha).classList.remove("selecionado");
}

// FUNÇÃO PRINCIPAL:
// executada quando o jogador escolher
function jogar(escolha){
    // impede multiplos clicks durante a mesma rodada:
    if (jogadorEscolha !== 0) return;
    // registrar a escolha do jogador:
    jogadorEscolha = escolha

    selecionar("jogador", jogadorEscolha);

    // computador sorteia aleatoriamente de 1 a 3
    computadorEscolha = sortear(1, 3);
    selecionar("computador", computadorEscolha);

    // calcula quem ganhou a rodada
    var ganhador = calcularEscolha(jogadorEscolha, computadorEscolha);

    // tratar o resultado da rodada
    if (ganhador == 0) {
        mensagem("EMPATE")
    }
    else if (ganhador == 1) {
        mensagem("EPONTO PARA JOGADOR" + nome)
        somaPontoJogador()
    }
   
    else if (ganhador == 2) {
        mensagem("PONTO PARA COMPUTADOR")
        somaPontoComputador()
    }

    // reset na rodada:
    setTimeout(function() {
    // remove o destaque:
    deselecionar("jogador", jogadorEscolha);
    deselecionar("computador", computadorEscolha);

    // remove as escolhas 
    jogadorEscolha = 0;
    computadorEscolha = 0;

    mensagem(jogadorNome + " escolha uma opção acima...");
  }, 2000)

}


// eventos de clique:
//pedra
document.getElementById("jogadorEscolha1").onclick = function() {
    jogar(1);
};
//papel
document.getElementById(jogadorEscolha2).onclick = function() {
    jogar(2);
};
//tesoura
document.getElementById(jogadorEscolha3).onclick = function() {
    jogar(3);
};




//inicialização do jogo
// perguntar o nome:
jogadorNome = prompt("qual é seu nome:")
// exibir na tela:
definirNomeJogador(jogadorNome);
// mensagem inicial:
mensagem("bem vindo, " + jogadorNome + "Escolha uma opção acima...")

