<?php
namespace App\Test;

use App\Models\Item;
use App\Models\ItemCarrinho;
use function App\Infra\conectarAoDB;

class SpecHelper {
    public static function prepararSessao(): void {
        if (PHP_SAPI === 'cli' && session_status() === PHP_SESSION_NONE) {
            $_SESSION = [];
        }
        $_SESSION['carrinho'] = [];
    }

    public static function prepararBancoDeDados(): \PDO {
        $pdo = conectarAoDB('cefetshop_bd_test');
        $baseDir = __DIR__ . '/../src/sql/';
        $pdo->exec(file_get_contents($baseDir . 'cefetshop_bd_test.sql'));
        $pdo->exec(file_get_contents($baseDir . 'script_populacao_test.sql'));
        return $pdo;
    }


    public static function criarItemFake(int $id = 1, string $descricao = 'Item de Teste'): Item {
        return new Item(
            $id, 1, 'foto.png', $descricao, 'Detais', '2026.1', 100.0, 10.0, 10
        );
    }


    public static function criarItemCarrinhoFake(string $carrinhoId, Item $item, int $quantidade = 1): ItemCarrinho {
        return new ItemCarrinho($carrinhoId, $item, $quantidade, $item->getPrecoVenda() * $quantidade);
    }
}