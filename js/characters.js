const listaPersonagens = document.getElementById("listaPersonagens");
const carregamento = document.getElementById("carregamento");
const mensagem = document.getElementById("mensagem");

const formBusca = document.getElementById("formBusca");
const campoBusca = document.getElementById("campoBusca");
const botaoBusca = document.getElementById("botaoBusca");

let personagens = [];

// Exibe mensagens na tela
function exibirMensagem(texto, tipo = "info") {
    mensagem.innerHTML = "";

    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = texto;

    mensagem.appendChild(alerta);
}

// Cria o cartão de um personagem
function criarCard(personagem) {
    const coluna = document.createElement("div");
    coluna.className = "col-12 col-sm-6 col-md-4 col-lg-3";

    const card = document.createElement("div");
    card.className = "card h-100 shadow-sm";

    const imagem = document.createElement("img");
    imagem.className = "card-img-top";
    imagem.src = personagem.thumb_img || "";
    imagem.alt = personagem.name_en || "Personagem";

    imagem.style.height = "220px";
    imagem.style.objectFit = "contain";

    imagem.onerror = () => {
        imagem.remove();
    };

    const corpo = document.createElement("div");
    corpo.className = "card-body";

    const nome = document.createElement("h5");
    nome.className = "card-title";
    nome.textContent = personagem.name_en || "Nome indisponível";

    const aniversario = document.createElement("p");
    aniversario.className = "card-text";

    if (personagem.birth_day && personagem.birth_month) {
        aniversario.textContent =
            `Aniversário: ${personagem.birth_day}/${personagem.birth_month}`;
    } else {
        aniversario.textContent = "Aniversário não informado/desconecido";
    }

    const altura = document.createElement("p");
    altura.className = "card-text text-secondary";

    altura.textContent = personagem.height
        ? `Altura: ${personagem.height} cm`
        : "Altura não informada";

    corpo.append(nome, aniversario, altura);
    card.append(imagem, corpo);
    coluna.appendChild(card);

    return coluna;
}

// Exibe os personagens na tela
function renderizarPersonagens(lista) {
    listaPersonagens.innerHTML = "";
    mensagem.innerHTML = "";

    if (lista.length === 0) {
        exibirMensagem("Nenhum personagem encontrado.", "warning");
        return;
    }

    lista.forEach(personagem => {
        const card = criarCard(personagem);
        listaPersonagens.appendChild(card);
    });
}

// Busca os personagens na API
async function carregarPersonagens() {
    carregamento.classList.remove("d-none");
    listaPersonagens.innerHTML = "";
    mensagem.innerHTML = "";
    botaoBusca.disabled = true;

    try {
        personagens = await buscarDados("/api/v1/character/info");

        renderizarPersonagens(personagens);

    } catch (erro) {
        exibirMensagem(
            "Não foi possível carregar os personagens. Verifique sua conexão e tente novamente.",
            "danger"
        );

        const botaoTentarNovamente = document.createElement("button");
        botaoTentarNovamente.className = "btn btn-outline-danger mt-2";
        botaoTentarNovamente.textContent = "Tentar novamente";

        botaoTentarNovamente.addEventListener("click", carregarPersonagens);

        mensagem.appendChild(botaoTentarNovamente);

        console.error("Erro ao carregar personagens:", erro);

    } finally {
        carregamento.classList.add("d-none");
        botaoBusca.disabled = false;
    }
}

// Pesquisa personagens pelo nome
formBusca.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const pesquisa = campoBusca.value.trim().toLowerCase();

    if (!pesquisa) {
        exibirMensagem("Digite o nome de um personagem para pesquisar.", "warning");
        return;
    }

    const resultado = personagens.filter(personagem =>
        personagem.name_en?.toLowerCase().includes(pesquisa) ||
        personagem.name_jp?.toLowerCase().includes(pesquisa)
    );

    renderizarPersonagens(resultado);
});

// Inicializa a página
carregarPersonagens();
