package br.ufpb.dsc.mercado;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Teste de carregamento do contexto Spring Boot.
     *
     * <p><strong>O que este teste verifica?</strong><br>
     * @SpringBootTest inicializa o contexto completo do Spring Boot e verifica se
     * todos os beans sao criados corretamente, sem erros de configuracao ou dependencias
     * circulares. Eh o teste mais basico e deve sempre passar.
     *
     * <p><strong>@ActiveProfiles("test"):</strong><br>
     * Ativa o perfil "test", que usa as configuracoes de application-test.yml.
     * Isso garante que os testes usem um banco de dados isolado (Testcontainers)
                                                                   * em vez do banco de desenvolvimento.
     *
     * <p><strong>Testcontainers:</strong><br>
     * Para que este teste funcione, o Docker deve estar rodando.
     * O Testcontainers sobe automaticamente um container PostgreSQL para os testes
     * e o derruba ao final. Isso garante que os testes de integracao usem um banco
     * real, identico ao de producao, sem depender de configuracoes locais.
     *
     * @author DSC - UFPB Campus IV
     */
@SpringBootTest
    @Testcontainers
    @ActiveProfiles("test")
    class MercadoApplicationTests {


    @Container
            @ServiceConnection
            static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Test
            void contextLoads() {
            }

    }
