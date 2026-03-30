# Intelligent Data Management & Recommendation System (IDMRS) 🚀

A production-ready, scalable, and secure Full Stack application designed to manage structured data (Expense Management) and generate intelligent insights via a rule-based recommendation engine.

---

## 🏗️ Architecture Explanation
The project is built using a **Modular Layered Architecture** for maximum scalability and clear separation of concerns:

1.  **Backend (Java 17 & Spring Boot 3)**:
    *   **Layered (Controller → Service → Repository)**: Adheres to SOLID principles for clean and maintainable logic.
    *   **Security Layer**: Implements **JWT-based Authentication** using Spring Security for stateless, secure API access.
    *   **Business Intelligence**: Features a specialized **Recommendation Engine** that analyzes data patterns to provide actionable spending suggestions.
2.  **Frontend (React 18 & Vite)**:
    *   **SPA Design**: Built for speed and a smooth, modern User Interface.
    *   **Secure API Integration**: Centralized Axios service with JWT interceptors for automated authentication.
3.  **Database (MySQL)**:
    *   **Efficient Schema**: Includes proper `1:N` relationships, primary/foreign keys, and data indexing for optimized performance.

---

## 🛠️ Project Setup Instructions

### 1. Prerequisites
*   **Java**: JDK 17+ installed.
*   **Database**: MySQL Server 8.0+ running.
*   **Web**: React.js 18+ & npm.

### 2. Backend Initialization
1.  Open `idmrs-backend/src/main/resources/application.properties`.
2.  Update `spring.datasource.username` and `spring.datasource.password` to match your local MySQL credentials.
3.  Execute the following:
    ```bash
    cd idmrs-backend
    mvn clean spring-boot:run
    ```
4.  The server will be live at [**http://localhost:8080**](http://localhost:8080).

### 3. Frontend Initialization
1.  Open a new terminal.
2.  Execute the following:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
3.  Access the web app at [**http://localhost:5173**](http://localhost:5173) (or 5174).

---

## 📡 API Documentation & Endpoints
The backend is fully self-documenting via **Swagger UI** and follows REST standards.

### **Documentation Links**
*   **Live Swagger UI**: [🚀 http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
*   **Postman/OpenAPI Spec**: [📥 http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### **Key API Routes**
| Category | Method | Endpoint | Auth Required |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | ❌ No |
| **Auth** | `POST` | `/api/v1/auth/login` | ❌ No |
| **Expense** | `GET/POST` | `/api/v1/expenses` | ✅ Yes (JWT) |
| **Insights**| `GET` | `/api/v1/insights` | ✅ Yes (JWT) |

---

## 🔥 Professional Compliance Summary
*   ✅ **Industry-Standard Security**: JWT with BCrypt password hashing.
*   ✅ **Clean Code**: DTO pattern for request/response separation.
*   ✅ **Robustness**: Global exception handling with appropriate HTTP status codes.
*   ✅ **Intelligence**: Analytical spending logic built into the service layer.
*   ✅ **Performance**: Data indexing and efficient query design.
*   ✅ **UI/UX**: Responsive, Glassmorphism design with Framer Motion animations.

---

## 🌐 Hosted Links
*   **Live Web Dashboard**: [🚀 https://idmrs-production-a092.up.railway.app/](https://idmrs-production-a092.up.railway.app/)
  
*   **Interactive API Documentation (Swagger UI)**: [📡 https://idmrs-production.up.railway.app/swagger-ui/index.html](https://idmrs-production.up.railway.app/swagger-ui/index.html)

---
