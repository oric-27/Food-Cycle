package com.yno.foodcyclebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
@CrossOrigin
public class FoodcycleBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodcycleBackendApplication.class, args);
    }

}
