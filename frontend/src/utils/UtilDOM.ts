export function obterHTML(seletor: string): HTMLElement {
  const elemento = document.querySelector(seletor);
  if (!elemento) throw new Error(`Elemento não encontrado: ${seletor}`);
  return elemento as HTMLElement;
}

export function limparFilhos(elemento: HTMLElement): void {
  elemento.replaceChildren();
}

export function htmlParaElemento(html: string): HTMLElement {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild as HTMLElement;
}