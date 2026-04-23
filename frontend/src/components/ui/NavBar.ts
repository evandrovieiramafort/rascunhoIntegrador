import { htmlParaElemento } from "../../utils/UtilDOM";
import { navegarPara } from "../../utils/Navegacao";

export function NavBar(): HTMLElement {
  const nav = htmlParaElemento(`
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
      <div class="container d-flex justify-content-between">
        <a class="navbar-brand" href="/" data-link="/">Mercado Cefet</a>
        
        <div class="d-flex align-items-center">
            <a href="/carrinho" class="btn btn-outline-light position-relative" data-link="/carrinho">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              <span id="badge-carrinho" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none">
                0
              </span>
            </a>
        </div>
      </div>
    </nav>
  `);

  const links = nav.querySelectorAll('[data-link]');
  links.forEach(link => {
    (link as HTMLElement).onclick = (e) => {
      e.preventDefault();
      const rota = link.getAttribute('data-link');
      if (rota) navegarPara(rota);
    };
  });

  return nav;
}