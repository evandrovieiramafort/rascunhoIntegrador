export async function carregarPagina(destino: HTMLElement, arquivoHtml: string): Promise<void> {
    const response = await fetch(arquivoHtml);
    if (response.ok) {
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        
        destino.replaceChildren(...Array.from(doc.body.childNodes));
    }
}