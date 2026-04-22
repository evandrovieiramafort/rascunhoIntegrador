<?php

namespace App\Models;

class Carrinho {
    /** @var array<int, ItemCarrinho> */
    private array $itens = [];
    private float $totalGeral = 0.0;

    public function __construct(private string $id) {}

    public function getId(): string { return $this->id; }
    public function getTotalGeral(): float { return $this->totalGeral; }

    /** @return list<ItemCarrinho> */
    public function getItens(): array {
        return array_values($this->itens);
    }

    /**
     * Retorna a quantidade de um item específico no carrinho
     */
    public function getQuantidadeDoItem(int $itemId): int {
        return isset($this->itens[$itemId]) ? $this->itens[$itemId]->getQuantidade() : 0;
    }

    public function adicionarItem(ItemCarrinho $novoItem): void {
        $itemId = $novoItem->getItem()->getId();
        
        if (isset($this->itens[$itemId])) {
            $novaQuantidade = $this->itens[$itemId]->getQuantidade() + $novoItem->getQuantidade();
            $this->atualizarQuantidade($itemId, $novaQuantidade);
        } else {
            // Garante que o subtotal esteja correto mesmo para itens novos
            $this->itens[$itemId] = $this->garantirSubtotalCorreto($novoItem);
            $this->recalcularTotal();
        }
    }

    public function atualizarQuantidade(int $itemId, int $quantidade): void {
        if (isset($this->itens[$itemId])) {
            $itemModel = $this->itens[$itemId]->getItem();
            $subtotal = $this->calcularSubtotal($itemModel, $quantidade);

            $this->itens[$itemId] = new ItemCarrinho($this->id, $itemModel, $quantidade, $subtotal);
            $this->recalcularTotal();
        }
    }

    public function removerItem(int $itemId): void {
        if (isset($this->itens[$itemId])) {
            unset($this->itens[$itemId]);
            $this->recalcularTotal();
        }
    }

    public function calcularSubtotal(Item $item, int $quantidade): float {
        $preco = $item->getPrecoVenda();
        if ($item->getPercentualDesconto() > 0) {
            $preco = $preco * (1 - ($item->getPercentualDesconto() / 100));
        }
        return (float) ($preco * $quantidade);
    }

    private function garantirSubtotalCorreto(ItemCarrinho $item): ItemCarrinho {
        $subtotal = $this->calcularSubtotal($item->getItem(), $item->getQuantidade());
        return new ItemCarrinho($this->id, $item->getItem(), $item->getQuantidade(), $subtotal);
    }

    private function recalcularTotal(): void {
        $this->totalGeral = 0.0;
        foreach ($this->itens as $item) {
            $this->totalGeral += $item->getSubtotal();
        }
    }
}