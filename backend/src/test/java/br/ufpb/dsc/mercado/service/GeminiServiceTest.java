package br.ufpb.dsc.mercado.service;

import br.ufpb.dsc.mercado.dto.GeminiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GeminiServiceTest {

    @InjectMocks
    private GeminiService geminiService;

    private RestClient restClient;
    private RestClient.RequestBodyUriSpec requestBodyUriSpec;
    private RestClient.RequestBodySpec requestBodySpec;
    private RestClient.ResponseSpec responseSpec;

    @BeforeEach
    void setUp() {
        // Inicializa os mocks fluentes para o RestClient
        restClient = mock(RestClient.class);
        requestBodyUriSpec = mock(RestClient.RequestBodyUriSpec.class);
        requestBodySpec = mock(RestClient.RequestBodySpec.class);
        responseSpec = mock(RestClient.ResponseSpec.class);

        // Injeta os campos necessários na instância da classe de teste
        ReflectionTestUtils.setField(geminiService, "apiKey", "test-key");
        ReflectionTestUtils.setField(geminiService, "restClient", restClient);
    }

    @Test
    void perguntar_ComSucesso_RetornaTextoDaIA() {
        // GIVEN
        GeminiResponse.Part part = new GeminiResponse.Part("Resposta simulada");
        GeminiResponse.Content content = new GeminiResponse.Content(List.of(part));
        GeminiResponse.Candidate candidate = new GeminiResponse.Candidate(content);
        GeminiResponse mockResponse = new GeminiResponse(List.of(candidate));

        when(restClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(Map.class))).thenReturn(requestBodySpec);
        when(requestBodySpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(GeminiResponse.class)).thenReturn(mockResponse);

        // WHEN
        String resultado = geminiService.perguntar("Olá, teste.");

        // THEN
        assertNotNull(resultado);
        assertEquals("Resposta simulada", resultado);
        verify(restClient, times(1)).post();
    }
}
