import { htmlParaElemento } from "../../utils/UtilDOM";
import { formatarC$ } from "../../utils/Formatador";

export function TabelaCarrinhoBase(totalGeral: number): HTMLElement {
  const wrapper = htmlParaElemento(`
    <div>
      <div class="table-responsive mb-4">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Produto</th>
              <th class="text-center">Preço</th>
              <th class="text-center" style="width: 140px;">Quantidade</th>
              <th class="text-center">Subtotal</th>
              <th class="text-center">Ação</th>
            </tr>
          </thead>
          <tbody data-corpo-tabela></tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end align-items-center bg-light p-4 rounded shadow-sm">
        <h4 class="mb-0 me-4 fw-bold" data-total></h4>
        <button class="btn btn-success btn-lg">Finalizar Compra</button>
      </div>
    </div>
  `);

  wrapper.querySelector("[data-total]")!.textContent = `Total: ${formatarC$(totalGeral)}`;
  
  return wrapper;
}