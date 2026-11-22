const listaSupportCards = document.getElementById("listaSupportCards");
const carregamentoCards = document.getElementById("carregamento");
const mensagemCards = document.getElementById("mensagem");

const formBuscaCards = document.getElementById("formBusca");
const campoBuscaCards = document.getElementById("campoBusca");
const botaoBuscaCards = document.getElementById("botaoBusca");

let supportCards = [];
let personagens = [];

// Exibe mensagens na página
function exibirMensagemCards(texto, tipo = "info") {
    mensagemCards.innerHTML = "";

    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = texto;

    mensagemCards.appendChild(alerta);
}

// Procura a personagem relacionada à carta
function buscarPersonagem(charaId) {
    return personagens.find(
        personagem => Number(personagem.game_id) === Number(charaId)
    );
}

// Cria o card de uma Support Card
function criarCardSupport(card) {
    const coluna = document.createElement("div");
    coluna.className = "col-12 col-sm-6 col-md-4 col-lg-3";

    const elementoCard = document.createElement("div");
    elementoCard.className = "card h-100 shadow-sm";

    // Imagem original da Support Card
    const imagem = document.createElement("img");

    imagem.src = `https://umamusume.run/images/supports/support-${card.id}.webp`;
    imagem.alt = card.title_en || "Support Card";
    imagem.className = "card-img-top";
    imagem.style.width = "100%";
    imagem.style.height = "280px";
    imagem.style.objectFit = "contain";
    imagem.loading = "lazy";

    imagem.onerror = () => imagem.remove();

    elementoCard.appendChild(imagem);

    const corpo = document.createElement("div");
    corpo.className = "card-body";

    const titulo = document.createElement("h5");
    titulo.className = "card-title";
    titulo.textContent = card.title_en || card.title || "Título indisponível";

    const personagem = buscarPersonagem(card.chara_id);

    const nomePersonagem = document.createElement("p");
    nomePersonagem.className = "card-text";
    nomePersonagem.textContent =
        `Personagem: ${personagem?.name_en || "Não disponível"}`;

    const raridade = document.createElement("p");
    raridade.className = "card-text";
    raridade.textContent =
        `Raridade: ${card.rarity_string || "Não disponível"}`;

    const tipo = document.createElement("p");
    tipo.className = "card-text";
    tipo.textContent =
        `Tipo: ${card.type || "Não disponível"}`;

    const identificador = document.createElement("p");
    identificador.className = "card-text text-secondary";
    identificador.textContent = `ID da carta: ${card.id}`;

    corpo.append(
    titulo,
    nomePersonagem,
    raridade,
    tipo,
    identificador
);

    elementoCard.appendChild(corpo);
    coluna.appendChild(elementoCard);

    return coluna;
}

// Ordena em ssr > sr > r
function ordenarSupportCards(lista) {
    const ordemRaridade = {
        "SSR": 1,
        "SR": 2,
        "R": 3
    };

    return [...lista].sort((a, b) => {
        const ordemA = ordemRaridade[a.rarity_string] || 4;
        const ordemB = ordemRaridade[b.rarity_string] || 4;

        return ordemA - ordemB;
    });
}
// Renderiza as Support Cards
function renderizarSupportCards(lista) {
    listaSupportCards.innerHTML = "";
    mensagemCards.innerHTML = "";

    if (lista.length === 0) {
        exibirMensagemCards(
            "Nenhuma Support Card encontrada.",
            "warning"
        );
        return;
    }

    ordenarSupportCards(lista).forEach(card => {
        listaSupportCards.appendChild(criarCardSupport(card));
    });
}

// Busca os detalhes das cartas com limite de requisições simultâneas
async function carregarDetalhesCards(cartas) {
    const quantidadeSimultanea = 12;
    let proximoIndice = 0;
    let falhas = 0;

    async function trabalhador() {
        while (proximoIndice < cartas.length) {
            const indice = proximoIndice++;

            try {
                const detalhes = await buscarDados(
                    `/api/v1/support/${cartas[indice].id}`
                );

                cartas[indice] = {
                    ...cartas[indice],
                    ...detalhes
                };

            } catch (erro) {
                falhas++;
                console.error(
                    `Erro ao carregar a carta ${cartas[indice].id}:`,
                    erro
                );
            }
        }
    }

    const trabalhadores = Array.from(
        {
            length: Math.min(quantidadeSimultanea, cartas.length)
        },
        () => trabalhador()
    );

    await Promise.all(trabalhadores);

    return falhas;
}

// Carrega as Support Cards
async function carregarSupportCards() {
    carregamentoCards.classList.remove("d-none");
    listaSupportCards.innerHTML = "";
    mensagemCards.innerHTML = "";
    botaoBuscaCards.disabled = true;

    try {
        // Busca a lista de cartas e os personagens
        const [cartas, dadosPersonagens] = await Promise.all([
            buscarDados("/api/v1/support"),
            buscarDados("/api/v1/character/info")
        ]);

        supportCards = cartas;
        personagens = dadosPersonagens;

        // Busca os detalhes individuais de cada carta
        const falhas = await carregarDetalhesCards(supportCards);

        renderizarSupportCards(supportCards);

        if (falhas > 0) {
            exibirMensagemCards(
                `${falhas} carta(s) não tiveram todos os detalhes carregados. Algumas informações podem estar indisponíveis.`,
                "warning"
            );
        }

    } catch (erro) {
        exibirMensagemCards(
            "Não foi possível carregar as Support Cards. Verifique sua conexão e tente novamente.",
            "danger"
        );

        const botaoTentar = document.createElement("button");
        botaoTentar.className = "btn btn-outline-danger mt-2";
        botaoTentar.textContent = "Tentar novamente";

        botaoTentar.addEventListener(
            "click",
            carregarSupportCards
        );

        mensagemCards.appendChild(botaoTentar);

        console.error("Erro ao carregar Support Cards:", erro);

    } finally {
        carregamentoCards.classList.add("d-none");
        botaoBuscaCards.disabled = false;
    }
}

// Pesquisa de Support Cards
formBuscaCards.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const pesquisa = campoBuscaCards.value.trim().toLowerCase();

    if (!pesquisa) {
        exibirMensagemCards(
            "Digite um título ou ID para pesquisar.",
            "warning"
        );
        return;
    }

    const resultado = supportCards.filter(card => {
        const personagem = buscarPersonagem(card.chara_id);

        return (
            card.title_en?.toLowerCase().includes(pesquisa) ||
            card.title?.toLowerCase().includes(pesquisa) ||
            personagem?.name_en?.toLowerCase().includes(pesquisa) ||
            card.rarity_string?.toLowerCase().includes(pesquisa) ||
            card.type?.toLowerCase().includes(pesquisa) ||
            String(card.id).includes(pesquisa) ||
            String(card.chara_id).includes(pesquisa)
        );
    });

    renderizarSupportCards(resultado);
});

// Carrega os dados ao abrir a página
carregarSupportCards();
