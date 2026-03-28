package xyz.webspaghetti.schedulerserver.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.dto.*;
import xyz.webspaghetti.schedulerserver.dto.create.TeamCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.TeamResponseDto;
import xyz.webspaghetti.schedulerserver.dto.response.UserResponseDto;
import xyz.webspaghetti.schedulerserver.dto.update.TeamUpdateDto;
import xyz.webspaghetti.schedulerserver.entity.Team;
import xyz.webspaghetti.schedulerserver.entity.User;
import xyz.webspaghetti.schedulerserver.mapper.TeamMapper;
import xyz.webspaghetti.schedulerserver.mapper.UserMapper;
import xyz.webspaghetti.schedulerserver.repository.TeamRepository;
import xyz.webspaghetti.schedulerserver.repository.UserRepository;

import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserMapper userMapper;
    private final TeamMapper teamMapper;
    private final UserRepository userRepository;


    public TeamService(TeamRepository teamRepository, UserMapper userMapper, TeamMapper teamMapper, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.userMapper = userMapper;
        this.teamMapper = teamMapper;
        this.userRepository = userRepository;
    }


    public List<UserResponseDto> findAllTeamUsers(Integer teamId) {

        Team tempTeam =
                teamRepository.findById(teamId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find team with id: " + teamId
                        ));

        return DtoStaticHelper.userCollectionToDtoList(tempTeam.getUsers(), userMapper);
    }

    public TeamResponseDto findTeamById(Integer teamId) {

        return teamMapper.toResponseDto(
                teamRepository.findById(teamId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find team with id: " + teamId
                        )));
    }

    @Transactional
    public TeamResponseDto createTeam(TeamCreateDto teamCreateDto) {

        int userId = teamCreateDto.userId();
        User tempUser =
                userRepository.findById(userId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find user with id: " + userId
                        ));

        // Add the User that created the Team into it
        Team tempTeam = teamMapper.toEntity(teamCreateDto);
        tempTeam.addUser(tempUser);

        Team savedTeam = teamRepository.save(tempTeam);

        return teamMapper.toResponseDto(savedTeam);
    }

    @Transactional
    public TeamResponseDto updateTeam(Integer teamId, TeamUpdateDto teamUpdateDto) {

        Team tempTeam =
                teamRepository.findById(teamId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find team with id: " + teamId
                        ));

        teamMapper.updateTeamFromDto(tempTeam, teamUpdateDto);

        Team updatedTeam = teamRepository.save(tempTeam);
        return teamMapper.toResponseDto(updatedTeam);
    }

    @Transactional
    public void deleteTeam(Integer teamId) {

        Team teamToDelete =
                teamRepository.findById(teamId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find team with id: " + teamId
                        ));

        for (User teamUser : teamToDelete.getUsers()) {
            teamUser.getTeams().remove(teamToDelete);
        }

        teamRepository.delete(teamToDelete);
    }

    @Transactional
    public void addUserToTeam(Integer userId, Integer teamId) {

        User userToAdd =
                userRepository.findById(userId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find user with id: " + userId
                        ));

        Team teamToAddTo =
                teamRepository.findById(teamId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find team with id: " + teamId
                        ));


        // Check if User is already in the Team
        if (teamToAddTo.getUsers().contains(userToAdd)) {
            throw new RuntimeException("User is already in the Team");
        }

        teamToAddTo.addUser(userToAdd);
    }

    @Transactional
    public void removeUserFromTeam(Integer userId, Integer teamId) {

        User userToRemove =
                userRepository.findById(userId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find user with id: " + userId
                        ));

        Team teamToRemoveFrom =
                teamRepository.findById(teamId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find team with id: " + teamId
                        ));


        // Check if User is part of the Team
        if (!teamToRemoveFrom.getUsers().contains(userToRemove)) {
            throw new RuntimeException("User is not part of the Team");
        }

        teamToRemoveFrom.removeUser(userToRemove);
    }
}
