-- Migração V3: Adicionar coluna de imagem na tabela de produto
ALTER TABLE produto ADD COLUMN imagem VARCHAR(2000);
