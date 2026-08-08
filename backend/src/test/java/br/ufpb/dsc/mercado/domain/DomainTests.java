package br.ufpb.dsc.mercado.domain;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class DomainTests {

    @Test
    void testProduto() {
        Produto p = new Produto();
        p.setId(1L);
        p.setNome("Nome");
        p.setDescricao("Desc");
        p.setPreco(BigDecimal.TEN);
        p.setImagem("img.png");
        p.setCriadoEm(java.time.Instant.MIN);
        p.setAtualizadoEm(java.time.Instant.MAX);

        assertEquals(1L, p.getId());
        assertEquals("Nome", p.getNome());
        assertEquals("Desc", p.getDescricao());
        assertEquals(BigDecimal.TEN, p.getPreco());
        assertEquals("img.png", p.getImagem());
        assertEquals(java.time.Instant.MIN, p.getCriadoEm());
        assertEquals(java.time.Instant.MAX, p.getAtualizadoEm());

        p.prePersist();
        assertNotNull(p.getCriadoEm());
        assertNotNull(p.getAtualizadoEm());
        
        p.preUpdate();
        assertNotNull(p.getAtualizadoEm());

        Produto p2 = new Produto("Nome", "Desc", BigDecimal.TEN);
        assertNull(p2.getId());
        assertEquals("Nome", p2.getNome());
        p2.setImagem("teste.png");
        assertEquals("teste.png", p2.getImagem());
    }

    @Test
    void testUsuario() {
        Usuario u = new Usuario();
        u.setId(1L);
        u.setNome("Nome");
        u.setEmail("email@email.com");
        u.setSenha("123");
        u.setCriadoEm(LocalDateTime.MIN);
        u.setAtualizadoEm(LocalDateTime.MAX);

        assertEquals(1L, u.getId());
        assertEquals("Nome", u.getNome());
        assertEquals("email@email.com", u.getEmail());
        assertEquals("123", u.getSenha());
        assertEquals(LocalDateTime.MIN, u.getCriadoEm());
        assertEquals(LocalDateTime.MAX, u.getAtualizadoEm());

        u.onCreate();
        assertNotNull(u.getCriadoEm());
        assertNotNull(u.getAtualizadoEm());

        u.onUpdate();
        assertNotNull(u.getAtualizadoEm());
    }

    @Test
    void testFavorito() {
        Favorito f = new Favorito();
        f.setId(1L);
        
        Usuario u = new Usuario();
        u.setId(2L);
        f.setUsuario(u);
        
        Produto p = new Produto();
        p.setId(3L);
        f.setProduto(p);
        
        f.setCriadoEm(LocalDateTime.MIN);

        assertEquals(1L, f.getId());
        assertEquals(2L, f.getUsuario().getId());
        assertEquals(3L, f.getProduto().getId());
        assertEquals(LocalDateTime.MIN, f.getCriadoEm());

        f.onCreate();
        assertNotNull(f.getCriadoEm());
    }

    @Test
    void testAuditLog() {
        AuditLog al = new AuditLog();
        al.setId(1L);
        al.setAcao("ACAO");
        al.setDetalhes("DETALHES");
        al.setIpAddress("IP");
        al.setUsuario("USER");
        al.setCriadoEm(java.time.Instant.MIN);

        assertEquals(1L, al.getId());
        assertEquals("ACAO", al.getAcao());
        assertEquals("DETALHES", al.getDetalhes());
        assertEquals("IP", al.getIpAddress());
        assertEquals("USER", al.getUsuario());
        assertEquals(java.time.Instant.MIN, al.getCriadoEm());

        al.prePersist();
        assertNotNull(al.getCriadoEm());

        AuditLog al2 = new AuditLog("ACAO2", "DETALHES2", "IP2", "USER2");
        assertNull(al2.getId());
        assertEquals("ACAO2", al2.getAcao());
    }

    @Test
    void testMensagem() {
        Mensagem m = new Mensagem();
        m.setProdutoId(1L);
        m.setRemetenteId(2L);
        m.setTexto("TEXTO");
        
        assertEquals(1L, m.getProdutoId());
        assertEquals(2L, m.getRemetenteId());
        assertEquals("TEXTO", m.getTexto());
        
        m.prePersist();
        assertNotNull(m.getEnviadaEm());
    }
}
