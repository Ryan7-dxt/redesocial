
const API = "http://localhost/redesocial/back/api.php";

let usuarioLogado = JSON.parse(localStorage.getItem("usuario")) || null;

// ELEMENTOS DAS TELAS
const telaLogin = document.getElementById("telaLogin");
const telaCadastro = document.getElementById("telaCadastro");
const telaFeed = document.getElementById("telaFeed");

// TROCAR ENTRE LOGIN E CADASTRO
document.getElementById("irCadastro").addEventListener("click", function(e) {
    e.preventDefault();
    telaLogin.classList.add("escondido");
    telaCadastro.classList.remove("escondido");
});

document.getElementById("irLogin").addEventListener("click", function(e) {
    e.preventDefault();
    telaCadastro.classList.add("escondido");
    telaLogin.classList.remove("escondido");
});

// MOSTRAR FEED
function mostrarFeed() {
    telaLogin.classList.add("escondido");
    telaCadastro.classList.add("escondido");
    telaFeed.classList.remove("escondido");

    carregarPublicacoes();
}

// CADASTRAR USUARIO
document.getElementById("formCadastro").addEventListener("submit", async function(e) {
    e.preventDefault();

    const dados = {
        nome: document.getElementById("nome").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senhaCadastro").value
    };

    try {
        const resposta = await fetch(API + "?rota=usuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Não foi possível cadastrar.");
        }

        alert("Conta criada com sucesso! Agora faça seu login.");

        document.getElementById("formCadastro").reset();
        telaCadastro.classList.add("escondido");
        telaLogin.classList.remove("escondido");

    } catch (erro) {
        document.getElementById("mensagemCadastro").textContent = erro.message;
    }
});

// FAZER LOGIN
document.getElementById("formLogin").addEventListener("submit", async function(e) {
    e.preventDefault();

    const dados = {
        login: document.getElementById("login").value,
        senha: document.getElementById("senhaLogin").value
    };

    try {
        const resposta = await fetch(API + "?rota=login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao entrar.");
        }

        usuarioLogado = resultado.usuario;
        localStorage.setItem("usuario", JSON.stringify(usuarioLogado));

        document.getElementById("formLogin").reset();
        document.getElementById("mensagemLogin").textContent = "";

        mostrarFeed();

    } catch (erro) {
        document.getElementById("mensagemLogin").textContent = erro.message;
    }
});

// CARREGAR PUBLICACOES
async function carregarPublicacoes() {
    const lista = document.getElementById("listaPublicacoes");
    lista.innerHTML = "<p>Carregando publicações...</p>";

    try {
        const resposta = await fetch(API + "?rota=publicacao");
        const publicacoes = await resposta.json();

        if (!resposta.ok) {
            throw new Error("Erro ao carregar publicações.");
        }

        const respostaCurtidas = await fetch(API + "?rota=curtida");
        const curtidas = await respostaCurtidas.json();

        lista.innerHTML = "";

        if (publicacoes.length === 0) {
            lista.innerHTML = "<p>Ainda não existem publicações.</p>";
            return;
        }

        publicacoes.reverse().forEach(function(publicacao) {
            const totalCurtidas = curtidas.filter(function(curtida) {
                return curtida.id_publicacao == publicacao.id_publicacao;
            }).length;

            const card = document.createElement("div");
            card.className = "publicacao";

            const topo = document.createElement("div");
            topo.className = "publicacao-topo";

            const avatar = document.createElement("div");
            avatar.className = "avatar";
            avatar.textContent = "U" + publicacao.id_usuario;

            const usuario = document.createElement("div");
            const nome = document.createElement("h3");
            nome.textContent = "Usuário #" + publicacao.id_usuario;

            const data = document.createElement("small");
            data.textContent = publicacao.data_publicacao || "";

            usuario.appendChild(nome);
            usuario.appendChild(data);
            topo.appendChild(avatar);
            topo.appendChild(usuario);

            const texto = document.createElement("p");
            texto.textContent = publicacao.legenda;

            card.appendChild(topo);
            card.appendChild(texto);

            if (publicacao.imagem_url) {
                const imagem = document.createElement("img");
                imagem.className = "imagem-publicacao";
                imagem.src = publicacao.imagem_url;
                imagem.alt = "Imagem da publicação";

                imagem.onerror = function() {
                    imagem.style.display = "none";
                };

                card.appendChild(imagem);
            }

            const botao = document.createElement("button");
            botao.className = "botao-curtir";
            botao.textContent = "♥ Curtir (" + totalCurtidas + ")";

            botao.addEventListener("click", function() {
                curtirPublicacao(publicacao.id_publicacao);
            });

            card.appendChild(botao);
            lista.appendChild(card);
        });

    } catch (erro) {
        lista.innerHTML = "<p>Não foi possível carregar o feed. Verifique o backend.</p>";
    }
}

// CRIAR PUBLICACAO
document.getElementById("formPost").addEventListener("submit", async function(e) {
    e.preventDefault();

    const dados = {
        id_usuario: usuarioLogado.id_usuario,
        legenda: document.getElementById("legenda").value,
        imagem_url: document.getElementById("imagemUrl").value
    };

    try {
        const resposta = await fetch(API + "?rota=publicacao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao publicar.");
        }

        document.getElementById("formPost").reset();
        document.getElementById("mensagemPost").textContent = "Publicação criada com sucesso!";

        carregarPublicacoes();

    } catch (erro) {
        document.getElementById("mensagemPost").textContent = erro.message;
    }
});

// CURTIR PUBLICACAO
async function curtirPublicacao(idPublicacao) {
    const dados = {
        id_usuario: usuarioLogado.id_usuario,
        id_publicacao: idPublicacao
    };

    try {
        const resposta = await fetch(API + "?rota=curtida", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Não foi possível curtir.");
        }

        carregarPublicacoes();

    } catch (erro) {
        alert(erro.message);
    }
}

// SAIR DA CONTA
document.getElementById("sair").addEventListener("click", function() {
    localStorage.removeItem("usuario");
    usuarioLogado = null;

    telaFeed.classList.add("escondido");
    telaLogin.classList.remove("escondido");
});

// MANTER LOGIN AO ATUALIZAR A PAGINA
if (usuarioLogado) {
    mostrarFeed();
}
