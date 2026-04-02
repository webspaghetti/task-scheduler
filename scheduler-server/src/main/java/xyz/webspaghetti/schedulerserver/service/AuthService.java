package xyz.webspaghetti.schedulerserver.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.dto.create.UserCreateDto;
import xyz.webspaghetti.schedulerserver.dto.request.LoginRequestDto;
import xyz.webspaghetti.schedulerserver.dto.response.JwtResponseDto;
import xyz.webspaghetti.schedulerserver.dto.response.UserResponseDto;
import xyz.webspaghetti.schedulerserver.exception.BadUserCredentialsException;
import xyz.webspaghetti.schedulerserver.security.model.CustomUserDetails;
import xyz.webspaghetti.schedulerserver.security.util.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;


    @Transactional
    public UserResponseDto registerUser(UserCreateDto userCreateDto) {

        return userService.createUser(userCreateDto);
    }

    public JwtResponseDto loginUser(LoginRequestDto loginRequestDto) {

        Authentication authentication;

        try {
            // Authenticate user credentials against the database
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDto.username(),
                            loginRequestDto.password()
                    )
            );
        } catch (BadCredentialsException e) {
            // Throw custom exception if credentials do not match
            throw new BadUserCredentialsException("Incorrect username or password");
        }

        // Extract UserDetails from the authenticated principal
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // Generate JWT token
        assert userDetails != null;
        String jwt = jwtUtil.generateToken(userDetails);

        // Create and return Response DTO
        return new JwtResponseDto(jwt);
    }
}
