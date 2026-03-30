package com.idmrs.backend.controller;

import com.idmrs.backend.dto.ExpenseDto;
import com.idmrs.backend.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
@Tag(name = "Expense Management", description = "CRUD operations for expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @Operation(summary = "Create an expense")
    public ResponseEntity<ExpenseDto> createExpense(Authentication authentication, @RequestBody ExpenseDto dto) {
        return ResponseEntity.ok(expenseService.createExpense(authentication.getName(), dto));
    }

    @GetMapping
    @Operation(summary = "Get all expenses with pagination")
    public ResponseEntity<Page<ExpenseDto>> getExpenses(Authentication authentication, Pageable pageable) {
        return ResponseEntity.ok(expenseService.getUserExpenses(authentication.getName(), pageable));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter expenses by category or date range")
    public ResponseEntity<Page<ExpenseDto>> filterExpenses(
            Authentication authentication,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) LocalDate start,
            @RequestParam(required = false) LocalDate end,
            Pageable pageable) {
        return ResponseEntity.ok(expenseService.filterExpenses(authentication.getName(), category, start, end, pageable));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an expense")
    public ResponseEntity<ExpenseDto> updateExpense(
            Authentication authentication, 
            @PathVariable Long id, 
            @RequestBody ExpenseDto dto) {
        return ResponseEntity.ok(expenseService.updateExpense(id, authentication.getName(), dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense")
    public ResponseEntity<Void> deleteExpense(Authentication authentication, @PathVariable Long id) {
        expenseService.deleteExpense(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
