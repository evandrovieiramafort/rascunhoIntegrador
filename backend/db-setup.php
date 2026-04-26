<?php

function realizarSetup(string $ambiente, array $config): void {
    // verifica qual sufixo veio em $ambiente
    $sufixo = ($ambiente === 'test') ? 'TEST' : 'PROD';
    
    // pega as variáveis no env.php
    $db      = $config["DB_NAME_$sufixo"];
    $usuario = $config['DB_USER'];
    $senha   = $config['DB_PASS'];

    // cria as strings de endereço dos scripts sql
    $arquivoEstrutura = "src/sql/cefetshop_bd_$ambiente.sql";
    $arquivoPopulacao = "src/sql/script_populacao_$ambiente.sql";

    echo "===========================================================\n";
    echo "[INFO] Iniciando SETUP do banco de " . strtoupper($ambiente) . ": $db\n";
    echo "===========================================================\n";

    // Monta o comando com as variáveis definidas
    $comando = "mysql -u $usuario --password=\"$senha\" $db < $arquivoEstrutura && mysql -u $usuario --password=\"$senha\" $db < $arquivoPopulacao";

    // Roda o comando com a variável mágica $status (importante pro if/else abaixo)
    system($comando, $status);

    echo "===========================================================\n";
    if ($status === 0) {
        echo "[INFO] $db criado, configurado e populado com sucesso.\n";
    } else {
        echo "[ERRO] Falha na execução; Verifique as suas credenciais e se bin do MariaDB está no PATH.\n";
        exit(1);
    }
    echo "===========================================================\n";
}


$config = require __DIR__ . '/env.php'; // carrega o env.php
$ambienteSolicitado = $argv[1]; // pega o primeiro argumento do comando que está no composer ("prd" ou "test")

// realizarSetup("prd"/"test", array dos argumentos que vem do env.php)
realizarSetup($ambienteSolicitado, $config);