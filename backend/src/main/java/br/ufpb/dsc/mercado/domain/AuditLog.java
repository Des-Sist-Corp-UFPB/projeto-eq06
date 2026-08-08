package br.ufpb.dsc.mercado.domain;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Entidade JPA que representa um registro de log de auditoria no sistema.
 */
@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "acao", nullable = false, length = 100)
    private String acao;

    @Column(name = "detalhes", columnDefinition = "TEXT")
    private String detalhes;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "usuario", length = 255)
    private String usuario;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @PrePersist
    protected void prePersist() {
        if (this.criadoEm == null) {
            this.criadoEm = Instant.now();
        }
    }

    public AuditLog() {
    }

    public AuditLog(String acao, String detalhes, String ipAddress, String usuario) {
        this.acao = acao;
        this.detalhes = detalhes;
        this.ipAddress = ipAddress;
        this.usuario = usuario;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAcao() {
        return acao;
    }

    public void setAcao(String acao) {
        this.acao = acao;
    }

    public String getDetalhes() {
        return detalhes;
    }

    public void setDetalhes(String detalhes) {
        this.detalhes = detalhes;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(Instant criadoEm) {
        this.criadoEm = criadoEm;
    }
}
