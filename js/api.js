const API_BASE_URL = "https://umapyoi.net";

async function buscarDados(endpoint) {
    const resposta = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    return await resposta.json();
}
