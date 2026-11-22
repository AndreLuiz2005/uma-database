
const SKILLS_URL =
    "https://raw.githubusercontent.com/daftuyda/UmaTools/main/public/assets/skills_all.json";

const listaSkills = document.getElementById("listaSkills");
const carregamentoSkills = document.getElementById("carregamentoSkills");
const mensagemSkills = document.getElementById("mensagemSkills");

const formBuscaSkills = document.getElementById("formBuscaSkills");
const campoBuscaSkills = document.getElementById("campoBuscaSkills");
const botaoBuscaSkills = document.getElementById("botaoBuscaSkills");

let todasSkills = [];

async function buscarSkills() {
    carregamentoSkills.classList.remove("d-none");
    mensagemSkills.classList.add("d-none");
    listaSkills.innerHTML = "";
    botaoBuscaSkills.disabled = true;

    try {
        const resposta = await fetch(SKILLS_URL);

        if (!resposta.ok) {
            throw new Error(`HTTP ${resposta.status}`);
        }

        const dados = await resposta.json();

        if (!Array.isArray(dados)) {
            throw new Error("Invalid skills data.");
        }

        todasSkills = dados;

        exibirSkills(todasSkills);

    
    } catch (erro) {
        console.error("Erro ao carregar skills:", erro);

        mensagemSkills.innerHTML = "";
        mensagemSkills.textContent =
            "Não foi possível carregar as habilidades. Verifique sua conexão e tente novamente.";

        mensagemSkills.className = "alert alert-danger";

        const botaoTentar = document.createElement("button");
        botaoTentar.className = "btn btn-outline-danger mt-2";
        botaoTentar.textContent = "Tentar novamente";

        botaoTentar.addEventListener("click", buscarSkills);

        mensagemSkills.appendChild(botaoTentar);
    } finally {

        carregamentoSkills.classList.add("d-none");
        botaoBuscaSkills.disabled = false;
    }
}

function exibirSkills(skills) {
    listaSkills.innerHTML = "";

    if (skills.length === 0) {
        mensagemSkills.textContent = "No skills found.";
        mensagemSkills.className = "alert alert-warning";
        return;
    }

    mensagemSkills.classList.add("d-none");

    skills.forEach(skill => {
        const nome = skill.enname || skill.name_en || "Unknown skill";
        const id = skill.id ?? "N/A";
        const raridade = skill.rarity ?? "N/A";

        const descricao = skill.endesc || "Description unavailable.";
        const ativacao = skill.desc_en || "Activation information unavailable.";

        const custo = skill.gene_version?.cost;

        const personagem = Array.isArray(skill.char)
            ? skill.char.join(", ")
            : null;

        const isUltimate = raridade === 5;

        const coluna = document.createElement("div");
        coluna.className = "col-12 col-md-6 col-xl-4";

        const card = document.createElement("article");
        card.className = "card h-100 shadow-sm";

        const corpo = document.createElement("div");
        corpo.className = "card-body";

        const titulo = document.createElement("h5");
        titulo.className = "card-title";
        titulo.textContent = nome;

        const identificador = document.createElement("small");
        identificador.className = "text-muted d-block mb-3";
        identificador.textContent = `ID: ${id}`;

        const imagemPlaceholder = document.createElement("img");
        imagemPlaceholder.className = "skill-icon mb-3";
        imagemPlaceholder.alt = `Skill icon - ${nome}`;

        if (skill.iconid) {
            imagemPlaceholder.src =
                `https://mihonostudios.com/img/skill-icons/${skill.iconid}.webp`;

            imagemPlaceholder.onerror = () => {
                imagemPlaceholder.alt = "Skill icon unavailable";
                imagemPlaceholder.classList.add("skill-icon-error");
            };
        } else {
            imagemPlaceholder.alt = "Skill icon unavailable";
            imagemPlaceholder.classList.add("skill-icon-error");
        }

        const informacoes = document.createElement("div");
        informacoes.className = "d-flex flex-wrap gap-2 mb-3";

        const categoria = document.createElement("span");
        categoria.className = "badge text-bg-secondary";
        categoria.textContent = "Category pending";

        const badgeRaridade = document.createElement("span");
        badgeRaridade.className = "badge text-bg-dark";
        badgeRaridade.textContent = isUltimate
            ? `Ultimate · Rarity ${raridade}`
            : `Rarity ${raridade}`;

        informacoes.append(categoria, badgeRaridade);

        const tituloDescricao = document.createElement("h6");
        tituloDescricao.textContent = "In-game description";

        const textoDescricao = document.createElement("p");
        textoDescricao.textContent = descricao;

        const tituloAtivacao = document.createElement("h6");
        tituloAtivacao.textContent = "Activation conditions";

        const textoAtivacao = document.createElement("p");
        textoAtivacao.textContent = ativacao;

        const custoTexto = document.createElement("p");
        custoTexto.className = "mb-1";
        custoTexto.textContent = custo !== undefined
            ? `Skill Points: ${custo}`
            : "Skill Points: unavailable";

        corpo.append(
            titulo,
            identificador,
            imagemPlaceholder
        );

        if (isUltimate && personagem) {
            const personagemTexto = document.createElement("p");
            personagemTexto.className = "text-muted";
            personagemTexto.textContent =
                `Character ID: ${personagem}`;

            corpo.appendChild(personagemTexto);
        }

        corpo.append(
            informacoes,
            tituloDescricao,
            textoDescricao,
            tituloAtivacao,
            textoAtivacao,
            custoTexto
        );

        card.appendChild(corpo);
        coluna.appendChild(card);
        listaSkills.appendChild(coluna);
    });
}

formBuscaSkills.addEventListener("submit", evento => {
    evento.preventDefault();

    const pesquisa = campoBuscaSkills.value.trim().toLowerCase();

    if (!pesquisa) {
        exibirSkills(todasSkills);
        return;
    }

    const resultado = todasSkills.filter(skill => {
        const nome = skill.enname || skill.name_en || "";

        return nome.toLowerCase().includes(pesquisa) ||
            String(skill.id).includes(pesquisa);
    });

    exibirSkills(resultado);
});

buscarSkills();
