package br.ufpb.dsc.mercado.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(SpaController.class)
@AutoConfigureMockMvc(addFilters = false)
public class SpaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void forward_ReturnsIndexHtml() throws Exception {
        String[] routes = {"/main", "/login", "/favorites", "/criar-conta", "/info/1", "/checkout"};

        for (String route : routes) {
            mockMvc.perform(get(route))
                    .andExpect(status().isOk())
                    .andExpect(forwardedUrl("/index.html"));
        }
    }
}
