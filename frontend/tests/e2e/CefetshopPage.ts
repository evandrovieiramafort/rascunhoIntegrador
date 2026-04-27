import { type Page, expect } from '@playwright/test';

export class CefetshopPage {
    constructor(private readonly page: Page) {}

    async navegarParaHome() {
        await this.page.goto('http://localhost:5173');
    }

    async navegarParaCarrinho() {
        await this.page.locator('a[href="/carrinho"]').click();
    }

    async adicionarAoCarrinho(nomeItem: string, quantidade?: string) {
        const card = this.page.locator('.card', { hasText: nomeItem }).first();
        await card.getByRole('button', { name: 'Detalhes' }).click();
        
        if (quantidade) {
            await this.page.locator('#seletor-quantidade').selectOption(quantidade);
        }
        
        await this.page.getByRole('button', { name: 'Adicionar ao Carrinho' }).click();
    }

    async mudarPagina(numero: string) {
        await this.page.getByRole('button', { name: numero, exact: true }).click();
    }

    async removerItemDoCarrinho(nomeItem: string) {
        const linha = this.page.locator('tr', { hasText: nomeItem });
        await linha.getByRole('button', { name: 'Remover' }).click();
        
        const modal = this.page.locator('.modal-content');
        await modal.getByRole('button', { name: 'Remover' }).click();
    }

    async alterarQuantidadeNoCarrinho(nomeItem: string, novaQuantidade: string) {
        const linha = this.page.locator('tr', { hasText: nomeItem });
        await linha.locator('#seletor-quantidade').selectOption(novaQuantidade);
    }

    async validarItemNoCarrinho(nomeItem: string, quantidadeEsperada: string) {
        const linha = this.page.locator('tr', { hasText: nomeItem });
        await expect(linha).toContainText(`No carrinho: ${quantidadeEsperada}`);
    }

    async validarCarrinhoVazio() {
        await expect(this.page.getByText('Seu carrinho de compras está vazio.')).toBeVisible();
        await expect(this.page.locator('table')).not.toBeVisible();
    }
}