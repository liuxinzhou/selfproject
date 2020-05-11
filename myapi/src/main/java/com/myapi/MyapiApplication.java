package com.myapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.UUID;

@SpringBootApplication
public class MyapiApplication {

    public static void main(String[] args) {
        UUID.randomUUID();
        SpringApplication.run(MyapiApplication.class, args);
    }

}
