DROP DATABASE IF EXISTS `cefetshop_bd_prd`;
CREATE DATABASE IF NOT EXISTS cefetshop_bd_prd DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE cefetshop_bd_prd;

CREATE TABLE categoria_produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_produto VARCHAR(50) NOT NULL UNIQUE
) ENGINE=INNODB;

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
    total_vendas INT DEFAULT 0,
    FOREIGN KEY (categoria_id) REFERENCES categoria_produto(id)
) ENGINE=INNODB;

CREATE TABLE carrinho (
    id VARCHAR(50) PRIMARY KEY,
    total_geral DECIMAL(10,2) NOT NULL DEFAULT 0.00 
) ENGINE=INNODB;

CREATE TABLE item_carrinho (
    carrinho_id VARCHAR(50) NOT NULL,
    item_id INT NOT NULL,
    quantidade INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL, 
    PRIMARY KEY (carrinho_id, item_id),
    FOREIGN KEY (carrinho_id) REFERENCES carrinho(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE
) ENGINE=INNODB;