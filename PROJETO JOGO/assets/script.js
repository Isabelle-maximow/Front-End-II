// Variaveis Globais:

// Capturar nome jogador
var jogadorNome;

// Pontuação (inicia em 0)
var jogadorPontos = 0;
// 0 = Nenhuma escolha, 1 = Pedra, 2 = Papel, 3 = Tesoura
var jogadorEscolha = 0;

// Pontuação (inicia em 0)
var computadorPontos = 0;
// 0 = Nenhuma escolha, 1 = Pedra, 2 = Papel, 3 = Tesoura
var computadorEscolha = 0;

// funções de interface:
// Exibe mensagem na tela
function mensagem(texto){
    document.getElementById("mensagem").innerHTML = texto;
}

// Definir nome do Jogador
function definirNomeJogador(nome) {
    document.getElementById("jogadorNome").innerHTML = nome;
}

// funções auxiliares:
//sortear um numero entre min e max
function sortear(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// calcular quem ganhou a rodada
// 0 = empate, 1 = jogador, 2 = computador
function calcularEscolha(jogador,computador) {
    //empates:
    if (jogador == 1 && computador == 1) {
        return 0;
    } else if (jogador == 2 && computador == 2) {
        return 0;
    } else if (jogador == 3 && computador == 3) {
        return 0;
    }

    // Jogador ganha:
    else if (jogador == 1 && computador == 3) {
        return 1;
    } else if (jogador == 2 && computador == 1) {
        return 1;
    } else if (jogador == 3 && computador == 2) {
        return 1;
    }

    // Computador ganha:
    else if (jogador == 1 && computador == 2) {
        return 2;
    } else if (jogador == 2 && computador == 3) {
        return 2;
    } else if (jogador == 3 && computador == 1) {
        return 2;
    }
    // 0 = empate, 1 = jogador, 2 = computador
}

// soma 1 ponto ao jogador
function somaPontoJogador() {
    jogadorPontos++;
    document.getElementById("jogadorPontos").innerHTML = jogadorPontos;
}

// soma 1 ponto ao computadolr
function somaPontoComputador() {
    computadorPontos++;
    document.getElementById("computadorPontos").innerHTML = computadorPontos;
}

// Adicionar a classe "selecionado" ao elemento clicado
function selecionar(tipo, escolha) {
  document
    .getElementById(tipo + "Escolha" + escolha)
    .classList.add("selecionado");
}
function desselecionar(tipo, escolha) {
  document
    .getElementById(tipo + "Escolha" + escolha)
    .classList.remove("selecionado");
}

// Função auxiliar para converter número em texto
const escolhaMap = {
  1: "Pedra",
  2: "Papel",
  3: "Tesoura"
};

// Função principal 
// Executada quando o jogador escolher as opções
function jogar(escolha) {

    if (jogadorEscolha !== 0) return;
    //Registrar a escolha do jogador
    jogadorEscolha = escolha
    // Destaca a escolha do jogador
    selecionar("jogador", jogadorEscolha)
    
    // Computador sortea aleatoriamente de 1 a 3 
    computadorEscolha = sortear(1 , 3);
    // Destaca a escolha do jogador
    selecionar("computador", computadorEscolha)

    // Calcula quem ganhou a rodada
    var ganhador = calcularEscolha(jogadorEscolha, computadorEscolha);

    // Trata o resultado da rodada
    if (ganhador == 0) {
      mensagem("EMPATE!");
    } else if (ganhador == 1) {
      mensagem("Ponto para " + jogadorNome);
      somaPontoJogador()
    } else if (ganhador == 2) {
      mensagem("Ponto para o Computador");
      somaPontoComputador()
    }

    // registra no histórico (após atualizar pontuação)
    logRound({
      playerChoice: escolhaMap[jogadorEscolha],
      computerChoice: escolhaMap[computadorEscolha],
      result: ganhador == 0 ? "Empate" : (ganhador == 1 ? "Vitória" : "Derrota"),
      playerScore: jogadorPontos,
      computerScore: computadorPontos
    });

    //reset na jogada
    setTimeout(function(){
        //remove o destaque
        desselecionar("jogador", jogadorEscolha);
        desselecionar("computador", computadorEscolha)
        //remove as escolhas
        jogadorEscolha = 0;
        computadorEscolha = 0;
    }, 2000);
}
//eventos de clique:
document.getElementById("jogadorEscolha1").onclick = function(){
    jogar(1)
}
document.getElementById("jogadorEscolha2").onclick = function(){
    jogar(2)
}
document.getElementById("jogadorEscolha3").onclick = function(){
    jogar(3)
}

//inicialização do jogo
//perguntar nome do jogador
jogadorNome = prompt("Qual é o seu nome?")
definirNomeJogador(jogadorNome)
// mensagem inicial
mensagem("Bem vindo, "+ jogadorNome + ". Escolha uma opção acima...")

let roundCounter = 0;
const historicoBody = document.querySelector('#historico tbody');
const limparBtn = document.getElementById('limparHistorico');

function logRound({ playerChoice, computerChoice, result, playerScore, computerScore }) {
    roundCounter++;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${roundCounter}</td>
        <td>${playerChoice}</td>
        <td>${computerChoice}</td>
        <td>${result}</td>
        <td>${playerScore}</td>
        <td>${computerScore}</td>
    `;
    // marca resultado para CSS
    tr.children[3].setAttribute('data-result', result);
    // adiciona no topo (mais recente primeiro)
    historicoBody.prepend(tr);
    saveHistorico();
}

function saveHistorico() {
    const rows = [...historicoBody.querySelectorAll('tr')].map(tr => ({
        round: tr.children[0].textContent,
        playerChoice: tr.children[1].textContent,
        computerChoice: tr.children[2].textContent,
        result: tr.children[3].textContent,
        playerScore: tr.children[4].textContent,
        computerScore: tr.children[5].textContent
    }));
    localStorage.setItem('historicoJokenpo', JSON.stringify({ roundCounter, rows }));
}

function loadHistorico() {
    const data = JSON.parse(localStorage.getItem('historicoJokenpo') || 'null');
    if (!data) return;
    roundCounter = Number(data.roundCounter) || data.rows.length || 0;
    // os rows estavam salvos do mais recente primeiro; reverte para inserir na ordem desejada
    data.rows.slice().reverse().forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.round}</td>
            <td>${r.playerChoice}</td>
            <td>${r.computerChoice}</td>
            <td>${r.result}</td>
            <td>${r.playerScore}</td>
            <td>${r.computerScore}</td>
        `;
        tr.children[3].setAttribute('data-result', r.result);
        historicoBody.appendChild(tr);
    });
}

limparBtn.addEventListener('click', () => {
    roundCounter = 0;
    historicoBody.innerHTML = '';
    localStorage.removeItem('historicoJokenpo');
});

// carregar ao abrir a página
document.addEventListener('DOMContentLoaded', loadHistorico);