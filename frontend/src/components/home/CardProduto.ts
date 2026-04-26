import { htmlParaElemento } from "../../utils/UtilDOM";
import { Badge, PrecoArea } from "../ui/UIComponents";
import type { ItemDTO } from "../../domain/ItemDTO";

export function CardProduto(item: ItemDTO, aoClicarDetalhes: (id: number) => void): HTMLElement {
  // é chamado o htmlParaElemento para converter o innerHTML para estrutura DOM
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

  // --- A partir daqui, todo o DOM começa a ser trabalhado ---
  // seleciona a tag de imagem, insere a foto, descrição e o evento que encaminha a tela de detalhes caso clique na foto
  const img = elemento.querySelector("img")!;
  img.src = item.foto; //
  img.alt = item.descricao; //
  img.onclick = () => aoClicarDetalhes(item.id); //

  // seleciona as tags h5 e p já criadas no template
  // h5 vai receber a descrição do item
  // p vai receber a descrição detalhada do item
  elemento.querySelector("h5")!.textContent = item.descricao; //
  elemento.querySelector("p")!.textContent = item.descricaoDetalhada; //

  // configura a ação do botão de detalhe com base no nível de estoque
  const btnAcao = elemento.querySelector("[data-btn-acao]") as HTMLButtonElement;
  
  // item esgotado (o booleano)? Texto = 'Sem estoque"; caso contrário, Texto = "Detalhes"
  btnAcao.textContent = item.estaEsgotado ? "Sem estoque" : "Detalhes"; 
  btnAcao.disabled = item.estaEsgotado; // desarma o botão que leva a tela de detalhes[cite: 103].
  
  if (!item.estaEsgotado) { // se o item não estiver esgotado...
    // ...o disparo da ação quando clicar em "Detalhes" é liberado, encaminhando o usuário pro item selecionado (via item.id)
    btnAcao.onclick = () => aoClicarDetalhes(item.id); //
  }

  // chama a div "data-area-preco" e adiciona a ela o container do preço, passando o preço de venda, o preço final e o desconto
  elemento.querySelector("[data-area-preco]")!.appendChild(
    PrecoArea(item.precoVenda, item.precoFinal, item.percentualDesconto) //
  );

  // chama a div "data-badges" (onde ficam as informações de desconto)
  const areaBadges = elemento.querySelector("[data-badges]")!;
  
  // Verificação dupla:
  // 1. Se o item estiver esgotado, gera a badge de "Esgotado" e adiciona a área de badges
  if (item.estaEsgotado) {
    areaBadges.appendChild(Badge("Esgotado", "danger", "position-absolute top-0 end-0 m-2 z-1"));
  }
  
  // 2. Se o percentual de desconto for maior do que zero, é adicionada essa informação a badge a área de badges
  if (item.percentualDesconto > 0) {
    areaBadges.appendChild(Badge(`-${item.percentualDesconto}%`, "success", "position-absolute top-0 start-0 m-2 z-1"));
  }

  // por fim, retorna o elemento estruturado para ser usado na view.
  return elemento;
}