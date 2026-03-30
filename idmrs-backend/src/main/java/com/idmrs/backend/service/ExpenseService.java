package com.idmrs.backend.service;

import com.idmrs.backend.dto.ExpenseDto;
import com.idmrs.backend.entity.Expense;
import com.idmrs.backend.entity.User;
import com.idmrs.backend.repository.ExpenseRepository;
import com.idmrs.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseDto createExpense(String email, ExpenseDto expenseDto) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        Expense expense = Expense.builder()
                .title(expenseDto.getTitle())
                .description(expenseDto.getDescription())
                .amount(expenseDto.getAmount())
                .category(expenseDto.getCategory())
                .expenseDate(expenseDto.getExpenseDate())
                .user(user)
                .build();
                
        Expense saved = expenseRepository.save(expense);
        return mapToDto(saved);
    }

    public Page<ExpenseDto> getUserExpenses(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return expenseRepository.findByUserId(user.getId(), pageable).map(this::mapToDto);
    }

    public ExpenseDto updateExpense(Long id, String email, ExpenseDto dto) {
        Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        expense.setTitle(dto.getTitle());
        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setCategory(dto.getCategory());
        expense.setExpenseDate(dto.getExpenseDate());
        return mapToDto(expenseRepository.save(expense));
    }

    public void deleteExpense(Long id, String email) {
        Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        expenseRepository.delete(expense);
    }

    public Page<ExpenseDto> filterExpenses(String email, String category, LocalDate start, LocalDate end, Pageable pageable) {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (category != null) {
            return expenseRepository.findByUserIdAndCategory(user.getId(), category, pageable).map(this::mapToDto);
        } else if (start != null && end != null) {
            return expenseRepository.findByUserIdAndExpenseDateBetween(user.getId(), start, end, pageable).map(this::mapToDto);
        }
        return getUserExpenses(email, pageable);
    }

    private ExpenseDto mapToDto(Expense expense) {
        return ExpenseDto.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .expenseDate(expense.getExpenseDate())
                .build();
    }
}
