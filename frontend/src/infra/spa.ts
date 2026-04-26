export async function carregarPagina(destino: HTMLElement, arquivoHtml: string): Promise<void> {
    const response = await fetch(arquivoHtml); // faz a chamada da página que vai ser carregada
    
    if (response.ok) {
        const html = await response.text(); // pega a resposta em formato de texto
        const doc = new DOMParser().parseFromString(html, 'text/html'); // faz o parsing pro formato html 
        
        // limpa o destino e injeta os elementos da página carregada em #app, que 
        // já vem em formato de array espalhado
        destino.replaceChildren(...Array.from(doc.body.childNodes));
    }
}
