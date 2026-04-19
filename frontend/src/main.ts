import { carregarPagina } from "./infra/spa";

const appContainer = document.querySelector('#app') as HTMLElement;

async function rotearApp() {
    const path = window.location.pathname;

    if (path === '/') {
        await carregarPagina(appContainer, '/pages/home.html');
        
        const { HomeView } = await import('./views/HomeView');
        const visao = new HomeView();
        
        const params = new URLSearchParams(window.location.search);
        const paginaInicial = parseInt(params.get('pagina') || '1', 10);
        
        await visao.iniciar(paginaInicial);
    } else {
        appContainer.innerHTML = `
            <div class="text-center mt-5">
                <h1 class="display-1 fw-bold">404</h1>
                <p class="fs-3"> <span class="text-danger">Ops!</span> Página não encontrada.</p>
                <p class="lead">O endereço que você procura não existe no sistema.</p>
                <a href="/" class="btn btn-primary">Voltar para o início</a>
            </div>
        `;
    }
}

window.addEventListener('popstate', rotearApp);

rotearApp();