
const listaNews = document.getElementById("listaNews");
const carregamentoNews = document.getElementById("carregamentoNews");
const mensagemNews = document.getElementById("mensagemNews");

const formBuscaNews = document.getElementById("formBuscaNews");
const campoBuscaNews = document.getElementById("campoBuscaNews");
const botaoBuscaNews = document.getElementById("botaoBuscaNews");

let noticias = [];

// Exibe mensagens na página
function exibirMensagemNews(texto, tipo = "info") {
    mensagemNews.innerHTML = "";

    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = texto;

    mensagemNews.appendChild(alerta);
}

// Remove elementos e atributos potencialmente perigosos do HTML
function sanitizarHTML(html) {
    const modelo = document.createElement("template");

    modelo.innerHTML = html || "";

    modelo.content.querySelectorAll(
        "script, iframe, object, embed, form"
    ).forEach(elemento => elemento.remove());

    modelo.content.querySelectorAll("*").forEach(elemento => {
        Array.from(elemento.attributes).forEach(atributo => {
            const nome = atributo.name.toLowerCase();
            const valor = atributo.value.trim().toLowerCase();

            if (
                nome.startsWith("on") ||
                (
                    ["href", "src", "xlink:href"].includes(nome) &&
                    valor.startsWith("javascript:")
                )
            ) {
                elemento.removeAttribute(atributo.name);
            }
        });
    });

    return modelo.innerHTML;
}

// Extrai o título do conteúdo da notícia
function extrairTitulo(html) {
    const modelo = document.createElement("div");

    modelo.innerHTML = sanitizarHTML(html);

    const titulo = modelo.querySelector("h1, h2, h3");

    if (titulo && titulo.textContent.trim()) {
        return titulo.textContent.trim();
    }

    return "Notícia de Uma Musume";
}

// Cria o card de uma notícia
function criarCardNews(noticia) {
    const coluna = document.createElement("div");
    coluna.className = "col-12 col-md-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "card h-100 shadow-sm";

    // Imagem da notícia
    const imagemUrl = noticia.article_image || noticia.image;

    if (imagemUrl) {
        const imagem = document.createElement("img");

        imagem.src = imagemUrl;
        imagem.alt = "Imagem da notícia";
        imagem.className = "card-img-top";
        imagem.style.width = "100%";
        imagem.style.height = "220px";
        imagem.style.objectFit = "contain";
        imagem.loading = "lazy";

        imagem.onerror = () => imagem.remove();

        card.appendChild(imagem);
    }

    const corpo = document.createElement("div");
    corpo.className = "card-body";

    // Categoria
    const categoria = document.createElement("span");
    categoria.className = "badge text-bg-primary mb-2";
    categoria.textContent = noticia.label_name || "Notícia";

    // Título
    const titulo = document.createElement("h5");
    titulo.className = "card-title";
    titulo.textContent = extrairTitulo(noticia.message);

    // Conteúdo da notícia
    const conteudo = document.createElement("div");
    conteudo.className = "card-text news-conteudo";

    conteudo.innerHTML = sanitizarHTML(noticia.message);

    // Identificador
    const identificador = document.createElement("small");
    identificador.className = "text-secondary d-block mt-3";
    identificador.textContent = `ID da notícia: ${noticia.id}`;

    corpo.append(
        categoria,
        titulo,
        conteudo,
        identificador
    );

    card.appendChild(corpo);
    coluna.appendChild(card);

    return coluna;
}

// Renderiza as notícias
function renderizarNews(lista) {
    listaNews.innerHTML = "";
    mensagemNews.innerHTML = "";

    if (lista.length === 0) {
        exibirMensagemNews(
            "Nenhuma notícia encontrada.",
            "warning"
        );
        return;
    }

    lista.forEach(noticia => {
        listaNews.appendChild(criarCardNews(noticia));
    });
}

// Busca as notícias na API
async function carregarNews() {
    carregamentoNews.classList.remove("d-none");

    listaNews.innerHTML = "";
    mensagemNews.innerHTML = "";

    botaoBuscaNews.disabled = true;

    try {
        noticias = await buscarDados("/api/v1/news/latest/10");

        if (!Array.isArray(noticias)) {
            throw new Error("Formato de resposta inesperado.");
        }

        renderizarNews(noticias);

    } catch (erro) {
        exibirMensagemNews(
            "Não foi possível carregar as notícias. Verifique sua conexão e tente novamente.",
            "danger"
        );

        const botaoTentar = document.createElement("button");

        botaoTentar.className = "btn btn-outline-danger mt-2";
        botaoTentar.textContent = "Tentar novamente";

        botaoTentar.addEventListener("click", carregarNews);

        mensagemNews.appendChild(botaoTentar);

        console.error("Erro ao carregar notícias:", erro);

    } finally {
        carregamentoNews.classList.add("d-none");
        botaoBuscaNews.disabled = false;
    }
}

// Pesquisa de notícias
formBuscaNews.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const pesquisa = campoBuscaNews.value.trim().toLowerCase();

    if (!pesquisa) {
        exibirMensagemNews(
            "Digite um termo para pesquisar.",
            "warning"
        );
        return;
    }

    const resultado = noticias.filter(noticia => {
        const titulo = extrairTitulo(noticia.message);

        const conteudo = document.createElement("div");
        conteudo.innerHTML = sanitizarHTML(noticia.message);

        const texto = conteudo.textContent.toLowerCase();

        return (
            titulo.toLowerCase().includes(pesquisa) ||
            texto.includes(pesquisa) ||
            noticia.label_name?.toLowerCase().includes(pesquisa) ||
            String(noticia.id).includes(pesquisa)
        );
    });

    renderizarNews(resultado);
});

// Carrega as notícias ao abrir a página
carregarNews();
