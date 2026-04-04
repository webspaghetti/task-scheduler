package xyz.webspaghetti.schedulerserver.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import xyz.webspaghetti.schedulerserver.dto.create.TeamCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.TeamResponseDto;
import xyz.webspaghetti.schedulerserver.dto.response.UserResponseDto;
import xyz.webspaghetti.schedulerserver.dto.update.TeamUpdateDto;
import xyz.webspaghetti.schedulerserver.security.model.CustomUserDetails;
import xyz.webspaghetti.schedulerserver.service.TeamService;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;


    // Get all Teams
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<TeamResponseDto>> getAllTeams() {

        List<TeamResponseDto> fetchedTeams = teamService.findAllTeams();

        return ResponseEntity.ok(fetchedTeams);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/mine")
    public ResponseEntity<List<TeamResponseDto>> getMineTeams(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        List<TeamResponseDto> mineTeamsList = teamService.findMyTeams(userDetails.getId());

        return ResponseEntity.ok(mineTeamsList);
    }

    // Get all Users in a given Team
    @PreAuthorize("@teamAuthorization.isMember(#teamId, authentication) or hasRole('ADMIN')")
    @GetMapping("/{teamId}/users")
    public ResponseEntity<List<UserResponseDto>> getTeamUsers(
            @PathVariable Integer teamId
    ) {

        List<UserResponseDto> teamUsersList = teamService.findAllTeamUsers(teamId);

        return ResponseEntity.ok(teamUsersList);
    }

    // Get all Users that are not part of a given Team
    @PreAuthorize("@teamAuthorization.isMember(#teamId, authentication) or hasRole('ADMIN')")
    @GetMapping("/{teamId}/non-users")
    public ResponseEntity<List<UserResponseDto>> getNonTeamUsers(
            @PathVariable Integer teamId
    ) {

        List<UserResponseDto> nonTeamUsersList = teamService.findAllNonTeamUsers(teamId);

        return ResponseEntity.ok(nonTeamUsersList);
    }

    // Get a Team
    @PreAuthorize("@teamAuthorization.isMember(#teamId, authentication) or hasRole('ADMIN')")
    @GetMapping("/{teamId}")
    public ResponseEntity<TeamResponseDto> getTeam(
            @PathVariable Integer teamId
    ) {

        TeamResponseDto fetchedTeam = teamService.findTeamById(teamId);

        return ResponseEntity.ok(fetchedTeam);
    }

    // Create a Team
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @PostMapping
    public ResponseEntity<TeamResponseDto> createTeam(
            @RequestBody @Valid TeamCreateDto teamCreateDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        TeamResponseDto createdTeam = teamService.createTeam(teamCreateDto, userDetails.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTeam);
    }

    // Update a Team
    @PreAuthorize("@teamAuthorization.isManagerMember(#teamId, authentication) or hasRole('ADMIN')")
    @PutMapping("/{teamId}")
    public ResponseEntity<TeamResponseDto> updateTeam(
            @PathVariable Integer teamId,
            @RequestBody @Valid TeamUpdateDto teamUpdateDto
    ) {

        TeamResponseDto updatedTeam = teamService.updateTeam(teamId, teamUpdateDto);

        return ResponseEntity.ok(updatedTeam);
    }

    // Delete a Team
    @PreAuthorize("@teamAuthorization.isManagerMember(#teamId, authentication) or hasRole('ADMIN')")
    @DeleteMapping("/{teamId}")
    public ResponseEntity<Void> deleteTeam(
            @PathVariable Integer teamId
    ) {

        teamService.deleteTeam(teamId);

        return ResponseEntity.noContent().build();
    }

    // Add User to a Team
    @PreAuthorize("@teamAuthorization.isManagerMember(#teamId, authentication) or hasRole('ADMIN')")
    @PostMapping("/{teamId}/users/{userId}")
    public ResponseEntity<TeamResponseDto> addUserToTeam(
            @PathVariable Integer teamId,
            @PathVariable Integer userId
    ) {

        TeamResponseDto teamWithUser = teamService.addUserToTeam(userId, teamId);

        return ResponseEntity.ok(teamWithUser);
    }

    // Remove User from a Team
    @PreAuthorize("@teamAuthorization.isManagerMember(#teamId, authentication) or hasRole('ADMIN')")
    @DeleteMapping("/{teamId}/users/{userId}")
    public ResponseEntity<TeamResponseDto> deleteUserFromTeam(
            @PathVariable Integer teamId,
            @PathVariable Integer userId
    ) {

        TeamResponseDto teamWithoutUser = teamService.removeUserFromTeam(userId, teamId);

        return ResponseEntity.ok(teamWithoutUser);
    }
}
