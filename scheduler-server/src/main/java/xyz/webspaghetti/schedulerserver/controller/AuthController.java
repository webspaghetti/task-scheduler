package xyz.webspaghetti.schedulerserver.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.webspaghetti.schedulerserver.dto.create.UserCreateDto;
import xyz.webspaghetti.schedulerserver.dto.request.LoginRequestDto;
import xyz.webspaghetti.schedulerserver.dto.response.JwtResponseDto;
import xyz.webspaghetti.schedulerserver.dto.response.UserResponseDto;
import xyz.webspaghetti.schedulerserver.service.UserService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;


    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequestDto loginRequestDto
    ) {

        JwtResponseDto loggedUserJWT = userService.loginUser(loginRequestDto);

        return ResponseEntity.ok(loggedUserJWT);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(
            @RequestBody UserCreateDto userCreateDto
    ) {

        UserResponseDto registeredUser = userService.createUser(userCreateDto);

        return ResponseEntity.ok(registeredUser);
    }
}
