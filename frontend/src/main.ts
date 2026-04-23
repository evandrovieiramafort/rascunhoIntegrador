import { carregarPagina } from './infra/spa';
import { CarrinhoService } from './services/CarrinhoService';
import { NavBar } from './components/ui/NavBar';
import { navegarPara } from './utils/Navegacao';

const appContainer = document.querySelector('#app') as HTMLElement;
const headerContainer = document.querySelector('#header-container') as HTMLElement;

const servicoCarrinho = new CarrinhoService();

headerContainer.appendChild(NavBar());

servicoCarrinho.atualizarBadgeNav();

async function rotearApp() {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  await servicoCarrinho.atualizarBadgeNav();

  if (path === '/') {
    await carregarPagina(appContainer, '/pages/home.html');
    const { HomeView } = await import('./views/HomeView');
    const visao = new HomeView();

    const paginaInicial = parseInt(params.get('pagina') || '1');
    await visao.iniciar(paginaInicial);
  } else if (path === '/detalhes') {
    await carregarPagina(appContainer, '/pages/detalhes.html');
    const { DetalheItemView } = await import('./views/DetalheItemView');
    const visao = new DetalheItemView();

    const idItem = parseInt(params.get('id') || '0');
    idItem > 0 ? await visao.iniciar(idItem) : navegarPara('/');
  } else if (path === '/carrinho') {
    await carregarPagina(appContainer, '/pages/carrinho.html');
    const { CarrinhoView } = await import('./views/CarrinhoView');
    const visao = new CarrinhoView();

    await visao.iniciar();
  } else {
    const { Pagina404 } = await import('./components/404/Pagina404');
    const { limparFilhos } = await import('./utils/UtilDOM');
    
    limparFilhos(appContainer);
    appContainer.appendChild(Pagina404(() => navegarPara('/')));
  }
}

window.addEventListener('popstate', rotearApp);

rotearApp();