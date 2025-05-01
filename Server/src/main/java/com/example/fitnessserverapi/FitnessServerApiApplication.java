package com.example.fitnessserverapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class FitnessServerApiApplication {

    @CrossOrigin(origins = "http://localhost:8080")

    public static void main(String[] args) {
        SpringApplication.run(FitnessServerApiApplication.class, args);
    }

    @GetMapping("/")
    public String rootEndpoint() {
        return "Hello World!";
    }


}
