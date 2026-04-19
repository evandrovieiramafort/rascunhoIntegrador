import { carregarPagina } from "./infra/spa";
import { ErroViewEmDOM } from "./views/ErroViewEmDOM";

const appContainer = document.querySelector('#app') as HTMLElement;

async function rotearApp() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    // Função auxiliar para navegar via SPA
    const navegarParaHome = () => {
        window.history.pushState({}, '', '/');
        rotearApp();
    };

    if (path === '/' || path === '/index.html') {
        await carregarPagina(appContainer, '/pages/home.html');
        const { HomeViewEmDOM } = await import('./views/HomeViewEmDOM');
        const visao = new HomeViewEmDOM();
        
        const paginaInicial = parseInt(params.get('pagina') || '1', 10);
        await visao.iniciar(paginaInicial);

    } else if (path === '/detalhes') {
        await carregarPagina(appContainer, '/pages/detalhes.html');
        const { DetalheItemViewEmDOM } = await import('./views/DetalheViewEmDOM');
        const visao = new DetalheItemViewEmDOM();
        
        const idItem = parseInt(params.get('id') || '0', 10);
        idItem > 0 ? await visao.iniciar(idItem) : navegarParaHome();

    } else {
        // Uso da ErroView via DOM em vez de innerHTML
        const visaoErro = new ErroViewEmDOM();
        visaoErro.exibirPaginaNaoEncontrada(appContainer, navegarParaHome);
    }
}

window.addEventListener('popstate', rotearApp);
rotearApp();