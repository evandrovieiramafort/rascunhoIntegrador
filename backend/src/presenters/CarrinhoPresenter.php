<?php

namespace App\Presenters;

use App\Repositories\{RepositorioCarrinho, RepositorioItem};
use App\Models\{Carrinho, ItemCarrinho, Item};
use App\Dto\CarrinhoDTO;
use App\Mappers\MapperCarrinho;
use App\Exceptions\NaoEncontradoException;
use App\Exceptions\QuantidadeInvalidaException;

class CarrinhoPresenter {
    public function __construct(
        private readonly RepositorioCarrinho $repoCarrinho,
        private readonly RepositorioItem $repoItem
    ) {}

    public function obterCarrinho(string $sessaoId): CarrinhoDTO {
        $carrinho = $this->recuperarCarrinhoDaSession($sessaoId);
        return MapperCarrinho::paraDTO($carrinho);
    }

    public function adicionarItem(string $sessaoId, int $itemId, int $quantidade): CarrinhoDTO {
        $itemModel = $this->verificarSeItemExiste($itemId);
        $carrinho = $this->recuperarCarrinhoDaSession($sessaoId);
        
        $carrinho->adicionarItem(new ItemCarrinho($sessaoId, $itemModel, $quantidade, 0.0));
    
        return $this->persistirCarrinho($carrinho);
    }

    public function atualizarQuantidade(string $sessaoId, int $itemId, int $quantidade): CarrinhoDTO {
        $carrinho = $this->buscarCarrinho($sessaoId);

        if ($quantidade < 0) {
            throw new QuantidadeInvalidaException("A quantidade não pode ser negativa.");
        }

        if ($quantidade <= 0) {
            return $this->removerItem($sessaoId, $itemId);
        }
        
        $carrinho->atualizarQuantidade($itemId, $quantidade);

        return $this->persistirCarrinho($carrinho);
    }

    public function removerItem(string $sessaoId, int $itemId): CarrinhoDTO {
        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId);
        
        if ($carrinho) {
            $carrinho->removerItem($itemId);
            return $this->persistirCarrinho($carrinho);
        }
        
        return $this->obterCarrinho($sessaoId);
    }

    private function verificarSeItemExiste(int $itemId): Item {
        $item = $this->repoItem->ObterPorId($itemId);
        if (!$item) throw NaoEncontradoException::paraEntidade("Item", $itemId);
        return $item;
    }

    private function recuperarCarrinhoDaSession(string $sessaoId): Carrinho {
        return $this->repoCarrinho->ObterCarrinhoPorId($sessaoId) ?? new Carrinho($sessaoId);
    }

    private function buscarCarrinho(string $sessaoId): Carrinho {
        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId);
        if (!$carrinho) throw NaoEncontradoException::paraEntidade("Carrinho", $sessaoId);
        return $carrinho;
    }

    private function persistirCarrinho(Carrinho $carrinho): CarrinhoDTO {
        $this->repoCarrinho->salvarCarrinho($carrinho);
        return MapperCarrinho::paraDTO($carrinho);
    }
}