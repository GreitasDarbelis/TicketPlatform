package com.ticketplatform.backend.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
public class LoggingAspect {

    // REQUIREMENT: Cross-cutting functionality/Interceptors
    // Logging all business logic (Service class) method invocations
    // without modifying the Service classes themselves. Changing logging logic
    // does not require recompiling or modifying the observed code.

    @Before("execution(* com.ticketplatform.backend.service.*.*(..))")
    public void logBeforeBusinessMethod(JoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        LocalDateTime time = LocalDateTime.now();
        
        // In practice, we would use SecurityContext to retrieve the logged-in user
        String user = "SYSTEM_OR_LOGGED_IN_USER"; 

        System.out.printf("[%s] Executing '%s.%s' on behalf of user: %s%n",
                time, className, methodName, user);
    }
}
