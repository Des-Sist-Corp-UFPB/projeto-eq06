CREATE TABLE mensagem (
    id BIGSERIAL PRIMARY KEY,
    produto_id BIGINT NOT NULL,
    remetente_id BIGINT NOT NULL,
    texto TEXT NOT NULL,
    enviada_em TIMESTAMP NOT NULL
);