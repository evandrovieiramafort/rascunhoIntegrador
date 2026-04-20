export function limparFilhos(elemento: HTMLElement): void {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

export function obterHTML<T extends HTMLElement>(query: string): T {
    const elemento = document.querySelector<T>(query);
    if (!elemento) throw new Error(`Elemento não encontrado: ${query}`);
    return elemento;
}

export function criarHTML<K extends keyof HTMLElementTagNameMap>(tag: K): HTMLElementTagNameMap[K] {
    return document.createElement(tag);
}