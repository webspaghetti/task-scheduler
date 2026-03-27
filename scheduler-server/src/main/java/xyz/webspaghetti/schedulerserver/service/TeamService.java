package xyz.webspaghetti.schedulerserver.service;

import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.dto.*;
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
}
