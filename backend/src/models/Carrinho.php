<?php

namespace App\Models;

use App\Exceptions\DominioException;

class Carrinho
{
    /** @var array<int, ItemCarrinho> */
    private array $listaItens = [];
    private float $totalGeral = 0.0;

    public function __construct(private string $id) {}

    public function getId(): string
    {
        return $this->id;
    }
    public function getTotalGeral(): float
    {
        return $this->totalGeral;
    }

    /** @return list<ItemCarrinho> */
    public function getItens(): array
    {
        return array_values($this->listaItens);
    }

    public function getQuantidadeDoItem(int $itemId): int
    {
        return isset($this->listaItens[$itemId]) ? $this->listaItens[$itemId]->getQuantidade() : 0;
    }

    public function adicionarItem(ItemCarrinho $itemCarrinho): void
    {
        $itemCarrinhoId = $itemCarrinho->getItem()->getId();
        $item = $itemCarrinho->getItem();

        $quantidadeNoCarrinho = $this->getQuantidadeDoItem($itemCarrinhoId);
        $novaQuantidade = $quantidadeNoCarrinho + $itemCarrinho->getQuantidade();

        $this->validarLimite($item, $novaQuantidade);

        if (isset($this->listaItens[$itemCarrinhoId])) {
            $this->atualizarQuantidade($itemCarrinhoId, $novaQuantidade);
        } else {
            $this->listaItens[$itemCarrinhoId] = $this->garantirSubtotalCorreto($itemCarrinho);
            $this->recalcularTotal();
        }
    }

    private function validarLimite(Item $item, int $quantidade): void
    {
        $limite = min(10, $item->getQuantidadeEstoque());
        if ($quantidade > $limite || $quantidade <= 0) {
            throw new DominioException("Quantidade inválida para o item " . $item->getDescricao());
        }
    }

    public function atualizarQuantidade(int $itemId, int $quantidade): void {
    if (isset($this->listaItens[$itemId])) {
        $item = $this->listaItens[$itemId]->getItem();
        
        $this->validarLimite($item, $quantidade);

        $subtotal = $this->calcularSubtotal($item, $quantidade);
        $this->listaItens[$itemId] = new ItemCarrinho($this->id, $item, $quantidade, $subtotal);
        $this->recalcularTotal();
    }
    }

    public function removerItem(int $itemId): void
    {
        if (isset($this->listaItens[$itemId])) {
            unset($this->listaItens[$itemId]);
            $this->recalcularTotal();
        }
    }

    public function calcularSubtotal(Item $item, int $quantidade): float
    {
        $preco = $item->getPrecoVenda();
        if ($item->getPercentualDesconto() > 0) {
            $preco = $preco * (1 - ($item->getPercentualDesconto() / 100));
        }
        return (float) ($preco * $quantidade);
    }

    private function garantirSubtotalCorreto(ItemCarrinho $item): ItemCarrinho
    {
        $subtotal = $this->calcularSubtotal($item->getItem(), $item->getQuantidade());
        return new ItemCarrinho($this->id, $item->getItem(), $item->getQuantidade(), $subtotal);
    }

    private function recalcularTotal(): void
    {
        $this->totalGeral = 0.0;
        foreach ($this->listaItens as $item) {
            $this->totalGeral += $item->getSubtotal();
        }
    }
}
