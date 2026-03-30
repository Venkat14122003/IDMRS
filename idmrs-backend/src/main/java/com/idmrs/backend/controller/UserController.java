package com.idmrs.backend.controller;

import com.idmrs.backend.entity.User;
import com.idmrs.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @PutMapping("/budget")
    public ResponseEntity<Void> updateBudget(Authentication authentication, @RequestBody Map<String, Double> payload) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        user.setMonthlyBudget(payload.get("budget"));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
}
