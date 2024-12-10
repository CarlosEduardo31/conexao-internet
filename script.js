const itens = document.querySelectorAll(".item-drag");
const posicoes = document.querySelectorAll(".area-drop");
const mensagem = document.getElementById("mensagem");
let tentativas = 0; // Contador de itens movidos
let itensMovidos = []; // Lista de itens movidos

// Adiciona eventos para drag-and-drop e touch
itens.forEach((item) => {
  item.addEventListener("dragstart", (event) => {
    if (item.classList.contains("disabled")) return;
    event.dataTransfer.setData("item", item.id); // Usando o ID do item
  });

  // Suporte para dispositivos móveis
  item.addEventListener("touchstart", (event) => {
    if (item.classList.contains("disabled")) return;
    event.target.classList.add("dragging");
  });

  item.addEventListener("touchmove", (event) => {
    if (item.classList.contains("disabled")) return;
    const touch = event.touches[0];
    const draggingItem = document.querySelector(".dragging");
    if (draggingItem) {
      draggingItem.style.position = "absolute";
      draggingItem.style.left = `${touch.pageX}px`;
      draggingItem.style.top = `${touch.pageY}px`;
    }
    event.preventDefault(); // Impede que a tela seja rolada
  });

  item.addEventListener("touchend", (event) => {
    const draggingItem = document.querySelector(".dragging");
    if (draggingItem) {
      draggingItem.style.position = "";
      draggingItem.style.left = "";
      draggingItem.style.top = "";
      draggingItem.classList.remove("dragging");

      const itemName = draggingItem.id;
      handleDrop(itemName); // Passando o id do item
    }
  });
});

// Adiciona eventos de arrastar ao parque
const parque = document.getElementById("parque");
parque.addEventListener("dragover", (event) => {
  event.preventDefault(); // Necessário para permitir o "drop"
});

parque.addEventListener("drop", (event) => {
  event.preventDefault();
  const itemId = event.dataTransfer.getData("item");
  handleDrop(itemId); // Passando o id do item
});

function handleDrop(itemId) {
  // Verifica se o item é a antena
  if (itemId === "antena") {
    // Definindo as áreas onde a antena deve ser colocado
    const areasDaAntena = ["area-antena1", "area-antena2", "area-antena3"];

    // Coloca a antena nas 3 áreas
    areasDaAntena.forEach((areaId) => {
      const area = document.getElementById(areaId);

      // Verifica se a área está disponível para o item
      if (area && !area.classList.contains("completo")) {
        // Clona a antena para a área
        const itemElement = document.getElementById("antena");
        const clonedItem = itemElement.cloneNode(true); // Cria uma cópia da antena
        area.textContent = ""; // Limpa a área de destino
        area.classList.add("completo");
        area.appendChild(clonedItem); // Adiciona a antena na área
        clonedItem.classList.add("grande"); // Aumenta o tamanho do item copiado
        const cardItem = itemElement.parentElement;
        cardItem.classList.add("hidden"); // Oculta a antena da lista
      }
    });
  } else {
    // Lógica para os outros itens
    const posicaoCorreta = document.querySelector(`#area-${itemId}`);
    if (posicaoCorreta && !posicaoCorreta.classList.contains("completo")) {
      posicaoCorreta.textContent = ""; // Limpa a área de destino
      posicaoCorreta.classList.add("completo");
      const itemElement = document.getElementById(itemId);
      const cardItem = itemElement.parentElement;
      cardItem.classList.add("hidden");
      posicaoCorreta.appendChild(itemElement);
      itemElement.classList.add("grande");
    }
  }

  // Adiciona o item à lista de itens movidos e atualiza a contagem
  if (!itensMovidos.includes(itemId)) {
    itensMovidos.push(itemId);
    tentativas++;
  }

  // Verifica se já foram movidos 3 itens
  if (tentativas === 3) {
    desabilitarItens(); // Desabilita os itens restantes
    validarTentativa(); // Valida a tentativa e apresenta a mensagem
  }
}

// Função para desabilitar os itens após 3 movimentos
function desabilitarItens() {
  itens.forEach((item) => {
    item.classList.add("disabled");
  });
}

// Função para validar a tentativa
function validarTentativa() {
  const itensCorretos = ["antena", "satelite", "garota-notebook"];
  const estaCorreto = itensCorretos.every((item) =>
    itensMovidos.includes(item)
  );

  if (estaCorreto) {
    mensagem.textContent = "A palavra da sua organização é TESTE 1.";
    mensagem.style.color = "green";
  } else {
    mensagem.textContent = "A palavra da sua organização é TESTE 2.";
    mensagem.style.color = "red";
  }
}
