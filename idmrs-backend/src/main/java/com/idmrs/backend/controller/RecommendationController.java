package com.idmrs.backend.controller;

import com.idmrs.backend.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/insights")
@RequiredArgsConstructor
@Tag(name = "Intelligent Insights", description = "Provides recommendations based on user data")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    @Operation(summary = "Get spending insights and recommendations")
    public ResponseEntity<Map<String, Object>> getInsights(Authentication authentication) {
        return ResponseEntity.ok(recommendationService.generateInsights(authentication.getName()));
    }
}
