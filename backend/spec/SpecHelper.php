<?php
namespace App\Test;

use App\Models\Item;
use App\Models\ItemCarrinho;
use App\Exceptions\NaoEncontradoException;
use function App\Infra\conectarAoDB;

class SpecHelper {
    public const ID_EXISTENTE = 1;
    public const ID_SECUNDARIO = 2;
    public const ID_INEXISTENTE = 9999;
    public const LIMITE_PAGINACAO = 6;
    public const LIMITE_ITENS_PAGINA = 6;
    public const ID_MOLETOM_POUCO_ESTOQUE = 9;

    /**
     * @return void
     */
    public static function prepararSessao(): void {
        if (PHP_SAPI === 'cli' && session_status() === PHP_SESSION_NONE) {
            $_SESSION = [];
        }
        $_SESSION['carrinho'] = [];
    }

    /**
     * @return \PDO
     */
    public static function prepararBancoDeDados(): \PDO {
        $pdo = conectarAoDB('cefetshop_bd_test');
        $baseDir = __DIR__ . '/../src/sql/';
        $pdo->exec(file_get_contents($baseDir . 'cefetshop_bd_test.sql'));
        $pdo->exec(file_get_contents($baseDir . 'script_populacao_test.sql'));
        return $pdo;
    }

    /**
     * @param array $referencias
     * @return void
     */
    public static function limparDependencias(&...$referencias): void {
        foreach ($referencias as &$ref) {
            $ref = null;
        }
    }

    /**
     * @param array $params
     * @return Item
     */
    private static function fabricarItem(array $params): Item {
        return new Item(
            $params['id'] ?? self::ID_EXISTENTE,
            1, 
            'foto.png', 
            $params['descricao'] ?? 'Item de Teste', 
            $params['detalhes'] ?? 'Details', 
            '2026.1', 
            100.0, 
            10.0, 
            10
        );
    }

    /**
     * @param string $classe
     * @param array $params
     * @return Item|ItemCarrinho
     */
    public static function criarMock(string $classe, array $params = []) {
        return match ($classe) {
            Item::class => self::fabricarItem($params),
            ItemCarrinho::class => self::fabricarItemCarrinho($params),
            default => throw new \InvalidArgumentException("Classe {$classe} não mapeada no criarMock.")
        };
    }


    /**
     * @param array $params
     * @return ItemCarrinho
     */
    private static function fabricarItemCarrinho(array $params): ItemCarrinho {
        $item = $params['item'] ?? self::criarMock(Item::class);
        $quantidade = $params['quantidade'] ?? 1;
        
        return new ItemCarrinho(
            $params['carrinhoId'] ?? 'sessao_padrao',
            $item,
            $quantidade,
            $item->getPrecoVenda() * $quantidade
        );
    }

    /**
     * @param callable $fn
     * @param string $classe
     * @param mixed $mensagemOuEntidade
     * @param mixed $idEntidade
     * @return void
     */
    public static function esperarExcecao(callable $fn, string $classe, $mensagemOuEntidade = null, $idEntidade = null): void {
        if ($classe === NaoEncontradoException::class) {
            $excecao = ($idEntidade !== null)
                ? NaoEncontradoException::paraEntidade($mensagemOuEntidade, $idEntidade)
                : NaoEncontradoException::paraBusca();
            expect($fn)->toThrow($excecao);
            return;
        }
        expect($fn)->toThrow(new $classe($mensagemOuEntidade));
    }

    /**
     * @param array $lista
     * @param int $tamanhoEsperado
     * @param mixed $classeEsperada
     * @return void
     */
    public static function validarColecao(array $lista, int $tamanhoEsperado, ?string $classeEsperada = null): void {
        /** @var mixed $expectativa */
        $expectativa = expect(count($lista));
        $expectativa->toBe($tamanhoEsperado);
        if ($classeEsperada) {
            foreach ($lista as $item) {
                expect($item)->toBeAnInstanceOf($classeEsperada);
            }
        }
    }

    /**
     * @param mixed $objeto
     * @param array $mapa
     * @return void
     */
    public static function validarAtributos($objeto, array $mapa): void {
        foreach ($mapa as $propriedade => $valorEsperado) {
            $metodo = 'get' . ucfirst($propriedade);
            $valorReal = method_exists($objeto, $metodo) ? $objeto->$metodo() : $objeto->$propriedade;
            expect($valorReal)->toBe($valorEsperado);
        }
    }

    /**
     * @param mixed $valor
     * @return void
     */
    public static function validarAusencia($valor): void {
        expect($valor)->toBeNull();
    }

    /**
     * @param callable $fn
     * @return void
     */
    public static function esperarSucesso(callable $fn): void {
        expect($fn)->not->toThrow();
    }
}