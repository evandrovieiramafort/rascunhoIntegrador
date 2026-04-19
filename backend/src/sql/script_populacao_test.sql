USE cefetshop_bd_test;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE item_carrinho;
TRUNCATE TABLE item;
TRUNCATE TABLE categoria_produto;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO categoria_produto (tipo_produto) VALUES 
('Bonés'), ('Canecas'), ('Camisetas'), ('Blusas de Frio'), ('Bermudas');

SET @cat_bones = (SELECT id FROM categoria_produto WHERE tipo_produto = 'Bonés');
SET @cat_canecas = (SELECT id FROM categoria_produto WHERE tipo_produto = 'Canecas');
SET @cat_camisetas = (SELECT id FROM categoria_produto WHERE tipo_produto = 'Camisetas');
SET @cat_frio = (SELECT id FROM categoria_produto WHERE tipo_produto = 'Blusas de Frio');
SET @cat_bermudas = (SELECT id FROM categoria_produto WHERE tipo_produto = 'Bermudas');

INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_camisetas, '/src/assets/img/camisa sistemas.png', 'Camiseta BSI', 'Teste Paginação 1', '2026-1', 45.00, 0.00, 50, 1000);
INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_bones, '/src/assets/img/bone cefet.png', 'Boné Teste', 'Teste Paginação 2', '2026-1', 35.00, 10.00, 15, 900);
INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_frio, '/src/assets/img/moletom cefet.png', 'Moletom Teste', 'Teste Paginação 3', '2026-1', 130.00, 0.00, 20, 800);
INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_bermudas, '/src/assets/img/bermuda cefet.png', 'Bermuda Teste', 'Teste Paginação 4', '2026-1', 60.00, 0.00, 25, 700);
INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_canecas, '/src/assets/img/caneca.png', 'Caneca Teste', 'Teste Paginação 5', '2026-1', 35.00, 5.00, 40, 600);
INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_camisetas, '/src/assets/img/camisa original.png', 'Camiseta Teste', 'Teste Paginação 6', '2026-1', 40.00, 0.00, 60, 500);

INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_frio, '/src/assets/img/moletom azul.png', 'Moletom Promo', 'Teste Paginação 7', '2026-1', 125.00, 15.00, 5, 400);
INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_frio, '/src/assets/img/moletom cinza.png', 'Moletom Cinza', 'Teste Paginação 8', '2026-1', 125.00, 0.00, 12, 300);
INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_frio, '/src/assets/img/moletom preto.png', 'Moletom Out', 'Teste Esgotado', '2026-1', 135.00, 0.00, 0, 200);
INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_canecas, '/src/assets/img/caneca.png', 'Caneca V2', 'Teste Paginação 10', '2026-1', 30.00, 0.00, 10, 100);
INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_bones, '/src/assets/img/bone cefet.png', 'Boné V2', 'Teste Paginação 11', '2026-1', 32.00, 0.00, 10, 50);
INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_camisetas, '/src/assets/img/camisa sistemas.png', 'Camiseta BSI V2', 'Teste Paginação 12', '2026-1', 48.00, 0.00, 10, 10);