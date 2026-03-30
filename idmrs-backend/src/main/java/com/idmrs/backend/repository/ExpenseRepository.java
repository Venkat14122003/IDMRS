package com.idmrs.backend.repository;

import com.idmrs.backend.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    Page<Expense> findByUserId(Long userId, Pageable pageable);
    
    // Filtering by category
    Page<Expense> findByUserIdAndCategory(Long userId, String category, Pageable pageable);
    
    // Filtering by dates
    Page<Expense> findByUserIdAndExpenseDateBetween(Long userId, LocalDate start, LocalDate end, Pageable pageable);

    // Predictive/Recommendation queries
    List<Expense> findByUserIdAndExpenseDateAfter(Long userId, LocalDate date);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.expenseDate >= :startDate GROUP BY e.category ORDER BY SUM(e.amount) DESC")
    List<Object[]> findTopSpendingCategories(Long userId, LocalDate startDate);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId")
    Double sumAllExpenses(Long userId);
}
