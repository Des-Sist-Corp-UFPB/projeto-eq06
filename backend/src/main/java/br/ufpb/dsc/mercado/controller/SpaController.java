package br.ufpb.dsc.mercado.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller responsável por encaminhar as rotas do frontend (React Router)
 * para o index.html, permitindo que a navegação do lado do cliente funcione.
 */
@Controller
public class SpaController {

    @GetMapping(value = {
        "/main",
        "/login",
        "/favorites",
        "/criar-conta",
        "/info/{id}",
        "/checkout",
        "/auditoria"
    })
    public String forward() {
        // Encaminha internamente para o index.html gerado pelo React
        return "forward:/index.html";
    }
}
