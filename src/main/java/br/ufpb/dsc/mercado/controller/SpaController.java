package br.ufpb.dsc.mercado.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller responsável por encaminhar as rotas do frontend (React Router)
 * para o index.html, permitindo que a navegação do lado do cliente funcione.
 */
@Controller
public class SpaController {

    @RequestMapping(value = {
        "/home",
        "/login",
        "/favorites",
        "/criar-conta",
        "/info/{id}",
        "/checkout"
    })
    public String forward() {
        // Encaminha internamente para o index.html gerado pelo React
        return "forward:/index.html";
    }
}
