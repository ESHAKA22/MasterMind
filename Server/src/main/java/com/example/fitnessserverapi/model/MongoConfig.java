package com.example.fitnessserverapi.model;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.mapping.Document;

@Configuration
@EnableMongoAuditing
@Document()
 class MongoConfig {
}
