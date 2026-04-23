import { htmlParaElemento } from "../../utils/UtilDOM";

export function Pagina404(aoVoltar: () => void): HTMLElement {
  const elemento = htmlParaElemento(`
    <div class="text-center mt-5">
      <h1 class="display-1 fw-bold">404</h1>
      <p class="fs-3">
        <span class="text-danger">Ops! </span>Página não encontrada.
      </p>
      <p class="lead">O endereço que você procura não existe no sistema Cefet Shop.</p>
      <button class="btn btn-primary">Voltar para o início</button>
    </div>
  `);

  const btnVoltar = elemento.querySelector('button') as HTMLButtonElement;
  btnVoltar.onclick = (e) => {
    e.preventDefault();
    aoVoltar();
  };

  return elemento;
}