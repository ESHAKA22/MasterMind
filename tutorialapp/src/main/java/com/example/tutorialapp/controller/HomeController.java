package com.example.tutorialapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
  @GetMapping("/Home")
    @ResponseBody
    public String home() {
        return "Welcome to the Home Page!";
    }

    @GetMapping("/")
    @ResponseBody
    public String root() {
        return "Welcome to the Root Page!";
    }
 }