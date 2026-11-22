# Uma Database

## Sobre o projeto

Uma Database é uma aplicação web desenvolvida para consultar e explorar informações relacionadas ao jogo Uma Musume: Pretty Derby.

A aplicação permite visualizar personagens, cartas de suporte, habilidades e notícias, consumindo dados de APIs públicas.

## Integrantes

- Nome: [SEU NOME COMPLETO]
- Matrícula: [SUA MATRÍCULA]

## Links

- **Aplicação publicada:** [LINK DO GITHUB PAGES]
- **Repositório:** [LINK DO GITHUB]

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
| GET | `https://umapyoi.net/api/v1/support` | Consultar as cartas de suporte. |
| GET | `https://umapyoi.net/api/v1/support/{support_id}` | Consultar detalhes individuais das cartas de suporte. |
| GET | `https://umapyoi.net/api/v1/news/latest/10` | Consultar as notícias mais recentes. |
| GET | `https://raw.githubusercontent.com/daftuyda/UmaTools/main/public/assets/skills_all.json` | Consultar os dados das habilidades. |

## Funcionalidades

- Consulta e pesquisa de personagens.
- Listagem e consulta de cartas de suporte.
- Visualização das habilidades e suas descrições.
- Consulta de notícias relacionadas ao jogo.
- Pesquisa por nome ou identificador.
- Exibição de mensagens de erro e carregamento.
- Interface responsiva para dispositivos móveis, tablets e computadores.

## Estrutura do projeto

```text
projeto/
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

Foi utilizado o Bootstrap 5.3.3 para construção do layout, componentes e responsividade da aplicação.

## Vídeo de demonstração

[INSERIR LINK DO VÍDEO DE DEMONSTRAÇÃO]
