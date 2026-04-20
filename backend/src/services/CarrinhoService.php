<?php

namespace App\Services;

use App\Repositories\RepositorioCarrinho;
use App\Repositories\RepositorioItem;
use App\Models\Carrinho;
use App\Models\ItemCarrinho;
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
        $itemModel = $this->validarEstoque($itemId, $quantidade);

        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId) ?? new Carrinho($sessaoId);
        
        $precoFinal = $itemModel->getPrecoVenda() * (1 - ($itemModel->getPercentualDesconto() / 100));
        $subtotal = $precoFinal * $quantidade;

        $carrinho->adicionarItem(new ItemCarrinho($sessaoId, $itemModel, $quantidade, $subtotal));
    
        return $this->salvarEAtualizarEstoque($carrinho, $itemId, -$quantidade);
    }

    public function atualizarQuantidade(string $sessaoId, int $itemId, int $quantidade): CarrinhoDTO {
        $carrinho = $this->buscarCarrinho($sessaoId);
        $ic = $this->buscarItemNoCarrinho($carrinho, $itemId);
        
        $diferenca = $quantidade - $ic->getQuantidade();
        
        $this->validarEstoque($itemId, $diferenca);

        if ($quantidade <= 0) {
            $carrinho->removerItem($itemId);
        } else {
            $carrinho->atualizarQuantidade($itemId, $quantidade);
        }

        return $this->salvarEAtualizarEstoque($carrinho, $itemId, -$diferenca);
    }

    public function removerItem(string $sessaoId, int $itemId): CarrinhoDTO {
        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId);
        
        if ($carrinho) {
            $ic = $this->buscarItemNoCarrinho($carrinho, $itemId);
            $quantidadeADevolver = $ic->getQuantidade();
            
            $carrinho->removerItem($itemId);
            
            return $this->salvarEAtualizarEstoque($carrinho, $itemId, $quantidadeADevolver);
        }
        
        return MapperCarrinho::paraDTO(new Carrinho($sessaoId));
    }

    // métodos auxiliares
    private function buscarCarrinho(string $sessaoId): Carrinho {
        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId);
        if (!$carrinho) {
            throw new EntidadeNaoEncontradaException("Carrinho", $sessaoId);
        }
        return $carrinho;
    }

    private function buscarItemNoCarrinho(Carrinho $carrinho, int $itemId): ItemCarrinho {
        foreach ($carrinho->getItens() as $ic) {
            if ($ic->getItem()->getId() === $itemId) {
                return $ic;
            }
        }
        throw new EntidadeNaoEncontradaException("Item no Carrinho", $itemId);
    }

    private function validarEstoque(int $itemId, int $quantidadeNecessaria) {
        $item = $this->repoItem->ObterPorId($itemId);
        if (!$item) {
            throw new EntidadeNaoEncontradaException("Item", $itemId);
        }
        
        if ($quantidadeNecessaria > 0 && $item->getQuantidadeEstoque() < $quantidadeNecessaria) {
            throw new EstoqueInsuficienteException($item->getDescricao());
        }
        return $item;
    }

    private function salvarEAtualizarEstoque(Carrinho $carrinho, int $itemId, int $variacaoEstoque): CarrinhoDTO {
        $item = $this->repoItem->ObterPorId($itemId);
        
        $this->repoItem->atualizarEstoque($itemId, $item->getQuantidadeEstoque() + $variacaoEstoque);
        $this->repoCarrinho->salvarCarrinho($carrinho);
        
        return MapperCarrinho::paraDTO($carrinho);
    }
}