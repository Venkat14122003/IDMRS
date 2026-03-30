package com.idmrs.backend.service;

import com.idmrs.backend.entity.User;
import com.idmrs.backend.repository.ExpenseRepository;
import com.idmrs.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public Map<String, Object> generateInsights(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        
        List<Object[]> topCategories = expenseRepository.findTopSpendingCategories(user.getId(), thirtyDaysAgo);
        Double totalSpend = expenseRepository.sumAllExpenses(user.getId());
        if (totalSpend == null) totalSpend = 0.0;

        Map<String, Object> insights = new HashMap<>();
        insights.put("totalSpend", totalSpend);
        
        double budget = user.getMonthlyBudget() != null ? user.getMonthlyBudget() : 5000.0;
        insights.put("monthlyBudget", budget);
        insights.put("savings", Math.max(0, budget - totalSpend));

        if (topCategories.isEmpty()) {
            insights.put("recommendation", "Start tracking your expenses to see intelligent financial suggestions!");
            return insights;
        }

        Object[] highestCategory = topCategories.get(0);
        String category = (String) highestCategory[0];
        
        insights.put("topSpendingCategory", category);
        insights.put("recommendation", "Your highest spending is in " + category + ". We recommend reducing non-essential " + category + " purchases to increase your savings by up to 15%.");
        
        return insights;
    }
}

