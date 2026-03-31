package xyz.webspaghetti.schedulerserver.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.webspaghetti.schedulerserver.dto.create.UserCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.UserResponseDto;
import xyz.webspaghetti.schedulerserver.dto.update.UserUpdateDto;
import xyz.webspaghetti.schedulerserver.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;


    public UserController(UserService userService) {
        this.userService = userService;
    }


    // Get a single User
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> getUser(
            @PathVariable Integer userId
    ) {

        UserResponseDto fetchedUser = userService.findUserById(userId);

        return ResponseEntity.ok(fetchedUser);
    }

    // Create a User
    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(
            @RequestBody @Valid UserCreateDto userCreateDto
    ) {

        UserResponseDto createdUser = userService.createUser(userCreateDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // Update a User
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Integer userId,
            @RequestBody @Valid UserUpdateDto userUpdateDto
    ) {

        UserResponseDto updatedUser = userService.updateUser(userId, userUpdateDto);

        return ResponseEntity.ok(updatedUser);
    }

    // Delete a User
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Integer userId
    ) {

        userService.deleteUser(userId);

        return ResponseEntity.noContent().build();
    }

    // Add Role to a User
    @PostMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<UserResponseDto> assignRole(
            @PathVariable Integer userId,
            @PathVariable Integer roleId
    ) {

        UserResponseDto userWithRole = userService.addUserRole(userId, roleId);

        return ResponseEntity.ok(userWithRole);
    }

    // Remove Role from a User
    @DeleteMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<UserResponseDto> removeRole(
            @PathVariable Integer userId,
            @PathVariable Integer roleId
    ) {

        UserResponseDto userWithoutRole = userService.removeUserRole(userId, roleId);

        return ResponseEntity.ok(userWithoutRole);
    }
}
