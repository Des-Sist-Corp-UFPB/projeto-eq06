package br.ufpb.dsc.mercado.service;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FileStorageServiceTest {

    private FileStorageService fileStorageService;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService();
    }

    @Test
    @DisplayName("Deve armazenar o arquivo e retornar a URL correta com UUID")
    void storeFile_deveArmazenarERetornarUrl() {
        // GIVEN
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "produto.jpg",
                "image/jpeg",
                "conteudo_fake_da_imagem".getBytes()
        );

        // WHEN
        String urlDestino = fileStorageService.storeFile(file);

        // THEN
        assertThat(urlDestino).startsWith("/uploads/");
        assertThat(urlDestino).endsWith(".jpg");
        assertThat(urlDestino).isNotEqualTo("/uploads/produto.jpg"); // Tem que ter gerado UUID

        // Verifica se o arquivo foi fisicamente criado na pasta
        String fileName = urlDestino.replace("/uploads/", "");
        Path savedFile = Paths.get("uploads").resolve(fileName);
        assertThat(Files.exists(savedFile)).isTrue();
        
        // Limpeza do arquivo criado pelo teste
        try {
            Files.deleteIfExists(savedFile);
        } catch (IOException ignored) {}
    }

    @Test
    @DisplayName("Deve lançar exceção se o nome do arquivo contiver path traversal (..)")
    void storeFile_deveLancarExcecaoParaPathTraversal() {
        // GIVEN
        MockMultipartFile invalidFile = new MockMultipartFile(
                "file",
                "../produto.jpg",
                "image/jpeg",
                "conteudo_fake_da_imagem".getBytes()
        );

        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.storeFile(invalidFile))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Desculpe! O nome do arquivo contém uma sequência de caminho inválida");
    }

    @Test
    @DisplayName("Deve tratar arquivos sem extensão")
    void storeFile_deveTratarArquivoSemExtensao() {
        // GIVEN
        MockMultipartFile fileWithoutExtension = new MockMultipartFile(
                "file",
                "produto_sem_extensao",
                "image/jpeg",
                "conteudo".getBytes()
        );

        // WHEN
        String urlDestino = fileStorageService.storeFile(fileWithoutExtension);

        // THEN
        assertThat(urlDestino).startsWith("/uploads/");
        assertThat(urlDestino).doesNotContain(".jpg");
        
        String fileName = urlDestino.replace("/uploads/", "");
        Path savedFile = Paths.get("uploads").resolve(fileName);
        assertThat(Files.exists(savedFile)).isTrue();

        // Limpeza
        try {
            Files.deleteIfExists(savedFile);
        } catch (IOException ignored) {}
    }
}
