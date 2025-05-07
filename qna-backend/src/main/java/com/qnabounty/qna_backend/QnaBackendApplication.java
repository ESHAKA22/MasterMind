package com.qnabounty.qna_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing  // This enables support for @CreatedDate
public class QnaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(QnaBackendApplication.class, args);
	}
}
