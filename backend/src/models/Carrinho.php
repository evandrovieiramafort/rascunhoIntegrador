<?php

namespace App\Models;

class Carrinho {
    /** @var array<int, ItemCarrinho> */
    private array $itens = [];
    private float $totalGeral = 0.0;

    public function __construct(private string $id) {}

    public function getId(): string {
        return $this->id;
    }

    public function getTotalGeral(): float {
        return $this->totalGeral;
    }

    /** @return list<ItemCarrinho> */
    public function getItens(): array {
        return array_values($this->itens);
    }

    public function adicionarItem(ItemCarrinho $novoItem): void {
        $itemId = $novoItem->getItem()->getId();
        
        if (isset($this->itens[$itemId])) {
            $itemExistente = $this->itens[$itemId];
            $novaQuantidade = $itemExistente->getQuantidade() + $novoItem->getQuantidade();
            $this->atualizarQuantidade($itemId, $novaQuantidade);
        } else {
            $this->itens[$itemId] = $novoItem;
            $this->recalcularTotal();
        }
    }

    public function atualizarQuantidade(int $itemId, int $quantidade): void {
        if (isset($this->itens[$itemId])) {
            $itemModel = $this->itens[$itemId]->getItem();
            
            $preco = $itemModel->getPrecoVenda();
            if ($itemModel->getPercentualDesconto() > 0) {
                $preco = $preco * (1 - ($itemModel->getPercentualDesconto() / 100));
            }
            $subtotal = $preco * $quantidade;

            $this->itens[$itemId] = new ItemCarrinho(
                $this->id,
                $itemModel,
                $quantidade,
                (float) $subtotal
            );
            $this->recalcularTotal();
        }
    }

    public function removerItem(int $itemId): void {
        if (isset($this->itens[$itemId])) {
            unset($this->itens[$itemId]);
            $this->recalcularTotal();
        }
    }

    private function recalcularTotal(): void {
        $this->totalGeral = 0.0;
        foreach ($this->itens as $item) {
            $this->totalGeral += $item->getSubtotal();
        }
    }
}