USE cefetshop_test;

INSERT INTO aluno (matricula, email, senha, saldo_cefetins) VALUES
('2025100123', 'evandro.mafort@aluno.cefet-rj.br', 'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413', 250.00),
('2024200456', 'maria.silva@aluno.cefet-rj.br', 'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413', 50.00);


INSERT INTO historico_disciplina (aluno_matricula, nome_disciplina, media_final, vezes_cursada, saldo_cefetins) VALUES
('2025100123', 'Projeto Integrador de Sistemas', 9.50, 1, 47.50),
('2025100123', 'Cálculo A', 8.00, 2, 8.00),
('2024200456', 'Banco de Dados', 7.50, 1, 37.50);


INSERT INTO item (categoria, foto, descricao, descricao_detalhada, periodo_lancamento, preco_venda, percentual_desconto, quantidade_estoque) VALUES
('CANECA', '/img/caneca-sistemas.jpg', 'Caneca de Porcelana BSI', 'Caneca oficial do curso de Bacharelado em Sistemas de Informação, 325ml.', '2026-1', 45.00, 0.00, 15),
('BLUSA_FRIO', '/img/moletom-cefet.jpg', 'Moletom CEFET Canguru', 'Moletom grosso na cor azul marinho com escudo bordado.', '2025-2', 120.00, 10.00, 5), -- Estoque baixo para testar limite de seletor
('CAMISETA', '/img/camisa-algodao.jpg', 'Camisa Algodão Básica', 'Camisa 100% algodão com estampa minimalista.', '2026-1', 50.00, 5.00, 20),
('BONÉ', '/img/bone-aba-reta.jpg', 'Boné Aba Reta Preto', 'Boné ajustável com logo em relevo.', '2025-1', 35.00, 0.00, 0), -- Testar regra de "Esgotado"
('PULSEIRA', '/img/pulseira-silicone.jpg', 'Pulseira de Silicone', 'Pulseira azul e vermelha do CEFET.', '2026-1', 10.00, 0.00, 50),
('BROCHE', '/img/pin-metal.jpg', 'Pin Metálico Engrenagem', 'Broche para mochila em formato de engrenagem.', '2024-2', 15.00, 20.00, 8),
('CALÇA', '/img/calca-moletom.jpg', 'Calça de Moletom Cinza', 'Calça confortável para os dias de frio no campus.', '2026-1', 90.00, 0.00, 12);


INSERT INTO carrinho (aluno_matricula, total_geral) VALUES
('2025100123', 90.00);


INSERT INTO item_carrinho (carrinho_aluno_matricula, item_id, quantidade, subtotal) VALUES
('2025100123', 1, 2, 90.00);


INSERT INTO compra (numero_compra, aluno_matricula, valor_total, data_compra) VALUES
('PED-2026A-001', '2024200456', 35.00, '2026-04-15 14:30:00');


INSERT INTO item_compra (compra_numero, item_id, quantidade, preco_unitario, subtotal) VALUES
('PED-2026A-001', 4, 1, 35.00, 35.00);