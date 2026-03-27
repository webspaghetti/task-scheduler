package xyz.webspaghetti.schedulerserver.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsManager userDetailsManager(DataSource dataSource) {

        JdbcUserDetailsManager jdbcUserDetailsManager = new JdbcUserDetailsManager(dataSource);

        jdbcUserDetailsManager.setUsersByUsernameQuery(
                "SELECT username, password, enabled FROM users WHERE username=?"
        );

        jdbcUserDetailsManager.setAuthoritiesByUsernameQuery(
                "SELECT u.username, ro.name " +
                        "FROM users u " +
                        "JOIN user_roles ur ON u.id = ur.user_id " +
                        "JOIN roles ro ON ur.role_id = ro.id " +
                        "WHERE u.username=?"
        );

        return jdbcUserDetailsManager;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) {

        httpSecurity.authorizeHttpRequests(configurer ->
                configurer
                        .requestMatchers(HttpMethod.GET, "/api/test/**").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.GET, "/api/swagger-config").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/post-test").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/api/put-test/**").hasRole("USER")
        );

        httpSecurity.httpBasic(Customizer.withDefaults());

        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }
}
