# Uma Database

## Sobre o projeto

Uma Database é uma aplicação web desenvolvida para consultar e explorar informações relacionadas ao jogo Uma Musume: Pretty Derby.

A aplicação permite visualizar personagens, cartas de suporte, habilidades e notícias em inglês, utilizando APIs públicas e recursos de dados externos.

## Integrante

- **Nome:** André Luiz de Oliveira Ataide
- **Matrícula:** 202511918

## Links

- **Aplicação publicada (GitHub Pages):** https://andreluiz2005.github.io/uma-database/
- **Repositório:** https://github.com/AndreLuiz2005/uma-database

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript puro (Vanilla JavaScript)
- Bootstrap 5.3.3
- Fetch API

## APIs e endpoints utilizados

| Método | API / Endpoint | Finalidade |
|---|---|---|
| GET | `https://umapyoi.net/api/v1/character/info` | Consultar informações dos personagens. |
| GET | `https://umapyoi.net/api/v1/support` | Consultar a lista de cartas de suporte. |
| GET | `https://umapyoi.net/api/v1/support/{support_id}` | Consultar detalhes individuais das cartas de suporte. |
| GET | `https://umapyoi.net/api/v1/en/news/latest/10/0` | Consultar as 10 notícias mais recentes em inglês. |
| GET | `https://raw.githubusercontent.com/daftuyda/UmaTools/main/public/assets/skills_all.json` | Consultar os dados das habilidades, incluindo nomes, descrições e identificadores. |

## Funcionalidades

- Consulta e pesquisa de personagens.
- Listagem e consulta de cartas de suporte.
- Visualização das habilidades e suas descrições.
- Consulta de notícias em inglês relacionadas ao jogo.
- Pesquisa por nome ou identificador.
- Exibição de mensagens de erro e indicadores de carregamento.
- Interface responsiva para dispositivos móveis, tablets e computadores.

## Estrutura do projeto

```text
uma-database/
├── css/
│   └── style.css
├── js/
│   ├── api.js
│   ├── characters.js
│   ├── news.js
│   ├── skills.js
│   └── support-cards.js
├── pages/
│   ├── characters.html
│   ├── news.html
│   ├── skills.html
│   └── support-cards.html
├── index.html
└── README.md
```

## Framework CSS

Foi utilizado o **Bootstrap 5.3.3** para a construção do layout, utilização de componentes e organização da interface por meio do sistema de grid, além dos recursos de responsividade.
