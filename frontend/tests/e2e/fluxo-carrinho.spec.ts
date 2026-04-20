import { test, expect } from '@playwright/test';

// URL onde o seu front-end Vite está rodando
const BASE_URL = 'http://localhost:5173';

test.describe('Fluxo Principal do Usuário', () => {

  test('Deve comprar itens de páginas diferentes, remover e editar no carrinho', async ({ page }) => {
    
    await page.goto(BASE_URL);

    // Encontra o card que contém a palavra "Caneca" e clica em "Comprar"
    const cardCaneca = page.locator('.card', { hasText: 'Caneca' });
    await cardCaneca.getByRole('button', { name: 'Comprar' }).click();

    // Na tela de detalhes, escolhe 2 unidades e adiciona
    await page.locator('#quantidade-selecionada').selectOption('2');
    await page.getByRole('button', { name: 'Adicionar ao Carrinho' }).click();
    
    // Aguarda o botão ficar verde e mostrar "Item Adicionado!"
    await expect(page.getByText('Item Adicionado!')).toBeVisible();

    // Clica na logo "Mercado Cefet" na Navbar para voltar ao início
    await page.getByRole('link', { name: 'Mercado Cefet' }).click();

    // Clica no botão da Página 2 na paginação lá embaixo
    await page.getByRole('button', { name: '2', exact: true }).click();

    // Encontra o card que contém a palavra "Moletom" e clica em "Comprar"
    const cardMoletom = page.locator('.card', { hasText: 'Moletom' }).first();
    await cardMoletom.getByRole('button', { name: 'Comprar' }).click();

    // Na tela de detalhes, deixa a quantidade padrão (1) e adiciona
    await page.getByRole('button', { name: 'Adicionar ao Carrinho' }).click();
    await expect(page.getByText('Item Adicionado!')).toBeVisible();

    // Clica no ícone do carrinho na Navbar
    await page.locator('a[href="/carrinho"]').click();

    // Confirma se a tabela renderizou os dois produtos
    const tabela = page.locator('table');
    await expect(tabela).toContainText('Caneca');
    await expect(tabela).toContainText('Moletom');

    // Localiza a linha (tr) do Moletom e clica no botão "Remover" dela
    const linhaMoletom = page.locator('tr', { hasText: 'Moletom' });
    await linhaMoletom.getByRole('button', { name: 'Remover' }).click();

    // Aguarda o modal de confirmação abrir e clica no botão vermelho "Remover"
    const modal = page.locator('.modal-content');
    await modal.getByRole('button', { name: 'Remover' }).click();

    // Verifica se o Moletom sumiu da tela
    await expect(page.getByText('Moletom')).not.toBeVisible();

    // Localiza a linha da Caneca e pega o select de quantidade
    const linhaCaneca = page.locator('tr', { hasText: 'Caneca' });
    const selectQuantidade = linhaCaneca.locator('select');

    // Troca a quantidade de 2 para 1
    await selectQuantidade.selectOption('1');

    // Verifica se a interface atualizou o texto para "No carrinho: 1"
    await expect(linhaCaneca).toContainText('No carrinho: 1');

  });

});