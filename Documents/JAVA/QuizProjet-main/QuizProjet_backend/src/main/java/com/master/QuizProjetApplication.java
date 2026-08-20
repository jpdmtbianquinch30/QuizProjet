package com.master;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class QuizProjetApplication {
    public static void main(String[] args) {
        SpringApplication.run(QuizProjetApplication.class, args);
    }
}