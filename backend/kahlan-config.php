<?php

// Esse código vai rodar assim que o kahlan for disparado
require_once __DIR__ . '/spec/SpecHelper.php'; // só pra fazer o SpecHelper ser detectado
$basePath = __DIR__ . '/vendor/phputil/router/src/'; // caminho absoluto + localização da pasta onde o router está

$routerSrc = realpath($basePath); // vê se a pasta existe
if ($routerSrc) {
    // inclui o basePath na busca do php pelas pastas padrão quando um include ou require está presente no código
    set_include_path(get_include_path() . PATH_SEPARATOR . $routerSrc);
}

// Faz o carregamento manual dos códigos da phputil/router utilizando do caminho absoluto se o arquivo http.php existir
if (file_exists($basePath . 'http.php')) {
    require_once $basePath . 'http.php';
    require_once $basePath . 'HttpRequest.php';
    require_once $basePath . 'HttpResponse.php';
    require_once $basePath . 'Router.php';
    require_once $basePath . 'RouterOptions.php';
    require_once $basePath . 'FakeHttpRequest.php';
    require_once $basePath . 'FakeHttpResponse.php';
}

// Carrega as funções do Kahlan que estavam dando problema - isso aqui já é outra treta
// Se a execução dos testes do back quebrar, só descomentar esse trecho de código
/* $functions = __DIR__ . '/vendor/kahlan/kahlan/src/functions.php';
if (file_exists($functions)) {
    require_once $functions;
}*/

/** 
 * e assim que for finalizado, os arquivos do router e as funções do kahlan 
 * vão ser carregadas junto com o resto do framework
 */