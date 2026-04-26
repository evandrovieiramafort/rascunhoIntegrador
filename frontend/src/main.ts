import { carregarPagina } from './infra/spa';
import { CarrinhoService } from './services/CarrinhoService';
import { NavBar } from './components/ui/NavBar';
import { navegarPara } from './utils/Navegacao';

// pega o id #app, onde a aplicação vai ficar
const appContainer = document.querySelector('#app') as HTMLElement; 

// pega o id #header-container onde as infos do header estão
const headerContainer = document.querySelector('#header-container') as HTMLElement; 

// instancia o carrinho para poder chamar o atualizarBadgeNav
const servicoCarrinho = new CarrinhoService();

// adiciona o container da barra de navegação no header
headerContainer.appendChild(NavBar());

// chama o carrinho para obter o carrinho da session
servicoCarrinho.atualizarBadgeNav();

async function rotearApp() {
  const path = window.location.pathname; // pega a rota
  
  // pega os parâmetros de busca (query parameters, especificamente) da url
  const params = new URLSearchParams(window.location.search); 
  await servicoCarrinho.atualizarBadgeNav(); // faz a chamada para atualizar o ícone do carrinho na navegação

  if (path === '/') {
    await carregarPagina(appContainer, '/pages/home.html'); // passa a #app pra ter os elementos da página injetados nela
    const { HomeView } = await import('./views/HomeView'); // faz o import dinâmico da visão da home
    const visao = new HomeView(); // instancia a visão da home

    // busca o query parameter "pagina" na url; se tiver nada, passa "1" pra variável
    const paginaInicial = parseInt(params.get('pagina') || '1');
    
    await visao.iniciar(paginaInicial); // chama o iniciar da visão da home (a partir daqui, vamos pra visão)



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
    const { Pagina404 } = await import('./components/404/404');
    const { limparFilhos } = await import('./utils/UtilDOM');
    
    limparFilhos(appContainer);
    appContainer.appendChild(Pagina404(() => navegarPara('/')));
  }
}

/* Garante que o "voltar" do navegador funcione, disparando o rotearApp quando isso acontecer */
window.addEventListener('popstate', rotearApp);

// executa o roteamento 
rotearApp();