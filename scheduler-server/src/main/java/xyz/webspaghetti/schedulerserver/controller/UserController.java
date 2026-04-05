package xyz.webspaghetti.schedulerserver.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import xyz.webspaghetti.schedulerserver.annotation.TrackActionHistory;
import xyz.webspaghetti.schedulerserver.dto.create.UserCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.UserResponseDto;
import xyz.webspaghetti.schedulerserver.dto.update.UserUpdateDto;
import xyz.webspaghetti.schedulerserver.enums.ActionType;
import xyz.webspaghetti.schedulerserver.enums.EntityType;
import xyz.webspaghetti.schedulerserver.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    // Get all Users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {

        List<UserResponseDto> fetchedUsers = userService.findAllUsers();

        return ResponseEntity.ok(fetchedUsers);
    }

    // Get a single User
    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> getUser(
            @PathVariable Integer userId
    ) {

        UserResponseDto fetchedUser = userService.findUserById(userId);

        return ResponseEntity.ok(fetchedUser);
    }

    // Get all Users that are not part of a given Task and are in the Team
    @PreAuthorize("@taskAuthorization.isInTaskTeam(#taskId, authentication) or hasRole('ADMIN')")
    @GetMapping("/tasks/{taskId}/non-users")
    public ResponseEntity<List<UserResponseDto>> getNonAssignedUsersInTeam(
            @PathVariable Integer taskId
    ) {

        List<UserResponseDto> nonAssignedUsersList = userService.findAllNonTaskAssignedUsers(taskId);

        return ResponseEntity.ok(nonAssignedUsersList);
    }

    // Create a User
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(
            @RequestBody @Valid UserCreateDto userCreateDto
    ) {

        UserResponseDto createdUser = userService.createUser(userCreateDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // Update a User
    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')") // Compare path variable usedId with id from CustomUserDetails
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Integer userId,
            @RequestBody @Valid UserUpdateDto userUpdateDto
    ) {

        UserResponseDto updatedUser = userService.updateUser(userId, userUpdateDto);

        return ResponseEntity.ok(updatedUser);
    }

    // Delete a User
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Integer userId
    ) {

        userService.deleteUser(userId);

        return ResponseEntity.noContent().build();
    }

    // Add Role to a User
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{userId}/roles/{roleId}")
    @TrackActionHistory(
            actionType = ActionType.ADDED,
            entityType = EntityType.USER
    )
    public ResponseEntity<UserResponseDto> assignRole(
            @PathVariable Integer userId,
            @PathVariable Integer roleId
    ) {

        UserResponseDto userWithRole = userService.addUserRole(userId, roleId);

        return ResponseEntity.ok(userWithRole);
    }

    // Remove Role from a User
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}/roles/{roleId}")
    @TrackActionHistory(
            actionType = ActionType.REMOVED,
            entityType = EntityType.USER
    )
    public ResponseEntity<UserResponseDto> removeRole(
            @PathVariable Integer userId,
            @PathVariable Integer roleId
    ) {

        UserResponseDto userWithoutRole = userService.removeUserRole(userId, roleId);

        return ResponseEntity.ok(userWithoutRole);
    }
}
