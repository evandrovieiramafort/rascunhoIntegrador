USE cefetshop_bd_prd;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE item_carrinho;
TRUNCATE TABLE item;
TRUNCATE TABLE categoria_produto;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO categoria_produto (tipo_produto) VALUES ('Bonés');
SET @cat_bones = LAST_INSERT_ID();

INSERT INTO categoria_produto (tipo_produto) VALUES ('Canecas');
SET @cat_canecas = LAST_INSERT_ID();

INSERT INTO categoria_produto (tipo_produto) VALUES ('Camisetas');
SET @cat_camisetas = LAST_INSERT_ID();

INSERT INTO categoria_produto (tipo_produto) VALUES ('Blusas de Frio');
SET @cat_frio = LAST_INSERT_ID();

INSERT INTO categoria_produto (tipo_produto) VALUES ('Bermudas');
SET @cat_bermudas = LAST_INSERT_ID();

INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_camisetas, 'frontend/img/camisa sistemas.png', 'Camiseta Sistemas de Informação', 'Camiseta azul marinho com estampa exclusiva do curso de BSI.', '2026-1', 45.00, 0.00, 50, 100);

INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_bones, 'frontend/img/bone cefet.png', 'Boné CEFET/RJ', 'Boné azul marinho com bordado branco de alta qualidade.', '2025-2', 35.00, 10.00, 15, 85);

INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_frio, 'frontend/img/moletom cefet.png', 'Moletom CEFET/RJ Grafite', 'Moletom com capuz e estampa central clássica.', '2026-1', 130.00, 0.00, 20, 70);

INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_bermudas, 'frontend/img/bermuda cefet.png', 'Bermuda Sarja CEFET', 'Bermuda azul escuro em sarja, confortável e resistente.', '2026-1', 60.00, 0.00, 25, 60);

INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_canecas, 'frontend/img/caneca.png', 'Caneca Programador', 'Caneca de cerâmica branca com estampa lateral "Programador".', '2026-1', 35.00, 5.00, 40, 55);

INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_camisetas, 'frontend/img/camisa original.png', 'Camiseta CEFET Branca', 'Camiseta branca oficial com logo no peito.', '2025-1', 40.00, 0.00, 60, 40);

INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_frio, 'frontend/img/moletom azul.png', 'Moletom Azul Marinho', 'Moletom liso com logo discreto no peito.', '2026-1', 125.00, 15.00, 8, 30);

INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_frio, 'frontend/img/moletom cinza.png', 'Moletom Cinza Mescla', 'Blusa de frio em moletom cinza com estampa lateral.', '2026-1', 125.00, 0.00, 12, 15);

INSERT INTO item (categoria_id, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque, total_vendas) 
VALUES (@cat_frio, 'frontend/img/moletom preto.png', 'Moletom Preto Minimalista', 'Moletom preto básico com logo bordado.', '2026-1', 135.00, 0.00, 0, 5);