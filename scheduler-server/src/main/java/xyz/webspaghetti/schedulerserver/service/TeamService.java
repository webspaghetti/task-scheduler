package xyz.webspaghetti.schedulerserver.service;

import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.dto.DtoStaticHelper;
import xyz.webspaghetti.schedulerserver.dto.UserResponseDto;
import xyz.webspaghetti.schedulerserver.entity.Team;
import xyz.webspaghetti.schedulerserver.mapper.UserMapper;
import xyz.webspaghetti.schedulerserver.repository.TeamRepository;

import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserMapper userMapper;


    public TeamService(TeamRepository teamRepository, UserMapper userMapper) {
        this.teamRepository = teamRepository;
        this.userMapper = userMapper;
    }

    public List<UserResponseDto> findAllTeamUsers(long teamId) {

        Team tempTeam =
                teamRepository.findById(teamId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find team with id: " + teamId
                        ));

        return DtoStaticHelper.userListToDtoList(tempTeam.getUsers(), userMapper);
        return DtoStaticHelper.userCollectionToDtoList(tempTeam.getUsers(), userMapper);
    }
}
