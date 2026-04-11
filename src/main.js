// src/main.js

/* =========================================
   LÓGICA DE PAGINAÇÃO (Tela Inicial)
   ========================================= */
const itensPorPagina = 6;
let paginaAtual = 1;
let totalPaginas = 1;

// Inicializa a paginação assim que o HTML carregar
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos na tela inicial checando se a classe existe
    const vitrine = document.querySelector('.products-grid');
    if (vitrine) {
        configurarPaginacao();
    }
});

function configurarPaginacao() {
    const itens = document.querySelectorAll('.item-paginado');
    const totalItens = itens.length; // Aqui será 13
    
    // Calcula o total de páginas (13 / 6 = 2.16 -> arredonda para cima: 3 páginas)
    totalPaginas = Math.ceil(totalItens / itensPorPagina);
    
    renderizarPagina(paginaAtual);
}

function renderizarPagina(pagina) {
    const itens = document.querySelectorAll('.item-paginado');
    
    // Calcula o índice de início e fim
    // Ex: Página 1 -> inicio: 0, fim: 6
    // Ex: Página 2 -> inicio: 6, fim: 12
    const indiceInicio = (pagina - 1) * itensPorPagina;
    const indiceFim = indiceInicio + itensPorPagina;

    // Mostra apenas os itens da página atual
    itens.forEach((item, index) => {
        if (index >= indiceInicio && index < indiceFim) {
            item.style.display = ''; // Volta ao padrão do CSS Grid
        } else {
            item.style.display = 'none'; // Esconde
        }
    });

    // Atualiza o texto "Página X de Y"
    const infoSpan = document.getElementById('page-info');
    if(infoSpan) infoSpan.innerText = `Página ${pagina} de ${totalPaginas}`;

    // Desabilita botões se estiver na primeira ou última página
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    if(btnPrev) btnPrev.disabled = pagina === 1;
    if(btnNext) btnNext.disabled = pagina === totalPaginas;
}

function mudarPagina(direcao) {
    paginaAtual += direcao;
    
    // Garante que não passe dos limites
    if (paginaAtual < 1) paginaAtual = 1;
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    renderizarPagina(paginaAtual);
    
    // Rola a tela suavemente para o topo da vitrine
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* =========================================
   LÓGICA DO CARRINHO (Simulação Básica)
   ========================================= */
let itensNoCarrinho = 0;

function adicionarAoCarrinho(event) {
    event.preventDefault(); 
    
    itensNoCarrinho++;
    atualizarBadge();
    alert("Item adicionado ao carrinho!");
    
    // A especificação diz: "A opção 'Adicionar ao Carrinho' deve adicionar o item e finalizar a exibição da tela de detalhes"
    window.location.href = "index.html"; 
}

function removerDoCarrinho(event) {
    event.preventDefault(); 
    
    const confirmacao = confirm("Deseja mesmo remover este item do carrinho?");
    if (confirmacao) {
        const itemParaRemover = event.target.closest('.cart-item');
        if (itemParaRemover) itemParaRemover.remove();
        
        if (itensNoCarrinho > 0) itensNoCarrinho--;
        atualizarBadge();
        alert("Item removido!");
    }
}

function atualizarBadge() {
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.innerText = itensNoCarrinho;
        if (itensNoCarrinho === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'inline-block';
        }
    });
}


/* =========================================
   LÓGICA DE LOGIN (Mockado)
   ========================================= */

// Banco de dados chumbado na memória para testes
const usuariosMock = [
    { 
        matricula: '2026101', 
        email: 'aluno@cefet.br', 
        senha: '123', 
        saldo: 150.00 
    }
];

function realizarLogin(event) {
    event.preventDefault(); // Impede a página de recarregar
    
    const loginInput = document.getElementById('campo-login').value;
    const senhaInput = document.getElementById('campo-senha').value;
    const errorBox = document.getElementById('login-error');

    // Procura o usuário que bata com a matrícula OU email, E com a senha
    const usuarioLogado = usuariosMock.find(u => 
        (u.matricula === loginInput || u.email === loginInput) && u.senha === senhaInput
    );

    if (usuarioLogado) {
        // Guarda na sessão temporária do navegador
        sessionStorage.setItem('usuarioAtivo', JSON.stringify(usuarioLogado));
        
        // A especificação diz: "Ao concluir o login, o usuário deve ser redirecionado ao Carrinho de Compras"
        window.location.href = "carrinho.html";
    } else {
        // Mostra o erro na tela
        errorBox.style.display = 'block';
        errorBox.innerText = 'Matrícula/E-mail ou senha incorretos.';
    }
}

// Modificando a lógica de checkout do carrinho
function tentarFinalizarCompra(event) {
    event.preventDefault();
    
    // Verifica se existe alguém logado na sessão
    const usuarioAtivo = sessionStorage.getItem('usuarioAtivo');

    if (!usuarioAtivo) {
        // Se não estiver logado, vai pro login
        alert("Você precisa estar logado para finalizar a compra.");
        window.location.href = "login.html";
    } else {
        // Se estiver logado, prossegue com a compra
        const user = JSON.parse(usuarioAtivo);
        alert(`Processando compra... Seu saldo atual é de C$ ${user.saldo.toFixed(2)}.`);
        
        // Aqui entraria a validação de saldo e estoque exigida na especificação
        alert("Compra finalizada com sucesso! Número do pedido: #9932.");
        
        // Limpa o carrinho e volta pra home
        itensNoCarrinho = 0;
        atualizarBadge();
        window.location.href = "index.html";
    }
}