// altera a URL do navegador e força a troca de página sem precisar recarregar
export function navegarPara(rota: string): void {
  
  // Atualiza a barra de endereço e o histórico do browser.
  // "{}" e "" são obrigatórios pela assinatura da função, só
  window.history.pushState({}, "", rota);
  
  // Dispara manualmente o "window.addEventListener('popstate', rotearApp);" no main.ts.
  // Sem esse disparo, o roteador não saberia que a URL mudou.
  window.dispatchEvent(new PopStateEvent("popstate"));
}