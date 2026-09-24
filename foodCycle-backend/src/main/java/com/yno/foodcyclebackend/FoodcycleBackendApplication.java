package com.yno.foodcyclebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FoodcycleBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodcycleBackendApplication.class, args);
    }

}
