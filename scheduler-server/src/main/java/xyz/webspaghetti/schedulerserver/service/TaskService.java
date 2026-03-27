package xyz.webspaghetti.schedulerserver.service;

import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.dto.DtoStaticHelper;
import xyz.webspaghetti.schedulerserver.dto.create.TaskCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.TaskResponseDto;
import xyz.webspaghetti.schedulerserver.entity.Task;
import xyz.webspaghetti.schedulerserver.entity.Team;
import xyz.webspaghetti.schedulerserver.mapper.TaskMapper;
import xyz.webspaghetti.schedulerserver.repository.TaskRepository;
import xyz.webspaghetti.schedulerserver.repository.TeamRepository;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TeamRepository teamRepository;
    private final TaskMapper taskMapper;


    public TaskService(TaskRepository taskRepository, TeamRepository teamRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.teamRepository = teamRepository;
        this.taskMapper = taskMapper;
    }


    public List<TaskResponseDto> findTasksForUserInTeam(Integer userId, Integer teamId) {

        return DtoStaticHelper.taskCollectionToDtoList(taskRepository.findTasksInTeamByUser(userId, teamId), taskMapper);
    }

    public List<TaskResponseDto> findAllTasksInTeam(Integer teamId) {

        Team tempTeam =
                teamRepository.findById(teamId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find team with id: " + teamId
                        ));

        return DtoStaticHelper.taskCollectionToDtoList(tempTeam.getTasks(), taskMapper);
    }

    public TaskResponseDto createTask(TaskCreateDto taskCreateDto) {

        // Get Team
        int teamId = taskCreateDto.teamId();
        Team tempTeam =
                teamRepository.findById(teamId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find team with id: " + teamId
                        ));

        // Get temp Task and set its Team
        Task tempTask = taskMapper.toEntity(taskCreateDto);
        tempTask.setTeam(tempTeam);

        // Save the Task adn return it
        Task savedTask = taskRepository.save(tempTask);

        return taskMapper.toResponseDto(savedTask);
    }
}
