package br.ufpb.dsc.mercado.controller;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.startsWith;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(PingController.class)
@AutoConfigureMockMvc(addFilters = false)
public class PingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @Test
    void ping_DatabaseUp_ReturnsStatusOkAndDbUp() throws Exception {
        Mockito.when(jdbcTemplate.queryForObject("SELECT 1", Integer.class)).thenReturn(1);

        mockMvc.perform(get("/ping"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"))
                .andExpect(jsonPath("$.database").value("up"))
                .andExpect(jsonPath("$.service").value("eq06"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void ping_DatabaseDown_ReturnsServiceUnavailable() throws Exception {
        Mockito.when(jdbcTemplate.queryForObject("SELECT 1", Integer.class))
                .thenThrow(new RuntimeException("Connection timed out"));

        mockMvc.perform(get("/ping"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.database").value(startsWith("down (Connection timed out)")))
                .andExpect(jsonPath("$.service").value("eq06"))
                .andExpect(jsonPath("$.timestamp").exists());
    }
}
