// ===== Status da loja (aberto/fechado por horário) =====
function atualizarStatusLoja() {
  const statusEl = document.getElementById("status-loja");
  if (!statusEl) return;

  const agora = new Date();
  const hora = agora.getHours() + agora.getMinutes() / 60;
  const aberto = hora >= HORARIO_ABERTURA && hora < HORARIO_FECHAMENTO;

  if (aberto) {
    statusEl.textContent = `Aberto agora — atendimento até às ${HORARIO_FECHAMENTO}h`;
    statusEl.className = "status-loja status-aberto";
  } else {
    statusEl.textContent = `Fechado no momento — voltamos às ${HORARIO_ABERTURA}h`;
    statusEl.className = "status-loja status-fechado";
    abrirModalFechado();
  }
}

function abrirModalFechado() {
  if (sessionStorage.getItem("modalFechadoVisto") === "sim") return;
  const modalTexto = document.getElementById("modal-fechado-texto");
  if (modalTexto) {
    modalTexto.textContent = `Nosso horário de atendimento é das ${HORARIO_ABERTURA}h às ${HORARIO_FECHAMENTO}h.`;
  }
  const fundo = document.getElementById("modal-fechado-fundo");
  if (fundo) fundo.classList.add("aberto");
}

function fecharModalFechado() {
  const fundo = document.getElementById("modal-fechado-fundo");
  if (fundo) fundo.classList.remove("aberto");
  sessionStorage.setItem("modalFechadoVisto", "sim");
}

function fecharModalFechadoFundo(evento) {
  if (evento.target.id === "modal-fechado-fundo") fecharModalFechado();
}

atualizarStatusLoja();

// ===== Monta os cards do cardápio a partir de produtos.js =====
function formatarPreco(valor) {
  return valor.toFixed(2).replace(".", ",");
}

function criarCardProduto(produto) {
  const card = document.createElement("div");
  card.className = "produto";
  card.id = produto.id;

  if (produto.sabores) {
    // Produto com sabores em cards clicáveis (Sorvete, Dindin Gourmet)
    const precoInicial = produto.sabores[0].preco;
    const itensSabor = produto.sabores.map((sabor, indice) => `
      <div class="sabor-item${indice === 0 ? " selecionado" : ""}" data-sabor="${sabor.nome}" data-preco="${formatarPreco(sabor.preco)}" onclick="selecionarSabor(this)">
        <img src="${sabor.foto}" alt="${produto.nome} sabor ${sabor.nome}">
        <span>${sabor.nome}${sabor.preco !== produto.precoBase ? ` (R$ ${formatarPreco(sabor.preco)})` : ""}</span>
      </div>
    `).join("");

    card.innerHTML = `
      <img src="${produto.foto}" alt="${produto.nome} Doce Sonho">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <strong id="preco-${produto.id}">A partir de R$ ${formatarPreco(produto.precoBase)}</strong>
      <div class="sabores-escolha" data-produto="${produto.nome}" data-sabor-selecionado="${produto.sabores[0].nome}" data-preco-selecionado="${formatarPreco(precoInicial)}">
        <p><strong>Escolha seu sabor:</strong></p>
        ${itensSabor}
        <div class="controle-quantidade">
          <button type="button" onclick="alterarQuantidade(this, -1)" aria-label="Diminuir quantidade">−</button>
          <span class="quantidade-valor">1</span>
          <button type="button" onclick="alterarQuantidade(this, 1)" aria-label="Aumentar quantidade">+</button>
        </div>
        <button onclick="adicionarComSabor(this)" class="botao-carrinho">Adicionar ao carrinho</button>
      </div>
    `;
  } else if (produto.saboresLista) {
    // Produto com sabores em menu suspenso (Trufas)
    const opcoes = produto.saboresLista.map(s => `<option value="${s}">${s}</option>`).join("");
    card.innerHTML = `
      <img src="${produto.foto}" alt="${produto.nome} Doce Sonho">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <strong>R$ ${formatarPreco(produto.preco)}</strong>
      <div class="escolha-sabor">
        <label for="sabor-${produto.id}">Escolha seu sabor:</label>
        <select id="sabor-${produto.id}">
          <option value="">Selecione um sabor</option>
          ${opcoes}
        </select>
      </div>
      <div class="controle-quantidade">
        <button type="button" onclick="alterarQuantidade(this, -1)" aria-label="Diminuir quantidade">−</button>
        <span class="quantidade-valor">1</span>
        <button type="button" onclick="alterarQuantidade(this, 1)" aria-label="Aumentar quantidade">+</button>
      </div>
      <button onclick="adicionarComDropdown(this, '${produto.nome}', ${produto.preco}, 'sabor-${produto.id}')" class="botao-carrinho">Adicionar ao carrinho</button>
    `;
  } else {
    // Produto simples, sem sabor (Brownie, Brownie no Pote)
    card.innerHTML = `
      <img src="${produto.foto}" alt="${produto.nome} Doce Sonho">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <strong>R$ ${formatarPreco(produto.preco)}</strong>
      <div class="controle-quantidade">
        <button type="button" onclick="alterarQuantidade(this, -1)" aria-label="Diminuir quantidade">−</button>
        <span class="quantidade-valor">1</span>
        <button type="button" onclick="alterarQuantidade(this, 1)" aria-label="Aumentar quantidade">+</button>
      </div>
      <button onclick="adicionarSimples(this, '${produto.nome}', ${produto.preco})" class="botao-carrinho">Adicionar ao carrinho</button>
    `;
  }

  return card;
}

function montarCardapio() {
  const grade = document.getElementById("grade-produtos");
  if (!grade) return;
  PRODUTOS.forEach(produto => grade.appendChild(criarCardProduto(produto)));
}

montarCardapio();

// ===== Vídeo: toca só quando entra na tela, pausa quando sai =====
const video = document.getElementById("video-doce");
let videoLiberado = false;

function tentarTocarVideo() {
  if (!video) return;
  video.play().catch(() => {});
}

if (video) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) tentarTocarVideo();
      else video.pause();
    });
  }, { threshold: 0.3 });
  observador.observe(video);

  ["touchstart", "click", "scroll"].forEach((evento) => {
    document.addEventListener(evento, () => {
      if (!videoLiberado) {
        videoLiberado = true;
        tentarTocarVideo();
      }
    }, { once: true, passive: true });
  });
}

// ===== Seleção de sabor (Sorvete, Dindin Gourmet) =====
function selecionarSabor(elemento) {
  const grupo = elemento.closest(".sabores-escolha");
  grupo.querySelectorAll(".sabor-item").forEach(item => item.classList.remove("selecionado"));
  elemento.classList.add("selecionado");
  grupo.dataset.saborSelecionado = elemento.dataset.sabor;
  grupo.dataset.precoSelecionado = elemento.dataset.preco || "";

  if (elemento.dataset.preco) {
    const card = grupo.closest(".produto");
    const precoElemento = card ? card.querySelector("strong[id^='preco-']") : null;
    if (precoElemento) precoElemento.textContent = `R$ ${elemento.dataset.preco}`;
  }
}

// ===== Controle de quantidade (+ / −) =====
function alterarQuantidade(botao, delta) {
  const controle = botao.closest(".controle-quantidade");
  const valor = controle.querySelector(".quantidade-valor");
  let atual = parseInt(valor.textContent, 10) || 1;
  atual = Math.max(1, atual + delta);
  valor.textContent = atual;
}

// ===== Carrinho de compras =====
const carrinho = [];

function paraNumero(precoTexto) {
  return parseFloat(String(precoTexto).replace(",", "."));
}

function paraTextoPreco(numero) {
  return numero.toFixed(2).replace(".", ",");
}

function adicionarAoCarrinho(nome, sabor, precoUnitario, quantidade) {
  const chave = nome + (sabor ? ` (${sabor})` : "");
  const existente = carrinho.find(item => item.chave === chave);
  if (existente) existente.quantidade += quantidade;
  else carrinho.push({ chave, nome, sabor, precoUnitario, quantidade });
  atualizarCarrinho();
  abrirCarrinho();
}

function adicionarSimples(botao, nome, precoUnitario) {
  const card = botao.closest(".produto");
  const controle = card.querySelector(".controle-quantidade .quantidade-valor");
  const quantidade = parseInt(controle.textContent, 10) || 1;
  adicionarAoCarrinho(nome, null, precoUnitario, quantidade);
  controle.textContent = "1";
}

function adicionarComSabor(botao) {
  const grupo = botao.closest(".sabores-escolha");
  const sabor = grupo.dataset.saborSelecionado;
  const preco = grupo.dataset.precoSelecionado;
  const produto = grupo.dataset.produto;

  if (!sabor) {
    alert("Escolha um sabor antes de adicionar ao carrinho.");
    return;
  }

  const controle = grupo.querySelector(".controle-quantidade .quantidade-valor");
  const quantidade = parseInt(controle.textContent, 10) || 1;
  adicionarAoCarrinho(produto, sabor, paraNumero(preco), quantidade);
  controle.textContent = "1";
}

function adicionarComDropdown(botao, nome, precoUnitario, idSelect) {
  const card = botao.closest(".produto");
  const select = card.querySelector(`#${idSelect}`);
  const sabor = select.value;

  if (!sabor) {
    alert("Escolha um sabor antes de adicionar ao carrinho.");
    return;
  }

  const controle = card.querySelector(".controle-quantidade .quantidade-valor");
  const quantidade = parseInt(controle.textContent, 10) || 1;
  adicionarAoCarrinho(nome, sabor, precoUnitario, quantidade);
  controle.textContent = "1";
  select.value = "";
}

function removerDoCarrinho(indice) {
  carrinho.splice(indice, 1);
  atualizarCarrinho();
}

function calcularTotal() {
  return carrinho.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0);
}

function atualizarCarrinho() {
  const contador = document.getElementById("carrinho-contador");
  const listaEl = document.getElementById("carrinho-itens");
  const totalEl = document.getElementById("carrinho-total");
  const freteEl = document.getElementById("carrinho-frete");

  const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  contador.textContent = totalItens;
  contador.style.display = totalItens > 0 ? "flex" : "none";

  if (carrinho.length === 0) {
    listaEl.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
  } else {
    listaEl.innerHTML = carrinho.map((item, indice) => `
      <div class="carrinho-item">
        <div class="carrinho-item-info">
          <strong>${item.quantidade}x ${item.nome}${item.sabor ? ` (${item.sabor})` : ""}</strong>
          <span>R$ ${paraTextoPreco(item.precoUnitario * item.quantidade)}</span>
        </div>
        <span class="carrinho-item-remover" onclick="removerDoCarrinho(${indice})">Remover</span>
      </div>
    `).join("");
  }

  const total = calcularTotal();
  totalEl.textContent = `R$ ${paraTextoPreco(total)}`;

  if (total === 0) freteEl.textContent = "";
  else if (total >= 10) freteEl.textContent = "Você garantiu o frete grátis para bairros locais!";
  else freteEl.textContent = `Faltam R$ ${paraTextoPreco(10 - total)} para o frete grátis (bairros locais)`;
}

function abrirCarrinho() {
  document.getElementById("carrinho-painel").classList.add("aberto");
  document.getElementById("carrinho-fundo").classList.add("aberto");
}

function fecharCarrinho() {
  document.getElementById("carrinho-painel").classList.remove("aberto");
  document.getElementById("carrinho-fundo").classList.remove("aberto");
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
  carrinho.forEach(item => {
    mensagem += `• ${item.quantidade}x ${item.nome}${item.sabor ? ` (${item.sabor})` : ""} - R$ ${paraTextoPreco(item.precoUnitario * item.quantidade)}\n`;
  });
  const total = calcularTotal();
  mensagem += `\nTotal: R$ ${paraTextoPreco(total)}`;
  mensagem += total >= 10 ? "\nFrete grátis (bairros locais)!" : `\n(Faltam R$ ${paraTextoPreco(10 - total)} para frete grátis em bairros locais)`;

  window.location.href = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

// ===== Visualizador de imagem em tela cheia (bastidores) =====
function abrirImagem(src) {
  const janela = document.createElement("div");
  janela.className = "visualizador";
  janela.innerHTML = `<span class="fechar">&times;</span><img src="${src}" alt="Imagem ampliada">`;
  document.body.appendChild(janela);

  janela.querySelector(".fechar").onclick = () => janela.remove();
  janela.onclick = (evento) => {
    if (evento.target === janela) janela.remove();
  };
}
