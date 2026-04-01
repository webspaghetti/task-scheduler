package xyz.webspaghetti.schedulerserver.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Around("within(@org.springframework.web.bind.annotation.RestController *)") // Everything annotated with @RestController
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {

        String methodName = joinPoint.getSignature().toShortString();

        if (log.isDebugEnabled()) {
            log.debug("--> Entering {}", methodName); // Inbound
        }

        long start = System.nanoTime();

        try {

            Object result = joinPoint.proceed();

            long executionTime = (System.nanoTime() - start) / 1_000_000;

            // Logging if slow
            if (executionTime > 200) {
                log.warn("<-- Slow performance: {} took {}ms", methodName, executionTime); // Outbound
            }

            return result;

        } catch (Throwable e) {

            log.error("<-- Exception in {}", methodName);
            throw e;
        }
    }
}
