package br.ufpb.dsc.mercado.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;

@WebMvcTest(PingController.class)
@AutoConfigureMockMvc(addFilters = false)
public class PingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @Test
    void ping_ReturnsStatusOk_WhenDatabaseIsUp() throws Exception {
        doNothing().when(jdbcTemplate).execute(anyString());

        mockMvc.perform(get("/ping"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"))
                .andExpect(jsonPath("$.service").value("eq06"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void ping_ReturnsStatusServiceUnavailable_WhenDatabaseIsDown() throws Exception {
        doThrow(new RuntimeException("Database error")).when(jdbcTemplate).execute(anyString());

        mockMvc.perform(get("/ping"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.service").value("eq06"))
                .andExpect(jsonPath("$.database").value("down"))
                .andExpect(jsonPath("$.timestamp").exists());
    }
}
