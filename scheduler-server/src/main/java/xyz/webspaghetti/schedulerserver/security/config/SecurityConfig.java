package xyz.webspaghetti.schedulerserver.security.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import xyz.webspaghetti.schedulerserver.security.filter.JwtRequestFilter;

import java.util.Collections;
import java.util.List;

@Configuration
@EnableMethodSecurity // Enabled @PreAuthorize
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Specify frontend origin
        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));

        // Explicitly allow OPTIONS alongside other methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Allow headers
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));

        // Sending cookies or using Authorization headers
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Apply this CORS configuration to all API endpoints
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) {

        httpSecurity.authorizeHttpRequests(configurer ->
                configurer
                        /* PUBLIC ENDPOINTS */
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()

                        /* PROTECTED ENDPOINTS */
                        // User
                        .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/users/*/roles/**").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/*/roles/**").hasAnyRole("ADMIN")

                        // Team
                        .requestMatchers(HttpMethod.GET, "/api/teams/**").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/teams/*/users").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/teams").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/teams/*/users/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/teams/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/teams/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/teams/*/users/**").hasAnyRole("MANAGER", "ADMIN")

                        // Task
                        .requestMatchers(HttpMethod.GET, "/api/tasks/**").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/tasks/teams/**").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/tasks/teams/*/users/**").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/tasks").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/tasks/*/users/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/tasks/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/tasks/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/tasks/*/users/**").hasAnyRole("MANAGER", "ADMIN")

                        // SwaggerUI
                        .requestMatchers(HttpMethod.GET, "/swagger-ui/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api-docs/**").hasRole("ADMIN")

                        /* EVERYTHING ELSE */
                        .anyRequest().authenticated()
        );

        // STATELESS session
        httpSecurity.sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        httpSecurity.cors(Customizer.withDefaults());

        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        // Insert JWT filter before Spring's default
        httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }
}
