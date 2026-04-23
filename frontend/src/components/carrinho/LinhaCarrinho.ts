import { htmlParaElemento } from "../../utils/UtilDOM";
import { formatarC$ } from "../../utils/Formatador";
import { Stepper, ModalConfirmacao } from "../ui/UIComponents";
import type { ItemCarrinhoDTO } from "../../domain/ItemCarrinhoDTO";

export function LinhaCarrinho(
  ic: ItemCarrinhoDTO, 
  aoMudarQtd: (id: number, novaQtd: number) => Promise<void>, 
  aoRemover: (id: number) => void
): HTMLElement {
  if (!ic.item) return htmlParaElemento(`<tr></tr>`);

  const tr = htmlParaElemento(`
    <tr>
      <td>
        <div class="d-flex align-items-center">
          <img class="img-thumbnail me-3" style="width: 64px;">
          <div>
            <h6 class="mb-0" data-desc></h6>
            <small class="text-primary d-block" data-qtd-carrinho></small>
            <small class="text-muted" data-estoque></small>
          </div>
        </div>
      </td>
      <td class="text-center" data-preco></td>
      <td class="text-center" data-stepper></td>
      <td class="fw-bold text-center" data-subtotal></td>
      <td class="text-center">
        <button class="btn btn-outline-danger btn-sm" data-btn-remover>Remover</button>
      </td>
    </tr>
  `);

  const img = tr.querySelector("img")!;
  img.src = ic.item.foto;
  img.alt = ic.item.descricao;

  tr.querySelector("[data-desc]")!.textContent = ic.item.descricao;
  tr.querySelector("[data-qtd-carrinho]")!.textContent = `No carrinho: ${ic.quantidade}`;
  tr.querySelector("[data-estoque]")!.textContent = `Estoque total: ${ic.item.quantidadeEstoque}`;
  tr.querySelector("[data-preco]")!.textContent = formatarC$(ic.item.precoFinal);
  tr.querySelector("[data-subtotal]")!.textContent = formatarC$(ic.subtotal);

  const limiteMaximo = Math.min(10, ic.item.quantidadeEstoque);
  
  const stepperContainer = tr.querySelector("[data-stepper]")!;
  stepperContainer.appendChild(Stepper(ic.quantidade, limiteMaximo, "140px", (novo) => aoMudarQtd(ic.item.id, novo)));

  const btnRemover = tr.querySelector("[data-btn-remover]") as HTMLButtonElement;
  btnRemover.onclick = () => {
    ModalConfirmacao(
      "Confirmar", 
      `Deseja realmente remover "${ic.item.descricao}" do carrinho?`, 
      "Remover", 
      () => aoRemover(ic.item.id), 
      "danger"
    );
  };

  return tr;
}