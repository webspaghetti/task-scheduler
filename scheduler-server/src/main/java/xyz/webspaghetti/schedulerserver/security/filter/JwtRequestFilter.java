package xyz.webspaghetti.schedulerserver.security.filter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import xyz.webspaghetti.schedulerserver.security.model.CustomUserDetails;
import xyz.webspaghetti.schedulerserver.security.util.JwtUtil;

import java.io.IOException;
import java.util.List;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;


    public JwtRequestFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }


    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        // Check if the header exists and starts with "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {

            String jwt = authorizationHeader.substring(7);

            try {
                // Extract all claims
                Claims claims = jwtUtil.extractAllClaims(jwt);
                String username = claims.getSubject();

                // If we have a username and the context isn't authenticated yet
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    // Extract custom claims directly from the JWT payload
                    Integer userId = claims.get("userId", Integer.class);

                    List<String> roles = claims.get("roles", List.class);

                    if (userId != null && roles != null) {

                        // Convert the raw strings back into Spring Security Authorities
                        List<SimpleGrantedAuthority> authorities = roles.stream()
                                .map(SimpleGrantedAuthority::new)
                                .toList();

                        // Rebuild the CustomUserDetails ID Card (We can pass an empty string for the password because we are already authenticated)
                        CustomUserDetails userDetails = new CustomUserDetails(
                                userId,
                                username,
                                "",
                                authorities
                        );

                        // Create the authentication token
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        // Set the authentication in the Spring Security context
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (Exception e) {
                // If the token is expired, tampered with, or malformed, JJWT throws an exception
                // User will remain unauthenticated and get a 403 Forbidden
                logger.warn("JWT Token validation failed: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
