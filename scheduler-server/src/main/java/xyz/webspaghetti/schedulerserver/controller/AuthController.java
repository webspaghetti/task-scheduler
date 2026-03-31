package xyz.webspaghetti.schedulerserver.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.webspaghetti.schedulerserver.dto.create.UserCreateDto;
import xyz.webspaghetti.schedulerserver.dto.request.LoginRequestDto;
import xyz.webspaghetti.schedulerserver.dto.response.JwtResponseDto;
import xyz.webspaghetti.schedulerserver.dto.response.UserResponseDto;
import xyz.webspaghetti.schedulerserver.security.model.CustomUserDetails;
import xyz.webspaghetti.schedulerserver.security.util.JwtUtil;
import xyz.webspaghetti.schedulerserver.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;


    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequestDto loginRequestDto
    ) {

        try {
            // Spring Security checks the username and password against the database
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDto.username(),
                            loginRequestDto.password()
                    )
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            assert userDetails != null;
            String jwt = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(new JwtResponseDto(jwt));
        } catch (BadCredentialsException e) {

            // If the password or username is wrong, they get a 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(
            @RequestBody UserCreateDto userCreateDto
    ) {

        UserResponseDto registeredUser = userService.createUser(userCreateDto);

        return ResponseEntity.ok(registeredUser);
    }
}
