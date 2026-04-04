package xyz.webspaghetti.schedulerserver.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.dto.*;
import xyz.webspaghetti.schedulerserver.dto.create.TeamCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.TeamResponseDto;
import xyz.webspaghetti.schedulerserver.dto.response.UserResponseDto;
import xyz.webspaghetti.schedulerserver.dto.update.TeamUpdateDto;
import xyz.webspaghetti.schedulerserver.entity.Team;
import xyz.webspaghetti.schedulerserver.entity.User;
import xyz.webspaghetti.schedulerserver.exception.UserAlreadyInTeamException;
import xyz.webspaghetti.schedulerserver.exception.UserNotInTeamException;
import xyz.webspaghetti.schedulerserver.mapper.TeamMapper;
import xyz.webspaghetti.schedulerserver.mapper.UserMapper;
import xyz.webspaghetti.schedulerserver.repository.TeamRepository;
import xyz.webspaghetti.schedulerserver.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserMapper userMapper;
    private final TeamMapper teamMapper;
    private final UserRepository userRepository;


    public List<TeamResponseDto> findAllTeams() {

        return DtoStaticHelper.entityCollectionToDtoList(teamRepository.findAll(), teamMapper::toResponseDto);
    }

    public List<UserResponseDto> findAllTeamUsers(Integer teamId) {

        Team tempTeam = teamRepository.findOrThrow(teamId, Team.class.getSimpleName());

        return DtoStaticHelper.entityCollectionToDtoList(tempTeam.getUsers(), userMapper::toResponseDto);
    }

    public List<UserResponseDto> findAllNonTeamUsers(Integer teamId) {

        Team tempTeam = teamRepository.findOrThrow(teamId, Team.class.getSimpleName());

        List<User> userList = userRepository.findAll();
        userList.removeAll(tempTeam.getUsers());

        return DtoStaticHelper.entityCollectionToDtoList(userList, userMapper::toResponseDto);
    }

    public TeamResponseDto findTeamById(Integer teamId) {

        return teamMapper.toResponseDto(teamRepository.findOrThrow(teamId, Team.class.getSimpleName()));
    }

    @Transactional
    public TeamResponseDto createTeam(TeamCreateDto teamCreateDto, Integer userId) {

        User tempUser = userRepository.findOrThrow(userId, User.class.getSimpleName());

        // Add the User that created the Team into it
        Team tempTeam = teamMapper.toEntity(teamCreateDto);
        tempTeam.addUser(tempUser);

        Team savedTeam = teamRepository.save(tempTeam);

        return teamMapper.toResponseDto(savedTeam);
    }

    @Transactional
    public TeamResponseDto updateTeam(Integer teamId, TeamUpdateDto teamUpdateDto) {

        Team tempTeam = teamRepository.findOrThrow(teamId, Team.class.getSimpleName());

        teamMapper.updateTeamFromDto(tempTeam, teamUpdateDto);

        Team updatedTeam = teamRepository.save(tempTeam);
        return teamMapper.toResponseDto(updatedTeam);
    }

    @Transactional
    public void deleteTeam(Integer teamId) {

        Team teamToDelete = teamRepository.findOrThrow(teamId, Team.class.getSimpleName());

        for (User teamUser : teamToDelete.getUsers()) {
            teamUser.getTeams().remove(teamToDelete);
        }

        teamRepository.delete(teamToDelete);
    }

    @Transactional
    public TeamResponseDto addUserToTeam(Integer userId, Integer teamId) {

        Team existingTeam = teamRepository.findOrThrow(teamId, Team.class.getSimpleName());
        User userToAdd = userRepository.findOrThrow(userId, User.class.getSimpleName());

        // Check if User is already in the Team
        if (existingTeam.getUsers().contains(userToAdd)) {
            throw new UserAlreadyInTeamException("User is already in the Team");
        }

        existingTeam.addUser(userToAdd);

        return teamMapper.toResponseDto(existingTeam);
    }

    @Transactional
    public TeamResponseDto removeUserFromTeam(Integer userId, Integer teamId) {

        Team existingTeam = teamRepository.findOrThrow(teamId, Team.class.getSimpleName());
        User userToRemove = userRepository.findOrThrow(userId, User.class.getSimpleName());

        // Check if User is part of the Team
        if (!existingTeam.getUsers().contains(userToRemove)) {
            throw new UserNotInTeamException("User is not part of the Team");
        }

        existingTeam.removeUser(userToRemove);

        return teamMapper.toResponseDto(existingTeam);
    }

    @Transactional
    public boolean isMemberOfTeam(Integer userId, Integer teamId) {

        Team existingTeam = teamRepository.findOrThrow(teamId, Team.class.getSimpleName());
        User userToCheck = userRepository.findOrThrow(userId, User.class.getSimpleName());

        return existingTeam.getUsers().contains(userToCheck);
    }
}
