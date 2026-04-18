CREATE DATABASE IF NOT EXISTS cefet_shop_prod;
CREATE DATABASE IF NOT EXISTS cefet_shop_test;

USE cefetshop_prd;


CREATE TABLE aluno (
    matricula VARCHAR(20) PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha CHAR(128) NOT NULL,
    saldo_cefetins DECIMAL(10,2) NOT NULL DEFAULT 0.00
);


CREATE TABLE historico_disciplina (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_matricula VARCHAR(20) NOT NULL,
    nome_disciplina VARCHAR(100) NOT NULL,
    media_final DECIMAL(4,2) NOT NULL,
    vezes_cursada INT NOT NULL,
    saldo_cefetins DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (aluno_matricula) REFERENCES aluno(matricula) ON DELETE CASCADE
);


CREATE TABLE categoria_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    foto VARCHAR(255) NOT NULL,
    descricao VARCHAR(150) NOT NULL,
    descricao_detalhada TEXT NOT NULL,
    periodo_lancamento VARCHAR(10) NOT NULL,
    preco_venda DECIMAL(10,2) NOT NULL,
    percentual_desconto DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    quantidade_estoque INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categoria_item(id)
);


CREATE TABLE carrinho (
    id VARCHAR(50) PRIMARY KEY, -- Pode ser um UUID ou ID de Sessão PHP
    aluno_matricula VARCHAR(20) NULL, -- Permite NULL se não estiver logado
    total_geral DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (aluno_matricula) REFERENCES aluno(matricula) ON DELETE CASCADE
);


CREATE TABLE item_carrinho (
    carrinho_id VARCHAR(50) NOT NULL,
    item_id INT NOT NULL,
    quantidade INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (carrinho_id, item_id),
    FOREIGN KEY (carrinho_id) REFERENCES carrinho(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE
);


CREATE TABLE compra (
    numero_compra VARCHAR(50) PRIMARY KEY,
    aluno_matricula VARCHAR(20) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    data_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_matricula) REFERENCES aluno(matricula)
);


CREATE TABLE item_compra (
    compra_numero VARCHAR(50) NOT NULL,
    item_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (compra_numero, item_id),
    FOREIGN KEY (compra_numero) REFERENCES compra(numero_compra) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item(id)
);