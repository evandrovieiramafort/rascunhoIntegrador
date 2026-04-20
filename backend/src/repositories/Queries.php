<?php

namespace App\Repositories;

class Queries {
    // Queries referentes aos itens
    public const ITEM_BUSCAR_MAIS_VENDIDOS = "SELECT * FROM item ORDER BY total_vendas DESC LIMIT :limite OFFSET :offset";
    public const ITEM_CONTAR_TOTAL = "SELECT COUNT(*) FROM item";
    public const ITEM_BUSCAR_POR_ID = "SELECT * FROM item WHERE id = ?";
    public const ITEM_ATUALIZAR_QUANTIDADE_ESTOQUE = "UPDATE item SET quantidade_estoque = ? WHERE id = ?";
    
    public const CATEGORIA_BUSCAR_TODAS = "SELECT * FROM categoria_produto";
    
    public const CARRINHO_BUSCAR_POR_ID = "SELECT * FROM carrinho WHERE id = ?";
    public const CARRINHO_SALVAR = "INSERT INTO carrinho (id, total_geral) VALUES (?, ?) ON DUPLICATE KEY UPDATE total_geral = VALUES(total_geral)";
    public const CARRINHO_ADICIONAR_ITEM = "INSERT INTO item_carrinho (carrinho_id, item_id, quantidade, subtotal) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantidade = VALUES(quantidade), subtotal = VALUES(subtotal)";
    public const CARRINHO_REMOVER_ITEM = "DELETE FROM item_carrinho WHERE carrinho_id = ? AND item_id = ?";
    public const CARRINHO_BUSCAR_ITENS = "SELECT ic.*, i.* FROM item_carrinho ic JOIN item i ON ic.item_id = i.id WHERE ic.carrinho_id = ? ORDER BY ic.item_id DESC";
}