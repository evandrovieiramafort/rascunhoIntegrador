export async function carregarPagina(destino: HTMLElement, arquivoHtml: string): Promise<void> {
    const response = await fetch(arquivoHtml);
    if (response.ok) {
        const html = await response.text();
        destino.innerHTML = html;
    } else {
        destino.innerHTML = '<div class="alert alert-danger">Erro ao carregar a interface.</div>';
    }
}