<?php

namespace App\Services;

use App\Repositories\{RepositorioCarrinho, RepositorioItem};
use App\Models\{Carrinho, ItemCarrinho, Item};
use App\Dto\CarrinhoDTO;
use App\Mappers\MapperCarrinho;
use App\Exceptions\{DominioException, NaoEncontradoException, EstoqueInsuficienteException};

class CarrinhoService {
    public function __construct(
        private readonly RepositorioCarrinho $repoCarrinho,
        private readonly RepositorioItem $repoItem
    ) {}

    public function obterCarrinho(string $sessaoId): CarrinhoDTO {
        return MapperCarrinho::paraDTO($this->obterOuCriarCarrinho($sessaoId));
    }

    public function adicionarItem(string $sessaoId, int $itemId, int $quantidade): CarrinhoDTO {
        $itemModel = $this->validarItem($itemId);
        $carrinho = $this->obterOuCriarCarrinho($sessaoId);
        
        $quantidadeNoCarrinho = $carrinho->getQuantidadeDoItem($itemId);
        $novaQuantidade = $quantidadeNoCarrinho + $quantidade;

        $this->validarRegraQuantidade($itemModel, $novaQuantidade);
        $carrinho->adicionarItem(new ItemCarrinho($sessaoId, $itemModel, $quantidade, 0.0));
    
        return $this->salvarCarrinho($carrinho);
    }

    public function atualizarQuantidade(string $sessaoId, int $itemId, int $quantidade): CarrinhoDTO {
        $itemModel = $this->validarItem($itemId);
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

    private function validarItem(int $itemId): Item {
        $item = $this->repoItem->ObterPorId($itemId);
        if (!$item) throw NaoEncontradoException::paraEntidade("Item", $itemId);
        return $item;
    }

    private function obterOuCriarCarrinho(string $sessaoId): Carrinho {
        return $this->repoCarrinho->ObterCarrinhoPorId($sessaoId) ?? new Carrinho($sessaoId);
    }

    private function buscarCarrinho(string $sessaoId): Carrinho {
        $carrinho = $this->repoCarrinho->ObterCarrinhoPorId($sessaoId);
        if (!$carrinho) throw NaoEncontradoException::paraEntidade("Carrinho", $sessaoId);
        return $carrinho;
    }

    private function validarRegraQuantidade(Item $item, int $quantidadeFinal): void {
        $limite = min(10, $item->getQuantidadeEstoque());
        if ($quantidadeFinal > $limite) {
            throw new EstoqueInsuficienteException($item->getDescricao());
        }
        if ($quantidadeFinal <= 0) {
            throw new DominioException("A quantidade deve ser maior do que zero");
        }
    }

    private function salvarCarrinho(Carrinho $carrinho): CarrinhoDTO {
        $this->repoCarrinho->salvarCarrinho($carrinho);
        return MapperCarrinho::paraDTO($carrinho);
    }
}