<?php

namespace App\Services;

use App\Repositories\RepositorioCarrinho;
use App\Repositories\RepositorioItem;
use App\Models\Carrinho;
use App\Models\ItemCarrinho;
use App\Dto\CarrinhoDTO;
use App\Mappers\MapperCarrinho;
use App\Exceptions\DominioException;

class CarrinhoService
{
    public function __construct(
        private readonly RepositorioCarrinho $repoCarrinho,
        private readonly RepositorioItem $repoItem
    ) {}

    public function obterCarrinho(string $sessaoId): CarrinhoDTO
    {
        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId);
        if (!$carrinho) {
            $carrinho = new Carrinho($sessaoId);
            $this->repoCarrinho->salvarCarrinho($carrinho);
        }
        return MapperCarrinho::paraDTO($carrinho);
    }

    public function adicionarItem(string $sessaoId, int $itemId, int $quantidade): CarrinhoDTO
    {
        $itemModel = $this->repoItem->ObterPorId($itemId);

        if (!$itemModel) {
            throw new DominioException("Item não encontrado no sistema!");
        }

        if ($itemModel->getQuantidadeEstoque() < $quantidade) {
            throw new DominioException("Quantidade indisponível em estoque.");
        }

        $novoEstoque = $itemModel->getQuantidadeEstoque() - $quantidade;
        $this->repoItem->atualizarEstoque($itemId, $novoEstoque);

        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId) ?? new Carrinho($sessaoId);

        $preco = $itemModel->getPrecoVenda();
        if ($itemModel->getPercentualDesconto() > 0) {
            $preco -= $preco * ($itemModel->getPercentualDesconto() / 100);
        }
        $subtotal = $preco * $quantidade;

        $itemCarrinho = new ItemCarrinho($sessaoId, $itemModel, $quantidade, $subtotal);
        $carrinho->adicionarItem($itemCarrinho);

        $this->repoCarrinho->salvarCarrinho($carrinho);

        return MapperCarrinho::paraDTO($carrinho);
    }

    public function atualizarQuantidade(string $sessaoId, int $itemId, int $quantidade): CarrinhoDTO
    {
        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId);
        if (!$carrinho) {
            throw new DominioException("Carrinho não encontrado!");
        }

        $itemCarrinho = null;
        foreach ($carrinho->getItens() as $ic) {
            if ($ic->getItem()->getId() === $itemId) {
                $itemCarrinho = $ic;
                break;
            }
        }

        if (!$itemCarrinho) {
            throw new DominioException("Item não encontrado no carrinho!");
        }

        $itemModel = $this->repoItem->ObterPorId($itemId);
        $quantidadeAntiga = $itemCarrinho->getQuantidade();
        $diferenca = $quantidade - $quantidadeAntiga;

        if ($itemModel->getQuantidadeEstoque() < $diferenca) {
            throw new DominioException("Quantidade indisponível em estoque.");
        }

        $novoEstoque = $itemModel->getQuantidadeEstoque() - $diferenca;
        $this->repoItem->atualizarEstoque($itemId, $novoEstoque);

        if ($quantidade <= 0) {
            $carrinho->removerItem($itemId);
        } else {
            $carrinho->atualizarQuantidade($itemId, $quantidade);
        }

        $this->repoCarrinho->salvarCarrinho($carrinho);
        return MapperCarrinho::paraDTO($carrinho);
    }

    public function removerItem(string $sessaoId, int $itemId): CarrinhoDTO
    {
        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId);
        if ($carrinho) {
            foreach ($carrinho->getItens() as $ic) {
                if ($ic->getItem()->getId() === $itemId) {
                    $itemModel = $this->repoItem->ObterPorId($itemId);
                    $novoEstoque = $itemModel->getQuantidadeEstoque() + $ic->getQuantidade();
                    $this->repoItem->atualizarEstoque($itemId, $novoEstoque);
                    break;
                }
            }
            $carrinho->removerItem($itemId);
            $this->repoCarrinho->salvarCarrinho($carrinho);
        } else {
            $carrinho = new Carrinho($sessaoId);
        }
        return MapperCarrinho::paraDTO($carrinho);
    }
}
