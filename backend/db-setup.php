<?php

function realizarSetup(string $ambiente, array $config): void {
    $sufixo = ($ambiente === 'test') ? 'TEST' : 'PROD';
    
    $db      = $config["DB_NAME_$sufixo"];
    $usuario = $config['DB_USER'];
    $senha   = $config['DB_PASS'];

    $arquivoEstrutura = "src/sql/cefetshop_bd_$ambiente.sql";
    $arquivoPopulacao = "src/sql/script_populacao_$ambiente.sql";

    echo "===========================================================\n";
    echo "[INFO] Iniciando SETUP do banco de " . strtoupper($ambiente) . ": $db\n";
    echo "===========================================================\n";

    $comando = "mysql -u $usuario --password=\"$senha\" $db < $arquivoEstrutura && mysql -u $usuario --password=\"$senha\" $db < $arquivoPopulacao";

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


$config = require __DIR__ . '/env.php';
$ambienteSolicitado = $argv[1];
realizarSetup($ambienteSolicitado, $config);