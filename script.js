class Usuario {
  constructor(nome, pontos = 0, sequencia = 0, concluidas = []) {
    this.nome = nome;
    this.pontos = pontos;
    this.sequencia = sequencia;
    this.concluidas = concluidas;
  }

  adicionarPontos(valor) {
    this.pontos += valor;
    return this.pontos;
  }

  get nivel() {
    if (this.pontos >= 700) return { numero: 5, nome: "Guardiao do Planeta" };
    if (this.pontos >= 450) return { numero: 4, nome: "Lider Circular" };
    if (this.pontos >= 250) return { numero: 3, nome: "Agente Sustentavel" };
    if (this.pontos >= 100) return { numero: 2, nome: "Eco Aprendiz" };
    return { numero: 1, nome: "Broto Verde" };
  }
}

class Missao {
  constructor(id, titulo, descricao, pontos, categoria, frequencia, icone) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.pontos = pontos;
    this.categoria = categoria;
    this.frequencia = frequencia;
    this.icone = icone;
  }
}

class Conquista {
  constructor(id, titulo, descricao, icone, criterio) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.icone = icone;
    this.criterio = criterio;
  }
}

class ItemTroca {
  constructor(nome, categoria, estado, descricao, criadoEm = new Date().toISOString()) {
    this.nome = nome;
    this.categoria = categoria;
    this.estado = estado;
    this.descricao = descricao;
    this.criadoEm = criadoEm;
    this.pontos = 25;
  }
}

class FilaMissoes {
  constructor(itens = []) {
    this.itens = [...itens];
  }

  enfileirar(item) {
    this.itens.push(item);
  }

  desenfileirar() {
    return this.itens.shift();
  }

  proximo() {
    return this.itens[0] || null;
  }

  removerPorId(id) {
    this.itens = this.itens.filter((missao) => missao.id !== id);
  }

  get tamanho() {
    return this.itens.length;
  }
}

class NoItem {
  constructor(valor) {
    this.valor = valor;
    this.proximo = null;
  }
}

class ListaEncadeadaItens {
  constructor(itens = []) {
    this.cabeca = null;
    itens.forEach((item) => this.adicionar(item));
  }

  adicionar(item) {
    const novoNo = new NoItem(item);
    if (!this.cabeca) {
      this.cabeca = novoNo;
      return;
    }

    let atual = this.cabeca;
    while (atual.proximo) atual = atual.proximo;
    atual.proximo = novoNo;
  }

  paraArray() {
    const itens = [];
    let atual = this.cabeca;
    while (atual) {
      itens.push(atual.valor);
      atual = atual.proximo;
    }
    return itens;
  }
}

class PlataformaEcoQuest {
  constructor() {
    this.storageKey = "ecoquest-state-v1";
    this.missoes = this.criarMissoes();
    this.conquistas = this.criarConquistas();
    this.rankingBase = [
      { nome: "Marina", pontos: 610 },
      { nome: "Rafael", pontos: 520 },
      { nome: "Bianca", pontos: 340 },
      { nome: "Turma ADS", pontos: 210 }
    ];
    this.estado = this.carregarEstado();
    this.usuario = new Usuario(
      this.estado.usuario.nome,
      this.estado.usuario.pontos,
      this.estado.usuario.sequencia,
      this.estado.usuario.concluidas
    );
    this.filaMissoes = new FilaMissoes(
      this.missoes.filter((missao) => !this.usuario.concluidas.includes(missao.id))
    );
    this.listaItens = new ListaEncadeadaItens(this.estado.itens);
    this.iniciarEventos();
    this.renderizar();
  }

  criarMissoes() {
    return [
      new Missao("bike", "Ir de bicicleta ou transporte publico", "Registre um deslocamento com menor emissao de carbono.", 45, "Carbono", "Diaria", "🚲"),
      new Missao("banho", "Tomar banho curto", "Economize agua mantendo o banho em ate 5 minutos.", 30, "Agua", "Diaria", "🚿"),
      new Missao("energia", "Reduzir consumo de energia", "Desligue luzes e aparelhos fora de uso durante o dia.", 35, "Energia", "Diaria", "💡"),
      new Missao("reciclagem", "Separar residuos reciclaveis", "Separe papel, plastico, vidro ou metal para coleta correta.", 40, "Residuos", "Semanal", "♻️"),
      new Missao("garrafa", "Usar garrafa reutilizavel", "Evite descartaveis levando sua propria garrafa.", 25, "Residuos", "Diaria", "🥤"),
      new Missao("troca", "Cadastrar item para troca ou doacao", "Aumente a vida util de um objeto parado em casa.", 50, "Circular", "Semanal", "🔁")
    ];
  }

  criarConquistas() {
    return [
      new Conquista("primeira", "Primeira atitude", "Conclua sua primeira missao sustentavel.", "🌱", (app) => app.usuario.concluidas.length >= 1),
      new Conquista("cem", "100 pontos verdes", "Alcance 100 pontos no EcoQuest.", "🏅", (app) => app.usuario.pontos >= 100),
      new Conquista("multicategoria", "Impacto diverso", "Conclua missoes em pelo menos 3 categorias.", "🌎", (app) => app.categoriasConcluidas().length >= 3),
      new Conquista("circular", "Agente circular", "Cadastre pelo menos 1 item para troca ou doacao.", "🔄", (app) => app.listaItens.paraArray().length >= 1),
      new Conquista("ranking", "Top 3 sustentavel", "Entre nas tres primeiras posicoes do ranking.", "🏆", (app) => app.rankingAtual()[0]?.nome === app.usuario.nome || app.rankingAtual()[1]?.nome === app.usuario.nome || app.rankingAtual()[2]?.nome === app.usuario.nome)
    ];
  }

  carregarEstado() {
    const salvo = localStorage.getItem(this.storageKey);
    if (salvo) return JSON.parse(salvo);

    return {
      usuario: {
        nome: "Joao Eco",
        pontos: 80,
        sequencia: 3,
        concluidas: []
      },
      itens: [
        new ItemTroca("Livro de algoritmos", "Livros", "Muito bom", "Livro usado para estudo, disponivel para troca por outro material academico."),
        new ItemTroca("Jaqueta jeans", "Roupas", "Bom", "Peca conservada, ideal para reuso em vez de descarte.")
      ]
    };
  }

  salvarEstado() {
    localStorage.setItem(this.storageKey, JSON.stringify({
      usuario: this.usuario,
      itens: this.listaItens.paraArray()
    }));
  }

  iniciarEventos() {
    document.querySelectorAll(".nav-button").forEach((button) => {
      button.addEventListener("click", () => this.trocarTela(button.dataset.view));
    });

    document.getElementById("itemForm").addEventListener("submit", (event) => {
      event.preventDefault();
      this.cadastrarItem();
    });

    document.getElementById("resetApp").addEventListener("click", () => {
      localStorage.removeItem(this.storageKey);
      window.location.reload();
    });
  }

  trocarTela(viewId) {
    document.querySelectorAll(".nav-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.view === viewId);
    });
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.toggle("active", view.id === viewId);
    });
  }

  concluirMissao(id) {
    if (this.usuario.concluidas.includes(id)) return;
    const missao = this.missoes.find((item) => item.id === id);
    const nivelAnterior = this.usuario.nivel.numero;

    this.usuario.concluidas.push(id);
    this.usuario.adicionarPontos(missao.pontos);
    this.usuario.sequencia += 1;
    this.filaMissoes.removerPorId(id);
    this.salvarEstado();
    this.renderizar();

    const subiuNivel = this.usuario.nivel.numero > nivelAnterior ? ` Subiu para o nivel ${this.usuario.nivel.numero}!` : "";
    this.mostrarAviso(`Missao concluida: +${missao.pontos} pontos.${subiuNivel}`);
  }

  cadastrarItem() {
    const nome = document.getElementById("itemName").value.trim();
    const categoria = document.getElementById("itemCategory").value;
    const estado = document.getElementById("itemCondition").value;
    const descricao = document.getElementById("itemDescription").value.trim();
    if (!nome) return;

    const item = new ItemTroca(nome, categoria, estado, descricao || "Item cadastrado para incentivar reuso e economia circular.");
    const nivelAnterior = this.usuario.nivel.numero;
    this.listaItens.adicionar(item);
    this.usuario.adicionarPontos(item.pontos);

    if (!this.usuario.concluidas.includes("troca")) {
      this.usuario.concluidas.push("troca");
      this.filaMissoes.removerPorId("troca");
    }

    this.salvarEstado();
    document.getElementById("itemForm").reset();
    this.renderizar();
    const subiuNivel = this.usuario.nivel.numero > nivelAnterior ? " Voce tambem subiu de nivel." : "";
    this.mostrarAviso(`Item cadastrado na lista de trocas: +${item.pontos} pontos.${subiuNivel}`);
  }

  conquistasDesbloqueadas() {
    return this.conquistas.filter((conquista) => conquista.criterio(this));
  }

  categoriasConcluidas() {
    const categorias = this.missoes
      .filter((missao) => this.usuario.concluidas.includes(missao.id))
      .map((missao) => missao.categoria);
    return [...new Set(categorias)];
  }

  rankingAtual() {
    return [...this.rankingBase, { nome: this.usuario.nome, pontos: this.usuario.pontos }]
      .sort((a, b) => b.pontos - a.pontos);
  }

  impactoPorCategoria() {
    const impacto = { Carbono: 0, Agua: 0, Energia: 0, Residuos: 0, Circular: 0 };
    this.missoes.forEach((missao) => {
      if (this.usuario.concluidas.includes(missao.id)) {
        impacto[missao.categoria] += missao.pontos;
      }
    });
    return impacto;
  }

  renderizar() {
    this.renderizarMetricas();
    this.renderizarProximaMissao();
    this.renderizarGrafico();
    this.renderizarMissoes();
    this.renderizarRanking();
    this.renderizarConquistas();
    this.renderizarItens();
  }

  renderizarMetricas() {
    const nivel = this.usuario.nivel;
    document.getElementById("totalPoints").textContent = this.usuario.pontos;
    document.getElementById("levelLabel").textContent = `Nivel ${nivel.numero} - ${nivel.nome}`;
    document.getElementById("streakDays").textContent = `${this.usuario.sequencia} dias`;
    document.getElementById("completedCount").textContent = this.usuario.concluidas.length;
    document.getElementById("achievementCount").textContent = `${this.conquistasDesbloqueadas().length}/${this.conquistas.length}`;
    document.getElementById("queueSize").textContent = `${this.filaMissoes.tamanho} na fila`;
  }

  renderizarProximaMissao() {
    const container = document.getElementById("nextMissionCard");
    const missao = this.filaMissoes.proximo();
    if (!missao) {
      container.innerHTML = `<p class="empty-state">Todas as missoes iniciais foram concluidas. Cadastre novos itens ou reinicie a demo para apresentar novamente.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="mission-card compact">
        <div class="mission-top">
          <span class="mission-icon">${missao.icone}</span>
          <span class="pill">${missao.frequencia}</span>
        </div>
        <h3>${missao.titulo}</h3>
        <p>${missao.descricao}</p>
        <div class="mission-meta">
          <span>+${missao.pontos} pontos</span>
          <span>${missao.categoria}</span>
        </div>
        <button class="primary-button" type="button" data-complete="${missao.id}">Concluir proxima</button>
      </div>
    `;
    container.querySelector("[data-complete]").addEventListener("click", () => this.concluirMissao(missao.id));
  }

  renderizarGrafico() {
    const chart = document.getElementById("impactChart");
    const impacto = this.impactoPorCategoria();
    const maximo = Math.max(100, ...Object.values(impacto));
    const cores = {
      Carbono: "var(--green)",
      Agua: "var(--blue)",
      Energia: "var(--yellow)",
      Residuos: "var(--rose)",
      Circular: "var(--green-dark)"
    };

    chart.innerHTML = Object.entries(impacto).map(([categoria, pontos]) => {
      const largura = Math.min(100, Math.round((pontos / maximo) * 100));
      return `
        <div class="chart-row">
          <div class="chart-title"><span>${categoria}</span><span>${pontos} pts</span></div>
          <div class="bar-track"><div class="bar-fill" style="width: ${largura}%; background: ${cores[categoria]}"></div></div>
        </div>
      `;
    }).join("");
  }

  renderizarMissoes() {
    const lista = document.getElementById("missionList");
    const template = document.getElementById("missionTemplate");
    lista.innerHTML = "";

    this.missoes.forEach((missao) => {
      const card = template.content.cloneNode(true);
      const artigo = card.querySelector(".mission-card");
      const concluida = this.usuario.concluidas.includes(missao.id);
      artigo.querySelector(".mission-icon").textContent = missao.icone;
      artigo.querySelector(".mission-frequency").textContent = missao.frequencia;
      artigo.querySelector("h3").textContent = missao.titulo;
      artigo.querySelector("p").textContent = missao.descricao;
      artigo.querySelector(".points").textContent = `+${missao.pontos} pontos`;
      artigo.querySelector(".category").textContent = missao.categoria;

      const input = artigo.querySelector("input");
      const preview = artigo.querySelector(".proof-preview");
      input.addEventListener("change", () => {
        const arquivo = input.files[0];
        if (!arquivo) return;
        preview.src = URL.createObjectURL(arquivo);
        preview.classList.add("visible");
      });

      const botao = artigo.querySelector(".complete-button");
      botao.textContent = concluida ? "Missao concluida" : "Concluir missao";
      botao.disabled = concluida;
      botao.addEventListener("click", () => this.concluirMissao(missao.id));
      lista.appendChild(card);
    });
  }

  renderizarRanking() {
    const lista = document.getElementById("rankingList");
    lista.innerHTML = this.rankingAtual().map((pessoa, index) => `
      <article class="ranking-row ${pessoa.nome === this.usuario.nome ? "current-user" : ""}">
        <div class="ranking-left">
          <span class="rank-position">${index + 1}</span>
          <div>
            <strong>${pessoa.nome}</strong>
            <p class="empty-state">${pessoa.nome === this.usuario.nome ? "Voce" : "Participante EcoQuest"}</p>
          </div>
        </div>
        <strong>${pessoa.pontos} pts</strong>
      </article>
    `).join("");
  }

  renderizarConquistas() {
    const lista = document.getElementById("achievementList");
    lista.innerHTML = this.conquistas.map((conquista) => {
      const desbloqueada = conquista.criterio(this);
      return `
        <article class="achievement-card ${desbloqueada ? "" : "locked"}">
          <span class="badge-icon">${conquista.icone}</span>
          <h3>${conquista.titulo}</h3>
          <p>${conquista.descricao}</p>
          <span class="pill">${desbloqueada ? "Desbloqueada" : "Bloqueada"}</span>
        </article>
      `;
    }).join("");
  }

  renderizarItens() {
    const lista = document.getElementById("itemList");
    const itens = this.listaItens.paraArray();
    if (!itens.length) {
      lista.innerHTML = `<p class="empty-state">Nenhum item cadastrado ainda.</p>`;
      return;
    }

    lista.innerHTML = itens.map((item, index) => `
      <article class="item-card">
        <div class="panel-header">
          <h3>${item.nome}</h3>
          <span class="pill">No ${index + 1}</span>
        </div>
        <p>${item.descricao}</p>
        <div class="item-tags">
          <span class="pill">${item.categoria}</span>
          <span class="pill">${item.estado}</span>
          <span class="pill">+${item.pontos} pts</span>
        </div>
      </article>
    `).join("");
  }

  mostrarAviso(mensagem) {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;
    toast.classList.add("show");
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3800);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PlataformaEcoQuest();
});
