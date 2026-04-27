import { test, expect } from '@playwright/test';
import { CefetshopPage } from './CefetshopPage';

const BASE_URL = 'http://localhost:5173';

test.describe('Fluxo Principal do Usuário', () => {

  test('Deve comprar itens de páginas diferentes, remover e editar no carrinho', async ({ page }) => {
    const cefetPage = new CefetshopPage(page);
    
    await cefetPage.navegarParaHome();

    await cefetPage.adicionarAoCarrinho('Caneca Programador', '2');

    await cefetPage.navegarParaHome();
    await cefetPage.mudarPagina('2');

    await cefetPage.adicionarAoCarrinho('Moletom Azul Marinho');

    await cefetPage.navegarParaCarrinho();
    
    const tabela = page.locator('table');
    await expect(tabela).toContainText('Caneca Programador');
    await expect(tabela).toContainText('Moletom Azul Marinho');

    await cefetPage.removerItemDoCarrinho('Moletom Azul Marinho');
    await expect(page.getByText('Moletom Azul Marinho')).not.toBeVisible();

    await cefetPage.alterarQuantidadeNoCarrinho('Caneca Programador', '1');
    await cefetPage.validarItemNoCarrinho('Caneca Programador', '1');
  });

  test('Deve exibir mensagem de carrinho vazio ao acessar a rota sem itens', async ({ page }) => {
    const cefetPage = new CefetshopPage(page);
    
    await page.goto(`${BASE_URL}/carrinho`);
    await cefetPage.validarCarrinhoVazio();
  });

  test('Deve exibir a Página 404 ao acessar uma rota inexistente', async ({ page }) => {
    await page.goto(`${BASE_URL}/rota-maluca-inexistente`);
    await expect(page.getByText('Página não encontrada')).toBeVisible();
  });

});