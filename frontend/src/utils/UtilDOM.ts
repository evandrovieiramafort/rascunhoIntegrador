

// seleciona a tag e a retorna (lança exceção se encontrar nada)
export function obterHTML(seletor: string): HTMLElement {
  const elemento = document.querySelector(seletor);
  if (!elemento) throw new Error(`Elemento não encontrado: ${seletor}`);
  return elemento as HTMLElement;
}

// limpa todos os filhos de uma tag
export function limparFilhos(elemento: HTMLElement): void {
  elemento.replaceChildren();
}

// pega uma string de html e retorna o elemento do dom correspondente
export function htmlParaElemento(html: string): HTMLElement {
  const template = document.createElement("template"); // cria o template via DOM
  template.innerHTML = html.trim(); // limpa os espaços laterais do html recebido
  return template.content.firstElementChild as HTMLElement; // retorna o dom
}