-- Migração V5: Criação da tabela de Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    acao VARCHAR(100) NOT NULL,
    detalhes TEXT,
    ip_address VARCHAR(45),
    usuario VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar a performance de buscas no painel de auditoria
CREATE INDEX idx_audit_log_acao ON audit_log (acao);
CREATE INDEX idx_audit_log_usuario ON audit_log (usuario);

COMMENT ON TABLE audit_log IS 'Tabela para registro de ações de auditoria';
COMMENT ON COLUMN audit_log.acao IS 'Nome da ação realizada (ex: LOGIN_SUCCESS)';
COMMENT ON COLUMN audit_log.detalhes IS 'Payload ou detalhes adicionais (em JSON preferencialmente)';
COMMENT ON COLUMN audit_log.ip_address IS 'IP do usuário que realizou a ação';
COMMENT ON COLUMN audit_log.usuario IS 'E-mail ou ID do usuário que realizou a ação';
