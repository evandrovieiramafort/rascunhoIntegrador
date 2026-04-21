<?php

namespace App\Services;

use App\Repositories\RepositorioCarrinho;
use App\Repositories\RepositorioItem;
use App\Models\Carrinho;
use App\Models\ItemCarrinho;
use App\Models\Item;
use App\Dto\CarrinhoDTO;
use App\Mappers\MapperCarrinho;
use App\Exceptions\EntidadeNaoEncontradaException;
use App\Exceptions\EstoqueInsuficienteException;

class CarrinhoService {
    public function __construct(
        private readonly RepositorioCarrinho $repoCarrinho,
        private readonly RepositorioItem $repoItem
    ) {}

    public function obterCarrinho(string $sessaoId): CarrinhoDTO {
        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId) ?? new Carrinho($sessaoId);
        return MapperCarrinho::paraDTO($carrinho);
    }

    public function adicionarItem(string $sessaoId, int $itemId, int $quantidade): CarrinhoDTO {
        $itemModel = $this->repoItem->ObterPorId($itemId);
        if (!$itemModel) {
            throw new EntidadeNaoEncontradaException("Item", $itemId);
        }

        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId) ?? new Carrinho($sessaoId);
        
        $quantidadeNoCarrinho = 0;
        foreach ($carrinho->getItens() as $ic) {
            if ($ic->getItem()->getId() === $itemId) {
                $quantidadeNoCarrinho = $ic->getQuantidade();
                break;
            }
        }

        $novaQuantidade = $quantidadeNoCarrinho + $quantidade;
        $this->validarRegraQuantidade($itemModel, $novaQuantidade);

        $desconto = $itemModel->getPercentualDesconto() / 100;
        $precoFinal = $itemModel->getPrecoVenda() * (1 - $desconto);
        $subtotal = (float) ($precoFinal * $novaQuantidade);

        $carrinho->adicionarItem(new ItemCarrinho($sessaoId, $itemModel, $quantidade, $subtotal));
    
        return $this->salvarCarrinho($carrinho);
    }

    public function atualizarQuantidade(string $sessaoId, int $itemId, int $quantidade): CarrinhoDTO {
        $itemModel = $this->repoItem->ObterPorId($itemId);
        if (!$itemModel) {
            throw new EntidadeNaoEncontradaException("Item", $itemId);
        }

        $carrinho = $this->buscarCarrinho($sessaoId);
        
        if ($quantidade <= 0) {
            $carrinho->removerItem($itemId);
        } else {
            $this->validarRegraQuantidade($itemModel, $quantidade);
            $carrinho->atualizarQuantidade($itemId, $quantidade);
        }

        return $this->salvarCarrinho($carrinho);
    }

    public function removerItem(string $sessaoId, int $itemId): CarrinhoDTO {
        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId);
        if ($carrinho) {
            $carrinho->removerItem($itemId);
            return $this->salvarCarrinho($carrinho);
        }
        return MapperCarrinho::paraDTO(new Carrinho($sessaoId));
    }

    private function buscarCarrinho(string $sessaoId): Carrinho {
        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId);
        if (!$carrinho) {
            throw new EntidadeNaoEncontradaException("Carrinho", $sessaoId);
        }
        return $carrinho;
    }

    private function validarRegraQuantidade(Item $item, int $quantidadeFinal): void {
        $estoqueDisponivel = $item->getQuantidadeEstoque();
        $limitePermitido = min(10, $estoqueDisponivel);
        
        if ($quantidadeFinal > $limitePermitido) {
            throw new EstoqueInsuficienteException($item->getDescricao());
        }
    }

    private function salvarCarrinho(Carrinho $carrinho): CarrinhoDTO {
        $this->repoCarrinho->salvarCarrinho($carrinho);
        return MapperCarrinho::paraDTO($carrinho);
    }
}