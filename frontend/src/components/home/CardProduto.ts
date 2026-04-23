import { htmlParaElemento } from "../../utils/UtilDOM";
import { Badge, PrecoArea } from "../ui/UIComponents";
import type { ItemDTO } from "../../domain/ItemDTO";

export function CardProduto(item: ItemDTO, aoClicarDetalhes: (id: number) => void): HTMLElement {
  const elemento = htmlParaElemento(`
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm position-relative">
        <div data-badges></div>
        <img class="card-img-top" style="height: 200px; object-fit: cover; cursor: pointer;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title"></h5>
          <p class="card-text text-muted small flex-grow-1"></p>
          <div data-area-preco class="mt-2"></div>
        </div>
        <div class="card-footer bg-transparent border-top-0 pb-3">
          <button class="btn btn-primary w-100" data-btn-acao></button>
        </div>
      </div>
    </div>
  `);

  const img = elemento.querySelector("img")!;
  img.src = item.foto;
  img.alt = item.descricao;
  img.onclick = () => aoClicarDetalhes(item.id);

  elemento.querySelector("h5")!.textContent = item.descricao;
  elemento.querySelector("p")!.textContent = item.descricaoDetalhada;

  const btnAcao = elemento.querySelector("[data-btn-acao]") as HTMLButtonElement;
  btnAcao.textContent = item.estaEsgotado ? "Sem estoque" : "Detalhes";
  btnAcao.disabled = item.estaEsgotado;
  if (!item.estaEsgotado) {
    btnAcao.onclick = () => aoClicarDetalhes(item.id);
  }

  elemento.querySelector("[data-area-preco]")!.appendChild(PrecoArea(item.precoVenda, item.precoFinal, item.percentualDesconto));

  const areaBadges = elemento.querySelector("[data-badges]")!;
  if (item.estaEsgotado) {
    areaBadges.appendChild(Badge("Esgotado", "danger", "position-absolute top-0 end-0 m-2 z-1"));
  }
  if (item.percentualDesconto > 0) {
    areaBadges.appendChild(Badge(`-${item.percentualDesconto}%`, "success", "position-absolute top-0 start-0 m-2 z-1"));
  }

  return elemento;
}