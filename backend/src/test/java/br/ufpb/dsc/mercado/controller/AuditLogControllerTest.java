package br.ufpb.dsc.mercado.controller;

import br.ufpb.dsc.mercado.domain.AuditLog;
import br.ufpb.dsc.mercado.repository.AuditLogRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuditLogController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuditLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuditLogRepository auditLogRepository;

    @Test
    void listar_RetornaPaginaDeLogs() throws Exception {
        AuditLog log = new AuditLog("USER_LOGIN_SUCCESS", "Admin logou", "127.0.0.1", "admin");
        Page<AuditLog> page = new PageImpl<>(List.of(log));

        when(auditLogRepository.findAll(any(PageRequest.class))).thenReturn(page);

        mockMvc.perform(get("/api/auditoria")
                        .param("pagina", "0")
                        .param("tamanho", "15")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].acao").value("USER_LOGIN_SUCCESS"))
                .andExpect(jsonPath("$.content[0].usuario").value("admin"));

        verify(auditLogRepository, times(1)).findAll(any(PageRequest.class));
    }
}
