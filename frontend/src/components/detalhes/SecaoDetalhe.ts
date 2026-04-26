import { htmlParaElemento } from "../../utils/UtilDOM";
import { PrecoArea, SeletorQuantidade } from "../ui/UIComponents"; 
import type { ItemDTO } from "../../domain/ItemDTO";

export function SecaoDetalhe(
  item: ItemDTO, 
  quantidadeNoCarrinho: number, 
  aoAdicionar: (qtd: number) => void, 
  irParaCarrinho: () => void
): HTMLElement {
  const container = htmlParaElemento(`
    <div class="row g-5 align-items-center">
      <div class="col-md-6">
        <img class="img-fluid rounded-4 shadow-sm">
      </div>
      <div class="col-md-6">
        <h2 class="fw-bold mb-1" data-titulo></h2>
        <p class="text-muted small mb-3" data-lancamento></p>
        <p class="lead fs-6 mb-4" data-desc-longa></p>
        
        <div class="mb-4 p-4 bg-light rounded-3 border-start border-primary border-4">
           <div data-area-preco></div>
           <p class="small text-muted mt-2 mb-0" data-estoque-total></p>
        </div>

        <div data-area-acoes></div>
        <button class="btn btn-outline-secondary btn-lg w-100 mt-2" data-btn-carrinho>Ir para o Carrinho</button>
      </div>
    </div>
  `);

  const img = container.querySelector("img")!;
  img.src = item.foto;
  img.alt = item.descricao;

  container.querySelector("[data-titulo]")!.textContent = item.descricao;
  container.querySelector("[data-lancamento]")!.textContent = `Lançamento: ${item.periodoLancamento}`;
  container.querySelector("[data-desc-longa]")!.textContent = item.descricaoDetalhada;
  container.querySelector("[data-estoque-total]")!.textContent = `Estoque total: ${item.quantidadeEstoque} unidades`;
  
  container.querySelector("[data-area-preco]")!.appendChild(PrecoArea(item.precoVenda, item.precoFinal, item.percentualDesconto));

  const areaAcoes = container.querySelector("[data-area-acoes]")!;
  const limiteAbsoluto = Math.min(10, item.quantidadeEstoque);
  const disponivelParaAdicionar = limiteAbsoluto - quantidadeNoCarrinho;

  if (disponivelParaAdicionar <= 0) {
    const msg = htmlParaElemento(`<h3 class="text-danger fw-bold my-4"></h3>`);
    msg.textContent = item.quantidadeEstoque > 0 ? "Limite de 10 unidades atingido" : "Esgotado";
    areaAcoes.appendChild(msg);
  } else {
    areaAcoes.appendChild(htmlParaElemento(`<label class="form-label fw-bold d-block mb-2">Quantidade:</label>`));

    const seletorDom = SeletorQuantidade(1, disponivelParaAdicionar, "100px");
    areaAcoes.appendChild(seletorDom);

    const btnAdd = htmlParaElemento(`<button id="btn-adicionar" class="btn btn-primary btn-lg w-100 py-3 fw-bold shadow-sm mb-3 mt-3">Adicionar ao Carrinho</button>`);
    btnAdd.onclick = () => {
      const inputVal = (seletorDom as HTMLSelectElement).value;
      aoAdicionar(parseInt(inputVal));
    };
    areaAcoes.appendChild(btnAdd);
  }

  (container.querySelector("[data-btn-carrinho]") as HTMLButtonElement).onclick = irParaCarrinho;

  return container;
}