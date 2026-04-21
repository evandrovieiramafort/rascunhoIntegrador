import { carregarPagina } from "./infra/spa";
import { CarrinhoService } from "./services/CarrinhoService";

const appContainer = document.querySelector('#app') as HTMLElement;
const servicoCarrinho = new CarrinhoService();

async function rotearApp() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    const navegarParaHome = () => {
        window.history.pushState({}, '', '/');
        rotearApp();
    };

    await servicoCarrinho.atualizarBadgeNav();

    if (path === '/' || path === '/index.html') {
        await carregarPagina(appContainer, '/pages/home.html');
        const { HomeViewEmDOM } = await import('./views/HomeViewEmDOM');
        const visao = new HomeViewEmDOM();
        
        const paginaInicial = parseInt(params.get('pagina') || '1', 10);
        await visao.iniciar(paginaInicial);

    } else if (path === '/detalhes') {
        await carregarPagina(appContainer, '/pages/detalhes.html');
        const { DetalheItemViewEmDOM } = await import('./views/DetalheItemViewEmDOM');
        const visao = new DetalheItemViewEmDOM();
        
        const idItem = parseInt(params.get('id') || '0', 10);
        idItem > 0 ? await visao.iniciar(idItem) : navegarParaHome();

    } else if (path === '/carrinho') {
        await carregarPagina(appContainer, '/pages/carrinho.html');
        const { CarrinhoViewEmDOM } = await import('./views/CarrinhoViewEmDOM');
        const visao = new CarrinhoViewEmDOM();
        
        await visao.iniciar();

    } else {
        const { HomeViewEmDOM } = await import('./views/HomeViewEmDOM');
        const visaoErro = new HomeViewEmDOM();
        visaoErro.exibir404(appContainer);
    }
}

window.addEventListener('popstate', rotearApp);
rotearApp();