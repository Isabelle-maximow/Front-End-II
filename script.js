//Captura de elementos do DOM

//Campo aonde será gerado a senha
const inputEl = document.querySelector("#password");

//Indicador de segurança da senha
const indicatorBarEl = document.querySelector("#indicatorBar");

//Tamanho da senha (slider)
const passwordLengthEl = document.querySelector("#password-length");

//Checkboxes
const uppercaseCheckEl = document.querySelector("#uppercaseCheck");
const numberCheckEl = document.querySelector("#numberCheck");
const symbolCheckEl = document.querySelector("#symbolCheck");

//Variavel de estado:
let passwordLength = 16;

//Função responsável por calcular a "força" da senha
function calculateQuality() {
  const percent = Math.round(
    (passwordLength / 64) * 25 + //PEso do tamanho da senha
      (uppercaseCheckEl.checked ? 15 : 0) + //peso de maiúsculas
      (numberCheckEl.checked ? 25 : 0) + //peso de números
      (symbolCheckEl.checked ? 35 : 0), //Peso de símbolos
  );
  //Definir largura do indicador proporcional a força da senha
  indicatorBarEl.style.width = `${percent}%`;

  //Classificação visual por nível de segurança
  if (percent > 69) {
    //Senha forte
    indicatorBarEl.classList.remove("critical");
    indicatorBarEl.classList.remove("warning");
    indicatorBarEl.classList.add("safe");
  } else if (percent > 50) {
    //Senha média
    indicatorBarEl.classList.remove("critical");
    indicatorBarEl.classList.add("warning");
    indicatorBarEl.classList.remove("safe");
  } else {
    //Senha fraca
    indicatorBarEl.classList.add("critical");
    indicatorBarEl.classList.remove("warning");
    indicatorBarEl.classList.remove("safe");
  }
  //Quando atingir 100%, marcar como completa
  if (percent >= 100) {
    indicatorBarEl.classList.add("completed");
  } else {
    indicatorBarEl.classList.remove("completed");
  }
}

function calculateFontSizer() {
  if (passwordLength > 45)  {
    inputEl.classList.remove("font-small");
    inputEl.classList.remove("font-mid");
    inputEl.classList.add("font-big");
  } else if (passwordLength > 32) {
    inputEl.classList.remove("font-small");
    inputEl.classList.add("font-mid");
    inputEl.classList.remove("font-big");
  } else if (passwordLength > 22) {
    inputEl.classList.add("font-small");
    inputEl.classList.remove("font-mid");
    inputEl.classList.remove("font-big");
  } else {
    inputEl.classList.remove("font-small");
    inputEl.classList.remove("font-mid");
    inputEl.classList.remove("font-big");
  }
}

//Função de gerar senha
function generatePassword() {
  //Conjunto base de caracteres
  let chars = "abcdefghijklmnopqrstuvwxyz"; //letras minúscullas
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; //Letras maiúsculas
  const numberChars = "0123456789"; //Números
  const symbolChars = "!@#$%^&*()-_=+[]{}|;:,.<>?/~"; //Símbolos

  //Quando o checkbox estiver marcado
  if (uppercaseCheckEl.checked) {
    chars += upperCaseChars;
  }
  if (numberCheckEl.checked) {
    chars += numberChars;
  }
  if (symbolCheckEl.checked) {
    chars += symbolChars;
  }

  //Variável onde irá armazenar a senha final
  let password = "";

  // Loop que gera cada caracter da senha
  for (let i = 0; i < passwordLength; i++) {
    //Gera um numero aleatorio do conjunto de caracteres:
    const randomNumber = Math.floor(Math.random() * chars.length);

    //Pega 1 caractere aleatório da string
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  //Exiba a senha no input
  inputEl.value = password;

  //Exibe o indicador de fonte
  calculateQuality();

  // Ajuste tamanho da fonte
  calculateFontSizer();
}

//Evento do slider, tamanho de senha:
passwordLengthEl.addEventListener("input", function () {
  //Atualiza o valor da variável global:
  passwordLength = passwordLengthEl.value;

  document.querySelector("#passwordLengthText").innerHTML = passwordLength;
  generatePassword();
});

// Eventos Checkbox
uppercaseCheckEl.addEventListener("click", generatePassword);
numberCheckEl.addEventListener("click", generatePassword);
symbolCheckEl.addEventListener("click", generatePassword);

function copy() {
  // API do navehador para copiar texto;
  navigator.clipboard.writeText(inputEl.value);
}

// Botões de copiar:
document.querySelector("#copy-1").addEventListener("click", copy);
document.querySelector("#copy-2").addEventListener("click", copy);
// Botão renovar
document.querySelector("#renew").addEventListener("click", generatePassword);

generatePassword();