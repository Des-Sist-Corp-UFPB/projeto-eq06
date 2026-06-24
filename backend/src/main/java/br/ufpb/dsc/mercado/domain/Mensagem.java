package br.ufpb.dsc.mercado.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "mensagem")
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long produtoId;

    private Long remetenteId;

    @Column(columnDefinition = "TEXT")
    private String texto;

    private Instant enviadaEm;

    @PrePersist
    protected void prePersist() {
        enviadaEm = Instant.now();
    }

    public Mensagem() {
    }

    public Mensagem(Long produtoId, Long remetenteId, String texto) {
        this.produtoId = produtoId;
        this.remetenteId = remetenteId;
        this.texto = texto;
    }

    public Long getId() {
        return id;
    }

    public Long getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    public Long getRemetenteId() {
        return remetenteId;
    }

    public void setRemetenteId(Long remetenteId) {
        this.remetenteId = remetenteId;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public Instant getEnviadaEm() {
        return enviadaEm;
    }
}